import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizeStore } from '../../organize/services/organize.store';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="w-full max-w-4xl mx-auto py-6 px-4 animate-fade-in-up">
      <header class="mb-8">
        <h1 class="text-3xl sm:text-4xl font-light tracking-tight text-white mb-2">Proyectos</h1>
        <p class="text-zinc-500">Múltiples pasos para una meta. Vigila que ninguno se quede estancado.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        @if (projectsWithHealth().length === 0) {
          <div class="col-span-full text-center py-20 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 border-dashed">
            <h3 class="text-zinc-300 font-medium">Sin Proyectos</h3>
            <p class="text-sm text-zinc-500 mt-1">No hay metas activas de múltiples pasos.</p>
          </div>
        } @else {
          @for (project of projectsWithHealth(); track project.id) {
            <article class="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 flex flex-col relative overflow-hidden group hover:border-zinc-700 transition-colors">
              
              <!-- Indicator -->
              <div class="absolute top-0 left-0 w-full h-1" [ngClass]="project.isHealthy ? 'bg-teal-500/50' : 'bg-amber-500/80'"></div>

              <div class="flex justify-between items-start mb-3 mt-1">
                <h3 class="text-lg font-medium text-white pr-6">{{ project.title }}</h3>
                @if (!project.isHealthy) {
                  <div class="text-amber-500 flex-shrink-0" title="Proyecto Estancado: No tiene próximas acciones">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clip-rule="evenodd" /></svg>
                  </div>
                } @else {
                  <div class="text-teal-500 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path fill-rule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clip-rule="evenodd" /></svg>
                  </div>
                }
              </div>

              @if (project.notes) {
                <p class="text-sm text-zinc-500 mb-4 line-clamp-2">{{ project.notes }}</p>
              }

              <!-- Stats/Footer -->
              <div class="mt-auto pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span class="text-xs font-medium" [ngClass]="project.isHealthy ? 'text-teal-400' : 'text-amber-400'">
                  {{ project.isHealthy ? 'Activo' : 'Requiere revisión' }}
                </span>
                <span class="text-xs text-zinc-600 font-mono">
                  {{ project.created_at | date:'shortDate' }}
                </span>
              </div>
            </article>
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
  `]
})
export default class ProjectsPage {
  private store = inject(OrganizeStore);
  
  public projectsWithHealth = computed(() => {
    const projects = this.store.projects();
    const actions = this.store.nextActions();
    
    // Reverse chronologically
    const sorted = [...projects].sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    return sorted.map(p => {
      const hasActions = actions.some(a => a.parent_id === p.id);
      return { ...p, isHealthy: hasActions };
    });
  });
}
