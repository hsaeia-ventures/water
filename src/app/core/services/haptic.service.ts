import { Injectable } from '@angular/core';

/**
 * HapticService — Wrapper de la Vibration API del navegador.
 * Proporciona feedback táctil para acciones del usuario.
 * No-op silencioso si la API no está disponible.
 */
@Injectable({ providedIn: 'root' })
export class HapticService {

  /** ¿Está disponible la Vibration API? */
  readonly isAvailable = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  /** Vibración corta — tap/click (10ms) */
  tap(): void {
    this.vibrate(10);
  }

  /** Vibración de éxito — doble pulso suave */
  success(): void {
    this.vibrate([10, 50, 10]);
  }

  /** Vibración de error — pulso largo */
  error(): void {
    this.vibrate([50, 30, 50]);
  }

  /** Vibración personalizada */
  vibrate(pattern: number | number[]): void {
    if (this.isAvailable) {
      navigator.vibrate(pattern);
    }
  }
}
