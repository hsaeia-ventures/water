import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { CaptureInputComponent } from './capture-input';
import { HapticService } from '../../../core/services/haptic.service';

describe('CaptureInputComponent', () => {
  let mockHaptic: { success: any, error: any };
  const user = userEvent.setup();

  beforeEach(() => {
    mockHaptic = {
      success: vi.fn(),
      error: vi.fn()
    };
  });

  const setup = async () => {
    return render(CaptureInputComponent, {
      providers: [
        { provide: HapticService, useValue: mockHaptic }
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
      providers: [{ provide: HapticService, useValue: mockHaptic }],
      on: { capture: captureSpy }
    });

    const textarea = screen.getByRole('textbox');
    await user.type(textarea, '   {Enter}');

    expect(captureSpy).not.toHaveBeenCalled();
    expect(mockHaptic.error).toHaveBeenCalledTimes(1);
  });
});
