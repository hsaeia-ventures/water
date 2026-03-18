import { render, screen } from '@testing-library/angular';
import { CaptureBottomSheetComponent } from './capture-bottom-sheet';
import { CaptureUiService } from '../../services/capture-ui.service';
import { KeyboardShortcutService } from '../../../core/services/keyboard-shortcut.service';
import { signal } from '@angular/core';
import { SpeechRecognitionService } from '../../services/speech-recognition.service';
import { GhostTagService } from '../../services/ghost-tag.service';

describe('CaptureBottomSheetComponent', () => {
  let mockUiService: { isOpen: any, captureMode: any, close: any };
  let mockShortcutService: { register: any };

  beforeEach(() => {
    mockUiService = {
      isOpen: signal(false),
      captureMode: signal('bottom-sheet'),
      close: vi.fn()
    };
    mockShortcutService = { register: vi.fn() };
  });

  const setup = async () => {
    return render(CaptureBottomSheetComponent, {
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
    const sheet = screen.getByRole('dialog', { hidden: true });
    expect(sheet).not.toHaveClass('bottom-sheet--open');
  });

  it('should apply open classes and render input when UI opens in bottom-sheet mode', async () => {
    const { fixture } = await setup();
    
    mockUiService.isOpen.set(true);
    mockUiService.captureMode.set('bottom-sheet');
    fixture.detectChanges();

    const sheet = screen.getByRole('dialog');
    expect(sheet).toHaveClass('bottom-sheet--open');
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should NOT apply open classes if UI opens but mode is spotlight', async () => {
    const { fixture } = await setup();
    
    mockUiService.isOpen.set(true);
    mockUiService.captureMode.set('spotlight');
    fixture.detectChanges();

    const sheet = screen.getByRole('dialog', { hidden: true });
    expect(sheet).not.toHaveClass('bottom-sheet--open');
  });
});
