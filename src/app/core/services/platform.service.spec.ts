import { TestBed } from '@angular/core/testing';
import { PlatformService } from './platform.service';

describe('PlatformService', () => {
  let service: PlatformService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect viewport width', () => {
    expect(typeof service.viewportWidth()).toBe('number');
    expect(service.viewportWidth()).toBeGreaterThan(0);
  });

  it('should derive isMobile from viewportWidth', () => {
    service.viewportWidth.set(500);
    expect(service.isMobile()).toBe(true);
    expect(service.isDesktop()).toBe(false);

    service.viewportWidth.set(1024);
    expect(service.isMobile()).toBe(false);
    expect(service.isDesktop()).toBe(true);
  });

  it('should detect online status', () => {
    expect(typeof service.isOnline()).toBe('boolean');
  });

  it('should update isOnline on online/offline events', () => {
    window.dispatchEvent(new Event('offline'));
    expect(service.isOnline()).toBe(false);

    window.dispatchEvent(new Event('online'));
    expect(service.isOnline()).toBe(true);
  });

  it('should update viewportWidth on resize', () => {
    const initialWidth = service.viewportWidth();

    // Simular resize — no podemos cambiar innerWidth directamente,
    // pero verificamos que el listener está registrado
    Object.defineProperty(window, 'innerWidth', { value: 375, writable: true });
    window.dispatchEvent(new Event('resize'));
    expect(service.viewportWidth()).toBe(375);

    // Restaurar
    Object.defineProperty(window, 'innerWidth', { value: initialWidth, writable: true });
    window.dispatchEvent(new Event('resize'));
  });

  it('should detect touch device capability', () => {
    expect(typeof service.isTouchDevice()).toBe('boolean');
  });
});
