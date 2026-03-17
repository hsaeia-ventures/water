import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { IconComponent } from '../shared/components/icon/icon';
import { ButtonComponent } from '../shared/components/button/button';

import { OmniFabComponent } from '../capture/components/omni-fab/omni-fab';
import { CaptureBottomSheetComponent } from '../capture/components/capture-bottom-sheet/capture-bottom-sheet';
import { CaptureSpotlightComponent } from '../capture/components/capture-spotlight/capture-spotlight';

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
    CaptureSpotlightComponent
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppShellComponent {
  // Inbox count could be a signal from a store later. For now, we mock it or keep it static.
  // We'll leave it ready to receive a signal.
}
