import { Injectable, computed, inject, signal } from '@angular/core';
import { OrganizeStore } from '../../organize/services/organize.store';
import { ReflectService } from '../../core/services/reflect.service';
import { GtdItem } from '../../core/models/gtd-item.model';

export type ReviewStep = 'clear_minds' | 'review_past' | 'review_future' | 'audit_projects' | 'review_someday' | 'complete';

@Injectable({ providedIn: 'root' })
export class ReflectStore {
  private organizeStore = inject(OrganizeStore);
  private reflectService = inject(ReflectService);

  // ─── State ─────────────────────────────────────────────────────────────────
  
  public readonly currentStep = signal<ReviewStep>('clear_minds');
  public readonly isZenMode = signal<boolean>(false);
  
  // ─── Computed ──────────────────────────────────────────────────────────────
  
  /**
   * Calcula el nivel de confianza del sistema (0-100).
   * Basado en la auditoría del ReflectService.
   */
  public readonly systemConfidence = computed(() => {
    const audit = this.reflectService.performAudit();
    return this.reflectService.calculateHealthScore(audit);
  });

  public readonly reviewSteps: ReviewStep[] = [
    'clear_minds',
    'review_past',
    'review_future',
    'audit_projects',
    'review_someday',
    'complete'
  ];

  public readonly currentStepIndex = computed(() => 
    this.reviewSteps.indexOf(this.currentStep())
  );

  public readonly progress = computed(() => 
    (this.currentStepIndex() / (this.reviewSteps.length - 1)) * 100
  );

  // ─── Actions ───────────────────────────────────────────────────────────────

  public nextStep() {
    const index = this.currentStepIndex();
    if (index < this.reviewSteps.length - 1) {
      this.currentStep.set(this.reviewSteps[index + 1]);
    }
  }

  public prevStep() {
    const index = this.currentStepIndex();
    if (index > 0) {
      this.currentStep.set(this.reviewSteps[index - 1]);
    }
  }

  public resetReview() {
    this.currentStep.set('clear_minds');
  }

  public toggleZenMode(enabled?: boolean) {
    this.isZenMode.update(v => enabled ?? !v);
  }
}
