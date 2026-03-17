import { Component, input } from '@angular/core';
import { IconComponent } from '../icon/icon';

/**
 * EmptyStateComponent — Estado vacío genérico con icono, título y subtítulo.
 * Usa content projection para máxima flexibilidad.
 *
 * Uso:
 * <app-empty-state iconName="inbox" title="Tu bandeja está vacía">
 *   <p>Captura una idea con Cmd+K</p>
 * </app-empty-state>
 */
@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [IconComponent],
  template: `
    <div class="empty-state">
      @if (iconName()) {
        <div class="empty-state__icon">
          <app-icon [name]="iconName()!" [size]="48" />
        </div>
      }
      <h3 class="empty-state__title">{{ title() }}</h3>
      @if (subtitle()) {
        <p class="empty-state__subtitle">{{ subtitle() }}</p>
      }
      <div class="empty-state__content">
        <ng-content />
      </div>
    </div>
  `,
  styles: `
    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 3rem 1.5rem;
      animation: fade-in var(--transition-slow) var(--ease-organic);
    }

    .empty-state__icon {
      color: var(--color-text-muted);
      margin-bottom: 1.25rem;
      opacity: 0.6;
    }

    .empty-state__title {
      font-family: var(--font-display);
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--color-text-primary);
      margin: 0 0 0.5rem;
    }

    .empty-state__subtitle {
      font-size: 0.875rem;
      color: var(--color-text-secondary);
      margin: 0 0 1rem;
      max-width: 28rem;
      line-height: 1.5;
    }

    .empty-state__content {
      color: var(--color-text-muted);
      font-size: 0.8125rem;
    }
  `,
})
export class EmptyStateComponent {
  /** Nombre del ícono Heroicon */
  readonly iconName = input<string | undefined>(undefined);

  /** Título principal */
  readonly title = input.required<string>();

  /** Subtítulo descriptivo (opcional) */
  readonly subtitle = input<string | undefined>(undefined);
}
