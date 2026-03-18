import { Directive, ElementRef, inject, output, DestroyRef, OnInit } from '@angular/core';

/**
 * ClickOutsideDirective — Emite evento al hacer click fuera del elemento host.
 * Útil para cerrar modales, dropdowns, sheets.
 *
 * Uso: <div appClickOutside (clickOutside)="close()">...</div>
 */
@Directive({
  selector: '[appClickOutside]',
  standalone: true,
})
export class ClickOutsideDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly destroyRef = inject(DestroyRef);

  /** Evento emitido al hacer click fuera del host */
  readonly clickOutside = output<void>();

  ngOnInit(): void {
    const handler = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target && !this.el.nativeElement.contains(target)) {
        this.clickOutside.emit();
      }
    };

    // Pequeño delay para evitar que el click que abrió el componente lo cierre inmediatamente
    setTimeout(() => {
      document.addEventListener('click', handler, { capture: true });
    }, 0);

    this.destroyRef.onDestroy(() => {
      document.removeEventListener('click', handler, { capture: true });
    });
  }
}
