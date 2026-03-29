import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WeeklyReviewCoachComponent } from './weekly-review-coach';
import { ReflectStore } from '../../services/reflect.store';
import { OrganizeStore } from '../../../organize/services/organize.store';
import { CaptureStore } from '../../../capture/services/capture.store';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('WeeklyReviewCoachComponent', () => {
  let component: WeeklyReviewCoachComponent;
  let fixture: ComponentFixture<WeeklyReviewCoachComponent>;
  let mockReflect: any;
  let mockOrganize: any;
  let mockCapture: any;
  let stepSignal: any;

  beforeEach(async () => {
    stepSignal = signal('clear_minds');
    mockReflect = {
      currentStep: stepSignal,
      reviewSteps: ['clear_minds', 'review_past', 'review_future', 'audit_projects', 'review_someday', 'complete'],
      currentStepIndex: signal(0),
      nextStep: vi.fn(),
      prevStep: vi.fn(),
      resetReview: vi.fn()
    };

    mockOrganize = {
      upcomingEvents: signal({ past: [], today: [], future: [] }),
      unhealthyProjects: signal([]),
      somedayItems: signal([])
    };

    mockCapture = {
      items: signal([]),
      inboxCount: signal(0)
    };

    await TestBed.configureTestingModule({
      imports: [WeeklyReviewCoachComponent],
      providers: [
        { provide: ReflectStore, useValue: mockReflect },
        { provide: OrganizeStore, useValue: mockOrganize },
        { provide: CaptureStore, useValue: mockCapture }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WeeklyReviewCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Paso 1 for clear_minds step', () => {
    stepSignal.set('clear_minds');
    fixture.detectChanges();
    const h2 = fixture.nativeElement.querySelector('h2');
    expect(h2.textContent).toContain('Paso 1: Vaciar tu Mente');
  });

  it('should navigate forward', () => {
    const nextButton = fixture.nativeElement.querySelectorAll('button')[2]; // Siguiente
    nextButton.click();
    expect(mockReflect.nextStep).toHaveBeenCalled();
  });

  it('should call resetReview when clicking Finalizar en el último paso', () => {
    stepSignal.set('complete');
    fixture.detectChanges();
    const finishButton = fixture.nativeElement.querySelector('button');
    finishButton.click();
    expect(mockReflect.resetReview).toHaveBeenCalled();
  });
});
