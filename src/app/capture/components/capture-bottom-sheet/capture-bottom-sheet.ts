import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureUiService } from '../../services/capture-ui.service';
import { CaptureInputComponent } from '../capture-input/capture-input';
import { BackdropComponent } from '../../../shared/components/backdrop/backdrop';

@Component({
  selector: 'app-capture-bottom-sheet',
  standalone: true,
  imports: [CommonModule, CaptureInputComponent, BackdropComponent],
  templateUrl: './capture-bottom-sheet.html',
  styleUrl: './capture-bottom-sheet.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureBottomSheetComponent {
  public captureUi = inject(CaptureUiService);
  
  // Track visibility for the CSS transition
  protected isVisible = signal(false);

  constructor() {
    effect(() => {
      // Solo es visible si el UI está abierto y el modo es bottom-sheet
      const shouldShow = this.captureUi.isOpen() && this.captureUi.captureMode() === 'bottom-sheet';
      this.isVisible.set(shouldShow);
    });
  }

  public handleCapture(text: string): void {
    console.log('[Water] Mobile Capture:', text);
    // In future: push to InboxStore
    this.captureUi.close();
  }

  public close(): void {
    this.captureUi.close();
  }
}
