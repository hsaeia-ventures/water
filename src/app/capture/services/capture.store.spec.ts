import { TestBed } from '@angular/core/testing';
import { CaptureStore } from './capture.store';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { SyncService } from '../../core/services/sync.service';
import { GtdItem } from '../../core/models/gtd-item.model';

describe('CaptureStore', () => {
  let store: CaptureStore;
  let mockDbService: { getAll: any, put: any, delete: any, STORE_GTD_ITEMS: string };
  let mockSyncService: { enqueueOperation: any };

  const mockItems: Partial<GtdItem>[] = [
    { id: '1', title: 'older', created_at: new Date('2024-01-01'), status: 'inbox', type: 'capture', ghost_tags: [] },
    { id: '2', title: 'newer', created_at: new Date('2024-02-01'), status: 'inbox', type: 'capture', ghost_tags: [] }
  ];

  beforeEach(() => {
    mockDbService = {
      STORE_GTD_ITEMS: 'gtd_items',
      getAll: vi.fn().mockResolvedValue(mockItems),
      put: vi.fn().mockResolvedValue(undefined),
      delete: vi.fn().mockResolvedValue(undefined)
    };

    mockSyncService = {
      enqueueOperation: vi.fn().mockResolvedValue(undefined)
    };

    TestBed.configureTestingModule({
      providers: [
        CaptureStore,
        { provide: IndexedDbService, useValue: mockDbService },
        { provide: SyncService, useValue: mockSyncService }
      ]
    });

    store = TestBed.inject(CaptureStore);
  });

  it('should auto-load items from DB on creation and sort them by date descending', async () => {
    // wait for async loadAll inside constructor
    await new Promise(r => setTimeout(r, 0));

    expect(mockDbService.getAll).toHaveBeenCalledWith('gtd_items');
    
    // Sort logic validation (newer should be first)
    expect(store.items()).toHaveLength(2);
    expect(store.items()[0].title).toBe('newer');
    expect(store.inboxCount()).toBe(2);
  });

  it('should add a new capture to local DB and update signal array', async () => {
    await new Promise(r => setTimeout(r, 0)); // resolve loadAll first
    expect(store.items()).toHaveLength(2);

    await store.addCapture('Comprar leche');

    expect(mockDbService.put).toHaveBeenCalledTimes(1);
    expect(mockDbService.put).toHaveBeenCalledWith('gtd_items', expect.objectContaining({
      title: 'Comprar leche',
      status: 'inbox',
      type: 'capture'
    }));

    expect(mockSyncService.enqueueOperation).toHaveBeenCalled();

    // Update signal list instantly
    expect(store.items()).toHaveLength(3);
    expect(store.items()[0].title).toBe('Comprar leche');
    expect(store.inboxCount()).toBe(3);
  });

  it('should delete a capture from local DB and update signal array', async () => {
    await new Promise(r => setTimeout(r, 0)); // resolve loadAll
    
    await store.deleteCapture('2');

    expect(mockDbService.delete).toHaveBeenCalledWith('gtd_items', '2');
    expect(mockSyncService.enqueueOperation).toHaveBeenCalled();
    expect(store.items()).toHaveLength(1);
    expect(store.items()[0].id).toBe('1');
  });
});
