import { Component, HostListener, computed, inject } from '@angular/core';
import { ClarifyStore } from '../../services/clarify.store';
import { TwoMinuteRuleService } from '../../services/two-minute-rule.service';

@Component({
  selector: 'app-decision-tree',
  standalone: true,
  template: `
    @if (currentItem()) {
      <div class="decision-card">
        <h2>{{ currentItem()?.title }}</h2>
        
        @if (isQuick()) {
          <div class="alert alert-success">
            ⏱️ Esto toma menos de dos minutos. ¡Hazlo ahora!
            <button (click)="doNow()">Ya lo hice</button>
          </div>
        }

        <div class="actions">
          <p>Atajos: [E] Eliminar | [I] Incubar</p>
          <button (click)="trash()">Papelera</button>
          <button (click)="incubate()">Algún día/Tal vez</button>
        </div>

        <div class="friction-zone">
          <input [value]="nextActionTitle" (input)="nextActionTitle = $any($event.target).value" placeholder="¿Cuál es la próxima acción física?" />
          <!-- Fricción Positiva: Disabled si no hay acción definida -->
          <button [disabled]="!nextActionTitle.trim()" (click)="saveProjectAction()">
            Guardar Proyecto/Acción
          </button>
        </div>
      </div>
    } @else {
      <p>Inbox a 0. ¡Buen trabajo!</p>
    }
  `,
  styles: [`
    .decision-card { padding: 2rem; border: 1px solid #ccc; border-radius: 8px; }
    .alert { background: #d4edda; padding: 1rem; margin-bottom: 1rem; border-radius: 4px; }
    .friction-zone { margin-top: 2rem; padding-top: 1rem; border-top: 1px dashed #ccc; }
    button { margin-right: 0.5rem; }
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
    
    // Ignorar si estamos escribiendo en el input
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement) {
      return;
    }

    if (event.key.toLowerCase() === 'e') {
      this.trash();
    } else if (event.key.toLowerCase() === 'i') {
      this.incubate();
    }
  }

  trash() {
    this.store.processCurrentItem({ status: 'trashed', type: 'reference' }, 'item_trashed');
  }

  incubate() {
    this.store.processCurrentItem({ status: 'someday', type: 'capture' }, 'item_incubated');
  }

  doNow() {
    this.store.processCurrentItem({ status: 'done', type: 'action' }, 'item_done_2min');
  }

  saveProjectAction() {
    if (!this.nextActionTitle) return; 
    
    this.store.processCurrentItem({ 
      type: 'action', 
      status: 'next_action', 
      notes: `Definido desde inbox. Acción: ${this.nextActionTitle}`
    }, 'action_defined');
    
    this.nextActionTitle = '';
  }
}
