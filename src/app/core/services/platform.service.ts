import { Injectable, signal, computed, DestroyRef, inject } from '@angular/core';

/**
 * PlatformService — Detección reactiva de plataforma y estado de conexión.
 * Expone signals para viewport (mobile/desktop), touch, y online/offline.
 */
@Injectable({ providedIn: 'root' })
export class PlatformService {
  private readonly destroyRef = inject(DestroyRef);

  private readonly MOBILE_BREAKPOINT = 768;

  /** Ancho actual del viewport */
  readonly viewportWidth = signal(
    typeof window !== 'undefined' ? window.innerWidth : 1024
  );

  /** ¿Estamos en viewport móvil? (≤768px) */
  readonly isMobile = computed(() => this.viewportWidth() <= this.MOBILE_BREAKPOINT);

  /** ¿Estamos en viewport desktop? (>768px) */
  readonly isDesktop = computed(() => !this.isMobile());

  /** ¿El dispositivo soporta touch? */
  readonly isTouchDevice = signal(
    typeof window !== 'undefined'
      ? 'ontouchstart' in window || navigator.maxTouchPoints > 0
      : false
  );

  /** ¿Hay conexión a internet? */
  readonly isOnline = signal(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  constructor() {
    if (typeof window === 'undefined') return;

    const onResize = () => this.viewportWidth.set(window.innerWidth);
    const onOnline = () => this.isOnline.set(true);
    const onOffline = () => this.isOnline.set(false);

    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);

    this.destroyRef.onDestroy(() => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
    });
  }
}
