import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../organize/services/organize.store';
import { WeekStripComponent } from '../../organize/components/week-strip/week-strip';
import { ItemMenuComponent, MenuAction } from '../../shared/components/item-menu/item-menu';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import { GtdItem } from '../../core/models/gtd-item.model';

@Component({
  selector: 'app-calendar-page',
  standalone: true,
  imports: [CommonModule, WeekStripComponent, ItemMenuComponent, ConfirmDialogComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">Hard Landscape</h1>
          <p class="text-zinc-500">Tus compromisos sagrados. Lo que tiene que ocurrir en una fecha y hora exactas.</p>
        </div>
        <div class="flex items-center gap-2">
          <button 
            (click)="selectedDate.set(null)"
            [ngClass]="selectedDate() === null ? 'bg-zinc-800 text-white' : 'bg-transparent border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'"
            class="px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          >
            Agenda
          </button>
          <button 
            (click)="createEvent()"
            class="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white font-medium text-sm rounded-xl transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
            Añadir Evento
          </button>
        </div>
      </header>

      <!-- Week Strip (Sticky) -->
      <div class="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md pb-4 pt-2 mb-4 -mx-4 px-4 sm:mx-0 sm:px-0">
         <app-week-strip 
           [selectedDate]="selectedDate()"
           [eventDates]="eventDates()"
           (dayChange)="onDayChanged($event)"
         />
      </div>

      <div class="flex flex-col gap-3">
        @if (filteredEvents().length === 0) {
          <div class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <h3 class="text-zinc-300 font-medium">Sin Eventos</h3>
            <p class="text-sm text-zinc-500 mt-1">
              {{ selectedDate() ? 'No hay nada agendado para este día.' : 'El paisaje está despejado. No hay citas obligatorias.' }}
            </p>
          </div>
        } @else {
          <!-- Let's group events by day if we are in Agenda view (selectedDate === null) -->
          @for (group of groupedEvents(); track group.dateStr) {
            
            @if (selectedDate() === null) {
              <h2 class="text-sm font-semibold uppercase tracking-wider text-zinc-500 mt-4 mb-2 pl-2">
                {{ group.dateObj | date:'EEEE, d MMMM' }}
              </h2>
            }

            @for (event of group.events; track event.id) {
               <!-- Hard block style vs fluid style based on whether it has exact time -->
               <div class="group relative items-start gap-4 transition-all"
                    [ngClass]="hasTime(event) ? 
                        'bg-zinc-900 border-l-4 border-l-indigo-500 border-y border-r border-zinc-800/80 rounded-r-2xl p-4 md:p-5 flex hover:bg-zinc-800/50' : 
                        'bg-zinc-900/50 border border-zinc-800/50 rounded-2xl p-3 md:p-4 flex hover:bg-zinc-800/50'">
                  
                  <div class="flex-shrink-0 w-12 text-center pt-1" [ngClass]="hasTime(event) ? '' : 'opacity-70'">
                    @if (event.scheduled_date) {
                      <div class="text-xs font-bold uppercase tracking-wider" [ngClass]="hasTime(event) ? 'text-indigo-400' : 'text-zinc-500'">
                        {{ event.scheduled_date | date:'MMM' }}
                      </div>
                      <div class="text-2xl font-light leading-none mt-1" [ngClass]="hasTime(event) ? 'text-white' : 'text-zinc-400'">
                        {{ event.scheduled_date | date:'dd' }}
                      </div>
                    } @else {
                      <div class="text-xs text-indigo-400 font-bold uppercase tracking-wider">Cita</div>
                      <div class="text-xl font-light text-white leading-none mt-1">--</div>
                    }
                  </div>

                  <div class="flex-1 min-w-0 py-1" [ngClass]="hasTime(event) ? 'border-l border-zinc-800/80 pl-4' : 'pl-2'">
                    <h3 class="font-medium transition-colors" [ngClass]="[
                        hasTime(event) ? 'text-base sm:text-lg text-zinc-200' : 'text-sm sm:text-base text-zinc-300',
                        event.status === 'done' ? 'line-through opacity-50' : ''
                      ]">
                      {{ event.title }}
                    </h3>
                    
                    @if (event.notes) {
                      <p class="text-sm text-zinc-500 mt-1 line-clamp-2">{{ event.notes }}</p>
                    }
                    
                    @if (hasTime(event)) {
                      <p class="text-xs text-indigo-400/80 mt-2 font-mono bg-indigo-500/10 inline-block px-1.5 py-0.5 rounded">
                        {{ event.scheduled_date | date:'shortTime' }}
                      </p>
                    }
                  </div>

                  <!-- Actions menu -->
                  <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                    <app-item-menu 
                      [actions]="eventMenuOptions"
                      (actionSelected)="onEventMenu($event, event)"
                    />
                  </div>
               </div>
            }
          }
        }
      </div>
    </div>

    <app-confirm-dialog
      #deleteDialog
      title="¿Cancelar Evento?"
      message="El evento desaparecerá del calendario de forma permanente."
      confirmLabel="Eliminar"
      (confirmed)="confirmDeleteEvent()"
    />
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
  
  @ViewChild('deleteDialog') deleteDialog!: ConfirmDialogComponent;
  
  public selectedDate = signal<Date | null>(new Date());
  
  public eventMenuOptions: MenuAction[] = [
    { id: 'edit', label: 'Editar evento...' },
    { id: 'reschedule', label: 'Reprogramar...' },
    { id: 'delete', label: 'Cancelar Evento', danger: true }
  ];

  private eventToDelete: GtdItem | null = null;

  public eventDates = computed(() => {
    return this.store.calendarEvents()
      .map(e => e.scheduled_date ? new Date(e.scheduled_date) : null)
      .filter((d): d is Date => d !== null);
  });

  public filteredEvents = computed(() => {
    let events = this.store.calendarEvents();
    const sel = this.selectedDate();
    
    // Default to hiding historic past context if viewing agenda? 
    // Actually, GTD calendar is strict, keep it pure. If agenda, show from today forward maybe?
    // Let's just show all if Agenda (null), but sort properly.
    
    if (sel) {
      const selString = sel.toDateString();
      events = events.filter(e => {
        if (!e.scheduled_date) return false;
        return new Date(e.scheduled_date).toDateString() === selString;
      });
    } else {
      // Agenda view: filter out events older than yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(23, 59, 59, 999);
      events = events.filter(e => {
        if (!e.scheduled_date) return true;
        return new Date(e.scheduled_date) > yesterday;
      });
    }

    return events;
  });

  // Group events by day for agenda view
  public groupedEvents = computed(() => {
    const events = this.filteredEvents();
    const groups = new Map<string, { dateStr: string, dateObj: Date, events: GtdItem[] }>();
    
    for (const event of events) {
      const date = event.scheduled_date ? new Date(event.scheduled_date) : new Date();
      date.setHours(0,0,0,0);
      const key = date.toISOString();
      
      if (!groups.has(key)) {
        groups.set(key, { dateStr: key, dateObj: date, events: [] });
      }
      groups.get(key)!.events.push(event);
    }
    
    return Array.from(groups.values()).sort((a,b) => a.dateObj.getTime() - b.dateObj.getTime());
  });

  hasTime(event: GtdItem): boolean {
    if (!event.scheduled_date) return false;
    const d = new Date(event.scheduled_date);
    // If hours and minutes are exactly 0, consider it an all-day event
    return !(d.getHours() === 0 && d.getMinutes() === 0);
  }

  onDayChanged(date: Date) {
    this.selectedDate.set(date);
  }

  async createEvent() {
    const title = window.prompt('Título del evento:');
    if (!title || !title.trim()) return;

    let scheduledDate = this.selectedDate() ? new Date(this.selectedDate()!) : new Date();
    
    const timeStr = window.prompt('Hora (HH:MM)? (Deja en blanco o cancela para "todo el día"):');
    if (timeStr && timeStr.includes(':')) {
       const [h, m] = timeStr.trim().split(':');
       scheduledDate.setHours(parseInt(h), parseInt(m), 0, 0);
    } else {
       scheduledDate.setHours(0, 0, 0, 0);
    }
    
    await this.store.createCalendarEvent({
      title: title.trim(),
      scheduledDate
    });
  }

  async onEventMenu(menuAction: MenuAction, event: GtdItem) {
    if (menuAction.id === 'edit') {
      const newTitle = window.prompt('Nuevo título:', event.title);
      if (newTitle && newTitle.trim()) {
        await this.store.updateItem(event.id, { title: newTitle.trim() });
      }
    } else if (menuAction.id === 'reschedule') {
      // Very basic MVP reschedule
      const newDateStr = window.prompt('Nueva fecha (YYYY-MM-DD):', event.scheduled_date ? new Date(event.scheduled_date).toISOString().split('T')[0] : '');
      if (newDateStr) {
        const d = new Date(newDateStr);
        if (!isNaN(d.getTime())) {
          // Keep previous time if it existed
          if (this.hasTime(event)) {
             const old = new Date(event.scheduled_date!);
             d.setHours(old.getHours(), old.getMinutes(), 0, 0);
          } else {
             d.setHours(0,0,0,0);
          }
          await this.store.updateItem(event.id, { scheduled_date: d });
        }
      }
    } else if (menuAction.id === 'delete') {
      this.eventToDelete = event;
      this.deleteDialog.open();
    }
  }

  async confirmDeleteEvent() {
    if (this.eventToDelete) {
      await this.store.deleteItem(this.eventToDelete.id);
      this.eventToDelete = null;
    }
  }
}
