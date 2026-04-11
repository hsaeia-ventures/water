import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastType } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 w-full max-w-sm px-4 pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div 
          class="pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-xl animate-toast-in"
          [ngClass]="getToastClass(toast.type)"
          role="alert"
        >
          <div class="flex items-center gap-3">
             <div class="shrink-0">
               @if (toast.type === 'success') {
                 <div class="w-8 h-8 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clip-rule="evenodd" />
                   </svg>
                 </div>
               } @else if (toast.type === 'error') {
                 <div class="w-8 h-8 rounded-full bg-red-500/20 text-red-500 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clip-rule="evenodd" />
                   </svg>
                 </div>
               } @else {
                 <div class="w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                     <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clip-rule="evenodd" />
                   </svg>
                 </div>
               }
             </div>
             <p class="text-sm font-medium text-white">{{ toast.message }}</p>
          </div>
          
          <button (click)="toastService.remove(toast.id)" class="text-zinc-500 hover:text-zinc-300 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      }
    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-toast-in {
      animation: toastIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes toastIn {
      from { transform: translateY(100%) scale(0.9); opacity: 0; }
      to { transform: translateY(0) scale(1); opacity: 1; }
    }
  `]
})
export class ToastContainerComponent {
  public toastService = inject(ToastService);

  getToastClass(type: ToastType): string {
    switch (type) {
      case 'success': return 'bg-zinc-900/90 border-teal-500/20';
      case 'error': return 'bg-zinc-900/90 border-red-500/20';
      default: return 'bg-zinc-900/90 border-zinc-800/80';
    }
  }
}
