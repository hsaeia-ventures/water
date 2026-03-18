import { TestBed } from '@angular/core/testing';
import { CaptureUiService } from './capture-ui.service';
import { PlatformService } from '../../core/services/platform.service';
import { KeyboardShortcutService } from '../../core/services/keyboard-shortcut.service';
import { signal } from '@angular/core';

describe('CaptureUiService', () => {
  let service: CaptureUiService;
  let mockPlatformService: { isMobile: ReturnType<typeof signal> };
  let mockShortcutService: { register: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    mockPlatformService = {
      isMobile: signal(false)
    };
    
    mockShortcutService = {
      register: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        CaptureUiService,
        { provide: PlatformService, useValue: mockPlatformService },
        { provide: KeyboardShortcutService, useValue: mockShortcutService }
      ]
    });

    service = TestBed.inject(CaptureUiService);
  });

  it('should be created in closed state initially', () => {
    expect(service.isOpen()).toBe(false);
  });

  it('should open, close and toggle correctly', () => {
    service.open();
    expect(service.isOpen()).toBe(true);

    service.close();
    expect(service.isOpen()).toBe(false);

    service.toggle();
    expect(service.isOpen()).toBe(true);
  });

  it('should correctly derive captureMode based on viewport', () => {
    // Escenario 1: Desktop
    mockPlatformService.isMobile.set(false);
    expect(service.captureMode()).toBe('spotlight');

    // Escenario 2: Mobile
    mockPlatformService.isMobile.set(true);
    // Angular signals son reaccionarias, force un tick de la lectura
    expect(service.captureMode()).toBe('bottom-sheet');
  });

  it('should have registered mod+k and Escape shortcuts on init', () => {
    // Expected arguments are objects with `combo` property
    expect(mockShortcutService.register).toHaveBeenCalledWith(expect.objectContaining({ combo: 'mod+k' }));
    expect(mockShortcutService.register).toHaveBeenCalledWith(expect.objectContaining({ combo: 'Escape' }));
  });

  it('shortcut mod+k should toggle the ui state', () => {
    // Recuperar el callback de mod+k
    const modkConfig = mockShortcutService.register.mock.calls.find(c => c[0].combo === 'mod+k')![0];
    const toggleCb = modkConfig.handler;
    
    expect(service.isOpen()).toBe(false);
    toggleCb(new KeyboardEvent('keydown'));
    expect(service.isOpen()).toBe(true);
  });

  it('shortcut Escape should close the ui state if open', () => {
    const escConfig = mockShortcutService.register.mock.calls.find(c => c[0].combo === 'Escape')![0];
    const escCb = escConfig.handler;
    
    // Está cerrado, no pasa nada
    escCb(new Event('keydown'));
    expect(service.isOpen()).toBe(false);

    // Lo abrimos
    service.open();
    expect(service.isOpen()).toBe(true);

    // Esc cierra
    escCb(new Event('keydown'));
    expect(service.isOpen()).toBe(false);
  });
});
