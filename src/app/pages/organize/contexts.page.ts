import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore, GroupedActions } from '../../organize/services/organize.store';
import { InlineCaptureComponent } from '../../shared/components/inline-capture/inline-capture';
import { ItemMenuComponent, MenuAction } from '../../shared/components/item-menu/item-menu';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import { DialogService } from '../../core/services/dialog.service';
import { GtdItem } from '../../core/models/gtd-item.model';

@Component({
  selector: 'app-contexts-page',
  standalone: true,
  imports: [CommonModule, InlineCaptureComponent, ItemMenuComponent, ConfirmDialogComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">Próximas Acciones</h1>
        <p class="text-zinc-500">Todo lo que puedes hacer en este preciso instante, filtrado por tu localización o herramienta.</p>
      </header>

      <!-- Context Tabs -->
      <div class="flex gap-2 overflow-x-auto pb-4 scrollbar-hide mb-6 border-b border-zinc-800">
        <button 
          (click)="selectedContext.set('all')"
          class="flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all focus:outline-none"
          [ngClass]="selectedContext() === 'all' ? 'bg-zinc-100 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'"
        >
          Todo
        </button>
        @for (group of allGroups(); track group.context) {
          @if (group.context !== 'Sin contexto') {
            <button 
              (click)="selectedContext.set(group.context)"
              class="flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all focus:outline-none"
              [ngClass]="selectedContext() === group.context ? 'bg-teal-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'"
            >
              {{ group.context }}
              <span class="ml-1 opacity-70 text-xs">{{ group.actions.length }}</span>
            </button>
          }
        }
      </div>

      <!-- Actions List -->
      <div class="flex flex-col gap-8">
        @if (displayedGroups().length === 0) {
          <div class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
             <div class="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4 text-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h3 class="text-zinc-300 font-medium">Bandeja Vacía</h3>
             <p class="text-sm text-zinc-500 mt-1">No hay acciones para este contexto en este momento.</p>
             <div class="mt-6 max-w-sm mx-auto">
               <app-inline-capture 
                 [placeholder]="'Añadir acción en ' + (selectedContext() === 'all' ? 'bandeja' : selectedContext())"
                 (save)="onAddAction($event, selectedContext() === 'all' ? undefined : selectedContext())"
               />
             </div>
          </div>
        } @else {
          @for (group of displayedGroups(); track group.context) {
            <section class="group-section">
              <h2 class="text-xl font-medium text-zinc-300 mb-4 flex items-center gap-2">
                @if (group.context !== 'Sin contexto') {
                   <span class="w-2 h-2 rounded-full bg-teal-500"></span>
                }
                {{ group.context }}
              </h2>
              
              <div class="flex flex-col gap-3">
                @for (action of group.actions; track action.id) {
                  <div class="group relative bg-zinc-900 border border-zinc-800/80 rounded-2xl p-4 md:p-5 flex items-start gap-4 hover:border-zinc-700 transition-all hover:shadow-lg hover:-translate-y-0.5 ease-out duration-300">
                    
                    <!-- Custom Checkbox -->
                    <button 
                      (click)="toggleAction(action)"
                      class="mt-1 flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
                      [ngClass]="action.status === 'done' ? 'bg-teal-500 border-teal-500 text-zinc-900' : 'bg-transparent border-zinc-700 hover:border-zinc-500'"
                      aria-label="Marcar como completado"
                    >
                      @if (action.status === 'done') {
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                      }
                    </button>
        
                    <!-- Content -->
                    <div class="flex-1 min-w-0">
                      <h3 
                        class="text-base sm:text-lg font-medium transition-colors"
                        [ngClass]="action.status === 'done' ? 'text-zinc-600 line-through' : 'text-zinc-200'"
                      >
                        {{ action.title }}
                      </h3>
        
                      @if (action.notes && action.status !== 'done') {
                         <p class="text-sm text-zinc-500 mt-1 line-clamp-2">{{ action.notes }}</p>
                      }
                      
                      <!-- Chips: Energy & Time & Tags -->
                      @if (action.status !== 'done') {
                        <div class="flex flex-wrap items-center gap-2 mt-3">
                          
                          @if (action.energy_level) {
                            <span class="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-amber-500/10 text-amber-500 border border-amber-500/20" title="Nivel de energía requerido">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path d="M11.983 1.807A.75.75 0 0011.022 1a.75.75 0 00-.671.415l-5.5 11.5A.75.75 0 005.5 14h3.879l-1.362 4.193a.75.75 0 001.32.748l5.5-11.5a.75.75 0 00-.655-1.082l-3.882-.0011.383-4.549z" /></svg>
                              {{ getEnergyLabel(action.energy_level) }}
                            </span>
                          }

                          @if (action.time_estimate_mins) {
                            <span class="flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20" title="Tiempo estimado">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clip-rule="evenodd" /></svg>
                              {{ action.time_estimate_mins }}m
                            </span>
                          }

                          <!-- Context tags only if selected 'all' to avoid redundancy -->
                          @if (selectedContext() === 'all' && action.ghost_tags && action.ghost_tags.length > 0) {
                            @for (tag of action.ghost_tags; track tag.raw) {
                              <span class="px-2 py-0.5 rounded text-xs font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                {{ tag.raw || tag.value }}
                              </span>
                            }
                          }
                        </div>
                      }
                    </div>

                    <!-- Context Menu -->
                    <div class="flex-shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <app-item-menu 
                        [actions]="menuOptions"
                        (actionSelected)="onMenuAction($event, action)"
                      />
                    </div>

                  </div>
                }

                <!-- Inline capture at the end of the group -->
                <div class="mt-2 pl-12 pr-4">
                  <app-inline-capture 
                    [placeholder]="'Añadir en ' + group.context + '...'"
                    (save)="onAddAction($event, group.context)"
                  />
                </div>
              </div>
            </section>
          }
        }
      </div>
    </div>

    <!-- Confirm dialog for deletion -->
    <app-confirm-dialog
      #deleteDialog
      title="¿Eliminar acción?"
      message="Se enviará a la papelera permanentemente."
      confirmLabel="Eliminar"
      (confirmed)="confirmDelete()"
    />
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in-up {
      animation: fadeInUp 0.4s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  `]
})
export default class ContextsPage {
  private store = inject(OrganizeStore);
  private dialog = inject(DialogService);
  
  @ViewChild('deleteDialog') deleteDialog!: ConfirmDialogComponent;
  
  public selectedContext = signal<string>('all');
  
  public allGroups = this.store.groupedByContext;

  public displayedGroups = computed(() => {
    const groups = this.allGroups();
    const ctx = this.selectedContext();
    if (ctx === 'all') return groups;
    return groups.filter(g => g.context === ctx);
  });

  public menuOptions: MenuAction[] = [
    { id: 'edit', label: 'Editar título...' },
    { id: 'calendar', label: 'Mover a Calendario' },
    { id: 'someday', label: 'Mover a Incubadora' },
    { id: 'delete', label: 'Eliminar', danger: true }
  ];

  private itemToDelete: GtdItem | null = null;

  async toggleAction(action: GtdItem) {
    await this.store.toggleActionComplete(action);
  }

  getEnergyLabel(level: 1 | 2 | 3): string {
    return level === 1 ? 'Baja' : level === 2 ? 'Media' : 'Alta';
  }

  async onAddAction(title: string, contextName?: string) {
    if (contextName === 'Sin contexto') {
      contextName = undefined;
    }
    await this.store.createAction({
      title,
      context: contextName
    });
  }

  async onMenuAction(menuAction: MenuAction, item: GtdItem) {
    switch (menuAction.id) {
      case 'edit':
        const newTitle = await this.dialog.prompt({
          title: 'Editar acción',
          defaultValue: item.title,
          placeholder: 'Título de la acción...'
        });
        if (newTitle) {
          this.store.updateItem(item.id, { title: newTitle });
        }
        break;
      case 'calendar':
        const dateInput = await this.dialog.prompt({
          title: 'Mover al Calendario',
          message: 'Selecciona la fecha para este compromiso.',
          inputType: 'date',
          defaultValue: new Date().toISOString().split('T')[0]
        });
        if (dateInput) {
          const d = new Date(dateInput);
          if (!isNaN(d.getTime())) {
            this.store.moveToCalendar(item.id, d);
          }
        }
        break;
      case 'someday':
        this.store.updateItem(item.id, { status: 'someday' });
        break;
      case 'delete':
        this.itemToDelete = item;
        this.deleteDialog.open();
        break;
    }
  }

  async confirmDelete() {
    if (this.itemToDelete) {
      await this.store.deleteItem(this.itemToDelete.id);
      this.itemToDelete = null;
    }
  }
}
