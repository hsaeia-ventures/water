import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { SupabaseService } from '../../core/services/supabase.service';
import { IndexedDbService } from '../../core/services/indexed-db.service';
import { OrganizeStore } from '../../organize/services/organize.store';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="w-full h-full flex flex-col gap-2 py-6 px-4 border-r border-zinc-800/50 bg-zinc-950/30">
      <div class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 px-3">Organizar</div>
      
      <!-- Contexts -->
      <a routerLink="/organize/contexts" routerLinkActive="bg-zinc-800/50 text-white" class="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M9.568 2.051a8 8 0 018.663 8.663m-5.467 4.135a5.5 5.5 0 0110.151 3.518m-14.864.884a4.5 4.5 0 017.348 2.046m2.522-8.487A3.5 3.5 0 0118 10a3.498 3.498 0 01.385-1.52m2.42-6.429a2.5 2.5 0 11-4.75 1.54 2.5 2.5 0 014.75-1.54zm-8.232 4.414A5.5 5.5 0 0111.455 3" /></svg>
        <span class="font-medium text-sm">Contextos</span>
        @if (contextsCount() > 0) {
          <span class="ml-auto bg-zinc-800 text-zinc-400 text-[10px] font-bold px-2 py-0.5 rounded-full">{{ contextsCount() }}</span>
        }
      </a>

      <!-- Calendar -->
      <a routerLink="/organize/calendar" routerLinkActive="bg-zinc-800/50 text-white" class="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5m-9-6h.008v.008H12v-.008zM12 15h.008v.008H12V15zm0 2.25h.008v.008H12v-.008zM9.75 15h.008v.008H9.75V15zm0 2.25h.008v.008H9.75v-.008zM7.5 15h.008v.008H7.5V15zm0 2.25h.008v.008H7.5v-.008zm6.75-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V15zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H16.5v-.008zm0 2.25h.008v.008H16.5V15z" /></svg>
        <span class="font-medium text-sm">Calendario</span>
      </a>

      <!-- Projects -->
      <a routerLink="/organize/projects" routerLinkActive="bg-zinc-800/50 text-white" class="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" /></svg>
        <span class="font-medium text-sm">Proyectos</span>
        @if (unhealthyProjectCount() > 0) {
          <span class="ml-auto bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full" title="Proyectos sin próximas acciones">{{ unhealthyProjectCount() }}</span>
        }
      </a>

      <!-- Waiting -->
      <a routerLink="/organize/waiting" routerLinkActive="bg-zinc-800/50 text-white" class="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        <span class="font-medium text-sm">A la Espera</span>
        @if (urgentWaitingCount() > 0) {
          <span class="ml-auto bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]" title="Elementos que superan los 7 días">{{ urgentWaitingCount() }}</span>
        }
      </a>

      <!-- Someday -->
      <a routerLink="/organize/someday" routerLinkActive="bg-zinc-800/50 text-white" class="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
        <span class="font-medium text-sm">Incubadora</span>
      </a>
      
      <!-- Spacer -->
      <div class="flex-1"></div>

      <!-- Separator -->
      <hr class="border-zinc-800/60 my-1" />

      <!-- Logout -->
      <button
        (click)="logout()"
        aria-label="Cerrar sesión"
        class="flex items-center gap-3 px-3 py-2 rounded-xl text-zinc-500 hover:text-red-400 hover:bg-red-950/30 transition-colors w-full text-left">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
        </svg>
        <span class="font-medium text-sm">Cerrar sesión</span>
      </button>
    </nav>
  `
})
export class SidebarComponent {
  private supabase = inject(SupabaseService);
  private indexedDb = inject(IndexedDbService);
  private router = inject(Router);
  public store = inject(OrganizeStore);

  public contextsCount = computed(() => {
    return this.store.groupedByContext().filter(g => g.context !== 'Sin contexto').length;
  });

  public unhealthyProjectCount = this.store.unhealthyProjectCount;
  public urgentWaitingCount = this.store.urgentWaitingCount;

  async logout(): Promise<void> {
    try {
      await this.indexedDb.clearStore(this.indexedDb.STORE_GTD_ITEMS);
      await this.supabase.signOut();
      await this.router.navigate(['/auth/login']);
    } catch (e) {
      console.error('[Water] Error al cerrar sesión', e);
    }
  }
}
