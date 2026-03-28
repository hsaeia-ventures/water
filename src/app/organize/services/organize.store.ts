import { Injectable, computed, inject, signal } from '@angular/core';
import { GtdItem, GtdObjType, GtdStatus } from '../../core/models/gtd-item.model';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { SyncService } from '../../core/services/sync.service';
import { generateId } from '../../core/utils/uuid.util';

export interface ProjectWithActions extends GtdItem {
  actions: GtdItem[];
  isHealthy: boolean;
}

export interface GroupedActions {
  context: string;
  actions: GtdItem[];
}

export interface CalendarDay {
  label: 'past' | 'today' | 'future';
  events: GtdItem[];
}

@Injectable({ providedIn: 'root' })
export class OrganizeStore {
  private db = inject(IndexedDbService);
  private syncService = inject(SyncService);

  private allItems = signal<GtdItem[]>([]);

  // ─── Computed Views ────────────────────────────────────────────────────────

  public readonly nextActions = computed(() =>
    this.allItems().filter(i => i.type === 'action' && i.status === 'next_action')
  );

  public readonly projects = computed(() =>
    this.allItems().filter(i => i.type === 'project' && i.status !== 'trashed')
  );

  public readonly waitingActions = computed(() =>
    this.allItems().filter(i => i.status === 'waiting' && i.type !== 'project')
  );

  public readonly calendarEvents = computed(() =>
    this.allItems()
      .filter(i => i.status === 'calendar' || (i.scheduled_date != null && i.type !== 'project'))
      .sort((a, b) => {
        const da = a.scheduled_date ? new Date(a.scheduled_date).getTime() : 0;
        const db = b.scheduled_date ? new Date(b.scheduled_date).getTime() : 0;
        return da - db;
      })
  );

  public readonly somedayItems = computed(() =>
    this.allItems().filter(i => (i.status === 'someday' || i.type === 'reference') && i.status !== 'trashed')
  );

  /** Acciones agrupadas por contexto (@tag). Las sin contexto van al grupo "Sin contexto". */
  public readonly groupedByContext = computed((): GroupedActions[] => {
    const actions = this.nextActions();
    const groups = new Map<string, GtdItem[]>();

    groups.set('Sin contexto', []);

    for (const action of actions) {
      const contextTags = action.ghost_tags?.filter(t => t.type === 'context') ?? [];
      if (contextTags.length === 0) {
        groups.get('Sin contexto')!.push(action);
      } else {
        for (const tag of contextTags) {
          const key = tag.raw || `@${tag.value}`;
          if (!groups.has(key)) groups.set(key, []);
          groups.get(key)!.push(action);
        }
      }
    }

    // Remove empty 'Sin contexto' group if not needed
    if (groups.get('Sin contexto')!.length === 0 && groups.size > 1) {
      groups.delete('Sin contexto');
    }

    return Array.from(groups.entries())
      .map(([context, actions]) => ({ context, actions }))
      .sort((a, b) => {
        // Keep 'Sin contexto' at the end
        if (a.context === 'Sin contexto') return 1;
        if (b.context === 'Sin contexto') return -1;
        return a.context.localeCompare(b.context);
      });
  });

  /** Proyectos enriquecidos con sus acciones hijas y estado de salud. */
  public readonly projectsWithActionCount = computed((): ProjectWithActions[] => {
    const projects = this.projects();
    const actions = this.nextActions();

    return [...projects]
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(p => {
        const projectActions = actions.filter(a => a.parent_id === p.id);
        return { ...p, actions: projectActions, isHealthy: projectActions.length > 0 };
      });
  });

  /** Eventos de calendario separados en: pasados, hoy y futuros. */
  public readonly upcomingEvents = computed(() => {
    const now = new Date();
    const todayStr = now.toDateString();
    const events = this.calendarEvents();

    return {
      past: events.filter(e => e.scheduled_date && new Date(e.scheduled_date).toDateString() !== todayStr && new Date(e.scheduled_date) < now),
      today: events.filter(e => !e.scheduled_date || new Date(e.scheduled_date).toDateString() === todayStr),
      future: events.filter(e => e.scheduled_date && new Date(e.scheduled_date) > now && new Date(e.scheduled_date).toDateString() !== todayStr),
    };
  });

  /** Count de proyectos sin acciones (para badge en sidebar). */
  public readonly unhealthyProjectCount = computed(() =>
    this.projectsWithActionCount().filter(p => !p.isHealthy).length
  );

  /** Count de ítems en A la Espera que llevan más de 7 días (para badge urgente). */
  public readonly urgentWaitingCount = computed(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return this.waitingActions().filter(i => new Date(i.created_at) < sevenDaysAgo).length;
  });

  // ─── Lifecycle ─────────────────────────────────────────────────────────────

  constructor() {
    this.loadAll();
    window.addEventListener('sync-down-complete', () => this.loadAll());
  }

  public async loadAll() {
    const items = await this.db.getAll<GtdItem>(this.db.STORE_GTD_ITEMS);
    this.allItems.set(items);
  }

  // ─── Mutations ─────────────────────────────────────────────────────────────

  /** Crea una nueva acción con status next_action. */
  public async createAction(params: {
    title: string;
    notes?: string;
    context?: string;
    parentId?: string;
    energyLevel?: 1 | 2 | 3;
    timeEstimateMins?: number;
  }): Promise<GtdItem> {
    const now = new Date();
    const item: GtdItem = {
      id: generateId(),
      type: 'action' as GtdObjType,
      status: 'next_action' as GtdStatus,
      title: params.title.trim(),
      notes: params.notes,
      parent_id: params.parentId,
      energy_level: params.energyLevel,
      time_estimate_mins: params.timeEstimateMins,
      // Build ghost_tags from context if provided
      ghost_tags: params.context
        ? [{ type: 'context', value: params.context.replace('@', ''), raw: params.context }]
        : [],
      created_at: now,
      updated_at: now,
    };

    await this.db.put(this.db.STORE_GTD_ITEMS, item);
    await this.syncService.enqueueOperation({ id: generateId(), entityType: 'gtd_items', action: 'INSERT', payload: item });
    this.allItems.update(items => [item, ...items]);
    return item;
  }

  /** Crea un nuevo proyecto. */
  public async createProject(title: string, notes?: string): Promise<GtdItem> {
    const now = new Date();
    const item: GtdItem = {
      id: generateId(),
      type: 'project' as GtdObjType,
      status: 'next_action' as GtdStatus,
      title: title.trim(),
      notes,
      ghost_tags: [],
      created_at: now,
      updated_at: now,
    };

    await this.db.put(this.db.STORE_GTD_ITEMS, item);
    await this.syncService.enqueueOperation({ id: generateId(), entityType: 'gtd_items', action: 'INSERT', payload: item });
    this.allItems.update(items => [item, ...items]);
    return item;
  }

  /** Crea un ítem en la incubadora (someday/maybe o referencia). */
  public async createSomedayItem(params: {
    title: string;
    notes?: string;
    type?: 'reference' | 'action' | 'project';
  }): Promise<GtdItem> {
    const now = new Date();
    const item: GtdItem = {
      id: generateId(),
      type: (params.type || 'action') as GtdObjType,
      status: 'someday' as GtdStatus,
      title: params.title.trim(),
      notes: params.notes,
      ghost_tags: [],
      created_at: now,
      updated_at: now,
    };

    await this.db.put(this.db.STORE_GTD_ITEMS, item);
    await this.syncService.enqueueOperation({ id: generateId(), entityType: 'gtd_items', action: 'INSERT', payload: item });
    this.allItems.update(items => [item, ...items]);
    return item;
  }

  /** Crea un ítem en el calendario. */
  public async createCalendarEvent(params: {
    title: string;
    scheduledDate: Date;
    notes?: string;
  }): Promise<GtdItem> {
    const now = new Date();
    const item: GtdItem = {
      id: generateId(),
      type: 'action' as GtdObjType,
      status: 'calendar' as GtdStatus,
      title: params.title.trim(),
      notes: params.notes,
      scheduled_date: params.scheduledDate,
      ghost_tags: [],
      created_at: now,
      updated_at: now,
    };

    await this.db.put(this.db.STORE_GTD_ITEMS, item);
    await this.syncService.enqueueOperation({ id: generateId(), entityType: 'gtd_items', action: 'INSERT', payload: item });
    this.allItems.update(items => [item, ...items]);
    return item;
  }

  /** Actualización parcial genérica. */
  public async updateItem(id: string, patch: Partial<GtdItem>): Promise<void> {
    const existing = this.allItems().find(i => i.id === id);
    if (!existing) return;

    const updated: GtdItem = { ...existing, ...patch, updated_at: new Date() };
    await this.db.put(this.db.STORE_GTD_ITEMS, updated);
    await this.syncService.enqueueOperation({ id: generateId(), entityType: 'gtd_items', action: 'UPDATE', payload: updated });
    this.allItems.update(items => items.map(i => i.id === id ? updated : i));
  }

  /** Soft-delete: mueve a status 'trashed'. */
  public async deleteItem(id: string): Promise<void> {
    await this.updateItem(id, { status: 'trashed' });
  }

  /** Activa un ítem de la incubadora → next_action. */
  public async activateFromSomeday(id: string): Promise<void> {
    await this.updateItem(id, { type: 'action', status: 'next_action' });
  }

  /** Mueve un ítem al calendario con una fecha. */
  public async moveToCalendar(id: string, scheduledDate: Date): Promise<void> {
    await this.updateItem(id, { status: 'calendar', scheduled_date: scheduledDate });
  }

  /** Marca como completado / pendiente. */
  public async toggleActionComplete(item: GtdItem): Promise<void> {
    const newStatus: GtdStatus = item.status === 'done' ? 'next_action' : 'done';
    await this.updateItem(item.id, {
      status: newStatus,
      completed_at: newStatus === 'done' ? new Date() : undefined,
    });

    if (newStatus === 'done') {
      await this.syncService.enqueueOperation({
        id: generateId(),
        entityType: 'usage_logs',
        action: 'INSERT',
        payload: { event_type: 'action_completed', metadata: { item_id: item.id } },
      });
    }
  }

  /** Registra un seguimiento en un ítem de A la Espera (actualiza timestamp). */
  public async registerFollowUp(id: string): Promise<void> {
    await this.updateItem(id, { updated_at: new Date() });
  }
}
