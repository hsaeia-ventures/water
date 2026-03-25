import { Component, HostListener, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarifyStore } from '../../services/clarify.store';
import { TwoMinuteRuleService } from '../../services/two-minute-rule.service';

@Component({
  selector: 'app-decision-tree',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (currentItem()) {
      <div class="mt-8 flex flex-col gap-4 animate-fade-in-up">
        
        <!-- Two Minute Rule Alert -->
        @if (isQuick()) {
          <div class="bg-teal-500/10 border border-teal-500/20 text-teal-400 p-4 rounded-xl flex items-center justify-between shadow-lg shadow-teal-500/5">
            <div class="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Esto toma menos de dos minutos. ¡Hazlo ahora!</span>
            </div>
            <button (click)="doNow()" class="px-4 py-2 bg-teal-500 text-zinc-950 rounded-lg text-sm font-semibold hover:bg-teal-400 transition-colors shadow-md focus:ring-2 focus:ring-teal-500 focus:outline-none">
              Ya lo hice [D]
            </button>
          </div>
        }

        <!-- Primary Actions: Accionable? -->
        <h3 class="text-zinc-400 font-medium mb-2 tracking-wide text-sm uppercase">¿Es procesable o lo descartamos?</h3>
        
        <div class="grid grid-cols-2 gap-3 mb-6">
          <button (click)="trash()" class="group flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-900 border border-red-500/10 hover:border-red-500/30 hover:bg-red-500/5 transition-all outline-none focus:ring-2 focus:ring-red-500">
            <span class="p-2 rounded-full bg-red-500/10 text-red-500 group-hover:bg-red-500 group-hover:text-zinc-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
            </span>
            <span class="text-sm font-medium text-red-400">Eliminar [E]</span>
          </button>
          
          <button (click)="incubate()" class="group flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-zinc-900 border border-amber-500/10 hover:border-amber-500/30 hover:bg-amber-500/5 transition-all outline-none focus:ring-2 focus:ring-amber-500">
            <span class="p-2 rounded-full bg-amber-500/10 text-amber-500 group-hover:bg-amber-500 group-hover:text-zinc-900 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" /></svg>
            </span>
            <span class="text-sm font-medium text-amber-400">Incubar [I]</span>
          </button>
        </div>

        <!-- Yes, action required: Friction Zone -->
        <div class="pt-6 border-t border-zinc-800">
          <h3 class="text-zinc-400 font-medium mb-3 tracking-wide text-sm uppercase">Si es accionable...</h3>
          
          <div class="relative mb-3">
            <input 
              type="text" 
              [(ngModel)]="nextActionTitle" 
              placeholder="¿Cuál es la próxima acción física?" 
              class="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
            />
          </div>
          
          <button 
            [disabled]="!nextActionTitle.trim()" 
            (click)="saveNextAction()"
            class="w-full py-3 rounded-xl font-medium transition-all shadow-lg flex justify-center items-center gap-2"
            [ngClass]="nextActionTitle.trim() ? 'bg-blue-600 text-white hover:bg-blue-500 cursor-pointer shadow-blue-500/20' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'"
          >
            <span>Guardar Acción</span>
            <kbd class="hidden sm:inline-block bg-zinc-950/20 px-2 py-0.5 rounded text-xs font-mono ml-2">Enter</kbd>
          </button>
        </div>

      </div>
    }
  `,
  styles: [`
    :host {
      display: block;
    }
    .animate-fade-in-up {
      animation: fadeInUp 0.5s ease-out forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(15px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class DecisionTreeComponent {
  private store = inject(ClarifyStore);
  private twoMinService = inject(TwoMinuteRuleService);

  public currentItem = this.store.currentItem;

  public isQuick = computed(() => {
    const item = this.currentItem();
    return item ? this.twoMinService.isQuickTask(item.title) : false;
  });

  public nextActionTitle = '';
  
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.currentItem()) return;
    
    // Ignorar accesos directos si estamos dentro de un input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      if (event.key === 'Enter' && this.nextActionTitle.trim()) {
        this.saveNextAction();
      }
      return; // No ejecutar e, i, etc. si el focus está en un textbox
    }

    const key = event.key.toLowerCase();
    
    if (key === 'e') {
      this.trash();
    } else if (key === 'i') {
      this.incubate();
    } else if (key === 'd' && this.isQuick()) {
      this.doNow();
    } else if (key === 'enter' && this.nextActionTitle.trim()) {
      this.saveNextAction();
    }
  }

  trash() {
    this.store.processCurrentItem({ status: 'trashed', type: 'reference' }, 'item_trashed');
    this.resetState();
  }

  incubate() {
    this.store.processCurrentItem({ status: 'someday', type: 'capture' }, 'item_incubated');
    this.resetState();
  }

  doNow() {
    this.store.processCurrentItem({ status: 'done', type: 'action' }, 'item_done_2min');
    this.resetState();
  }

  saveNextAction() {
    if (!this.nextActionTitle.trim()) return; 
    
    this.store.processCurrentItem({ 
      type: 'action', 
      status: 'next_action', 
      title: this.nextActionTitle.trim(),
      notes: `Origen (Captura): ${this.currentItem()?.title}`
    }, 'action_defined');
    
    this.resetState();
  }
  
  private resetState() {
    this.nextActionTitle = '';
  }
}
