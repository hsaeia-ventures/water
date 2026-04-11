import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../organize/services/organize.store';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { GtdItem } from '../../core/models/gtd-item.model';
import { ToastService } from '../../core/services/toast.service';
import { HapticService } from '../../core/services/haptic.service';

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
            <div class="group bg-zinc-900 border rounded-2xl p-4 md:p-5 transition-all"
                 [ngClass]="getUrgencyBorder(task)">
              <div class="flex items-center gap-3 mb-3">
                <span class="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 font-bold text-sm border border-indigo-500/20">
                  {{ task.delegated_to ? task.delegated_to.charAt(0).toUpperCase() : '?' }}
                </span>
                <div>
                  <div class="text-sm text-zinc-500 font-medium leading-none mb-1">Delegado a</div>
                  <div class="text-indigo-400 font-medium leading-none">{{ task.delegated_to || 'Desconocido' }}</div>
                </div>
                <div class="ml-auto text-xs font-mono" [ngClass]="getUrgencyTextClass(task)">
                  hace {{ task.created_at | relativeTime }}
                </div>
              </div>
              
              <h3 class="text-lg font-medium text-white mb-2">{{ task.title }}</h3>
              
              @if (task.notes) {
                <p class="text-sm text-zinc-400 mb-2">{{ task.notes }}</p>
              }

              <!-- Actions/Footer -->
              <div class="mt-4 flex flex-wrap gap-2 items-center justify-between border-t border-zinc-800/50 pt-4">
                <span class="text-xs text-zinc-500 flex items-center gap-1">
                  @if (task.followed_up_at) {
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" /></svg>
                    Último toque: hace {{ task.followed_up_at | relativeTime }}
                  }
                </span>

                <div class="flex items-center gap-2">
                  <button 
                    (click)="ping(task)"
                    class="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                    title="Actualizar registro de seguimiento"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-3.5 h-3.5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>
                    Toque
                  </button>
                  <button 
                    (click)="markReceived(task)"
                    class="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-medium rounded-lg border border-teal-500/20 transition-colors flex items-center gap-1.5"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                    Resuelto
                  </button>
                </div>
              </div>
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
    .border-urgency-high {
      animation: pulseRed 3s infinite ease-in-out;
    }
    @keyframes pulseRed {
      0% { border-color: rgba(239, 68, 68, 0.4); }
      50% { border-color: rgba(239, 68, 68, 0.8); }
      100% { border-color: rgba(239, 68, 68, 0.4); }
    }
  `]
})
export default class WaitingPage {
  private store = inject(OrganizeStore);
  private toast = inject(ToastService);
  private haptic = inject(HapticService);
  public waitingTasks = this.store.waitingActions;

  private getAgeInDays(dateStr: Date | string): number {
    const d = new Date(dateStr);
    const diff = new Date().getTime() - d.getTime();
    return diff / (1000 * 3600 * 24);
  }

  getUrgencyBorder(task: GtdItem): string {
    const days = this.getAgeInDays(task.created_at);
    if (days >= 14) return 'border-red-500/50 border-urgency-high';
    if (days >= 7) return 'border-amber-500/50 hover:border-amber-500/80';
    return 'border-zinc-800/80 hover:border-zinc-700';
  }

  getUrgencyTextClass(task: GtdItem): string {
    const days = this.getAgeInDays(task.created_at);
    if (days >= 14) return 'text-red-400 font-bold';
    if (days >= 7) return 'text-amber-400 font-bold';
    return 'text-zinc-600';
  }

  async ping(task: GtdItem) {
    await this.store.registerFollowUp(task.id);
    this.haptic.success();
    this.toast.show('Toque registrado al delegado', 'success');
  }

  async markReceived(task: GtdItem) {
    await this.store.toggleActionComplete(task);
  }
}
