import { Directive, ElementRef, inject, DestroyRef, OnInit } from '@angular/core';

/**
 * TrapFocusDirective — Atrapa el foco dentro del elemento host.
 * Esencial para accesibilidad en modales y diálogos.
 *
 * Uso: <div appTrapFocus>...contenido del modal...</div>
 */
@Directive({
  selector: '[appTrapFocus]',
  standalone: true,
})
export class TrapFocusDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  private readonly FOCUSABLE_SELECTOR = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'textarea:not([disabled])',
    'select:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ].join(', ');

  ngOnInit(): void {
    const handler = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return;

      const focusableElements = this.getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (event.shiftKey) {
        // Shift+Tab: si estamos en el primer elemento, ir al último
        if (document.activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab: si estamos en el último elemento, ir al primero
        if (document.activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    this.el.nativeElement.addEventListener('keydown', handler);

    this.destroyRef.onDestroy(() => {
      this.el.nativeElement.removeEventListener('keydown', handler);
    });
  }

  private getFocusableElements(): HTMLElement[] {
    return Array.from(
      this.el.nativeElement.querySelectorAll(this.FOCUSABLE_SELECTOR) as NodeListOf<HTMLElement>
    );
  }
}
