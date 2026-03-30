import { Component, EventEmitter, Input, OnInit, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface DayInfo {
  date: Date;
  dayName: string; // L, M, X, J, V, S, D
  dayNumber: number;
  isToday: boolean;
  isSelected: boolean;
  hasEvents: boolean;
}

@Component({
  selector: 'app-week-strip',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="week-strip">
      @for (day of days(); track day.date.toISOString()) {
        <button
          type="button"
          (click)="selectDay(day.date)"
          class="week-strip__day"
          [class.week-strip__day--today]="day.isToday"
          [class.week-strip__day--selected]="day.isSelected"
          aria-label="Seleccionar día"
        >
          <span class="week-strip__name">{{ day.dayName }}</span>
          <span class="week-strip__number">{{ day.dayNumber }}</span>
          @if (day.hasEvents) {
            <span class="week-strip__dot"></span>
          }
        </button>
      }
    </div>
  `,
  styles: [`
    .week-strip {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.5rem;
      scrollbar-width: none; /* Firefox */
    }
    .week-strip::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Edge */
    }
    .week-strip__day {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-width: 3.5rem;
      height: 4.5rem;
      border-radius: 1rem;
      border: 1px solid rgba(82, 82, 91, 0.5);
      background: rgba(39, 39, 42, 0.3);
      color: #a1a1aa;
      cursor: pointer;
      position: relative;
      transition: all 0.2s ease;
    }
    .week-strip__day:hover {
      background: rgba(82, 82, 91, 0.4);
      color: #e4e4e7;
    }
    .week-strip__day--today {
      border-color: rgba(99, 102, 241, 0.5);
      color: #818cf8;
    }
    .week-strip__day--selected {
      background: #6366f1;
      border-color: #6366f1;
      color: #ffffff;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
    }
    .week-strip__day--selected.week-strip__day--today {
      color: #ffffff;
    }
    .week-strip__name {
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      margin-bottom: 0.25rem;
    }
    .week-strip__number {
      font-size: 1.125rem;
      font-weight: 300;
    }
    .week-strip__dot {
      position: absolute;
      bottom: 0.5rem;
      width: 0.375rem;
      height: 0.375rem;
      border-radius: 50%;
      background: #818cf8;
    }
    .week-strip__day--selected .week-strip__dot {
      background: #ffffff;
    }
  `]
})
export class WeekStripComponent implements OnInit {
  @Input() set selectedDate(val: Date | null) {
    if (val) {
      this.currentSelected.set(new Date(val.getFullYear(), val.getMonth(), val.getDate()));
    } else {
      this.currentSelected.set(null);
    }
    this.generateDays();
  }
  
  @Input() eventDates: Date[] = [];
  
  @Output() dayChange = new EventEmitter<Date>();

  days = signal<DayInfo[]>([]);
  currentSelected = signal<Date | null>(null);

  ngOnInit() {
    this.generateDays();
  }

  ngOnChanges() {
    this.generateDays();
  }

  generateDays() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Encontrar el lunes de esta semana
    const currentDay = today.getDay();
    const distanceToMonday = currentDay === 0 ? 6 : currentDay - 1; 
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - distanceToMonday);

    const week: DayInfo[] = [];
    const dayNames = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

    const selected = this.currentSelected();
    const selTime = selected ? selected.getTime() : null;

    // Normalizar fechas de eventos para comparación fácil (solo día)
    const eventTimeSet = new Set(this.eventDates.map(d => {
      const copy = new Date(d);
      copy.setHours(0,0,0,0);
      return copy.getTime();
    }));

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      const time = date.getTime();

      week.push({
        date,
        dayName: dayNames[date.getDay()],
        dayNumber: date.getDate(),
        isToday: time === today.getTime(),
        isSelected: time === selTime,
        hasEvents: eventTimeSet.has(time)
      });
    }

    this.days.set(week);
  }

  selectDay(date: Date) {
    this.currentSelected.set(date);
    this.generateDays();
    this.dayChange.emit(date);
  }
}
