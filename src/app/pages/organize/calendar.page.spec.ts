import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizeStore } from '../../organize/services/organize.store';
import CalendarPage from './calendar.page';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('CalendarPage', () => {
  let component: CalendarPage;
  let fixture: ComponentFixture<CalendarPage>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      calendarEvents: signal([
        { id: '1', title: 'Doc appointment', scheduled_date: new Date(), status: 'calendar' } as any
      ]),
      createCalendarEvent: vi.fn().mockResolvedValue({}),
      updateItem: vi.fn().mockResolvedValue(undefined),
      deleteItem: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [CalendarPage],
      providers: [
        { provide: OrganizeStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filteredEvents should handle date change', () => {
    const today = new Date();
    component.selectedDate.set(today);
    expect(component.filteredEvents().length).toBe(1);

    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    component.selectedDate.set(tomorrow);
    expect(component.filteredEvents().length).toBe(0);
  });

  it('createEvent handles missing time properly', async () => {
    const promptSpy = vi.spyOn(window, 'prompt');
    promptSpy.mockReturnValueOnce('New meeting');
    promptSpy.mockReturnValueOnce('');
    
    component.selectedDate.set(new Date());
    await component.createEvent();
    
    expect(mockStore.createCalendarEvent).toHaveBeenCalled();
    const args = mockStore.createCalendarEvent.mock.calls[0][0];
    expect(args.title).toBe('New meeting');
    
    const d = new Date(args.scheduledDate);
    expect(d.getHours()).toBe(0);
  });

  it('hasTime detects exact time', () => {
    const event1 = { scheduled_date: new Date(2025, 1, 1, 10, 30) } as any;
    const event2 = { scheduled_date: new Date(2025, 1, 1, 0, 0) } as any;

    expect(component.hasTime(event1)).toBe(true);
    expect(component.hasTime(event2)).toBe(false);
  });
});
