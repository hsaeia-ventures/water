import { Component, computed, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../organize/services/organize.store';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { InlineCaptureComponent } from '../../shared/components/inline-capture/inline-capture';
import { ItemMenuComponent, MenuAction } from '../../shared/components/item-menu/item-menu';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog';
import { GtdItem } from '../../core/models/gtd-item.model';

@Component({
  selector: 'app-someday-page',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe, InlineCaptureComponent, ItemMenuComponent, ConfirmDialogComponent],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">Incubadora</h1>
        <p class="text-zinc-500">Tus grandes ideas, posibles proyectos e información de referencia para el futuro.</p>
      </header>

      <!-- Filters -->
      <div class="flex gap-2 mb-6">
        <button 
          (click)="filter.set('all')"
          [ngClass]="filter() === 'all' ? 'bg-zinc-100 text-zinc-950' : 'bg-transparent border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
        >
          Todo
        </button>
        <button 
          (click)="filter.set('action')"
          [ngClass]="filter() === 'action' ? 'bg-amber-500 text-zinc-950 border-amber-500' : 'bg-transparent border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-amber-400 border-dashed'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
        >
          Ideas sueltas
        </button>
        <button 
          (click)="filter.set('project')"
          [ngClass]="filter() === 'project' ? 'bg-fuchsia-500 text-zinc-950 border-fuchsia-500' : 'bg-transparent border border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-fuchsia-400 border-dashed'"
          class="px-4 py-1.5 rounded-full text-sm font-medium transition-colors border"
        >
          Proyectos Futuros
        </button>
      </div>

      <div class="mb-8 max-w-lg">
        <app-inline-capture 
          [placeholder]="filter() === 'project' ? 'Añadir Proyecto a la incubadora...' : 'Añadir idea a la incubadora...'"
          (save)="addSomedayItem($event)"
        />
      </div>

      <div class="columns-1 md:columns-2 gap-4">
        @if (filteredItems().length === 0) {
          <div class="col-span-full py-20 text-center bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <h3 class="text-zinc-300 font-medium">Bandeja Vacía</h3>
            <p class="text-sm text-zinc-500 mt-1">Aún no has congelado ninguna idea para el futuro en este filtro.</p>
          </div>
        } @else {
          @for (item of filteredItems(); track item.id) {
            <div class="group break-inside-avoid relative mb-4 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl p-4 md:p-5 hover:bg-zinc-900 hover:border-zinc-700 transition-colors">
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full" 
                      [ngClass]="item.type === 'project' ? 'bg-fuchsia-500/10 text-fuchsia-400 border border-fuchsia-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'">
                  {{ item.type === 'project' ? 'Proyecto' : 'Idea' }}
                </span>
                
                <div class="-mr-2 -mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <app-item-menu 
                    [actions]="menuOptions"
                    (actionSelected)="onMenuAction($event, item)"
                  />
                </div>
              </div>
              
              <h3 class="text-lg font-medium text-zinc-200 mt-2">{{ item.title }}</h3>
              
              @if (item.notes) {
                <p class="text-sm text-zinc-500 mt-2">{{ item.notes }}</p>
              }

              <!-- Actions/Footer -->
              <div class="mt-4 flex flex-wrap gap-2 items-center justify-between border-t border-zinc-800/50 pt-4">
                <span class="text-xs text-zinc-600 font-mono">
                   hace {{ item.created_at | relativeTime }}
                </span>
                <button 
                  (click)="activateItem(item)"
                  class="px-3 py-1.5 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 text-xs font-medium rounded-lg border border-teal-500/20 transition-colors flex items-center gap-1.5"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3.5 h-3.5"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
                  Activar
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>

    <!-- Confirm dialog for deletion -->
    <app-confirm-dialog
      #deleteDialog
      title="¿Eliminar definitivamente?"
      message="El ítem se borrará de la incubadora. Esta acción no se puede deshacer."
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
  `]
})
export default class SomedayPage {
  private store = inject(OrganizeStore);
  
  @ViewChild('deleteDialog') deleteDialog!: ConfirmDialogComponent;

  public filter = signal<'all' | 'action' | 'project'>('all');

  public filteredItems = computed(() => {
    let items = this.store.somedayItems();
    const f = this.filter();
    if (f !== 'all') {
      items = items.filter(i => i.type === f);
    }
    // Sort descending by created_at
    return items.sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  });

  public menuOptions: MenuAction[] = [
    { id: 'edit', label: 'Editar título o notas...' },
    { id: 'delete', label: 'Eliminar', danger: true }
  ];

  private itemToDelete: GtdItem | null = null;

  async addSomedayItem(title: string) {
    const type = this.filter() === 'project' ? 'project' : 'action';
    await this.store.createSomedayItem({ title, type });
  }

  async activateItem(item: GtdItem) {
    await this.store.activateFromSomeday(item.id);
  }

  async onMenuAction(menuAction: MenuAction, item: GtdItem) {
    if (menuAction.id === 'edit') {
      const newTitle = window.prompt('Nuevo título:', item.title);
      if (newTitle && newTitle.trim()) {
        await this.store.updateItem(item.id, { title: newTitle.trim() });
      }
    } else if (menuAction.id === 'delete') {
      this.itemToDelete = item;
      this.deleteDialog.open();
    }
  }

  async confirmDelete() {
    if (this.itemToDelete) {
      await this.store.deleteItem(this.itemToDelete.id);
      this.itemToDelete = null;
    }
  }
}
