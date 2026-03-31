import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActionSelectorComponent } from '../../execute/components/action-selector/action-selector';
import { DeepWorkComponent } from '../../execute/components/deep-work/deep-work';
import { ExecuteStore } from '../../execute/services/execute.store';

@Component({
  selector: 'app-execute-page',
  standalone: true,
  imports: [CommonModule, ActionSelectorComponent, DeepWorkComponent],
  template: `
    <div class="min-h-screen bg-gray-950 p-6 md:p-10 relative">
      
      <!-- Fondo estético oscuro y focalizado -->
      <div 
        class="absolute inset-0 bg-gradient-to-br from-indigo-900/10 via-gray-950 to-orange-900/5 pointer-events-none transition-opacity duration-700"
        [class.opacity-0]="store.deepWorkTask() !== null">
      </div>

      <div class="relative z-10 w-full h-full">
        <!-- Main Selector View -->
        @if (!store.deepWorkTask()) {
          <app-action-selector />
        } 
        <!-- Deep Work Portal -->
        @else {
          <app-deep-work />
        }
      </div>
    </div>
  `
})
export class ExecutePage {
  public store = inject(ExecuteStore);
}
