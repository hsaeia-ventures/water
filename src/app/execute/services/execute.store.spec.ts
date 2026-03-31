import { TestBed } from '@angular/core/testing';
import { ExecuteStore } from './execute.store';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { generateId } from '../../core/utils/uuid.util';
import { GtdItem } from '../../core/models/gtd-item.model';

describe('ExecuteStore', () => {
  let store: ExecuteStore;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExecuteStore]
    });
    store = TestBed.inject(ExecuteStore);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should be created with default values', () => {
    expect(store).toBeTruthy();
    expect(store.energyLevel()).toBe('media');
    expect(store.timeAvailable()).toBe('30m');
    expect(store.manualContext()).toBeNull();
    expect(store.suggestedActions()).toEqual([]);
  });

  it('should update parameters correctly', () => {
    store.setParameters('alta', '15m');
    expect(store.energyLevel()).toBe('alta');
    expect(store.timeAvailable()).toBe('15m');
  });

  it('should start deep work and set pomodoro time based on limit', () => {
    const fakeTask: GtdItem = {
      id: generateId(),
      type: 'action',
      status: 'next_action',
      title: 'Test',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    // Test for 15m limit -> 15 * 60 = 900
    store.setParameters('baja', '15m');
    store.startDeepWork(fakeTask);
    
    expect(store.deepWorkTask()).toBe(fakeTask);
    expect(store.pomodoroSeconds()).toBe(900);
    expect(store.isPomodoroActive()).toBe(false);
  });

  it('should countdown pomodoro when started', () => {
    const fakeTask: GtdItem = {
      id: generateId(),
      type: 'action',
      status: 'next_action',
      title: 'Test',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    store.setParameters('alta', '15m');
    store.startDeepWork(fakeTask);
    store.togglePomodoro();
    
    expect(store.isPomodoroActive()).toBe(true);
    
    vi.advanceTimersByTime(2000); // Wait 2 virtual seconds
    
    expect(store.pomodoroSeconds()).toBe(898);
  });

  it('should end deepwork completely', () => {
    const fakeTask: GtdItem = {
      id: generateId(),
      type: 'action',
      status: 'next_action',
      title: 'Test',
      created_at: new Date(),
      updated_at: new Date()
    };
    
    store.startDeepWork(fakeTask);
    store.togglePomodoro();
    store.endDeepWork();
    
    expect(store.deepWorkTask()).toBe(null);
    expect(store.isPomodoroActive()).toBe(false);
    expect(store.pomodoroSeconds()).toBe(0);
  });
});
