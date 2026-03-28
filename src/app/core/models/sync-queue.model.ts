import { GtdItem } from './gtd-item.model';

// ─── Payloads para gtd_items ──────────────────────────────────────────────────

/** INSERT: todos los campos del item son necesarios (user_id se inyecta en SyncService) */
export type GtdItemInsertPayload = Omit<GtdItem, 'user_id'> & { id: string };

/** UPDATE: solo el id es obligatorio, el resto es parcial */
export type GtdItemUpdatePayload = Partial<Omit<GtdItem, 'user_id'>> & { id: string };

/** DELETE: solo se necesita el id */
export type GtdItemDeletePayload = { id: string };

// ─── Payloads para usage_logs ─────────────────────────────────────────────────

export interface UsageLogPayload {
  event_type: string;
  metadata?: Record<string, unknown>;
  id?: string;
}

// ─── Union discriminada por entityType × action ───────────────────────────────

/**
 * Union type discriminada que vincula cada entityType con sus payloads válidos.
 * Previene que un payload arbitrario sea enviado a Supabase en tiempo de compilación.
 */
export type SyncOperation =
  // gtd_items — INSERT
  | { id: string; entityType: 'gtd_items'; action: 'INSERT'; payload: GtdItemInsertPayload; timestamp: Date }
  // gtd_items — UPDATE
  | { id: string; entityType: 'gtd_items'; action: 'UPDATE'; payload: GtdItemUpdatePayload; timestamp: Date }
  // gtd_items — DELETE
  | { id: string; entityType: 'gtd_items'; action: 'DELETE'; payload: GtdItemDeletePayload; timestamp: Date }
  // usage_logs — INSERT (solo se insertan, nunca se actualizan ni borran)
  | { id: string; entityType: 'usage_logs'; action: 'INSERT'; payload: UsageLogPayload; timestamp: Date }
  // contexts — soporte genérico (payload tipado con id obligatorio)
  | { id: string; entityType: 'contexts'; action: 'INSERT'; payload: Record<string, unknown> & { id: string }; timestamp: Date }
  | { id: string; entityType: 'contexts'; action: 'UPDATE'; payload: Record<string, unknown> & { id: string }; timestamp: Date }
  | { id: string; entityType: 'contexts'; action: 'DELETE'; payload: { id: string }; timestamp: Date };
