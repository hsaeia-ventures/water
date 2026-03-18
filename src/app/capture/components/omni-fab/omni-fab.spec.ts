import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TestBed } from '@angular/core/testing';
import { OmniFabComponent } from './omni-fab';
import { CaptureUiService } from '../../services/capture-ui.service';
import { HapticService } from '../../../core/services/haptic.service';
import { PlatformService } from '../../../core/services/platform.service';
import { signal } from '@angular/core';

describe('OmniFabComponent', () => {
  let mockCaptureUi: { toggle: any, isOpen: any };
  let mockHaptic: { tap: any };
  let mockPlatform: { isMobile: any };

  beforeEach(() => {
    mockCaptureUi = {
      toggle: vi.fn(),
      isOpen: signal(false)
    };
    mockHaptic = { tap: vi.fn() };
    mockPlatform = { isMobile: signal(true) }; // Esencial para que renderice
  });

  const setup = async () => {
    return render(OmniFabComponent, {
      providers: [
        { provide: CaptureUiService, useValue: mockCaptureUi },
        { provide: HapticService, useValue: mockHaptic },
        { provide: PlatformService, useValue: mockPlatform }
      ]
    });
  };

  it('should render the fab button when on mobile', async () => {
    await setup();
    expect(screen.getByRole('button', { name: /Abrir panel de captura/i })).toBeInTheDocument();
  });

  it('should NOT render the fab button when on desktop', async () => {
    mockPlatform.isMobile.set(false);
    await setup();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('should call Haptic.tap() and CaptureUI.toggle() on click', async () => {
    await setup();
    const btn = screen.getByRole('button');
    
    await userEvent.click(btn);
    
    expect(mockHaptic.tap).toHaveBeenCalledTimes(1);
    expect(mockCaptureUi.toggle).toHaveBeenCalledTimes(1);
  });

  it('should reflect active class when CaptureUI is open', async () => {
    const { fixture } = await setup();
    const btn = screen.getByRole('button');
    
    // Al principio está false
    expect(btn).not.toHaveClass('omni-fab--active');

    // Modificamos reactivamente el mock
    mockCaptureUi.isOpen.set(true);
    fixture.detectChanges(); // Angular actualice vista base signals

    expect(btn).toHaveClass('omni-fab--active');
  });
});
