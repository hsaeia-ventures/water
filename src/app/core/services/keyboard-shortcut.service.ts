import { Injectable, DestroyRef, inject } from '@angular/core';

export interface KeyboardShortcut {
  /** Combo legible, e.g. 'ctrl+k', 'meta+k', 'escape' */
  combo: string;
  /** Callback al activar el atajo */
  handler: (event: KeyboardEvent) => void;
  /** Prevenir default del navegador (default: true) */
  preventDefault?: boolean;
}

/**
 * KeyboardShortcutService — Registro centralizado de atajos de teclado.
 * Evita conflictos y permite registrar/desregistrar atajos de forma limpia.
 */
@Injectable({ providedIn: 'root' })
export class KeyboardShortcutService {
  private readonly destroyRef = inject(DestroyRef);
  private readonly shortcuts = new Map<string, KeyboardShortcut>();
  private listenerAttached = false;

  /**
   * Registra un atajo de teclado.
   * @returns Función para desregistrar el atajo.
   */
  register(shortcut: KeyboardShortcut): () => void {
    const normalizedCombo = this.normalizeCombo(shortcut.combo);
    this.shortcuts.set(normalizedCombo, {
      ...shortcut,
      preventDefault: shortcut.preventDefault ?? true,
    });

    this.ensureListener();

    return () => this.unregister(normalizedCombo);
  }

  /** Desregistra un atajo de teclado */
  unregister(combo: string): void {
    const normalized = this.normalizeCombo(combo);
    this.shortcuts.delete(normalized);
  }

  /** ¿Está registrado un combo? */
  has(combo: string): boolean {
    return this.shortcuts.has(this.normalizeCombo(combo));
  }

  private ensureListener(): void {
    if (this.listenerAttached || typeof document === 'undefined') return;

    const handler = (event: KeyboardEvent) => this.handleKeydown(event);
    document.addEventListener('keydown', handler);
    this.listenerAttached = true;

    this.destroyRef.onDestroy(() => {
      document.removeEventListener('keydown', handler);
      this.listenerAttached = false;
    });
  }

  private handleKeydown(event: KeyboardEvent): void {
    const pressedCombo = this.eventToCombo(event);

    const shortcut = this.shortcuts.get(pressedCombo);
    if (shortcut) {
      if (shortcut.preventDefault) {
        event.preventDefault();
      }
      shortcut.handler(event);
    }
  }

  /** Convierte un KeyboardEvent en un combo normalizado */
  private eventToCombo(event: KeyboardEvent): string {
    const parts: string[] = [];
    if (event.ctrlKey || event.metaKey) parts.push('mod');
    if (event.altKey) parts.push('alt');
    if (event.shiftKey) parts.push('shift');
    parts.push(event.key.toLowerCase());
    return parts.join('+');
  }

  /** Normaliza un combo string: 'Ctrl+K' → 'mod+k', 'Meta+K' → 'mod+k' */
  private normalizeCombo(combo: string): string {
    return combo
      .toLowerCase()
      .replace(/ctrl|meta|cmd/g, 'mod')
      .split('+')
      .map((part) => part.trim())
      .sort((a, b) => {
        const order = ['mod', 'alt', 'shift'];
        const ai = order.indexOf(a);
        const bi = order.indexOf(b);
        if (ai !== -1 && bi !== -1) return ai - bi;
        if (ai !== -1) return -1;
        if (bi !== -1) return 1;
        return 0;
      })
      .join('+');
  }
}
