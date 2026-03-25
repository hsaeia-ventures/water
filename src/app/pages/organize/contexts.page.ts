import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../organize/services/organize.store';

@Component({
  selector: 'app-contexts-page',
  standalone: true,
  imports: [CommonModule],
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
        @for (ctx of availableContexts(); track ctx) {
          <button 
            (click)="selectedContext.set(ctx)"
            class="flex-shrink-0 px-4 py-2 rounded-full font-medium text-sm transition-all focus:outline-none"
            [ngClass]="selectedContext() === ctx ? 'bg-teal-500 text-zinc-950' : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 border border-zinc-800'"
          >
            {{ ctx }}
          </button>
        }
      </div>

      <!-- Actions List -->
      <div class="flex flex-col gap-3">
        @if (filteredActions().length === 0) {
          <div class="text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
             <div class="w-16 h-16 rounded-full bg-zinc-800/50 flex items-center justify-center mx-auto mb-4 text-zinc-600">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <h3 class="text-zinc-300 font-medium">Bandeja Vacía</h3>
             <p class="text-sm text-zinc-500 mt-1">No hay acciones para este contexto en este momento.</p>
          </div>
        } @else {
          @for (action of filteredActions(); track action.id) {
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
                
                <!-- Ghost Tags (Contexts and others) -->
                @if (action.ghost_tags && action.ghost_tags.length > 0 && action.status !== 'done') {
                  <div class="flex flex-wrap gap-2 mt-3">
                    @for (tag of action.ghost_tags; track tag.raw) {
                      <span 
                        class="px-2 py-0.5 rounded text-xs font-medium"
                        [ngClass]="tag.type === 'context' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'bg-zinc-800 text-zinc-400'"
                      >
                        {{ tag.raw || tag.value }}
                      </span>
                    }
                  </div>
                }
              </div>
            </div>
          }
        }
      </div>
    </div>
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
    /* Hide scrollbar for generic containers */
    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
  `]
})
export default class ContextsPage {
  private store = inject(OrganizeStore);
  
  public selectedContext = signal<string>('all');

  // Derive unique contexts starting with '@' from all next actions
  public availableContexts = computed(() => {
    const actions = this.store.nextActions();
    const contexts = new Set<string>();
    
    actions.forEach(action => {
      if (action.ghost_tags) {
        action.ghost_tags.forEach(tag => {
          if (tag.type === 'context') {
            contexts.add(tag.raw || '@' + tag.value);
          }
        });
      }
    });
    
    return Array.from(contexts).sort();
  });

  public filteredActions = computed(() => {
    const actions = this.store.nextActions();
    const ctx = this.selectedContext();
    
    if (ctx === 'all') return actions;
    
    return actions.filter(action => 
      action.ghost_tags && action.ghost_tags.some(tag => tag.type === 'context' && (tag.raw === ctx || '@' + tag.value === ctx))
    );
  });

  toggleAction(action: any) {
    this.store.toggleActionComplete(action);
  }
}
