import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../shared/components/icon/icon';
import { ButtonComponent } from '../shared/components/button/button';

import { OmniFabComponent } from '../capture/components/omni-fab/omni-fab';
import { CaptureBottomSheetComponent } from '../capture/components/capture-bottom-sheet/capture-bottom-sheet';
import { CaptureSpotlightComponent } from '../capture/components/capture-spotlight/capture-spotlight';
import { InboxBadgeComponent } from '../capture/components/inbox-badge/inbox-badge';
import { SupabaseService } from '../core/services/supabase.service';

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
    InboxBadgeComponent
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  private supabase = inject(SupabaseService);
  public isAuthenticated = this.supabase.isAuthenticated;
}
