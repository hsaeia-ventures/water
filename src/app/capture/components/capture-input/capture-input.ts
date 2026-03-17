import { Component, ChangeDetectionStrategy, output, signal, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoFocusDirective } from '../../../shared/directives/auto-focus.directive';
import { ButtonComponent } from '../../../shared/components/button/button';
import { HapticService } from '../../../core/services/haptic.service';

@Component({
  selector: 'app-capture-input',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoFocusDirective, ButtonComponent],
  templateUrl: './capture-input.html',
  styleUrl: './capture-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureInputComponent {
  public capture = output<string>();
  public text = signal<string>('');
  
  private haptic = inject(HapticService);

  @ViewChild('textareaRef') textareaRef?: ElementRef<HTMLTextAreaElement>;

  public onInput(event: Event): void {
    const target = event.target as HTMLTextAreaElement;
    this.text.set(target.value);
    this.adjustHeight(target);
  }

  public onKeydown(event: KeyboardEvent): void {
    // Si presiona Enter (sin Shift), enviar la captura
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // evitar salto de línea
      this.submit();
    }
  }

  public submit(): void {
    const val = this.text().trim();
    if (val) {
      this.haptic.success();
      this.capture.emit(val);
      this.text.set('');
      
      // Reset height
      if (this.textareaRef) {
        this.textareaRef.nativeElement.style.height = 'auto';
      }
    } else {
      this.haptic.error();
    }
  }

  private adjustHeight(element: HTMLTextAreaElement): void {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }
}
