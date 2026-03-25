import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../../organize/services/organize.store';
// import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">Hard Landscape</h1>
        <p class="text-zinc-500">Tus compromisos sagrados. Lo que tiene que ocurrir en una fecha y hora exactas.</p>
      </header>

      <div class="flex flex-col gap-3">
        @if (events().length === 0) {
          <div class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <h3 class="text-zinc-300 font-medium">Sin Eventos</h3>
            <p class="text-sm text-zinc-500 mt-1">El paisaje está despejado. No hay citas obligatorias.</p>
          </div>
        } @else {
          @for (event of events(); track event.id) {
             <div class="bg-zinc-900 border-l-4 border-l-indigo-500 border-y border-r border-zinc-800/80 rounded-r-2xl p-4 md:p-5 flex items-start gap-4 hover:bg-zinc-800/50 transition-colors">
                <div class="flex-shrink-0 w-12 text-center pt-1">
                  <!-- Mostrar mes y dia si existe scheduled_date -->
                  @if (event.scheduled_date) {
                    <div class="text-xs text-indigo-400 font-bold uppercase tracking-wider">
                      {{ event.scheduled_date | date:'MMM' }}
                    </div>
                    <div class="text-2xl font-light text-white leading-none mt-1">
                      {{ event.scheduled_date | date:'dd' }}
                    </div>
                  } @else {
                    <div class="text-xs text-indigo-400 font-bold uppercase tracking-wider">Cita</div>
                    <div class="text-xl font-light text-white leading-none mt-1">--</div>
                  }
                </div>
                <div class="flex-1 min-w-0 border-l border-zinc-800/80 pl-4 py-1">
                  <h3 class="text-base sm:text-lg font-medium text-zinc-200">{{ event.title }}</h3>
                  @if (event.notes) {
                    <p class="text-sm text-zinc-500 mt-1">{{ event.notes }}</p>
                  }
                  @if (event.scheduled_date) {
                    <p class="text-xs text-zinc-600 mt-2 font-mono">{{ event.scheduled_date | date:'shortTime' }}</p>
                  }
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
  `]
})
export default class CalendarPage {
  private store = inject(OrganizeStore);
  public events = this.store.calendarEvents;
}
