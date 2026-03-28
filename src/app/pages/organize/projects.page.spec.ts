import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrganizeStore, ProjectWithActions } from '../../organize/services/organize.store';
import ProjectsPage from './projects.page';
import { signal } from '@angular/core';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('ProjectsPage', () => {
  let component: ProjectsPage;
  let fixture: ComponentFixture<ProjectsPage>;
  let mockStore: any;

  beforeEach(async () => {
    mockStore = {
      projectsWithActionCount: signal<ProjectWithActions[]>([
        { id: '1', title: 'Project 1', isHealthy: true, actions: [{ id: 'a1', title: 'Action 1' } as any] } as any,
        { id: '2', title: 'Project 2', isHealthy: false, actions: [] } as any
      ]),
      createProject: vi.fn().mockResolvedValue({ id: '3', title: 'New' }),
      updateItem: vi.fn().mockResolvedValue(undefined),
      deleteItem: vi.fn().mockResolvedValue(undefined),
      toggleActionComplete: vi.fn().mockResolvedValue(undefined),
      createAction: vi.fn().mockResolvedValue({})
    };

    await TestBed.configureTestingModule({
      imports: [ProjectsPage],
      providers: [
        { provide: OrganizeStore, useValue: mockStore }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render projects', () => {
    expect(component.projects().length).toBe(2);
  });

  it('should toggle block expand', () => {
    component.toggleExpand('1');
    expect(component.expandedIds().has('1')).toBe(true);
    
    component.toggleExpand('1');
    expect(component.expandedIds().has('1')).toBe(false);
  });

  it('should call store.createProject when add is requested and not empty', async () => {
    vi.spyOn(window, 'prompt').mockReturnValue('  My new project  ');
    await component.createProject();
    expect(mockStore.createProject).toHaveBeenCalledWith('My new project');
  });

  it('should handle delete confirmation for project and its actions', async () => {
    component.onProjectMenu({ id: 'delete', label: 'delete' }, component.projects()[0]);
    await component.confirmDeleteProject();
    
    expect(mockStore.deleteItem).toHaveBeenCalledWith('1');
    expect(mockStore.deleteItem).toHaveBeenCalledWith('a1');
  });
});
