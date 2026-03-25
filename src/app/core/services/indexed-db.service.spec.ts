import { TestBed } from '@angular/core/testing';
import { IndexedDbService } from './indexed-db.service';
import 'fake-indexeddb/auto'; // Permite correr tests de IndexedDB en entorno Node/JSDOM de Vitest

describe('IndexedDbService', () => {
  let service: IndexedDbService;

  beforeEach(async () => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IndexedDbService);
    
    // Limpiar base de datos virtual antes de cada test
    try {
      await service.clearStore(service.STORE_GTD_ITEMS);
    } catch {
      // Ignorar si el store aún no existe al limpiar la primera vez
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should write and read items using put() and getAll()', async () => {
    const mockItem = { id: 'test-1', title: 'hello world', synced: false };
    
    await service.put(service.STORE_GTD_ITEMS, mockItem);
    
    const elements = await service.getAll<any>(service.STORE_GTD_ITEMS);
    
    expect(elements).toHaveLength(1);
    expect(elements[0].id).toBe('test-1');
    expect(elements[0].title).toBe('hello world');
  });

  it('should delete items by id', async () => {
    const mockItem = { id: 'test-2', title: 'delete me' };
    
    await service.put(service.STORE_GTD_ITEMS, mockItem);
    let elements = await service.getAll<any>(service.STORE_GTD_ITEMS);
    expect(elements).toHaveLength(1);

    await service.delete(service.STORE_GTD_ITEMS, 'test-2');
    
    elements = await service.getAll<any>(service.STORE_GTD_ITEMS);
    expect(elements).toHaveLength(0);
  });

  it('should clear an entire store', async () => {
    await service.put(service.STORE_GTD_ITEMS, { id: '1' });
    await service.put(service.STORE_GTD_ITEMS, { id: '2' });
    
    let elements = await service.getAll<any>(service.STORE_GTD_ITEMS);
    expect(elements).toHaveLength(2);

    await service.clearStore(service.STORE_GTD_ITEMS);
    
    elements = await service.getAll<any>(service.STORE_GTD_ITEMS);
    expect(elements).toHaveLength(0);
  });
});
