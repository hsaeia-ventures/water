import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureUiService } from '../../services/capture-ui.service';
import { CaptureInputComponent } from '../capture-input/capture-input';
import { BackdropComponent } from '../../../shared/components/backdrop/backdrop';
import { CaptureStore } from '../../services/capture.store';

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
  private store = inject(CaptureStore);
  
  protected isVisible = signal(false);

  constructor() {
    effect(() => {
      const shouldShow = this.captureUi.isOpen() && this.captureUi.captureMode() === 'spotlight';
      this.isVisible.set(shouldShow);
    });
  }

  public async handleCapture(text: string): Promise<void> {
    await this.store.addCapture(text);
    console.log('[Water] Desktop Capture saved offline');
    this.captureUi.close();
  }

  public close(): void {
    this.captureUi.close();
  }
}
