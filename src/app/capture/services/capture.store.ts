import { Injectable, signal, computed, inject } from '@angular/core';
import { GtdItem } from '../../core/models/gtd-item.model';
import { GhostTag } from '../models/ghost-tag.model';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { SyncService } from '../../core/services/sync.service';
import { generateId } from '../../core/utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class CaptureStore {
  private db = inject(IndexedDbService);
  private syncService = inject(SyncService);

  // State: lista interna de capturas (GtdItems donde status = 'inbox')
  private itemsState = signal<GtdItem[]>([]);

  // Selectors públicos y solo-lectura para componentes
  public readonly items = this.itemsState.asReadonly();
  public readonly inboxCount = computed(() => this.itemsState().length);

  constructor() {
    this.loadAll();
    
    window.addEventListener('sync-down-complete', () => {
      this.loadAll();
    });
  }

  /**
   * Carga todas las capturas (status=inbox) almacenadas en IndexedDB
   */
  public async loadAll(): Promise<void> {
    try {
      const storedItems = await this.db.getAll<GtdItem>(this.db.STORE_GTD_ITEMS);
      const inboxItems = storedItems.filter(i => i.status === 'inbox');
      
      // Ordenamos en memoria para mostrar lo más reciente arriba
      const sorted = inboxItems.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      
      this.itemsState.set(sorted);
    } catch (e) {
      console.error('[Water] Error al cargar capturas offline', e);
    }
  }

  /**
   * Crea, persiste de forma Offline-First, encola para sincronizar y anexa a la lista
   */
  public async addCapture(text: string, ghostTags: GhostTag[] = []): Promise<void> {
    const newItem: GtdItem = {
      id: generateId(),
      type: 'capture',
      status: 'inbox',
      title: text,
      ghost_tags: ghostTags,
      created_at: new Date(),
      updated_at: new Date()
    };

    try {
      // 1. Escribir a BD local primero para salvaguardar (Latencia Cero)
      await this.db.put(this.db.STORE_GTD_ITEMS, newItem);
      
      // 2. Encolar INSERT a Supabase a través del SyncQueue
      await this.syncService.enqueueOperation({
        id: generateId(),
        entityType: 'gtd_items',
        action: 'INSERT',
        payload: newItem
      });

      // 3. Log user tracking
      await this.syncService.enqueueOperation({
        id: generateId(),
        entityType: 'usage_logs',
        action: 'INSERT',
        payload: { event_type: 'item_captured', metadata: { item_id: newItem.id } }
      });

      // 4. Actualizar estado reactivo
      this.itemsState.update(current => [newItem, ...current]);
    } catch (error) {
      console.error('[Water] Fallo critico guardando captura localmente', error);
    }
  }

  /**
   * Elimina permanentemente una captura local (Trash flow temporal para Inbox page)
   */
  public async deleteCapture(id: string): Promise<void> {
    try {
      await this.db.delete(this.db.STORE_GTD_ITEMS, id);
      
      await this.syncService.enqueueOperation({
        id: generateId(),
        entityType: 'gtd_items',
        action: 'DELETE',
        payload: { id }
      });

      this.itemsState.update(current => current.filter(item => item.id !== id));
    } catch (error) {
      console.error('[Water] Error al eliminar la captura', error);
    }
  }
}
