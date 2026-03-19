import { GhostTag } from '../../capture/models/ghost-tag.model';

export type GtdObjType = 'capture' | 'action' | 'project' | 'reference';
export type GtdStatus = 'inbox' | 'next_action' | 'waiting' | 'someday' | 'calendar' | 'done' | 'trashed';

export interface GtdItem {
  id: string; // uuid
  user_id?: string;
  type: GtdObjType;
  status: GtdStatus;
  title: string;
  notes?: string;
  parent_id?: string;
  context_id?: string;
  delegated_to?: string;
  energy_level?: 1 | 2 | 3;
  time_estimate_mins?: number;
  due_date?: Date;
  scheduled_date?: Date;
  ghost_tags?: GhostTag[];
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}
