import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TwoMinuteRuleService {
  /**
   * Evalúa mediante heurísticas (y posteriormente IA real)
   * si la tarea puede completarse en menos de 2 minutos.
   */
  public isQuickTask(text: string): boolean {
    if (!text) return false;
    
    const words = text.trim().split(/\s+/).length;
    
    const quickVerbs = ['leer', 'revisar', 'contestar', 'enviar', 'mandar', 'pagar', 'llamar', 'agendar'];
    const lowerText = text.toLowerCase();
    const hasQuickVerb = quickVerbs.some(verb => lowerText.includes(verb));
    
    return words < 8 || hasQuickVerb;
  }
}
