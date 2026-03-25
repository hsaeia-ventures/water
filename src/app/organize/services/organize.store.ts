import { Injectable, computed, inject, signal } from '@angular/core';
import { GtdItem } from '../../core/models/gtd-item.model';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { SyncService } from '../../core/services/sync.service';
import { generateId } from '../../core/utils/uuid.util';

@Injectable({ providedIn: 'root' })
export class OrganizeStore {
  private db = inject(IndexedDbService);
  private syncService = inject(SyncService);

  private allItems = signal<GtdItem[]>([]);

  // Computed views for the 5 containers
  public readonly nextActions = computed(() => 
    this.allItems().filter(i => i.type === 'action' && i.status === 'next_action')
  );

  public readonly projects = computed(() => 
    this.allItems().filter(i => i.type === 'project')
  );

  public readonly waitingActions = computed(() => 
    this.allItems().filter(i => i.status === 'waiting')
  );

  public readonly calendarEvents = computed(() => 
    this.allItems().filter(i => i.status === 'calendar' || i.scheduled_date != null)
  );

  public readonly somedayItems = computed(() => 
    this.allItems().filter(i => i.status === 'someday' || i.type === 'reference')
  );

  constructor() {
    this.loadAll();
    window.addEventListener('sync-down-complete', () => this.loadAll());
  }

  public async loadAll() {
    const items = await this.db.getAll<GtdItem>(this.db.STORE_GTD_ITEMS);
    this.allItems.set(items);
  }

  public async toggleActionComplete(item: GtdItem) {
    const newStatus = item.status === 'done' ? 'next_action' : 'done';
    const updatedItem: GtdItem = {
      ...item,
      status: newStatus,
      completed_at: newStatus === 'done' ? new Date() : undefined,
      updated_at: new Date()
    };

    await this.db.put(this.db.STORE_GTD_ITEMS, updatedItem);
    await this.syncService.enqueueOperation({
      id: generateId(),
      entityType: 'gtd_items',
      action: 'UPDATE',
      payload: updatedItem
    });
    
    // Log tracking
    if (newStatus === 'done') {
      await this.syncService.enqueueOperation({
        id: generateId(),
        entityType: 'usage_logs',
        action: 'INSERT',
        payload: { event_type: 'action_completed', metadata: { item_id: item.id } }
      });
    }

    // Update local state instantly
    this.allItems.update(items => items.map(i => i.id === item.id ? updatedItem : i));
  }
}
