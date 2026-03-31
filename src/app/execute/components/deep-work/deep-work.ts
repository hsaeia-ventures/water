import { Component, computed, signal, inject, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExecuteStore } from '../../services/execute.store';
import { OrganizeStore } from '../../../organize/services/organize.store';

@Component({
  selector: 'app-deep-work',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-white animate-fade-in">
      
      <!-- Partículas de éxito (CSS nativo) -->
      @if (showConfetti()) {
        <div class="confetti-container absolute inset-0 pointer-events-none overflow-hidden">
          @for (item of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]; track item) {
            <div class="confetti"></div>
          }
        </div>
      }

      <!-- Título de la vista -->
      <div class="absolute top-10 left-10 flex items-center gap-3">
        <span class="text-3xl">🧘</span>
        <h1 class="text-xl font-medium tracking-wider text-white/50">Enfoque Profundo</h1>
      </div>

      <!-- Botón de Escape -->
      <button 
        (click)="exitDeepWork()"
        class="absolute top-10 right-10 p-3 rounded-full hover:bg-white/10 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <!-- Tarjeta de Tarea -->
      <div class="max-w-2xl w-full flex flex-col items-center justify-center space-y-8 animate-slide-up">
        
        @if (task()) {
          <div class="text-center space-y-4">
            <h2 class="text-4xl md:text-5xl font-bold leading-tight">{{ task()?.title }}</h2>
            @if (task()?.notes) {
              <p class="text-xl text-white/70">{{ task()?.notes }}</p>
            }
          </div>
        }

        <!-- Timer Reloj -->
        <div class="py-12 flex flex-col items-center justify-center relative">
          <!-- Anillo SVG estético -->
          <svg class="absolute inset-0 w-full h-full -rotate-90 pointer-events-none opacity-20" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="2" />
            <circle cx="50" cy="50" r="45" fill="none" stroke="var(--primary, #3b82f6)" stroke-width="2" 
                    [style.stroke-dasharray]="283" 
                    [style.stroke-dashoffset]="283 - (283 * timerProgress())"
                    class="transition-all duration-1000 linear" />
          </svg>
          
          <h3 class="text-7xl font-mono tracking-tighter tabular-nums drop-shadow-lg">
            {{ formattedTime() }}
          </h3>
        </div>

        <!-- Controles Primarios -->
        <div class="flex items-center gap-6 mt-8">
          <button 
            (click)="toggleTimer()"
            class="px-8 py-4 rounded-2xl font-medium text-lg bg-white/10 hover:bg-white/20 transition-all flex items-center gap-3">
            @if (isActive()) {
               ⏸ Pausar 
            } @else {
               ▶️ Reanudar
            }
          </button>
          
          <button 
             (click)="completeTask()"
             [disabled]="isCompleting()"
             class="px-8 py-4 rounded-2xl font-bold text-lg bg-emerald-500 hover:bg-emerald-400 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] transition-all flex items-center gap-3">
             ✅ Acción Completada
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./deep-work.css']
})
export class DeepWorkComponent {
  public store = inject(ExecuteStore);
  private organizeStore = inject(OrganizeStore);

  public task = this.store.deepWorkTask;
  public isActive = this.store.isPomodoroActive;
  public seconds = this.store.pomodoroSeconds;

  public isCompleting = signal(false);
  public showConfetti = signal(false);

  // Calcula progreso del anillo entre 0.0 y 1.0 (asumiendo 30m default para el total si no hay otro, o sacando proporción)
  // Simplificado: calculamos progreso en base a la diferencia entre el total y el actual.
  public timerProgress = computed(() => {
    // Si tiempo es > 0, usar 30 mins como max (1800 seg) sólo para el diseño visual, o usar el max seteado
    const max = 1800;
    const current = this.seconds();
    return Math.max(0, Math.min(1, current / max));
  });

  public formattedTime = computed(() => {
    const total = this.seconds();
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  });

  toggleTimer() {
    this.store.togglePomodoro();
  }

  exitDeepWork() {
    this.store.endDeepWork();
  }

  async completeTask() {
    if (!this.task()) return;
    this.isCompleting.set(true);

    // Mostar confeti
    this.showConfetti.set(true);

    // Marcar completado en organizeStore
    await this.organizeStore.toggleActionComplete(this.task()!);

    // Esperar a que pase el festejo y salir
    setTimeout(() => {
      this.showConfetti.set(false);
      this.isCompleting.set(false);
      this.exitDeepWork();
    }, 2500); // 2.5s magia
  }
}
