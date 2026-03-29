import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReflectStore } from '../../services/reflect.store';

@Component({
  selector: 'app-confidence-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col gap-1.5 w-48 group">
      <div class="flex justify-between items-end px-1">
        <span class="text-[10px] font-bold text-zinc-500 uppercase tracking-widest group-hover:text-zinc-400 transition-colors">Sistema</span>
        <span class="text-xs font-mono font-bold" [style.color]="statusColor()">{{ score() }}%</span>
      </div>
      
      <div class="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/50 shadow-inner">
        <div 
          class="h-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(251,191,36,0.2)]"
          [style.width.%]="score()"
          [style.background-color]="statusColor()">
        </div>
      </div>
      
      <span class="text-[9px] text-zinc-600 text-right italic">{{ statusText() }}</span>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class ConfidenceBarComponent {
  private store = inject(ReflectStore);
  public score = this.store.systemConfidence;

  public statusColor = computed(() => {
    const s = this.score();
    if (s > 80) return '#10b981'; // emerald-500
    if (s > 60) return '#f59e0b'; // amber-500
    if (s > 40) return '#f97316'; // orange-500
    return '#ef4444'; // red-500
  });

  public statusText = computed(() => {
    const s = this.score();
    if (s > 80) return 'Mente como el agua';
    if (s > 60) return 'Bajo control';
    if (s > 40) return 'Necesita revisión';
    return 'Sistema crítico';
  });
}
