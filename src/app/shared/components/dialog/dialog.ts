import { Component, inject, signal, computed, effect, ElementRef, ViewChild } from '@angular/core';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'app-dialog',
  standalone: true,
  imports: [],
  template: `
    @if (dialog.isOpen()) {
      <div
        class="dialog-overlay"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="dialog.config()?.title"
        (click)="onOverlayClick($event)"
        (keydown.escape)="dialog.cancel()"
      >
        <div class="dialog-panel">

          <!-- Icon -->
          <div class="dialog-icon-wrap">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="dialog-icon">
              <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" />
            </svg>
          </div>

          <!-- Title -->
          <h2 class="dialog-title">{{ dialog.config()?.title }}</h2>

          @if (dialog.config()?.message) {
            <p class="dialog-message">{{ dialog.config()?.message }}</p>
          }

          <!-- Input -->
          <div class="dialog-input-wrap">
            <input
              #inputEl
              class="dialog-input"
              [type]="dialog.config()?.inputType ?? 'text'"
              [placeholder]="dialog.config()?.placeholder ?? ''"
              [value]="dialog.value()"
              (input)="dialog.value.set($any($event.target).value)"
              (keydown.enter)="onEnter()"
              (keydown.escape)="dialog.cancel()"
              autocomplete="off"
              spellcheck="false"
            />
          </div>

          <!-- Actions -->
          <div class="dialog-actions">
            <button type="button" class="dialog-btn dialog-btn--cancel" (click)="dialog.cancel()">
              {{ dialog.config()?.cancelLabel ?? 'Cancelar' }}
            </button>
            <button type="button" class="dialog-btn dialog-btn--confirm" (click)="onConfirm()">
              {{ dialog.config()?.confirmLabel ?? 'Aceptar' }}
            </button>
          </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .dialog-overlay {
      position: fixed;
      inset: 0;
      z-index: 200;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(6px);
      padding: 1rem;
      animation: overlayIn 0.15s ease-out forwards;
    }
    @keyframes overlayIn {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    .dialog-panel {
      background: #18181b;
      border: 1px solid rgba(63, 63, 70, 0.9);
      border-radius: 1.5rem;
      padding: 2rem 1.75rem 1.75rem;
      max-width: 26rem;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255,255,255,0.03);
      animation: panelIn 0.22s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes panelIn {
      from { opacity: 0; transform: scale(0.88) translateY(12px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
    .dialog-icon-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      background: rgba(99, 102, 241, 0.12);
      border: 1px solid rgba(99, 102, 241, 0.25);
      margin: 0 auto 1.25rem;
    }
    .dialog-icon {
      width: 1.5rem;
      height: 1.5rem;
      color: #818cf8;
    }
    .dialog-title {
      font-size: 1.0625rem;
      font-weight: 600;
      color: #f4f4f5;
      margin-bottom: 0.375rem;
      line-height: 1.4;
    }
    .dialog-message {
      font-size: 0.875rem;
      color: #71717a;
      margin-bottom: 1.25rem;
      line-height: 1.5;
    }
    .dialog-input-wrap {
      margin-bottom: 1.5rem;
    }
    .dialog-input {
      width: 100%;
      background: rgba(39, 39, 42, 0.8);
      border: 1px solid rgba(63, 63, 70, 0.8);
      border-radius: 0.75rem;
      padding: 0.65rem 0.875rem;
      font-size: 0.9375rem;
      font-family: inherit;
      color: #e4e4e7;
      outline: none;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
      text-align: left;
    }
    .dialog-input:focus {
      border-color: rgba(99, 102, 241, 0.6);
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
    /* Date/time inputs: force consistent styling */
    .dialog-input[type="date"],
    .dialog-input[type="time"] {
      color-scheme: dark;
    }
    .dialog-actions {
      display: flex;
      gap: 0.75rem;
    }
    .dialog-btn {
      flex: 1;
      padding: 0.65rem 1rem;
      border-radius: 0.75rem;
      border: none;
      font-size: 0.875rem;
      font-weight: 500;
      font-family: inherit;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .dialog-btn--cancel {
      background: rgba(63, 63, 70, 0.5);
      color: #a1a1aa;
    }
    .dialog-btn--cancel:hover {
      background: rgba(63, 63, 70, 0.85);
      color: #e4e4e7;
    }
    .dialog-btn--confirm {
      background: rgba(99, 102, 241, 0.18);
      color: #a5b4fc;
      border: 1px solid rgba(99, 102, 241, 0.35);
    }
    .dialog-btn--confirm:hover {
      background: rgba(99, 102, 241, 0.3);
      color: #c7d2fe;
    }
  `]
})
export class DialogComponent {
  readonly dialog = inject(DialogService);

  @ViewChild('inputEl') inputEl?: ElementRef<HTMLInputElement>;

  constructor() {
    // Auto-focus the input whenever the dialog opens
    effect(() => {
      if (this.dialog.isOpen()) {
        // Defer to next tick so the element is rendered
        setTimeout(() => this.inputEl?.nativeElement?.focus(), 50);
      }
    });
  }

  onConfirm() {
    const value = this.dialog.value().trim();
    if (value) {
      this.dialog.confirm(value);
    }
  }

  onEnter() {
    this.onConfirm();
  }

  onOverlayClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('dialog-overlay')) {
      this.dialog.cancel();
    }
  }
}
