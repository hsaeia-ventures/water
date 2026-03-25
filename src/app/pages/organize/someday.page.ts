import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../../organize/services/organize.store';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-someday-page',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">Incubadora</h1>
        <p class="text-zinc-500">Tus grandes ideas, posibles proyectos e información de referencia para el futuro.</p>
      </header>

      <div class="grid gap-3 columns-1 md:columns-2">
        @if (somedayItems().length === 0) {
          <div class="col-span-full py-20 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <h3 class="text-zinc-300 font-medium">Bandeja Vacía</h3>
            <p class="text-sm text-zinc-500 mt-1">Aún no has congelado ninguna idea para el futuro.</p>
          </div>
        } @else {
          @for (item of somedayItems(); track item.id) {
            <div class="break-inside-avoid mb-3 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 md:p-5 hover:bg-zinc-900 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" 
                      [ngClass]="item.type === 'reference' ? 'bg-blue-500/10 text-blue-400' : 'bg-amber-500/10 text-amber-400'">
                  {{ item.type === 'reference' ? 'Referencia' : 'Tal vez' }}
                </span>
                <span class="text-xs text-zinc-600 font-mono">{{ item.created_at | relativeTime }}</span>
              </div>
              <h3 class="text-lg font-medium text-zinc-200 mt-2">{{ item.title }}</h3>
              @if (item.notes) {
                <p class="text-sm text-zinc-500 mt-2">{{ item.notes }}</p>
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
export default class SomedayPage {
  private store = inject(OrganizeStore);
  public somedayItems = this.store.somedayItems;
}
