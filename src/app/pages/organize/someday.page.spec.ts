import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizeStore } from '../../organize/services/organize.store';
import SomedayPage from './someday.page';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('SomedayPage', () => {
  let component: SomedayPage;
  let fixture: ComponentFixture<SomedayPage>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      somedayItems: signal([
        { id: '1', title: 'Idea 1', type: 'action', created_at: new Date() } as any,
        { id: '2', title: 'Project Idea', type: 'project', created_at: new Date() } as any
      ]),
      createSomedayItem: vi.fn().mockResolvedValue({}),
      activateFromSomeday: vi.fn().mockResolvedValue(undefined),
      updateItem: vi.fn().mockResolvedValue(undefined),
      deleteItem: vi.fn().mockResolvedValue(undefined)
    };

    await TestBed.configureTestingModule({
      imports: [SomedayPage],
      providers: [
        { provide: OrganizeStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SomedayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('filteredItems should respect filter', () => {
    component.filter.set('all');
    expect(component.filteredItems().length).toBe(2);

    component.filter.set('action');
    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].type).toBe('action');

    component.filter.set('project');
    expect(component.filteredItems().length).toBe(1);
    expect(component.filteredItems()[0].type).toBe('project');
  });

  it('should call activateFromSomeday when activating an item', async () => {
    await component.activateItem({ id: '2' } as any);
    expect(mockStore.activateFromSomeday).toHaveBeenCalledWith('2');
  });

  it('should add someday item with correct type based on filter', async () => {
    component.filter.set('action');
    await component.addSomedayItem('my idea');
    expect(mockStore.createSomedayItem).toHaveBeenCalledWith({ title: 'my idea', type: 'action' });

    component.filter.set('project');
    await component.addSomedayItem('my project');
    expect(mockStore.createSomedayItem).toHaveBeenCalledWith({ title: 'my project', type: 'project' });

    component.filter.set('all');
    await component.addSomedayItem('general idea');
    expect(mockStore.createSomedayItem).toHaveBeenCalledWith({ title: 'general idea', type: 'action' });
  });

  it('should handle menu actions', async () => {
    vi.spyOn(window, 'prompt').mockReturnValue('new name');
    await component.onMenuAction({ id: 'edit', label: '' }, { id: 'test' } as any);
    expect(mockStore.updateItem).toHaveBeenCalledWith('test', { title: 'new name' });

    component.onMenuAction({ id: 'delete', label: '' }, { id: 'test-del' } as any);
    await component.confirmDelete();
    expect(mockStore.deleteItem).toHaveBeenCalledWith('test-del');
  });
});
