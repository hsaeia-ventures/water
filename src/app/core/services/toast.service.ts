import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts = signal<Toast[]>([]);
  public readonly toasts = this._toasts.asReadonly();

  show(message: string, type: ToastType = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: Toast = { id, message, type };
    
    this._toasts.update(t => [...t, toast]);

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: string) {
    this._toasts.update(t => t.filter(toast => toast.id !== id));
  }
}
