import { Injectable, inject, effect } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';
import { SupabaseService } from './supabase.service';
import { SyncOperation } from '../models/sync-queue.model';
import { GtdItem } from '../models/gtd-item.model';

@Injectable({
  providedIn: 'root'
})
export class SyncService {
  private indexedDb = inject(IndexedDbService);
  private supabaseService = inject(SupabaseService);

  constructor() {
    window.addEventListener('online', () => this.syncQueue());
    
    // Listen to authentication state to start pulling and pushing
    effect(() => {
      if (this.supabaseService.isAuthenticated() && navigator.onLine) {
        this.downloadRemoteData().then(() => {
          this.syncQueue();
        });
      }
    });
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

  async downloadRemoteData() {
    if (!this.supabaseService.isAuthenticated()) return;
    
    try {
      const supabase = this.supabaseService.client;
      // Fetch all remote items
      const { data, error } = await supabase.from('gtd_items').select('*');
      
      if (error) {
        console.error('[Sync] Error al descargar data:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Upsert locales con la data remota
        for (const item of data) {
          await this.indexedDb.put(this.indexedDb.STORE_GTD_ITEMS, item as GtdItem);
        }
        window.dispatchEvent(new CustomEvent('sync-down-complete'));
      }
    } catch (e) {
      console.error('[Sync] Excepción en downloadRemoteData:', e);
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
              // Inject the current user ID just before sending
              const userOp = { ...op.payload, user_id: this.supabaseService.currentUser()?.id };
              const { error } = await supabase.from(op.entityType).insert(userOp);
              if (error) success = false;
            }
            break;
          case 'UPDATE':
            {
              const userOp = { ...op.payload, user_id: this.supabaseService.currentUser()?.id };
              const { error } = await supabase.from(op.entityType).update(userOp).eq('id', op.payload.id);
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
          break; // Si uno falla, detener cola
        }
      }
    } catch (e) {
      console.error('Error in sync queue', e);
    }
  }
}
