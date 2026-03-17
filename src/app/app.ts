import { Component, signal } from '@angular/core';
import { IconComponent } from './shared/components/icon/icon';
import { ButtonComponent } from './shared/components/button/button';
import { ChipComponent } from './shared/components/chip/chip';
import { EmptyStateComponent } from './shared/components/empty-state/empty-state';
import { BackdropComponent } from './shared/components/backdrop/backdrop';
import { RelativeTimePipe } from './shared/pipes/relative-time.pipe';
import { TruncatePipe } from './shared/pipes/truncate.pipe';

@Component({
  selector: 'app-root',
  imports: [
    IconComponent,
    ButtonComponent,
    ChipComponent,
    EmptyStateComponent,
    BackdropComponent,
    RelativeTimePipe,
    TruncatePipe,
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly showBackdrop = signal(false);
  protected readonly now = new Date();
  protected readonly fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
  protected readonly twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
  protected readonly longText = signal(
    'Este es un texto largo de ejemplo para demostrar cómo funciona el pipe de truncado en la interfaz de usuario de AppGTD'
  );

  protected toggleBackdrop(): void {
    this.showBackdrop.update((v) => !v);
  }
}
