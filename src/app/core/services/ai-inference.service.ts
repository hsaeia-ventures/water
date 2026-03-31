import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { GtdItem } from '../models/gtd-item.model';
import { EnergyLevel, TimeAvailable } from '../../execute/services/execute.store';

export interface AiInferenceResponse {
  recommendedTaskIds: string[];
}

@Injectable({ providedIn: 'root' })
export class AiInferenceService {
  private supabase = inject(SupabaseService);

  /**
   * Envía la lista de tareas y el contexto actual al LLM para obtener 3 recomendaciones.
   */
  public async getTrifocalRecommendations(
    actions: GtdItem[], 
    energy: EnergyLevel, 
    time: TimeAvailable, 
    context: string | null
  ): Promise<GtdItem[]> {
    if (actions.length === 0) return [];
    if (actions.length <= 3) return actions; // No need for AI if there are <= 3 tasks

    const promptPayload = {
      userContext: {
        energyLevel: energy,
        timeAvailable: time,
        locationContext: context || 'None'
      },
      availableTasks: actions.map(a => ({
        id: a.id,
        title: a.title,
        notes: a.notes,
        contextTags: a.ghost_tags?.filter(t => t.type === 'context').map(t => t.value) || []
      }))
    };

    try {
      // Intentar llamada a Edge Function (requeriría deploy en Supabase: supabase functions deploy trifocal-ai)
      const { data, error } = await this.supabase.client.functions.invoke<AiInferenceResponse>('trifocal-ai', {
        body: promptPayload
      });

      if (error || !data || !data.recommendedTaskIds) {
        throw new Error('Fallback to local heuristic due to edge function error or timeout');
      }

      // Filtrar las tareas correspondientes a los IDs devueltos
      return actions.filter(action => data.recommendedTaskIds.includes(action.id)).slice(0, 3);

    } catch (err) {
      console.warn('⚠️ IA backend unavailable. Falling back to local semantic mock:', err);
      return this.localHeuristicFallback(actions, energy, time, context);
    }
  }

  /**
   * Fallback heurístico en caso de que la Edge Function (LLM) no esté desplegada.
   * Selecciona 3 tareas determinísticamente evaluando coincidencias aproximadas.
   */
  private localHeuristicFallback(
    actions: GtdItem[], 
    energy: EnergyLevel, 
    time: TimeAvailable, 
    userContext: string | null
  ): GtdItem[] {
    
    const timeLimitsMap = {
      '15m': 15,
      '30m': 30,
      '60m': 60,
      'ilimitado': 999
    };
    
    // Asignar un puntaje a cada tarea
    const scoredTasks = actions.map(action => {
      let score = 0;
      
      // 1. Priorizar Contexto explícito
      if (userContext) {
        const contexts = action.ghost_tags?.filter(t => t.type === 'context').map(t => t.value) || [];
        if (contexts.includes(userContext.replace('@', '').toLowerCase())) {
          score += 100;
        } else if (contexts.length > 0) {
          // Si tiene otro contexto restrictivo asignado (ej: en casa pero pide @oficina), castigarlo
          score -= 50; 
        }
      }

      // 2. Semántica cruda (RegEx básico imitando un LLM muy tonto)
      const text = `${action.title} ${action.notes || ''}`.toLowerCase();
      
      // Chequeo de energía
      if (energy === 'baja') {
        if (text.match(/leer|revisar|responder|email|correo|ver|comprobar/)) score += 30; // tareas pasivas
        if (text.match(/escribir|desarrollar|crear|pensar|programar|informe/)) score -= 20; // tareas activas pesadas
      } else if (energy === 'alta') {
        if (text.match(/escribir|desarrollar|crear|pensar|programar|informe/)) score += 30;
      }

      // Chequeo de tiempo
      const minutesAvailable = timeLimitsMap[time] || 30;
      const expectedTimeRegex = /(\d+)\s*(min|m|h|hora)/;
      const match = text.match(expectedTimeRegex);
      if (match) {
        const amount = parseInt(match[1]);
        const unit = match[2];
        const estimatedMins = unit.startsWith('h') ? amount * 60 : amount;
        
        if (estimatedMins <= minutesAvailable) {
          score += 20; // cabe perfecto
        } else {
          score -= 40; // no alcanzará el tiempo
        }
      } else {
        // Tareas sin estimación explícita son neutrales a tiempo
        if (minutesAvailable < 15) {
          score -= 5;
        }
      }

      return { action, score };
    });

    // Ordenar de mayor a menor y agarrar los 3 primeros
    return scoredTasks
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.action);
  }
}
