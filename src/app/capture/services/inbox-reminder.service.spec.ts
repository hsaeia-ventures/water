import { TestBed } from '@angular/core/testing';
import { InboxReminderService } from './inbox-reminder.service';
import { CaptureStore } from './capture.store';
import { signal } from '@angular/core';

describe('InboxReminderService', () => {
  let service: InboxReminderService;
  let mockCaptureStore: any;

  beforeEach(() => {
    mockCaptureStore = {
      items: signal([]),
      inboxCount: signal(0)
    };

    TestBed.configureTestingModule({
      providers: [
        InboxReminderService,
        { provide: CaptureStore, useValue: mockCaptureStore }
      ]
    });
    service = TestBed.inject(InboxReminderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should not remind if inbox is empty', () => {
    expect(service.shouldRemind()).toBe(false);
    expect(service.reminderLevel()).toBe('none');
  });

  it('should return info level for fewer than 5 items recently created', () => {
    mockCaptureStore.items.set([
      { created_at: new Date() } // just now
    ]);
    mockCaptureStore.inboxCount.set(1);

    expect(service.shouldRemind()).toBe(false);
    expect(service.reminderLevel()).toBe('info');
  });

  it('should return warning level for 5 or more items recently created', () => {
    const items = Array.from({ length: 5 }, () => ({ created_at: new Date() }));
    mockCaptureStore.items.set(items);
    mockCaptureStore.inboxCount.set(5);

    expect(service.shouldRemind()).toBe(false);
    expect(service.reminderLevel()).toBe('warning');
  });

  it('should trigger reminder and critical level if the oldest item is older than 12 hours', () => {
    const past13Hours = new Date(new Date().getTime() - (13 * 60 * 60 * 1000));
    const items = [
      { created_at: new Date() }, // newest
      { created_at: past13Hours }  // oldest
    ];
    mockCaptureStore.items.set(items);
    mockCaptureStore.inboxCount.set(2);

    expect(service.shouldRemind()).toBe(true);
    expect(service.reminderLevel()).toBe('critical');
  });

  it('should return critical level if there are 10 or more items, regardless of age', () => {
    const items = Array.from({ length: 15 }, () => ({ created_at: new Date() }));
    mockCaptureStore.items.set(items);
    mockCaptureStore.inboxCount.set(15);

    expect(service.shouldRemind()).toBe(false); // age is not old
    expect(service.reminderLevel()).toBe('critical'); // but volume is high
  });
});
