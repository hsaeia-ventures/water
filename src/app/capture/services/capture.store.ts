import { Injectable, signal, computed, inject } from '@angular/core';
import { CaptureItem } from '../models/capture-item.model';
import { GhostTag } from '../models/ghost-tag.model';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { generateId } from '../../core/utils/uuid.util';

@Injectable({
  providedIn: 'root'
})
export class CaptureStore {
  private db = inject(IndexedDbService);

  // State: lista interna de capturas
  private itemsState = signal<CaptureItem[]>([]);

  // Selectors públicos y solo-lectura para componentes
  public readonly items = this.itemsState.asReadonly();
  public readonly inboxCount = computed(() => this.itemsState().length);

  constructor() {
    this.loadAll();
  }

  /**
   * Carga todas las capturas almacenadas en IndexedDB
   * (Usualmente se lanza al arrancar la app / instanciar el store)
   */
  public async loadAll(): Promise<void> {
    try {
      const storedItems = await this.db.getAll<CaptureItem>(this.db.STORE_CAPTURES);
      
      // Ordenamos en memoria para mostrar lo más reciente arriba
      const sorted = storedItems.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      this.itemsState.set(sorted);
    } catch (e) {
      console.error('[Water] Error al cargar capturas offline', e);
    }
  }

  /**
   * Crea, persiste de forma Offline-First, y anexa una nueva idea a la lista
   */
  public async addCapture(text: string, ghostTags: GhostTag[] = []): Promise<void> {
    const newItem: CaptureItem = {
      id: generateId(),
      text,
      ghostTags,
      createdAt: new Date(),
      synced: false // Todavía no hemos llegado a la fase de Backend (Supabase)
    };

    try {
      // 1. Escribir a BD local primero para salvaguardar
      await this.db.put(this.db.STORE_CAPTURES, newItem);
      
      // 2. Actualizar estado (Reactividad para la UI)
      this.itemsState.update(current => [newItem, ...current]);
    } catch (error) {
      console.error('[Water] Fallo críitico guardando captura localmente', error);
      // Opcional: Notificar a través de un ToastService en el futuro
    }
  }

  /**
   * Elimina permanentemente una captura local (Inbox clear)
   */
  public async deleteCapture(id: string): Promise<void> {
    try {
      await this.db.delete(this.db.STORE_CAPTURES, id);
      this.itemsState.update(current => current.filter(item => item.id !== id));
    } catch (error) {
      console.error('[Water] Error al eliminar la captura', error);
    }
  }
}
