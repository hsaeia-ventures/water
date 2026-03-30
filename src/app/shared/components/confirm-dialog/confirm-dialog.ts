import { Component, EventEmitter, Input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  template: `
    @if (isOpen()) {
      <div class="confirm-overlay" (click)="onOverlayClick($event)" role="dialog" aria-modal="true" [attr.aria-label]="title">
        <div class="confirm-panel">
          <div class="confirm-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6 text-red-400">
              <path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
            </svg>
          </div>
          <h2 class="confirm-title">{{ title }}</h2>
          <p class="confirm-message">{{ message }}</p>
          <div class="confirm-actions">
            <button type="button" (click)="onCancel()" class="confirm-btn confirm-btn--cancel">
              Cancelar
            </button>
            <button type="button" (click)="onConfirm()" class="confirm-btn confirm-btn--confirm">
              {{ confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .confirm-overlay {
      position: fixed;
      inset: 0;
      z-index: 100;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.7);
      backdrop-filter: blur(4px);
      padding: 1rem;
      animation: overlayIn 0.15s ease-out forwards;
    }
    @keyframes overlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .confirm-panel {
      background: #18181b;
      border: 1px solid rgba(63, 63, 70, 0.8);
      border-radius: 1.25rem;
      padding: 1.75rem;
      max-width: 24rem;
      width: 100%;
      text-align: center;
      animation: panelIn 0.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes panelIn {
      from { opacity: 0; transform: scale(0.9) translateY(8px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .confirm-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: rgba(239, 68, 68, 0.1);
      margin: 0 auto 1rem;
    }
    .confirm-title {
      font-size: 1rem;
      font-weight: 600;
      color: #f4f4f5;
      margin-bottom: 0.5rem;
    }
    .confirm-message {
      font-size: 0.875rem;
      color: #71717a;
      margin-bottom: 1.5rem;
      line-height: 1.5;
    }
    .confirm-actions {
      display: flex;
      gap: 0.75rem;
    }
    .confirm-btn {
      flex: 1;
      padding: 0.625rem 1rem;
      border-radius: 0.75rem;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .confirm-btn--cancel {
      background: rgba(63, 63, 70, 0.5);
      color: #a1a1aa;
    }
    .confirm-btn--cancel:hover {
      background: rgba(63, 63, 70, 0.8);
      color: #e4e4e7;
    }
    .confirm-btn--confirm {
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
    }
    .confirm-btn--confirm:hover {
      background: rgba(239, 68, 68, 0.25);
      color: #fca5a5;
    }
  `]
})
export class ConfirmDialogComponent {
  @Input() title = '¿Eliminar elemento?';
  @Input() message = 'Esta acción no se puede deshacer.';
  @Input() confirmLabel = 'Eliminar';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  isOpen = signal(false);

  open()  { this.isOpen.set(true); }
  close() { this.isOpen.set(false); }

  onConfirm() {
    this.confirmed.emit();
    this.close();
  }

  onCancel() {
    this.cancelled.emit();
    this.close();
  }

  onOverlayClick(e: MouseEvent) {
    if ((e.target as HTMLElement).classList.contains('confirm-overlay')) {
      this.onCancel();
    }
  }
}
