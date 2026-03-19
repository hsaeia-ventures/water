export interface SyncOperation {
  id: string; // uuid
  entityType: 'gtd_items' | 'contexts' | 'usage_logs';
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: any;
  timestamp: Date;
}
