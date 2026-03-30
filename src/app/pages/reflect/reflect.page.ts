import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReflectStore } from '../../reflect/services/reflect.store';
import { ConfidenceBarComponent } from '../../reflect/components/confidence-bar/confidence-bar';
import { WeeklyReviewCoachComponent } from '../../reflect/components/weekly-review-coach/weekly-review-coach';

@Component({
  selector: 'app-reflect-page',
  standalone: true,
  imports: [CommonModule, ConfidenceBarComponent, WeeklyReviewCoachComponent],
  template: `
    <div [class.zen-space]="store.isZenMode()" class="min-h-screen transition-all duration-700 ease-in-out p-6 md:p-10 bg-zinc-950 text-zinc-100">
      
      <!-- Header Area -->
      <header class="max-w-4xl mx-auto mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div>
          <h1 class="text-4xl font-light tracking-tight mb-2">Reflexionar</h1>
          <p class="text-zinc-500 font-medium">Mantenimiento del sistema para una mente clara.</p>
        </div>
        
        <div class="flex flex-col items-end gap-2">
          <app-confidence-bar />
          <button 
            (click)="store.toggleZenMode()"
            class="text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-zinc-800 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-all">
            {{ store.isZenMode() ? 'Desactivar Zen' : 'Activar Zen' }}
          </button>
        </div>
      </header>

      <!-- Main Review Area -->
      <main class="max-w-4xl mx-auto relative z-10">
        <app-weekly-review-coach />
      </main>

      <!-- Background Zen Effect -->
      @if (store.isZenMode()) {
        <div class="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div class="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/5 blur-[120px] rounded-full animate-pulse"></div>
          <div class="absolute bottom-1/4 -left-20 w-80 h-80 bg-orange-500/5 blur-[100px] rounded-full animate-pulse" style="animation-delay: 2s"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    
    .zen-space {
      background-color: #0c0a09; /* stone-950 */
      background-image: radial-gradient(circle at 50% 10%, rgba(251, 191, 36, 0.03) 0%, transparent 50%);
      color: #fafaf9; /* stone-50 */
    }

    .zen-space h1 {
      color: #fde68a; /* amber-200 */
      text-shadow: 0 0 40px rgba(251,191,36,0.15);
      font-weight: 200;
    }

    .zen-space p {
      color: #a8a29e; /* stone-400 */
      letter-spacing: 0.05em;
    }
    
    .zen-space app-confidence-bar {
      opacity: 0.9;
      transform: scale(0.95);
      transition: all 1s ease;
    }
  `]
})
export class ReflectPage {
  public store = inject(ReflectStore);
}
