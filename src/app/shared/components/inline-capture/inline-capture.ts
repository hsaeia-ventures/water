import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, signal } from '@angular/core';
import { AutoFocusDirective } from '../../directives/auto-focus.directive';

@Component({
  selector: 'app-inline-capture',
  standalone: true,
  imports: [AutoFocusDirective],
  template: `
    <form (submit)="onSubmit($event)" class="inline-capture">
      <input
        appAutoFocus
        #inputRef
        type="text"
        [placeholder]="placeholder"
        [value]="text()"
        (input)="text.set(inputRef.value)"
        (keydown.escape)="onCancel()"
        class="inline-capture__input"
        aria-label="Nueva entrada"
      />
      <div class="inline-capture__actions">
        <button
          type="submit"
          class="inline-capture__btn inline-capture__btn--save"
          [disabled]="!text().trim()"
          aria-label="Guardar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
          </svg>
        </button>
        <button
          type="button"
          (click)="onCancel()"
          class="inline-capture__btn inline-capture__btn--cancel"
          aria-label="Cancelar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
            <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
          </svg>
        </button>
      </div>
    </form>
  `,
  styles: [`
    .inline-capture {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 0.75rem;
      background: rgba(39, 39, 42, 0.8);
      border: 1px dashed rgba(82, 82, 91, 0.6);
      border-radius: 0.75rem;
      transition: border-color 0.2s ease, background 0.2s ease;
    }
    .inline-capture:focus-within {
      border-color: rgba(20, 184, 166, 0.5);
      background: rgba(39, 39, 42, 1);
    }
    .inline-capture__input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: #e4e4e7;
      font-size: 0.875rem;
      font-family: inherit;
    }
    .inline-capture__input::placeholder {
      color: #52525b;
    }
    .inline-capture__actions {
      display: flex;
      gap: 0.25rem;
      flex-shrink: 0;
    }
    .inline-capture__btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 0.5rem;
      border: none;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .inline-capture__btn--save {
      background: rgba(20, 184, 166, 0.15);
      color: #14b8a6;
    }
    .inline-capture__btn--save:hover:not(:disabled) {
      background: rgba(20, 184, 166, 0.3);
    }
    .inline-capture__btn--save:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
    .inline-capture__btn--cancel {
      background: rgba(113, 113, 122, 0.15);
      color: #71717a;
    }
    .inline-capture__btn--cancel:hover {
      background: rgba(113, 113, 122, 0.3);
      color: #a1a1aa;
    }
  `]
})
export class InlineCaptureComponent {
  @Input() placeholder = 'Nueva acción...';
  @Output() save = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();

  text = signal('');

  onSubmit(e: Event) {
    e.preventDefault();
    const trimmed = this.text().trim();
    if (!trimmed) return;
    this.save.emit(trimmed);
    this.text.set('');
  }

  onCancel() {
    this.text.set('');
    this.cancel.emit();
  }
}
