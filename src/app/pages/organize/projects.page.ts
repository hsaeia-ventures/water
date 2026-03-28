import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore, ProjectWithActions } from '../../organize/services/organize.store';
import { InlineCaptureComponent } from '../../shared/components/inline-capture/inline-capture';
import { ItemMenuComponent, MenuAction } from '../../shared/components/item-menu/item-menu';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import { GtdItem } from '../../core/models/gtd-item.model';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule, InlineCaptureComponent, ItemMenuComponent, ConfirmDialogComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
        <div>
          <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">Proyectos</h1>
          <p class="text-zinc-500">Múltiples pasos para una meta. Vigila que ninguno se quede estancado.</p>
        </div>
        <button 
          (click)="createProject()"
          class="flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-400 text-zinc-950 font-medium text-sm rounded-xl transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4"><path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" /></svg>
          Nuevo Proyecto
        </button>
      </header>

      <div class="flex flex-col gap-4">
        @if (projects().length === 0) {
          <div class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <h3 class="text-zinc-300 font-medium">Sin Proyectos</h3>
            <p class="text-sm text-zinc-500 mt-1">No hay metas activas de múltiples pasos.</p>
          </div>
        } @else {
          @for (project of projects(); track project.id) {
            <article class="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 relative transition-colors"
                     [ngClass]="expandedIds().has(project.id) ? 'border-zinc-700' : 'hover:border-zinc-700'">
              
              <!-- Indicator -->
              <div class="absolute top-0 left-0 w-full h-1 rounded-t-2xl" [ngClass]="project.isHealthy ? 'bg-teal-500/50' : 'bg-amber-500/80'"></div>

              <!-- Header (Clickable for accordion) -->
              <div class="flex justify-between items-start mb-2 mt-1 cursor-pointer" (click)="toggleExpand(project.id)">
                <div class="flex-1 min-w-0 pr-4">
                  <div class="flex items-center gap-3">
                    <h3 class="text-lg font-medium text-white truncate">{{ project.title }}</h3>
                    @if (!project.isHealthy) {
                      <div class="text-amber-500" title="Proyecto Estancado: No tiene próximas acciones">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>
                      </div>
                    }
                  </div>
                  @if (project.notes && !expandedIds().has(project.id)) {
                    <p class="text-sm text-zinc-500 mt-1 line-clamp-1">{{ project.notes }}</p>
                  }
                </div>

                <!-- Actions menu and toggle icon -->
                <div class="flex items-center gap-2" (click)="$event.stopPropagation()">
                  <app-item-menu 
                    [actions]="projectMenuOptions"
                    (actionSelected)="onProjectMenu($event, project)"
                  />
                  <button class="text-zinc-500 hover:text-white transition-colors" (click)="toggleExpand(project.id)">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-5 h-5 transition-transform" [ngClass]="expandedIds().has(project.id) ? 'rotate-180' : ''">
                      <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 011.06 0L10 11.94l3.72-3.72a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0L5.22 9.28a.75.75 0 010-1.06z" clip-rule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Collapsed stats footer -->
              @if (!expandedIds().has(project.id)) {
                <div class="mt-4 flex items-center justify-between text-xs font-medium">
                   <span [ngClass]="project.isHealthy ? 'text-teal-400' : 'text-amber-400'">
                     {{ project.actions.length }} acciones pendientes
                   </span>
                   <span class="text-zinc-600 font-mono">{{ project.created_at | date:'shortDate' }}</span>
                </div>
              }

              <!-- Expanded content -->
              @if (expandedIds().has(project.id)) {
                <div class="animate-fade-in mt-4 pt-4 border-t border-zinc-800/50">
                  @if (project.notes) {
                    <p class="text-sm text-zinc-400 mb-6 bg-zinc-950/30 p-3 rounded-lg border border-zinc-800/50">{{ project.notes }}</p>
                  }

                  <h4 class="text-xs uppercase tracking-wider text-zinc-500 font-semibold mb-3">Próximas Acciones</h4>
                  
                  <div class="flex flex-col gap-2 mb-4">
                     @if (project.actions.length === 0) {
                        <p class="text-sm text-zinc-600 italic py-2">No hay acciones. Añade una para avanzar.</p>
                     }
                     @for (action of project.actions; track action.id) {
                       <div class="flex items-start gap-3 p-3 rounded-xl hover:bg-zinc-800/50 transition-colors group">
                          <button 
                            (click)="toggleAction(action)"
                            class="mt-0.5 flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all focus:outline-none"
                            [ngClass]="action.status === 'done' ? 'bg-teal-500 border-teal-500 text-zinc-900' : 'bg-transparent border-zinc-600 hover:border-zinc-400'"
                          >
                            @if (action.status === 'done') {
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3"><path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" /></svg>
                            }
                          </button>
                          <div class="flex-1 min-w-0">
                            <span class="text-sm text-zinc-300" [ngClass]="action.status === 'done' ? 'line-through opacity-50' : ''">{{ action.title }}</span>
                            <!-- Context/Tags display -->
                            @if (action.ghost_tags && action.ghost_tags.length > 0) {
                               <div class="mt-1 flex gap-1">
                                 @for (tag of action.ghost_tags; track tag.raw) {
                                    <span class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-teal-500/10 text-teal-400 border border-teal-500/20">
                                      {{ tag.raw || tag.value }}
                                    </span>
                                 }
                               </div>
                            }
                          </div>
                          <!-- Action edit/delete menu -->
                          <div class="opacity-0 group-hover:opacity-100 transition-opacity">
                             <app-item-menu 
                               [actions]="actionMenuOptions"
                               (actionSelected)="onActionMenu($event, action)"
                             />
                          </div>
                       </div>
                     }
                  </div>

                  <app-inline-capture 
                    placeholder="Añadir paso al proyecto..." 
                    (save)="addActionToProject($event, project.id)"
                  />
                </div>
              }
            </article>
          }
        }
      </div>
    </div>

    <!-- Confirm dialog for deletion -->
    <app-confirm-dialog
      #deleteDialog
      title="¿Eliminar proyecto?"
      message="Se moverá a la papelera junto con todas sus acciones dependientes. Esta acción no se puede deshacer."
      confirmLabel="Eliminar"
      (confirmed)="confirmDeleteProject()"
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
    .animate-fade-in {
      animation: fadeIn 0.2s ease-out forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export default class ProjectsPage {
  private store = inject(OrganizeStore);
  
  @ViewChild('deleteDialog') deleteDialog!: ConfirmDialogComponent;
  
  public projects = this.store.projectsWithActionCount;

  public expandedIds = signal<Set<string>>(new Set());

  public projectMenuOptions: MenuAction[] = [
    { id: 'edit', label: 'Editar título o notas...' },
    { id: 'someday', label: 'Mover a Incubadora' },
    { id: 'delete', label: 'Eliminar Proyecto', danger: true }
  ];

  public actionMenuOptions: MenuAction[] = [
    { id: 'edit', label: 'Editar acción...' },
    { id: 'delete', label: 'Eliminar acción', danger: true }
  ];

  private projectToDelete: ProjectWithActions | null = null;

  toggleExpand(id: string) {
    this.expandedIds.update(set => {
      const newSet = new Set(set);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  }

  async createProject() {
    const title = window.prompt('Nombre del nuevo proyecto:');
    if (title && title.trim()) {
      const p = await this.store.createProject(title.trim());
      // Auto expand to allow adding actions
      this.expandedIds.update(set => new Set(set).add(p.id));
    }
  }

  async onProjectMenu(menuAction: MenuAction, project: ProjectWithActions) {
    if (menuAction.id === 'edit') {
      const newTitle = window.prompt('Nuevo título:', project.title);
      if (newTitle && newTitle.trim()) {
        await this.store.updateItem(project.id, { title: newTitle.trim() });
      }
    } else if (menuAction.id === 'someday') {
      await this.store.updateItem(project.id, { status: 'someday' });
    } else if (menuAction.id === 'delete') {
      this.projectToDelete = project;
      this.deleteDialog.open();
    }
  }

  async confirmDeleteProject() {
    if (this.projectToDelete) {
      // Soft-delete project
      await this.store.deleteItem(this.projectToDelete.id);
      // Soft-delete ALL associated actions
      for (const action of this.projectToDelete.actions) {
         await this.store.deleteItem(action.id);
      }
      this.projectToDelete = null;
    }
  }

  async toggleAction(action: GtdItem) {
    await this.store.toggleActionComplete(action);
  }

  async addActionToProject(title: string, projectId: string) {
    await this.store.createAction({
      title,
      parentId: projectId
    });
  }

  async onActionMenu(menuAction: MenuAction, action: GtdItem) {
    if (menuAction.id === 'edit') {
      const newTitle = window.prompt('Nuevo título:', action.title);
      if (newTitle && newTitle.trim()) {
        await this.store.updateItem(action.id, { title: newTitle.trim() });
      }
    } else if (menuAction.id === 'delete') {
      if (confirm('¿Eliminar acción permanentemente?')) {
        await this.store.deleteItem(action.id);
      }
    }
  }
}
