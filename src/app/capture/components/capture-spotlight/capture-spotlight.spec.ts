import { render, screen } from '@testing-library/angular';
import { CaptureSpotlightComponent } from './capture-spotlight';
import { CaptureUiService } from '../../services/capture-ui.service';
import { KeyboardShortcutService } from '../../../core/services/keyboard-shortcut.service';
import { signal } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { GhostTagService } from '../../services/ghost-tag.service';

describe('CaptureSpotlightComponent', () => {
  let mockUiService: { isOpen: any, captureMode: any, close: any };
  let mockShortcutService: { register: any };

  beforeEach(() => {
    mockUiService = {
      isOpen: signal(false),
      captureMode: signal('spotlight'),
      close: vi.fn()
    };
    mockShortcutService = { register: vi.fn() };
  });

  const setup = async () => {
    return render(CaptureSpotlightComponent, {
      providers: [
        { provide: CaptureUiService, useValue: mockUiService },
        { provide: KeyboardShortcutService, useValue: mockShortcutService },
        { provide: SpeechRecognitionService, useValue: { isAvailable: signal(true), isListening: signal(false), transcript: signal(''), toggle: vi.fn() } },
        { provide: GhostTagService, useValue: { parseText: vi.fn().mockReturnValue([]) } }
      ]
    });
  };

  it('should apply closed classes initially', async () => {
    await setup();
    const spotlight = screen.getByRole('dialog', { hidden: true });
    expect(spotlight).not.toHaveClass('spotlight--open');
  });

  it('should apply open classes and render input when UI opens in spotlight mode', async () => {
    const { fixture } = await setup();
    
    mockUiService.isOpen.set(true);
    mockUiService.captureMode.set('spotlight');
    fixture.detectChanges();

    const spotlight = screen.getByRole('dialog');
    expect(spotlight).toHaveClass('spotlight--open');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should NOT target open classes if UI opens but mode is bottom-sheet', async () => {
    const { fixture } = await setup();
    
    mockUiService.isOpen.set(true);
    mockUiService.captureMode.set('bottom-sheet');
    fixture.detectChanges();

    const spotlight = screen.getByRole('dialog', { hidden: true });
    expect(spotlight).not.toHaveClass('spotlight--open');
  });
});
