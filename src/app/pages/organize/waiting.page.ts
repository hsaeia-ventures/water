import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../organize/services/organize.store';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-waiting-page',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">A la Espera</h1>
        <p class="text-zinc-500">Tracking de todo aquello que has delegado. No dejes que se enfríen.</p>
      </header>

      <div class="grid gap-3">
        @if (waitingTasks().length === 0) {
          <div class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <div class="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4 text-zinc-600">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>
            </div>
            <h3 class="text-zinc-300 font-medium">Bandeja Vacía</h3>
            <p class="text-sm text-zinc-500 mt-1">No estás esperando respuesta de nadie en este momento.</p>
          </div>
        } @else {
          @for (task of waitingTasks(); track task.id) {
            <div class="group bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 md:p-5 hover:border-zinc-700 transition-colors">
              <div class="flex items-center gap-3 mb-3">
                <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-sm">
                  {{ task.delegated_to ? task.delegated_to.charAt(0).toUpperCase() : '?' }}
                </span>
                <div>
                  <div class="text-sm text-zinc-500 font-medium">Delegado a</div>
                  <div class="text-indigo-400 font-medium leading-none">{{ task.delegated_to || 'Desconocido' }}</div>
                </div>
                <div class="ml-auto text-xs text-zinc-600 font-mono">
                  hace {{ task.created_at | relativeTime }}
                </div>
              </div>
              
              <h3 class="text-lg font-medium text-white mb-1">{{ task.title }}</h3>
              @if (task.notes) {
                <p class="text-sm text-zinc-400">{{ task.notes }}</p>
              }
            </div>
          }
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export default class WaitingPage {
  private store = inject(OrganizeStore);
  public waitingTasks = this.store.waitingActions;
}
