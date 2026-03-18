import { Component, input, output } from '@angular/core';

/**
 * BackdropComponent — Overlay con blur reutilizable para modales y sheets.
 *
 * Uso: <app-backdrop [visible]="isOpen()" (backdropClick)="close()" />
 */
@Component({
  selector: 'app-backdrop',
  standalone: true,
  template: `
    @if (visible()) {
      <div
        class="backdrop"
        (click)="backdropClick.emit()"
        role="presentation">
      </div>
    }
  `,
  styles: `
    .backdrop {
      position: fixed;
      inset: 0;
      z-index: 40;
      background-color: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      animation: backdrop-in var(--transition-normal) var(--ease-organic);
    }

    @keyframes backdrop-in {
      from {
        opacity: 0;
        backdrop-filter: blur(0);
      }
      to {
        opacity: 1;
        backdrop-filter: blur(8px);
      }
    }
  `,
})
export class BackdropComponent {
  /** ¿Está visible el backdrop? */
  readonly visible = input.required<boolean>();

  /** Evento emitido al hacer click en el backdrop */
  readonly backdropClick = output<void>();
}
