import { Component, input, computed } from '@angular/core';
import { IconComponent } from '../icon/icon';

export type ButtonVariant = 'primary' | 'ghost' | 'icon-only';

/**
 * ButtonComponent — Botón reutilizable con variantes semánticas.
 * Micro-animaciones de press (scale) y hover (brillo).
 *
 * Uso:
 *   <app-button variant="primary">Guardar</app-button>
 *   <app-button variant="icon-only" iconName="plus" />
 */
@Component({
  selector: 'app-button',
  standalone: true,
  imports: [IconComponent],
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [class]="buttonClasses()"
      [attr.aria-label]="ariaLabel()"
      [attr.aria-busy]="loading()">
      @if (loading()) {
        <span class="btn-spinner"></span>
      }
      @if (iconName()) {
        <app-icon [name]="iconName()!" [size]="iconSize()" />
      }
      @if (variant() !== 'icon-only') {
        <ng-content />
      }
    </button>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      font-family: var(--font-sans);
      font-weight: 500;
      cursor: pointer;
      border: none;
      transition:
        transform var(--transition-fast) var(--ease-organic),
        background-color var(--transition-fast) var(--ease-smooth),
        box-shadow var(--transition-fast) var(--ease-smooth),
        opacity var(--transition-fast);
    }

    button:active:not(:disabled) {
      transform: scale(0.95);
    }

    button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    /* ── Primary ── */
    .btn-primary {
      padding: 0.625rem 1.25rem;
      border-radius: var(--radius-md);
      background-color: var(--color-accent-teal);
      color: var(--color-surface-base);
      font-size: 0.875rem;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: var(--color-accent-teal-strong);
      box-shadow: var(--shadow-glow-teal);
    }

    /* ── Ghost ── */
    .btn-ghost {
      padding: 0.5rem 1rem;
      border-radius: var(--radius-md);
      background-color: transparent;
      color: var(--color-text-secondary);
      font-size: 0.875rem;
    }

    .btn-ghost:hover:not(:disabled) {
      background-color: var(--color-surface-overlay);
      color: var(--color-text-primary);
    }

    /* ── Icon Only ── */
    .btn-icon-only {
      padding: 0.5rem;
      border-radius: var(--radius-full);
      background-color: transparent;
      color: var(--btn-text-color, var(--color-text-secondary));
    }

    .btn-icon-only:hover:not(:disabled) {
      background-color: var(--btn-hover-bg, var(--color-surface-overlay));
      color: var(--btn-hover-color, var(--color-text-primary));
    }

    /* ── Spinner ── */
    .btn-spinner {
      width: 1rem;
      height: 1rem;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `,
})
export class ButtonComponent {
  /** Variante visual del botón */
  readonly variant = input<ButtonVariant>('primary');

  /** Tipo HTML del botón */
  readonly type = input<'button' | 'submit' | 'reset'>('button');

  /** ¿Está deshabilitado? */
  readonly disabled = input<boolean>(false);

  /** ¿Está en estado de carga? */
  readonly loading = input<boolean>(false);

  /** Nombre del ícono (opcional) */
  readonly iconName = input<string | undefined>(undefined);

  /** Etiqueta ARIA (opcional) */
  readonly ariaLabel = input<string | undefined>(undefined);

  /** Tamaño del ícono (derivado de la variante) */
  readonly iconSize = computed(() => this.variant() === 'icon-only' ? 20 : 16);

  /** Clases CSS derivadas de la variante */
  readonly buttonClasses = computed(() => {
    const map: Record<ButtonVariant, string> = {
      primary: 'btn-primary',
      ghost: 'btn-ghost',
      'icon-only': 'btn-icon-only',
    };
    return map[this.variant()];
  });
}
