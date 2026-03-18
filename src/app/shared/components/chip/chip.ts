import { Component, input, computed } from '@angular/core';

export type ChipColor = 'teal' | 'amber' | 'violet' | 'default';

/**
 * ChipComponent — Etiqueta/chip reutilizable para ghost tags, categorías, etc.
 *
 * Uso: <app-chip label="@casa" color="teal" />
 */
@Component({
  selector: 'app-chip',
  standalone: true,
  template: `
    <span [class]="chipClasses()">
      {{ label() }}
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    span {
      display: inline-flex;
      align-items: center;
      padding: 0.2rem 0.6rem;
      border-radius: var(--radius-full);
      font-size: 0.75rem;
      font-weight: 500;
      letter-spacing: 0.01em;
      line-height: 1.4;
      transition: opacity var(--transition-fast) var(--ease-smooth);
    }

    .chip-teal {
      background-color: oklch(0.795 0.15 175 / 0.15);
      color: var(--color-accent-teal);
      border: 1px solid oklch(0.795 0.15 175 / 0.25);
    }

    .chip-amber {
      background-color: oklch(0.828 0.16 84 / 0.15);
      color: var(--color-accent-amber);
      border: 1px solid oklch(0.828 0.16 84 / 0.25);
    }

    .chip-violet {
      background-color: oklch(0.714 0.2 293 / 0.15);
      color: var(--color-accent-violet);
      border: 1px solid oklch(0.714 0.2 293 / 0.25);
    }

    .chip-default {
      background-color: var(--color-surface-overlay);
      color: var(--color-text-secondary);
      border: 1px solid var(--color-border-muted);
    }
  `,
})
export class ChipComponent {
  /** Texto de la etiqueta */
  readonly label = input.required<string>();

  /** Color semántico */
  readonly color = input<ChipColor>('default');

  /** Clase CSS derivada del color */
  readonly chipClasses = computed(() => `chip-${this.color()}`);
}
