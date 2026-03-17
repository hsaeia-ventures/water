import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureUiService } from '../../services/capture-ui.service';
import { CaptureInputComponent } from '../capture-input/capture-input';
import { BackdropComponent } from '../../../shared/components/backdrop/backdrop';

@Component({
  selector: 'app-capture-spotlight',
  standalone: true,
  imports: [CommonModule, CaptureInputComponent, BackdropComponent],
  templateUrl: './capture-spotlight.html',
  styleUrl: './capture-spotlight.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureSpotlightComponent {
  public captureUi = inject(CaptureUiService);
  
  protected isVisible = signal(false);

  constructor() {
    effect(() => {
      const shouldShow = this.captureUi.isOpen() && this.captureUi.captureMode() === 'spotlight';
      this.isVisible.set(shouldShow);
    });
  }

  public handleCapture(text: string): void {
    console.log('[Water] Desktop Capture:', text);
    // In future: push to InboxStore
    this.captureUi.close();
  }

  public close(): void {
    this.captureUi.close();
  }
}
