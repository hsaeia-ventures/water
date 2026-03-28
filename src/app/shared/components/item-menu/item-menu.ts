import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';

export interface MenuAction {
  id: string;
  label: string;
  icon?: string;
  danger?: boolean;
}

@Component({
  selector: 'app-item-menu',
  standalone: true,
  imports: [ClickOutsideDirective],
  template: `
    <div class="item-menu" (appClickOutside)="close()">
      <button
        type="button"
        (click)="toggle()"
        class="item-menu__trigger"
        [class.item-menu__trigger--open]="isOpen()"
        [attr.aria-expanded]="isOpen()"
        aria-label="Opciones"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4">
          <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      </button>

      @if (isOpen()) {
        <div class="item-menu__dropdown" role="menu">
          @for (action of actions; track action.id) {
            <button
              type="button"
              role="menuitem"
              (click)="onAction(action)"
              class="item-menu__option"
              [class.item-menu__option--danger]="action.danger"
            >
              @if (action.icon) {
                <span class="item-menu__icon" [innerHTML]="action.icon"></span>
              }
              {{ action.label }}
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .item-menu {
      position: relative;
    }
    .item-menu__trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 1.75rem;
      height: 1.75rem;
      border-radius: 0.5rem;
      border: none;
      background: transparent;
      color: #52525b;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .item-menu__trigger:hover,
    .item-menu__trigger--open {
      background: rgba(82, 82, 91, 0.2);
      color: #a1a1aa;
    }
    .item-menu__dropdown {
      position: absolute;
      right: 0;
      top: calc(100% + 0.25rem);
      z-index: 50;
      min-width: 10rem;
      padding: 0.25rem;
      background: #18181b;
      border: 1px solid rgba(63, 63, 70, 0.8);
      border-radius: 0.75rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      animation: menuFadeIn 0.12s ease-out forwards;
    }
    @keyframes menuFadeIn {
      from { opacity: 0; transform: translateY(-4px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
    .item-menu__option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.5rem 0.75rem;
      background: transparent;
      border: none;
      border-radius: 0.5rem;
      color: #a1a1aa;
      font-size: 0.8125rem;
      font-family: inherit;
      text-align: left;
      cursor: pointer;
      transition: all 0.1s ease;
    }
    .item-menu__option:hover {
      background: rgba(82, 82, 91, 0.2);
      color: #e4e4e7;
    }
    .item-menu__option--danger {
      color: #f87171;
    }
    .item-menu__option--danger:hover {
      background: rgba(239, 68, 68, 0.1);
      color: #fca5a5;
    }
    .item-menu__icon {
      display: flex;
      align-items: center;
    }
  `]
})
export class ItemMenuComponent {
  @Input() actions: MenuAction[] = [];
  @Output() actionSelected = new EventEmitter<MenuAction>();

  isOpen = signal(false);

  toggle() { this.isOpen.update(v => !v); }
  close()  { this.isOpen.set(false); }

  onAction(action: MenuAction) {
    this.actionSelected.emit(action);
    this.close();
  }
}
