import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';

/**
 * AutoFocusDirective — Enfoca automáticamente el elemento host al renderizarse.
 *
 * Uso:
 *   <input appAutoFocus />
 *   <textarea appAutoFocus [autoFocusDelay]="200" />
 */
@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);

  /** Retraso en ms antes de enfocar (útil para esperar animaciones) */
  readonly autoFocusDelay = input<number>(0);

  ngOnInit(): void {
    const delay = this.autoFocusDelay();
    if (delay > 0) {
      setTimeout(() => this.focus(), delay);
    } else {
      // Usar requestAnimationFrame para asegurar que el DOM está listo
      requestAnimationFrame(() => this.focus());
    }
  }

  private focus(): void {
    this.el.nativeElement.focus();
  }
}
