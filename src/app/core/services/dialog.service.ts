import { Injectable, signal } from '@angular/core';

export type DialogInputType = 'text' | 'date' | 'time';

export interface DialogConfig {
  title: string;
  message?: string;
  placeholder?: string;
  defaultValue?: string;
  inputType?: DialogInputType;
  confirmLabel?: string;
  cancelLabel?: string;
}

interface ActiveDialog {
  config: DialogConfig;
  resolve: (value: string | null) => void;
}

@Injectable({ providedIn: 'root' })
export class DialogService {
  readonly isOpen  = signal(false);
  readonly config  = signal<DialogConfig | null>(null);
  readonly value   = signal('');

  private _resolve: ((v: string | null) => void) | null = null;

  /** Abre un diálogo con un campo de entrada y retorna el valor introducido, o null si se cancela. */
  prompt(config: DialogConfig): Promise<string | null> {
    return new Promise(resolve => {
      this._resolve = resolve;
      this.config.set(config);
      this.value.set(config.defaultValue ?? '');
      this.isOpen.set(true);
    });
  }

  confirm(value: string) {
    this._resolve?.(value);
    this._close();
  }

  cancel() {
    this._resolve?.(null);
    this._close();
  }

  private _close() {
    this.isOpen.set(false);
    this.config.set(null);
    this.value.set('');
    this._resolve = null;
  }
}
