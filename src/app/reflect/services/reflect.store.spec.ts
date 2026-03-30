import { TestBed } from '@angular/core/testing';
import { ReflectStore, ReviewStep } from './reflect.store';
import { OrganizeStore } from '../../organize/services/organize.store';
import { ReflectService } from '../../core/services/reflect.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ReflectStore', () => {
  let store: ReflectStore;
  let mockOrganize: any;
  let mockReflect: any;

  beforeEach(() => {
    mockOrganize = {
      unhealthyProjectCount: vi.fn().mockReturnValue(0),
      projects: vi.fn().mockReturnValue([])
    };
    mockReflect = {
      performAudit: vi.fn().mockReturnValue({ count: 5 }),
      calculateHealthScore: vi.fn().mockReturnValue(85)
    };

    TestBed.configureTestingModule({
      providers: [
        ReflectStore,
        { provide: OrganizeStore, useValue: mockOrganize },
        { provide: ReflectService, useValue: mockReflect }
      ]
    });
    store = TestBed.inject(ReflectStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should navigate to next step', () => {
    store.nextStep();
    expect(store.currentStep()).toBe('review_past');
  });

  it('should compute system confidence from reflect service', () => {
    expect(store.systemConfidence()).toBe(85);
    expect(mockReflect.performAudit).toHaveBeenCalled();
  });

  it('should toggle zen mode', () => {
    expect(store.isZenMode()).toBe(false);
    store.toggleZenMode();
    expect(store.isZenMode()).toBe(true);
  });

  it('should reset review', () => {
    store.nextStep();
    store.resetReview();
    expect(store.currentStep()).toBe('clear_minds');
  });
});
