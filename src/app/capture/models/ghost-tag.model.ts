export type GhostTagType = 'context' | 'date' | 'person';

export interface GhostTag {
  type: GhostTagType;
  /** El valor normalizado (ej: 'hoy', 'casa', 'maría') */
  value: string;
  /** El fragmento original que gatilló el tag en el texto */
  raw: string;
}
