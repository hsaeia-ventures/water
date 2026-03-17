import { Injectable, signal, NgZone, inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpeechRecognitionService {
  private zone = inject(NgZone);

  // Señales expuestas para la UI
  public isAvailable = signal<boolean>(false);
  public isListening = signal<boolean>(false);
  
  // Mantenemos el texto transcrito actual en una señal
  public transcript = signal<string>('');

  private recognition: any = null;

  constructor() {
    this.initRecognition();
  }

  private initRecognition(): void {
    // Verificamos si la API de Web Speech está disponible
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      this.isAvailable.set(true);
      this.recognition = new SpeechRecognition();
      
      // Configuración: 
      // continuous = false (para que se detenga automáticamdnte tras hablar)
      // interimResults = true (para ver cómo se escribe en vivo)
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'es-ES'; // O dinámico basado en navegador

      // Manejo de eventos (envueltos en NgZone para que Angular actualice bindings de inmediato)
      this.recognition.onstart = () => {
        this.zone.run(() => {
          this.isListening.set(true);
          this.transcript.set('');
        });
      };

      this.recognition.onresult = (event: any) => {
        this.zone.run(() => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            currentTranscript += event.results[i][0].transcript;
          }
          this.transcript.set(currentTranscript);
        });
      };

      this.recognition.onerror = (event: any) => {
        console.warn('[Water] Speech Recognition error:', event.error);
        this.zone.run(() => {
          this.isListening.set(false);
        });
      };

      this.recognition.onend = () => {
        this.zone.run(() => {
          this.isListening.set(false);
        });
      };
    } else {
      this.isAvailable.set(false);
    }
  }

  public start(): void {
    if (!this.isAvailable() || !this.recognition) return;
    
    if (this.isListening()) {
      this.stop();
      return;
    }

    try {
      this.recognition.start();
    } catch (e) {
      console.error('[Water] Error al iniciar dictado:', e);
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening()) {
      this.recognition.stop();
    }
  }

  public toggle(): void {
    if (this.isListening()) {
      this.stop();
    } else {
      this.start();
    }
  }
}
