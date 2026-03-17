import { Pipe, PipeTransform } from '@angular/core';

/**
 * TruncatePipe — Corta texto a N caracteres y agrega "...".
 *
 * Uso: {{ longText | truncate:50 }}
 */
@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, maxLength: number = 100, suffix: string = '...'): string {
    if (!value) return '';
    if (value.length <= maxLength) return value;
    return value.substring(0, maxLength).trimEnd() + suffix;
  }
}
