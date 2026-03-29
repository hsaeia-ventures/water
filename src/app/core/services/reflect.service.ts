import { Injectable, inject } from '@angular/core';
import { OrganizeStore } from '../../organize/services/organize.store';
import { CaptureStore } from '../../capture/services/capture.store';
import { GtdItem } from '../models/gtd-item.model';

export interface AuditResults {
  orphanProjects: GtdItem[];
  staleActions: GtdItem[];
  waitingOverdue: GtdItem[];
  inboxCount: number;
}

@Injectable({ providedIn: 'root' })
export class ReflectService {
  private organizeStore = inject(OrganizeStore);
  private captureStore = inject(CaptureStore);

  /**
   * Realiza una auditoría completa del sistema.
   */
  public performAudit(): AuditResults {
    const now = new Date();
    const staleThresholdDays = 14; // Consideramos estancado algo no tocado en 2 semanas
    
    const orphanProjects = this.organizeStore.unhealthyProjects();
    
    const staleActions = this.organizeStore.nextActions().filter(action => {
      const updatedAt = new Date(action.updated_at);
      const diffTime = Math.abs(now.getTime() - updatedAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > staleThresholdDays;
    });

    const waitingOverdue = this.organizeStore.waitingActions().filter(item => {
      const createdAt = new Date(item.created_at);
      const diffTime = Math.abs(now.getTime() - createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 7; // Más de una semana esperando
    });

    return {
      orphanProjects,
      staleActions,
      waitingOverdue,
      inboxCount: this.captureStore.inboxCount()
    };
  }

  /**
   * Calcula el porcentaje de salud del sistema basado en los resultados de la auditoría.
   */
  public calculateHealthScore(audit: AuditResults): number {
    let score = 100;

    // Penalización por Inbox (cada ítem resta 2 puntos, max -30)
    score -= Math.min(30, audit.inboxCount * 2);

    // Penalización por Proyectos Huérfanos (cada uno resta 10 puntos, max -40)
    score -= Math.min(40, audit.orphanProjects.length * 10);

    // Penalización por Acciones Estancadas (cada una resta 5 puntos, max -20)
    score -= Math.min(20, audit.staleActions.length * 5);

    // Penalización por Esperas vencidas (cada una resta 5 puntos, max -10)
    score -= Math.min(10, audit.waitingOverdue.length * 5);

    return Math.max(0, score);
  }
}
