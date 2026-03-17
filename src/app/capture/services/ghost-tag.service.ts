import { Injectable } from '@angular/core';
import { GhostTag } from '../models/ghost-tag.model';

@Injectable({
  providedIn: 'root'
})
export class GhostTagService {
  /**
   * Procesa el texto plano ingresado por el usuario y retorna
   * una lista semántica de GhostTags detectados usando Heurísticas Locales/Regex.
   */
  public parseText(input: string): GhostTag[] {
    if (!input || !input.trim()) return [];

    const tags: GhostTag[] = [];
    const lowerInput = input.toLowerCase();

    this.extractContexts(input, tags);
    this.extractDates(lowerInput, input, tags);
    this.extractPersons(input, tags);

    // Filter duplicates by value to avoid UX clutter
    return this.removeDuplicates(tags);
  }

  /**
   * Extrae Tags de Contexto (ej. @correo, @casa, @oficina)
   */
  private extractContexts(input: string, results: GhostTag[]): void {
    // Alfanuméricos tras un arroba
    const regex = /@([\wáéíóúüñÁÉÍÓÚÜÑ]+)/g;
    let match;
    while ((match = regex.exec(input)) !== null) {
      results.push({
        type: 'context',
        raw: match[0],
        value: match[1].toLowerCase() // '@Casa' -> value: 'casa'
      });
    }
  }

  /**
   * Extrae Tags de Tiempo rudimentarios/naturales.
   * Usamos diccionario para interceptar "hoy", "mañana", "el lunes", etc.
   */
  private extractDates(lowerInput: string, originalInput: string, results: GhostTag[]): void {
    const timeKeywords = [
      'hoy', 'mañana', 'pasado mañana', 
      'lunes', 'martes', 'miércoles', 'miercoles', 'jueves', 'viernes', 'sábado', 'sabado', 'domingo',
      'esta tarde', 'esta noche', 'próxima semana', 'proxima semana'
    ];

    timeKeywords.forEach(keyword => {
      // Regex que busca la palabra suelta rodeada de límites (espacios/puntuación)
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      let match;
      while ((match = regex.exec(lowerInput)) !== null) {
        // Encontrar en el input original usando el index
        const rawMatch = originalInput.substring(match.index, match.index + keyword.length);
        results.push({
          type: 'date',
          raw: rawMatch,
          value: keyword
        });
      }
    });
  }

  /**
   * Extrae Nombres Propios (Personas).
   * Heurística frágil de NLP base: Palabra en Mayúscula (no a principio de oración si es posible) o tras palabras clave como "con", "a".
   * Por simplicidad en esta iteración sin NLP: detectará nombres precedidos por preposiciones comunes ("con Carlos", "llamar a Sara").
   */
  private extractPersons(input: string, results: GhostTag[]): void {
    // Busca "con/a/para [Nombre en Mayúscula]"
    // Usamos `(?![a-zA-ZáéíóúñÁÉÍÓÚÑ])` en vez de `\b` al final porque JS `\b` falla con tildes (ej. José)
    const verbRegex = /(?:^|\b)(?:con|a|para|llamar a|avisar a|ver a)\s+([A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)(?![a-zA-ZáéíóúñÁÉÍÓÚÑ])/g;
    let match;
    while ((match = verbRegex.exec(input)) !== null) {
      results.push({
        type: 'person',
        raw: match[0],
        value: match[1] // Nombre capturado, ej: "Carlos"
      });
    }
  }

  private removeDuplicates(tags: GhostTag[]): GhostTag[] {
    const seen = new Set<string>();
    return tags.filter(tag => {
      // Unique key based on type + value (ej. "person:Carlos")
      const key = `${tag.type}:${tag.value}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
}
