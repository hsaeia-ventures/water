import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../core/services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4">
      <div class="w-full max-w-sm flex flex-col items-center">
        <!-- Logo / Intro -->
        <div class="w-16 h-16 rounded-full bg-teal-500/10 flex items-center justify-center mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-teal-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.042 21.672 13.684 16.6m0 0-2.51 2.225.569-9.47 5.227 7.917-3.286-.672ZM12 2.25V4.5m5.834.166-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243-1.59-1.59" />
          </svg>
        </div>
        
        <h1 class="text-3xl font-light tracking-tight text-white mb-2">Entra a Water</h1>
        <p class="text-zinc-400 text-center mb-8">Envía tu email y te mandaremos un enlace mágico para entrar sin contraseñas.</p>
        
        <!-- Form -->
        <div class="w-full relative">
          <input 
            type="email" 
            [(ngModel)]="email"
            placeholder="tu@email.com" 
            class="w-full bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all shadow-inner"
            [disabled]="loading()"
            (keydown.enter)="handleLogin()"
          />
          
          <button 
            (click)="handleLogin()"
            [disabled]="loading() || !email()"
            class="absolute right-2 top-2 bottom-2 bg-teal-500 text-zinc-950 font-medium px-4 rounded-xl hover:bg-teal-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center min-w-[100px]"
          >
            @if(loading()) {
              <svg class="animate-spin h-5 w-5 text-zinc-950" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            } @else {
              <span>Enviar Link</span>
            }
          </button>
        </div>
        
        @if(message()) {
          <p class="mt-6 text-center text-sm" [ngClass]="isError() ? 'text-red-400' : 'text-teal-400'">
            {{ message() }}
          </p>
        }
      </div>
    </div>
  `
})
export default class LoginPage {
  private supabase = inject(SupabaseService);
  
  public email = signal('');
  public loading = signal(false);
  public message = signal('');
  public isError = signal(false);

  async handleLogin() {
    if (!this.email()) return;
    
    this.loading.set(true);
    this.message.set('');
    
    const { error } = await this.supabase.signIn(this.email());
    
    if (error) {
      this.isError.set(true);
      this.message.set(error.message);
    } else {
      this.isError.set(false);
      this.message.set('¡Enlace mágico enviado! Revisa tu bandeja de entrada.');
      this.email.set('');
    }
    
    this.loading.set(false);
  }
}
