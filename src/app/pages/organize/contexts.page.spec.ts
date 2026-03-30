import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizeStore, GroupedActions } from '../../organize/services/organize.store';
import ContextsPage from './contexts.page';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ContextsPage', () => {
  let component: ContextsPage;
  let fixture: ComponentFixture<ContextsPage>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      groupedByContext: signal<GroupedActions[]>([
        { context: 'Sin contexto', actions: [{ id: '1', title: 'Task 1', status: 'next_action', type: 'action', created_at: new Date() } as any] },
        { context: '@home', actions: [{ id: '2', title: 'Task 2', status: 'next_action', type: 'action', created_at: new Date() } as any] }
      ]),
      toggleActionComplete: vi.fn().mockResolvedValue(undefined),
      createAction: vi.fn().mockResolvedValue({}),
      updateItem: vi.fn().mockResolvedValue(undefined),
      moveToCalendar: vi.fn().mockResolvedValue(undefined),
      deleteItem: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [ContextsPage],
      providers: [
        { provide: OrganizeStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ContextsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should filter groups when context is selected', () => {
    component.selectedContext.set('@home');
    
    const displayed = component.displayedGroups();
    expect(displayed.length).toBe(1);
    expect(displayed[0].context).toBe('@home');
  });

  it('should handle add action', async () => {
    await component.onAddAction('New context task', '@home');
    expect(mockStore.createAction).toHaveBeenCalledWith({ title: 'New context task', context: '@home' });
  });

  it('should handle delete confirmation', async () => {
    component.onMenuAction({ id: 'delete', label: 'test' }, { id: 'test-id' } as any);
    await component.confirmDelete();
    
    expect(mockStore.deleteItem).toHaveBeenCalledWith('test-id');
  });
});
