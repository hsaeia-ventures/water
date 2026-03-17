import { TestBed } from '@angular/core/testing';
import { SpeechRecognitionService } from './speech-recognition.service';

describe('SpeechRecognitionService', () => {
  let service: SpeechRecognitionService;
  let originalWebkit: any;
  let mockRecognitionInstance: any;

  beforeEach(() => {
    originalWebkit = (window as any).webkitSpeechRecognition;

    // Crear un mock básico de webkitSpeechRecognition
    mockRecognitionInstance = {
      start: vi.fn(),
      stop: vi.fn(),
      continuous: false,
      interimResults: false,
      onstart: null,
      onresult: null,
      onerror: null,
      onend: null
    };

    class MockRecognition {
      constructor() { return mockRecognitionInstance; }
    }

    (window as any).webkitSpeechRecognition = MockRecognition;

    TestBed.configureTestingModule({});
    service = TestBed.inject(SpeechRecognitionService);
  });

  afterEach(() => {
    // Restaurar entorno
    (window as any).webkitSpeechRecognition = originalWebkit;
  });

  it('should be created and marked as available if API is supported', () => {
    expect(service).toBeTruthy();
    expect(service.isAvailable()).toBe(true);
    expect(service.isListening()).toBe(false);
  });

  it('should mark as unavailable if API is NOT supported', () => {
    (window as any).webkitSpeechRecognition = undefined;
    (window as any).SpeechRecognition = undefined;
    
    const isolatedService = TestBed.runInInjectionContext(() => new SpeechRecognitionService());
    
    expect(isolatedService.isAvailable()).toBe(false);
  });

  it('should start listening and update state', () => {
    service.start();
    expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(1);
    
    // Simulate API firing its start event
    mockRecognitionInstance.onstart();
    expect(service.isListening()).toBe(true);
  });

  it('should correctly process transcript strings from API events', () => {
    // Given listening state
    mockRecognitionInstance.onstart();
    
    // Simulate browser dispatching interim result event
    const fakeEvent = {
      resultIndex: 0,
      results: [
        [{ transcript: 'hola ' }] // The shape the API returns
      ]
    };
    
    mockRecognitionInstance.onresult(fakeEvent);
    expect(service.transcript()).toBe('hola ');
  });

  it('should handle API errors and stop listening gracefully', () => {
    mockRecognitionInstance.onstart();
    expect(service.isListening()).toBe(true);
    
    mockRecognitionInstance.onerror({ error: 'not-allowed' });
    expect(service.isListening()).toBe(false);
  });
});
