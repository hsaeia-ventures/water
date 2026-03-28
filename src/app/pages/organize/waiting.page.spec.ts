import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizeStore } from '../../organize/services/organize.store';
import WaitingPage from './waiting.page';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('WaitingPage', () => {
  let component: WaitingPage;
  let fixture: ComponentFixture<WaitingPage>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      waitingActions: signal([
        { id: '1', title: 'Task 1', delegated_to: 'Ana', created_at: new Date(), updated_at: new Date() } as any
      ]),
      registerFollowUp: vi.fn().mockResolvedValue(undefined),
      toggleActionComplete: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [WaitingPage],
      providers: [
        { provide: OrganizeStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WaitingPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate urgency appropriately', () => {
    const today = new Date();
    
    const d8days = new Date();
    d8days.setDate(today.getDate() - 8);
    const item8 = { created_at: d8days } as any;

    const d15days = new Date();
    d15days.setDate(today.getDate() - 15);
    const item15 = { created_at: d15days } as any;

    const d1day = new Date();
    d1day.setDate(today.getDate() - 1);
    const item1 = { created_at: d1day } as any;

    expect(component.getUrgencyBorder(item1)).toContain('border-zinc-800/80');
    expect(component.getUrgencyBorder(item8)).toContain('border-amber-500/50');
    expect(component.getUrgencyBorder(item15)).toContain('border-red-500/50 border-urgency-high');
  });

  it('should trigger registerFollowUp on ping', async () => {
    await component.ping({ id: '1' } as any);
    expect(mockStore.registerFollowUp).toHaveBeenCalledWith('1');
  });

  it('should trigger toggleActionComplete on markReceived', async () => {
    await component.markReceived({ id: '1' } as any);
    expect(mockStore.toggleActionComplete).toHaveBeenCalledWith({ id: '1' });
  });
});
