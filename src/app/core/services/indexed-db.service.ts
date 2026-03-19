import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private readonly DB_NAME = 'water_db';
  private readonly DB_VERSION = 2; // Incremented for V2 GTD Items

  // Colecciones (Object Stores)
  public readonly STORE_GTD_ITEMS = 'gtd_items';
  public readonly STORE_SYNC_QUEUE = 'sync_queue';

  private db: IDBDatabase | null = null;
  private dbPromise: Promise<IDBDatabase> | null = null;

  /**
   * Abre o retorna la conexión activa hacia IndexedDB
   */
  private async connect(): Promise<IDBDatabase> {
    if (this.db) {
      return this.db;
    }
    
    // Si ya existe una promesa de conexión en curso, esperarla
    if (this.dbPromise) {
      return this.dbPromise;
    }

    this.dbPromise = new Promise((resolve, reject) => {
      // API Native IndexedDB
      const request = indexedDB.open(this.DB_NAME, this.DB_VERSION);

      request.onerror = () => {
        reject(`Fallo al abrir IndexedDB: ${request.error?.message}`);
      };

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = request.result;
        // Migraciones / Creación de Schema
        
        // Versión 1 y 2
        if (!db.objectStoreNames.contains(this.STORE_GTD_ITEMS)) {
           db.createObjectStore(this.STORE_GTD_ITEMS, { keyPath: 'id' });
        }
        
        if (!db.objectStoreNames.contains(this.STORE_SYNC_QUEUE)) {
           db.createObjectStore(this.STORE_SYNC_QUEUE, { keyPath: 'id' });
        }
      };
    });

    return this.dbPromise;
  }

  /**
   * Recupera todos los registros de un ObjectStore
   */
  public async getAll<T>(storeName: string): Promise<T[]> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly');
      const store = transaction.objectStore(storeName);
      const request = store.getAll();

      request.onerror = () => reject(`Fallo al leer datos de ${storeName}`);
      request.onsuccess = () => resolve(request.result as T[]);
    });
  }

  /**
   * Inserta o actualiza un registro en un ObjectStore
   */
  public async put<T>(storeName: string, item: T): Promise<void> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.put(item);

      request.onerror = () => reject(`Fallo al guardar ítem en ${storeName}`);
      request.onsuccess = () => resolve();
    });
  }

  /**
   * Elimina un registro por su Key
   */
  public async delete(storeName: string, key: string | number): Promise<void> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.delete(key);

      request.onerror = () => reject(`Fallo al borrar ítem en ${storeName}`);
      request.onsuccess = () => resolve();
    });
  }

  /** 
   * Limpia toda la base de datos (Útil para tests o reset states) 
   */
  public async clearStore(storeName: string): Promise<void> {
    const db = await this.connect();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite');
      const store = transaction.objectStore(storeName);
      const request = store.clear();

      request.onerror = () => reject(`Fallo al limpiar ${storeName}`);
      request.onsuccess = () => resolve();
    });
  }
}
