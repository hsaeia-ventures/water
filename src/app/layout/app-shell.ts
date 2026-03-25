import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { IconComponent } from '../shared/components/icon/icon';
import { ButtonComponent } from '../shared/components/button/button';
import { IndexedDbService } from '../core/services/indexed-db.service';

import { OmniFabComponent } from '../capture/components/omni-fab/omni-fab';
import { CaptureBottomSheetComponent } from '../capture/components/capture-bottom-sheet/capture-bottom-sheet';
import { CaptureSpotlightComponent } from '../capture/components/capture-spotlight/capture-spotlight';
import { InboxBadgeComponent } from '../capture/components/inbox-badge/inbox-badge';
import { SupabaseService } from '../core/services/supabase.service';
import { SidebarComponent } from './sidebar/sidebar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterLink, 
    RouterLinkActive, 
    IconComponent, 
    OmniFabComponent,
    CaptureBottomSheetComponent,
    CaptureSpotlightComponent,
    InboxBadgeComponent,
    SidebarComponent
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private supabase = inject(SupabaseService);
  private indexedDb = inject(IndexedDbService);
  private router = inject(Router);
  public isAuthenticated = this.supabase.isAuthenticated;

  async logout(): Promise<void> {
    try {
      await this.indexedDb.clearStore(this.indexedDb.STORE_GTD_ITEMS);
      await this.supabase.signOut();
      await this.router.navigate(['/login']);
    } catch (e) {
      console.error('[Water] Error al cerrar sesión', e);
    }
  }
}
