import { Injectable, inject } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';
import { SupabaseService } from './supabase.service';
import { SyncOperation } from '../models/sync-queue.model';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private indexedDb = inject(IndexedDbService);
  private supabaseService = inject(SupabaseService);

  constructor() {
    window.addEventListener('online', () => this.syncQueue());
    
    if (navigator.onLine) {
      this.syncQueue();
    }
  }

  async enqueueOperation(op: Omit<SyncOperation, 'timestamp'>) {
    const fullOp: SyncOperation = {
      ...op,
      timestamp: new Date()
    };
    await this.indexedDb.put(this.indexedDb.STORE_SYNC_QUEUE, fullOp);
    
    if (navigator.onLine) {
      this.syncQueue();
    }
  }

  async syncQueue() {
    if (!this.supabaseService.isAuthenticated()) return;
    
    try {
      const queue = await this.indexedDb.getAll<SyncOperation>(this.indexedDb.STORE_SYNC_QUEUE);
      queue.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

      for (const op of queue) {
        let success = true;
        const supabase = this.supabaseService.client;
        
        switch (op.action) {
          case 'INSERT':
            {
              const { error } = await supabase.from(op.entityType).insert(op.payload);
              if (error) success = false;
            }
            break;
          case 'UPDATE':
            {
              const { error } = await supabase.from(op.entityType).update(op.payload).eq('id', op.payload.id);
              if (error) success = false;
            }
            break;
          case 'DELETE':
            {
              const { error } = await supabase.from(op.entityType).delete().eq('id', op.payload.id);
              if (error) success = false;
            }
            break;
        }

        if (success) {
          await this.indexedDb.delete(this.indexedDb.STORE_SYNC_QUEUE, op.id);
        } else {
          break;
        }
      }
    } catch (e) {
      console.error('Error in sync queue', e);
    }
  }
}
