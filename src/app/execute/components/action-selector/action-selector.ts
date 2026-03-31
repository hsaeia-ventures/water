import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecuteStore, EnergyLevel, TimeAvailable } from '../../services/execute.store';
import { ExecuteService } from '../../../core/services/execute.service';
import { OrganizeStore } from '../../../organize/services/organize.store';
import { GtdItem } from '../../../core/models/gtd-item.model';

@Component({
  selector: 'app-action-selector',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-4xl mx-auto py-8 px-4 flex flex-col gap-10">
      
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="text-3xl font-bold tracking-tight text-white flex items-center justify-center gap-3">
          <span class="text-4xl animate-bounce">⚡️</span> Ejecutar
        </h1>
        <p class="text-white/60 text-lg max-w-lg mx-auto leading-relaxed">
          Dime cómo te sientes y la <strong>IA Trifocal</strong> encontrará la tarea perfecta para este momento.
        </p>
      </div>

      <!-- Controles de Estado -->
      <div class="bg-gray-900/40 p-6 rounded-3xl border border-white/5 backdrop-blur-lg shadow-xl grid md:grid-cols-2 gap-8 items-start">
        
        <!-- Bloque Energía -->
        <div class="space-y-4">
          <label class="text-sm font-semibold text-white/50 uppercase tracking-widest pl-2">Energía Disponible</label>
          <div class="flex gap-2">
            @for (option of energyOptions; track option.value) {
              <button 
                (click)="setEnergy(option.value)"
                class="flex-1 py-4 px-2 rounded-2xl flex flex-col items-center gap-2 transition-all"
                [ngClass]="store.energyLevel() === option.value ? 'bg-indigo-500/20 text-indigo-300 ring-2 ring-indigo-500' : 'bg-white/5 text-white/60 hover:bg-white/10'">
                <span class="text-2xl">{{ option.icon }}</span>
                <span class="text-xs font-medium">{{ option.label }}</span>
              </button>
            }
          </div>
        </div>

        <!-- Bloque Tiempo -->
        <div class="space-y-4">
          <label class="text-sm font-semibold text-white/50 uppercase tracking-widest pl-2">Tiempo Libre</label>
          <div class="flex gap-2">
            @for (option of timeOptions; track option.value) {
              <button 
                (click)="setTime(option.value)"
                class="flex-1 py-4 px-2 rounded-2xl flex flex-col items-center gap-2 transition-all"
                [ngClass]="store.timeAvailable() === option.value ? 'bg-orange-500/20 text-orange-300 ring-2 ring-orange-500' : 'bg-white/5 text-white/60 hover:bg-white/10'">
                <span class="text-2xl pt-1">{{ option.icon }}</span>
                <span class="text-xs font-medium">{{ option.label }}</span>
              </button>
            }
          </div>
        </div>
        
        <!-- Bloque Contexto & Action Button-->
        <div class="md:col-span-2 flex items-center justify-between border-t border-white/10 pt-6 mt-2">
          <button 
             (click)="detectContext()"
             class="flex items-center gap-3 text-sm px-5 py-3 rounded-full transition-all"
             [ngClass]="store.manualContext() ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/5 text-white/60 hover:bg-white/10'">
             <span>📍</span> 
             {{ store.manualContext() || 'Detectar contexto actual' }}
          </button>
          
          <button 
             (click)="generateRecommendations()"
             [disabled]="store.isAiLoading()"
             class="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-blue-900/50 flex items-center gap-2 transition-all">
             @if (store.isAiLoading()) {
               <span class="animate-spin text-xl">✨</span> Consultando IA...
             } @else {
               <span>✨</span> Revelar mis Próximos Pasos
             }
          </button>
        </div>
      </div>

      <!-- Recomendaciones de la IA -->
      @if (store.suggestedActions().length > 0) {
        <div class="space-y-6 pt-4 animate-slide-up">
          <h2 class="text-center text-sm font-bold text-blue-400 uppercase tracking-widest">
            Top 3 Sugerencias de la IA
          </h2>
          <div class="space-y-4">
            @for (task of store.suggestedActions(); track task.id; let i = $index) {
              <div 
                class="group bg-gray-900 p-5 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-all flex items-center justify-between gap-6 hover:-translate-y-1 shadow-md cursor-pointer"
                (click)="startDeepWork(task)">
                <div class="flex items-center gap-5 overflow-hidden">
                   <!-- AI match ring -->
                   <div class="flex-shrink-0 w-12 h-12 rounded-full border-2 border-blue-500/30 flex items-center justify-center text-blue-400 font-bold bg-blue-500/10">
                     #{{ i + 1 }}
                   </div>
                   <div class="flex-col overflow-hidden">
                     <h3 class="text-xl font-medium text-white truncate">{{ task.title }}</h3>
                     <div class="flex items-center gap-2 mt-2 text-sm text-white/40">
                        @if (task.ghost_tags) {
                          <div class="flex gap-2">
                            @for (tag of task.ghost_tags; track tag.value) {
                             <span class="bg-white/5 px-2 py-0.5 rounded text-xs">{{ tag.raw }}</span>
                            }
                          </div>
                        }
                     </div>
                   </div>
                </div>
                
                <button 
                   class="flex-shrink-0 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all">
                   ▶️
                </button>
              </div>
            }
          </div>
        </div>
      } @else if (hasZeroItems()) {
         <div class="text-center py-10 bg-gray-900/50 rounded-3xl border border-white/5 mt-8">
           <span class="text-4xl block mb-4">🏆</span>
           <h3 class="text-xl font-bold text-white mb-2">¡Mente como el agua!</h3>
           <p class="text-white/60">No hay más acciones pendientes por ejecutar. Relájate.</p>
         </div>
      }
    </div>
  `
})
export class ActionSelectorComponent {
  public store = inject(ExecuteStore);
  private executeService = inject(ExecuteService);
  private organizeStore = inject(OrganizeStore);

  energyOptions: { value: EnergyLevel; label: string; icon: string }[] = [
    { value: 'baja', label: 'Baja', icon: '🔋' }, // half battery
    { value: 'media', label: 'Media', icon: '✨' }, // sparkles
    { value: 'alta', label: 'Alta', icon: '🔥' }   // fire
  ];

  timeOptions: { value: TimeAvailable; label: string; icon: string }[] = [
    { value: '15m', label: '15 min', icon: '15' },
    { value: '30m', label: '30 min', icon: '30' },
    { value: '60m', label: '1 h', icon: '60' },
    { value: 'ilimitado', label: 'Full', icon: '♾️' }
  ];

  public hasZeroItems = computed(() => this.organizeStore.nextActions().length === 0);

  setEnergy(e: EnergyLevel) {
    this.store.setParameters(e, this.store.timeAvailable());
  }

  setTime(t: TimeAvailable) {
    this.store.setParameters(this.store.energyLevel(), t);
  }

  detectContext() {
    this.executeService.detectContextByLocation();
  }

  generateRecommendations() {
    this.executeService.loadRecommendations();
  }

  startDeepWork(task: GtdItem) {
    this.store.startDeepWork(task);
  }
}
