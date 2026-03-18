import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { CaptureInputComponent } from './capture-input';
import { HapticService } from '../../../core/services/haptic.service';

import { GhostTagService } from '../../services/ghost-tag.service';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { signal } from '@angular/core';

describe('CaptureInputComponent', () => {
  let mockHaptic: { success: any, error: any };
  let mockGhostTagService: { parseText: any };
  let mockSpeechService: { isAvailable: any, isListening: any, transcript: any, toggle: any };
  const user = userEvent.setup();

  beforeEach(() => {
    mockHaptic = {
      success: vi.fn(),
      error: vi.fn()
    };
    mockGhostTagService = {
      parseText: vi.fn().mockReturnValue([]) // Return empty tags by default
    };
    mockSpeechService = {
      isAvailable: signal(true),
      isListening: signal(false),
      transcript: signal(''),
      toggle: vi.fn()
    };
  });

  const setup = async () => {
    return render(CaptureInputComponent, {
      providers: [
        { provide: HapticService, useValue: mockHaptic },
        { provide: GhostTagService, useValue: mockGhostTagService },
        { provide: SpeechRecognitionService, useValue: mockSpeechService }
      ]
    });
  };

  it('should render textarea and submit button', async () => {
    await setup();
    expect(screen.getByRole('textbox', { name: /Entrada de captura/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Enviar captura/i })).toBeInTheDocument();
  });

  it('should submit text when clicking the button', async () => {
    const captureSpy = vi.fn();
    await render(CaptureInputComponent, {
      providers: [{ provide: HapticService, useValue: mockHaptic }],
      on: { capture: captureSpy }
    });

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Buy some milk');
    
    const submitBtn = screen.getByRole('button');
    await user.click(submitBtn);

    expect(captureSpy).toHaveBeenCalledWith('Buy some milk');
    expect(mockHaptic.success).toHaveBeenCalledTimes(1);
    expect(textarea).toHaveValue(''); // Resets after submit
  });

  it('should submit text when pressing Enter', async () => {
    const captureSpy = vi.fn();
    await render(CaptureInputComponent, {
      providers: [{ provide: HapticService, useValue: mockHaptic }],
      on: { capture: captureSpy }
    });

    const textarea = screen.getByRole('textbox');
    // Simular escritura y luego Enter
    await user.type(textarea, 'Call mom{Enter}');

    expect(captureSpy).toHaveBeenCalledWith('Call mom');
    expect(mockHaptic.success).toHaveBeenCalledTimes(1);
  });

  it('should NOT submit text on Shift+Enter (should allow new lines)', async () => {
    const captureSpy = vi.fn();
    await render(CaptureInputComponent, {
      providers: [{ provide: HapticService, useValue: mockHaptic }],
      on: { capture: captureSpy }
    });

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, 'Line 1{Shift>}{Enter}{/Shift}Line 2');

    expect(captureSpy).not.toHaveBeenCalled();
    expect(textarea).toHaveValue('Line 1\nLine 2');
  });

  it('should not submit empty strings or whitespace', async () => {
    const captureSpy = vi.fn();
    await render(CaptureInputComponent, {
      providers: [
        { provide: HapticService, useValue: mockHaptic },
        { provide: GhostTagService, useValue: mockGhostTagService },
        { provide: SpeechRecognitionService, useValue: mockSpeechService }
      ],
      on: { capture: captureSpy }
    });

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '   {Enter}');

    expect(captureSpy).not.toHaveBeenCalled();
    expect(mockHaptic.error).toHaveBeenCalledTimes(1);
  });

  describe('Speech Recognition', () => {
    it('should show mic button if speech is available', async () => {
      await setup();
      expect(screen.getByRole('button', { name: /Iniciar dictado por voz/i })).toBeInTheDocument();
    });

    it('should NOT show mic button if speech is NOT available', async () => {
      mockSpeechService.isAvailable.set(false);
      await setup();
      expect(screen.queryByRole('button', { name: /Iniciar dictado por voz/i })).not.toBeInTheDocument();
    });

    it('should toggle dictation on mic button click', async () => {
      await setup();
      const micBtn = screen.getByRole('button', { name: /Iniciar dictado por voz/i });
      
      await user.click(micBtn);
      
      expect(mockSpeechService.toggle).toHaveBeenCalledTimes(1);
    });

    it('should append transcript to existing textarea value when listening', async () => {
      const { fixture } = await setup();
      const textarea = screen.getByRole('textbox');
      
      // User types first
      await user.type(textarea, 'Base text');
      
      // Simulate click on mic button so it copies current base text
      const micBtn = screen.getByRole('button', { name: /Iniciar dictado/i });
      await user.click(micBtn);
      
      // Assume user started recording
      mockSpeechService.isListening.set(true);
      // Let's assume the user speaks and the signal updates
      mockSpeechService.transcript.set('more spoken text');
      
      TestBed.flushEffects();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(textarea).toHaveValue('Base text more spoken text');
    });
  });
});
