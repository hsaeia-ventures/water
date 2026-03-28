import { TestBed } from '@angular/core/testing';
import { OrganizeStore } from './organize.store';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { SyncService } from '../../core/services/sync.service';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('OrganizeStore', () => {
  let store: OrganizeStore;
  let mockDb: any;
  let mockSync: any;

  beforeEach(() => {
    mockDb = {
      STORE_GTD_ITEMS: 'gtd_items',
      getAll: vi.fn().mockResolvedValue([]),
      put: vi.fn().mockResolvedValue(undefined)
    };

    mockSync = {
      enqueueOperation: vi.fn().mockResolvedValue(undefined)
    };

    TestBed.configureTestingModule({
      providers: [
        { provide: IndexedDbService, useValue: mockDb },
        { provide: SyncService, useValue: mockSync },
        OrganizeStore
      ]
    });

    store = TestBed.inject(OrganizeStore);
  });

  it('should be created', () => {
    expect(store).toBeTruthy();
  });

  it('should load items on init', async () => {
    expect(mockDb.getAll).toHaveBeenCalledWith('gtd_items');
  });

  it('should create an action', async () => {
    const item = await store.createAction({ title: 'New action', context: '@home' });
    expect(item.title).toBe('New action');
    expect(item.status).toBe('next_action');
    expect(item.ghost_tags?.[0].type).toBe('context');
    expect(item.ghost_tags?.[0].value).toBe('home');
    
    expect(mockDb.put).toHaveBeenCalledWith('gtd_items', item);
    expect(mockSync.enqueueOperation).toHaveBeenCalled();
    
    expect(store.nextActions().length).toBe(1);
    expect(store.groupedByContext()[0].context).toBe('@home');
  });

  it('should create a project', async () => {
    const item = await store.createProject('My Project');
    expect(item.type).toBe('project');
    expect(item.status).toBe('next_action');
    
    expect(mockDb.put).toHaveBeenCalledWith('gtd_items', item);
    expect(store.projects().length).toBe(1);
  });

  it('should compute projects with action count correctly', async () => {
    const project = await store.createProject('Project A');
    await store.createAction({ title: 'Task 1', parentId: project.id });
    await store.createProject('Project B');
    
    const enriched = store.projectsWithActionCount();
    expect(enriched.length).toBe(2);
    
    const pA = enriched.find(p => p.id === project.id);
    expect(pA?.actions.length).toBe(1);
    expect(pA?.isHealthy).toBe(true);
    
    const pB = enriched.find(p => p.id !== project.id);
    expect(pB?.actions.length).toBe(0);
    expect(pB?.isHealthy).toBe(false);
    
    expect(store.unhealthyProjectCount()).toBe(1);
  });

  it('should soft-delete item', async () => {
    const action = await store.createAction({ title: 'Will be deleted' });
    await store.deleteItem(action.id);
    
    expect(store.nextActions().length).toBe(0);
    expect(mockDb.put).toHaveBeenCalled();
  });
});
