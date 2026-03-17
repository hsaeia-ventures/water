import { Component, ChangeDetectionStrategy, output, signal, computed, ViewChild, ElementRef, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AutoFocusDirective } from '../../../shared/directives/auto-focus.directive';
import { ButtonComponent } from '../../../shared/components/button/button';
import { HapticService } from '../../../core/services/haptic.service';
import { GhostTagsComponent } from '../ghost-tags/ghost-tags';
import { GhostTagService } from '../../services/ghost-tag.service';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';

@Component({
  selector: 'app-capture-input',
  standalone: true,
  imports: [CommonModule, FormsModule, AutoFocusDirective, ButtonComponent, GhostTagsComponent],
  templateUrl: './capture-input.html',
  styleUrl: './capture-input.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CaptureInputComponent {
  public capture = output<string>();
  public text = signal<string>('');
  
  private haptic = inject(HapticService);
  private ghostTagService = inject(GhostTagService);
  public speechService = inject(SpeechRecognitionService); // Expose to template for state binding

  // Almacena el texto base que había antes de presionar el micrófono
  private textBeforeDictation = '';

  // Computamos las etiquetas mágicas a partir del texto que el usuario escribe
  public ghostTags = computed(() => this.ghostTagService.parseText(this.text()));

  @ViewChild('textareaRef') textareaRef?: ElementRef<HTMLTextAreaElement>;

  constructor() {
    effect(() => {
      // Sync the Web Speech interim transcript into the textarea
      if (this.speechService.isListening()) {
        const spoken = this.speechService.transcript();
        if (spoken) {
          const space = this.textBeforeDictation ? ' ' : '';
          this.text.set(this.textBeforeDictation + space + spoken);
          
          // Force height readjustment
          if (this.textareaRef) {
            this.adjustHeight(this.textareaRef.nativeElement);
          }
        }
      }
    });
  }

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

  public toggleDictation(): void {
    if (!this.speechService.isListening()) {
      // Guardamos la base actual antes de dictar para que no se borre
      this.textBeforeDictation = this.text().trim();
    }
    this.speechService.toggle();
  }

  private adjustHeight(element: HTMLTextAreaElement): void {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }
}
