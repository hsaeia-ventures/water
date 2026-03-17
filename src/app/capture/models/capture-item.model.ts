import { GhostTag } from './ghost-tag.model';

export interface CaptureItem {
  /** Identificador único local generado vía crypto.randomUUID() */
  id: string;
  
  /** El contenido raw que escribió o dictó el usuario */
  text: string;
  
  /** Las etiquetas semánticas detectadas localmente en el momento de la captura */
  ghostTags: GhostTag[];
  
  /** Timestamp de la creación */
  createdAt: Date;
  
  /** 
   * Flag para sincronización futura con Supabase u otro backend.
   * false = Creado offline/localmente, pendiente de subir
   * true = Sincronizado
   */
  synced: boolean;
}
