import { Injectable, computed, inject, signal } from '@angular/core';
import { PlatformService } from '../../core/services/platform.service';
import { KeyboardShortcutService } from '../../core/services/keyboard-shortcut.service';

export type CaptureMode = 'bottom-sheet' | 'spotlight';

@Injectable({
  providedIn: 'root'
})
export class CaptureUiService {
  private readonly platformService = inject(PlatformService);
  private readonly shortcutService = inject(KeyboardShortcutService);

  // Private mutable state for visibility
  private readonly _isOpen = signal(false);

  // Public readonly state
  public readonly isOpen = this._isOpen.asReadonly();
  
  // Derivamos el modo de captura basándonos en si es dispositivo móvil o no
  public readonly captureMode = computed<CaptureMode>(() => {
    return this.platformService.isMobile() ? 'bottom-sheet' : 'spotlight';
  });

  constructor() {
    this.registerShortcuts();
  }

  public open(): void {
    this._isOpen.set(true);
  }

  public close(): void {
    this._isOpen.set(false);
  }

  public toggle(): void {
    this._isOpen.update((v) => !v);
  }

  private registerShortcuts(): void {
    // Cmd+K en Mac, Ctrl+K en Windows
    this.shortcutService.register({
      combo: 'mod+k',
      handler: (e: KeyboardEvent) => {
        this.toggle();
      }
    });
    
    // Y Escape siempre para cerrar cuando esté abierto (en conjunto con otros modals)
    this.shortcutService.register({
      combo: 'Escape',
      handler: () => {
        if (this.isOpen()) {
          this.close();
        }
      }
    });
  }
}
