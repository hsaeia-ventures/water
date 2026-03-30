import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReflectStore, ReviewStep } from '../../services/reflect.store';
import { OrganizeStore } from '../../../organize/services/organize.store';
import { CaptureStore } from '../../../capture/services/capture.store';
import { InlineCaptureComponent } from '../../../shared/components/inline-capture/inline-capture';
import { MemoryVaultComponent } from '../memory-vault/memory-vault';

@Component({
  selector: 'app-weekly-review-coach',
  standalone: true,
  imports: [CommonModule, InlineCaptureComponent, MemoryVaultComponent],
  template: `
    <div class="bg-zinc-900/40 border border-zinc-800/50 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
      
      <!-- Stepper Header -->
      <div class="flex border-b border-zinc-800/50 overflow-x-auto no-scrollbar">
        @for (step of store.reviewSteps; track step) {
          <div 
            class="flex-1 min-w-[120px] px-4 py-3 flex items-center justify-center gap-2 border-r border-zinc-800/50 last:border-r-0 transition-colors"
            [class.bg-zinc-800/30]="store.currentStep() === step"
            [class.text-amber-400]="store.currentStep() === step">
            <span class="text-[10px] font-bold uppercase tracking-widest">{{ stepLabel(step) }}</span>
            @if (isStepCompleted(step)) {
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 text-emerald-500"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clip-rule="evenodd" /></svg>
            }
          </div>
        }
      </div>

      <!-- Step Content -->
      <div class="p-8 md:p-12 min-h-[400px] flex flex-col">
        
        @switch (store.currentStep()) {
          @case ('clear_minds') {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 class="text-2xl font-light mb-4">Paso 1: Vaciar tu Mente</h2>
              <p class="text-zinc-500 mb-8 max-w-xl">Usa este espacio para capturar todo lo que tengas en la cabeza en este momento. No juzgues, solo anota.</p>
              <app-inline-capture placeholder="Alguna idea, preocupación o tarea pendiente..." />
              <div class="mt-8 p-4 bg-zinc-950/40 border border-zinc-800/30 rounded-2xl flex items-start gap-4">
                <div class="p-2 bg-zinc-900 rounded-lg text-amber-500/60"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 18v-1.5m0-9V9m0 2.25V15l3.5 2.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <div>
                  <h4 class="text-xs font-bold uppercase text-zinc-400 mb-1">Coach IA</h4>
                  <p class="text-xs text-zinc-500 italic">"Intenta vaciar tu bandeja de entrada física también si estás en casa u oficina."</p>
                </div>
              </div>
            </div>
          }

          @case ('review_past') {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 class="text-2xl font-light mb-4">Paso 2: Revisar el Pasado</h2>
              <p class="text-zinc-500 mb-6">Revisemos las últimas 2 semanas. ¿Se te olvidó anotar algo o hay algún cabo suelto?</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (event of pastEvents(); track event.id) {
                  <div class="p-4 bg-zinc-950/40 border border-zinc-800/30 rounded-2xl flex items-center justify-between">
                    <div>
                      <h3 class="text-sm font-medium text-zinc-300">{{ event.title }}</h3>
                      <p class="text-[10px] text-zinc-600 uppercase font-bold">{{ event.scheduled_date | date:'dd MMM' }}</p>
                    </div>
                    <span class="text-xs text-zinc-600 italic">Pasado</span>
                  </div>
                } @empty {
                  <div class="col-span-2 text-center py-12 text-zinc-600 italic border border-dashed border-zinc-800/50 rounded-2xl">No hay eventos recientes en tu calendario.</div>
                }
              </div>
            </div>
          }

          @case ('review_future') {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 class="text-2xl font-light mb-4">Paso 3: Anticipar el Futuro</h2>
              <p class="text-zinc-500 mb-6">Mira las próximas 2 semanas. ¿Qué compromisos vienen? ¿Necesitas preparar algo?</p>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                @for (event of futureEvents(); track event.id) {
                  <div class="p-4 bg-zinc-950/40 border border-zinc-800/30 rounded-2xl border-l-2 border-l-amber-500/50">
                    <h3 class="text-sm font-medium text-zinc-300">{{ event.title }}</h3>
                    <p class="text-[10px] text-zinc-500 uppercase font-bold">{{ event.scheduled_date | date:'dd MMM' }}</p>
                  </div>
                } @empty {
                  <div class="col-span-2 text-center py-12 text-zinc-600 italic border border-dashed border-zinc-800/50 rounded-2xl">Sin compromisos futuros detectados.</div>
                }
              </div>
            </div>
          }

          @case ('audit_projects') {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 class="text-2xl font-light mb-4">Paso 4: Salud de Proyectos</h2>
              <p class="text-zinc-500 mb-6">Detectamos proyectos sin acciones próximas. Un proyecto sin acción es una preocupación latente.</p>
              <div class="flex flex-col gap-3">
                @for (project of orphanProjects(); track project.id) {
                  <div class="p-5 bg-zinc-950/40 border border-amber-500/10 rounded-2xl flex items-center justify-between group">
                    <div>
                      <h3 class="text-sm font-bold text-amber-500/80 mb-1 group-hover:text-amber-400 transition-colors">{{ project.title }}</h3>
                      <p class="text-xs text-zinc-600 italic">Causa: Sin acciones pendientes asociadas.</p>
                    </div>
                    <button class="text-[10px] font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors border border-zinc-800 px-3 py-1.5 rounded-lg">Añadir acción</button>
                  </div>
                } @empty {
                  <div class="text-center py-12 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-emerald-500 mx-auto mb-3 opacity-40"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <p class="text-emerald-500 font-medium tracking-tight">¡Todos tus proyectos están sanos!</p>
                  </div>
                }
              </div>
            </div>
          }

          @case ('review_someday') {
            <div class="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h2 class="text-2xl font-light mb-4 text-center">Paso 5: La Bóveda de Recuerdos</h2>
              <p class="text-zinc-500 mb-8 font-medium text-center max-w-lg mx-auto italic">Revisemos tu incubadora con una mirada fresca. ¿Alguna de estas ideas resuena hoy o merece ser liberada?</p>
              <app-memory-vault />
            </div>
          }

          @case ('complete') {
            <div class="text-center animate-in zoom-in duration-1000">
               <div class="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-12 h-12"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h2 class="text-4xl font-light mb-4">Mente como el agua</h2>
               <p class="text-zinc-500 max-w-sm mx-auto mb-8 font-medium">Has completado tu revisión semanal. Tu sistema está actualizado y tu mente tranquila.</p>
               <button 
                  (click)="store.resetReview()"
                  class="px-8 py-3 bg-zinc-100 text-zinc-950 font-bold rounded-2xl hover:bg-white transition-all shadow-xl shadow-white/5 active:scale-95">
                  Finalizar Revisión
               </button>
            </div>
          }
        }

        <!-- Footer Buttons -->
        @if (store.currentStep() !== 'complete') {
          <div class="mt-auto pt-10 flex border-t border-zinc-800/20 items-center justify-between">
            <button 
              (click)="store.prevStep()"
              [disabled]="store.currentStepIndex() === 0"
              class="px-6 py-3 rounded-2xl text-zinc-500 hover:text-zinc-300 disabled:opacity-0 transition-all font-bold uppercase tracking-widest text-[10px]">
              Atrás
            </button>
            
            <div class="flex items-center gap-1">
              @for (step of store.reviewSteps; track step) {
                <div class="w-1.5 h-1.5 rounded-full transition-all duration-500" [class.bg-amber-500]="store.currentStep() === step" [class.bg-zinc-800]="store.currentStep() !== step" [class.w-4]="store.currentStep() === step"></div>
              }
            </div>

            <button 
              (click)="store.nextStep()"
              class="px-10 py-3 bg-zinc-100 text-zinc-950 rounded-2xl hover:bg-white transition-all font-bold uppercase tracking-widest text-[10px] active:scale-95 shadow-lg shadow-white/5">
              {{ store.currentStepIndex() === store.reviewSteps.length - 2 ? 'Finalizar' : 'Siguiente' }}
            </button>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
  `]
})
export class WeeklyReviewCoachComponent {
  public store = inject(ReflectStore);
  public organizeStore = inject(OrganizeStore);
  public captureStore = inject(CaptureStore);

  public pastEvents = computed(() => this.organizeStore.upcomingEvents().past);
  public futureEvents = computed(() => this.organizeStore.upcomingEvents().future.slice(0, 5));
  public orphanProjects = this.organizeStore.unhealthyProjects;
  public somedayItems = this.organizeStore.somedayItems;

  public stepLabels: Record<ReviewStep, string> = {
    'clear_minds': 'Borrador',
    'review_past': 'Pasado',
    'review_future': 'Futuro',
    'audit_projects': 'Proyectos',
    'review_someday': 'Incubadora',
    'complete': 'Listo'
  };

  public stepLabel(step: ReviewStep): string {
    return this.stepLabels[step];
  }

  public isStepCompleted(step: ReviewStep): boolean {
    const currentIdx = this.store.currentStepIndex();
    const stepIdx = this.store.reviewSteps.indexOf(step as any);
    return stepIdx < currentIdx || currentIdx === this.store.reviewSteps.length - 1;
  }
}
