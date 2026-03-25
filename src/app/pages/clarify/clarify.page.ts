import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ClarifyStore } from '../../clarify/services/clarify.store';
import { ProcessCardComponent } from '../../clarify/components/process-card/process-card';
import { DecisionTreeComponent } from '../../clarify/components/decision-tree/decision-tree.component';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-clarify-page',
  standalone: true,
  imports: [
    CommonModule, 
    RouterLink,
    ProcessCardComponent, 
    DecisionTreeComponent
  ],
  template: `
    <div class="min-h-[calc(100vh-80px)] w-full max-w-2xl mx-auto flex flex-col justify-center py-10 px-4">
      
      <!-- Top nav -->
      <div class="w-full flex justify-between items-center mb-10">
        <a routerLink="/inbox" class="text-zinc-500 hover:text-white transition-colors flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          <span class="font-medium">Volver</span>
        </a>

        @if (store.remainingCount() > 0) {
          <div class="bg-zinc-900 px-4 py-1.5 rounded-full border border-zinc-800 text-sm font-medium text-zinc-400">
            Quedan: <span class="text-white">{{ store.remainingCount() }}</span>
          </div>
        }
      </div>

      <!-- Main Flow -->
      <div class="w-full relative">
        @if (store.remainingCount() === 0) {
          <div class="animate-fade-in text-center py-20">
             <div class="w-24 h-24 rounded-full bg-teal-500/10 flex items-center justify-center mx-auto mb-6 shadow-[0_0_50px_rgba(20,184,166,0.1)]">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-10 h-10 text-teal-400">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 class="text-3xl font-light tracking-tight text-white mb-3">Inbox a Cero</h1>
              <p class="text-zinc-500 max-w-md mx-auto">Has procesado todas tus capturas. Tu mente ahora fluye como el agua.</p>
              
              <a routerLink="/inbox" class="inline-block mt-8 bg-zinc-900 border border-zinc-800 text-white font-medium px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors">
                Ir a mis Tareas
              </a>
          </div>
        } @else {
          <!-- El ítem a procesar -->
          @if (store.currentItem(); as item) {
            <div class="w-full">
              <app-process-card [item]="item" />
              <div class="mt-4 px-2">
                <app-decision-tree />
              </div>
            </div>
          }
        }
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; }
    .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.95); }
      to { opacity: 1; transform: scale(1); }
    }
  `]
})
export default class ClarifyPage {
  public store = inject(ClarifyStore);
  
  constructor() {
    this.store.loadInbox();
  }
}
