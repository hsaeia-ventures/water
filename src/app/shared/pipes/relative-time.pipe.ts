import { Pipe, PipeTransform } from '@angular/core';

/**
 * RelativeTimePipe — Convierte una fecha en texto relativo humanizado en español.
 * Usa Intl.RelativeTimeFormat cuando está disponible.
 *
 * Uso: {{ captureDate | relativeTime }}
 *   → "hace 2 min", "hace 1 hora", "ayer", "hace 3 días"
 */
@Pipe({
  name: 'relativeTime',
  standalone: true,
  pure: true,
})
export class RelativeTimePipe implements PipeTransform {
  private readonly formatter = typeof Intl !== 'undefined'
    ? new Intl.RelativeTimeFormat('es', { numeric: 'auto', style: 'long' })
    : null;

  transform(value: Date | string | number | null | undefined): string {
    if (!value) return '';

    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '';

    const now = Date.now();
    const diffMs = date.getTime() - now;
    const diffSeconds = Math.round(diffMs / 1000);
    const absDiffSeconds = Math.abs(diffSeconds);

    if (!this.formatter) {
      return this.fallbackFormat(diffSeconds);
    }

    // Elegir la unidad de tiempo más apropiada
    if (absDiffSeconds < 60) {
      return this.formatter.format(diffSeconds, 'second');
    }

    const diffMinutes = Math.round(diffMs / (1000 * 60));
    if (Math.abs(diffMinutes) < 60) {
      return this.formatter.format(diffMinutes, 'minute');
    }

    const diffHours = Math.round(diffMs / (1000 * 60 * 60));
    if (Math.abs(diffHours) < 24) {
      return this.formatter.format(diffHours, 'hour');
    }

    const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
    if (Math.abs(diffDays) < 30) {
      return this.formatter.format(diffDays, 'day');
    }

    const diffMonths = Math.round(diffMs / (1000 * 60 * 60 * 24 * 30));
    if (Math.abs(diffMonths) < 12) {
      return this.formatter.format(diffMonths, 'month');
    }

    const diffYears = Math.round(diffMs / (1000 * 60 * 60 * 24 * 365));
    return this.formatter.format(diffYears, 'year');
  }

  private fallbackFormat(diffSeconds: number): string {
    const abs = Math.abs(diffSeconds);
    const prefix = diffSeconds < 0 ? 'hace ' : 'en ';

    if (abs < 60) return `${prefix}${abs} seg`;
    if (abs < 3600) return `${prefix}${Math.round(abs / 60)} min`;
    if (abs < 86400) return `${prefix}${Math.round(abs / 3600)} h`;
    return `${prefix}${Math.round(abs / 86400)} d`;
  }
}
