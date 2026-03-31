import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReflectPage } from './reflect.page';
import { ReflectStore } from '../../reflect/services/reflect.store';
import { ConfidenceBarComponent } from '../../reflect/components/confidence-bar/confidence-bar';
import { WeeklyReviewCoachComponent } from '../../reflect/components/weekly-review-coach/weekly-review-coach';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

import { OrganizeStore } from '../../organize/services/organize.store';
import { CaptureStore } from '../../capture/services/capture.store';

describe('ReflectPage', () => {
  let component: ReflectPage;
  let fixture: ComponentFixture<ReflectPage>;
  let mockReflect: any;
  let zenSignal: any;

  beforeEach(async () => {
    zenSignal = signal(false);
    mockReflect = {
      isZenMode: zenSignal,
      toggleZenMode: vi.fn(),
      systemConfidence: signal(100),
      currentStep: signal('clear_minds'),
      reviewSteps: ['clear_minds'],
      currentStepIndex: signal(0)
    };

    const mockOrganize = {
      upcomingEvents: signal({ past: [], today: [], future: [] }),
      unhealthyProjects: signal([]),
      somedayItems: signal([])
    };

    const mockCapture = {
      items: signal([]),
      inboxCount: signal(0)
    };

    await TestBed.configureTestingModule({
      imports: [ReflectPage, ConfidenceBarComponent, WeeklyReviewCoachComponent],
      providers: [
        { provide: ReflectStore, useValue: mockReflect },
        { provide: OrganizeStore, useValue: mockOrganize },
        { provide: CaptureStore, useValue: mockCapture }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReflectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply zen-space class when store is in zen mode', () => {
    zenSignal.set(true);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.min-h-screen');
    expect(container.classList.contains('zen-space')).toBe(true);
  });

  it('should toggle zen mode when clicking the button', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(mockReflect.toggleZenMode).toHaveBeenCalled();
  });
});
