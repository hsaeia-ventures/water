import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
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
        <p class="text-zinc-400 text-center mb-8">Inicia sesión con tu cuenta de Google para continuar.</p>
        
        <!-- Google Sign-In Button -->
        <button 
          (click)="handleLogin()"
          [disabled]="loading()"
          class="w-full flex items-center justify-center gap-3 bg-white text-zinc-800 font-medium px-5 py-4 rounded-2xl hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
        >
          @if(loading()) {
            <svg class="animate-spin h-5 w-5 text-zinc-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Redirigiendo…</span>
          } @else {
            <!-- Google Logo -->
            <svg viewBox="0 0 24 24" class="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Continuar con Google</span>
          }
        </button>
        
        @if(errorMsg()) {
          <p class="mt-6 text-center text-sm text-red-400">
            {{ errorMsg() }}
          </p>
        }
      </div>
    </div>
  `
})
export default class LoginPage {
  private supabase = inject(SupabaseService);
  
  public loading = signal(false);
  public errorMsg = signal('');

  async handleLogin() {
    this.loading.set(true);
    this.errorMsg.set('');
    
    const { error } = await this.supabase.signInWithGoogle();
    
    if (error) {
      this.errorMsg.set(error.message);
      this.loading.set(false);
    }
    // If success, Supabase redirects to Google — no further action needed here
  }
}

