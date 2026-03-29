import { TestBed } from '@angular/core/testing';
import { ReflectService, AuditResults } from './reflect.service';
import { OrganizeStore } from '../../organize/services/organize.store';
import { CaptureStore } from '../../capture/services/capture.store';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ReflectService', () => {
  let service: ReflectService;
  let mockOrganize: any;
  let mockCapture: any;

  beforeEach(() => {
    mockOrganize = {
      unhealthyProjects: vi.fn().mockReturnValue([]),
      nextActions: vi.fn().mockReturnValue([]),
      waitingActions: vi.fn().mockReturnValue([])
    };
    mockCapture = {
      inboxCount: vi.fn().mockReturnValue(0)
    };

    TestBed.configureTestingModule({
      providers: [
        ReflectService,
        { provide: OrganizeStore, useValue: mockOrganize },
        { provide: CaptureStore, useValue: mockCapture }
      ]
    });
    service = TestBed.inject(ReflectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('performAudit', () => {
    it('should detect orphan projects', () => {
      mockOrganize.unhealthyProjects.mockReturnValue([{ id: 'p1' }]);
      const audit = service.performAudit();
      expect(audit.orphanProjects.length).toBe(1);
    });

    it('should detect stale actions', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 20);
      mockOrganize.nextActions.mockReturnValue([{ updated_at: oldDate }]);
      const audit = service.performAudit();
      expect(audit.staleActions.length).toBe(1);
    });
  });

  describe('calculateHealthScore', () => {
    it('should return 100 for perfect system', () => {
      const audit: AuditResults = {
        orphanProjects: [],
        staleActions: [],
        waitingOverdue: [],
        inboxCount: 0
      };
      expect(service.calculateHealthScore(audit)).toBe(100);
    });

    it('should penalize for inbox', () => {
      const audit: AuditResults = {
        orphanProjects: [],
        staleActions: [],
        waitingOverdue: [],
        inboxCount: 5
      };
      expect(service.calculateHealthScore(audit)).toBe(90);
    });
  });
});
