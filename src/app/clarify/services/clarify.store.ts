import { Injectable, computed, inject, signal } from '@angular/core';
import { GtdItem, GtdObjType, GtdStatus } from '../../core/models/gtd-item.model';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { SyncService } from '../../core/services/sync.service';
import { generateId } from '../../core/utils/uuid.util';

@Injectable({ providedIn: 'root' })
export class ClarifyStore {
  private db = inject(IndexedDbService);
  private syncService = inject(SyncService);

  private inboxItems = signal<GtdItem[]>([]);
  
  // Patrón "Tarjetas apiladas": Siempre procesamos 1 solo a la vez.
  public currentItem = computed(() => {
    const items = this.inboxItems();
    return items.length > 0 ? items[0] : null;
  });
  
  public remainingCount = computed(() => this.inboxItems().length);

  constructor() {
    this.loadInbox();
  }

  public async loadInbox() {
    const all = await this.db.getAll<GtdItem>(this.db.STORE_GTD_ITEMS);
    const inbox = all.filter(i => i.status === 'inbox' && i.type === 'capture');
    this.inboxItems.set(inbox);
  }

  public async processCurrentItem(updates: Partial<GtdItem>, eventType: string = 'item_processed') {
    const current = this.currentItem();
    if (!current) return;

    const updatedItem = {
      ...current,
      ...updates,
      updated_at: new Date()
    };

    // 1. Local update
    await this.db.put(this.db.STORE_GTD_ITEMS, updatedItem);
    
    // 2. Sync to Supabase
    await this.syncService.enqueueOperation({
      id: generateId(),
      entityType: 'gtd_items',
      action: 'UPDATE',
      payload: updatedItem
    });

    // 3. Log usage
    await this.syncService.enqueueOperation({
      id: generateId(),
      entityType: 'usage_logs',
      action: 'INSERT',
      payload: { event_type: eventType, metadata: { item_id: current.id, updates } }
    });

    // 4. Sacar del inbox local
    this.inboxItems.update(items => items.filter(i => i.id !== current.id));
  }
}
