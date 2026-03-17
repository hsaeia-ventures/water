import { TestBed } from '@angular/core/testing';
import { HapticService } from './haptic.service';

describe('HapticService', () => {
  let service: HapticService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HapticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should detect Vibration API availability', () => {
    expect(typeof service.isAvailable).toBe('boolean');
  });

  it('should call navigator.vibrate on tap() if available', () => {
    if ('vibrate' in navigator) {
      const spy = vi.spyOn(navigator, 'vibrate').mockReturnValue(true);
      service.tap();
      expect(spy).toHaveBeenCalledWith(10);
      spy.mockRestore();
    }
  });

  it('should call navigator.vibrate with pattern on success()', () => {
    if ('vibrate' in navigator) {
      const spy = vi.spyOn(navigator, 'vibrate').mockReturnValue(true);
      service.success();
      expect(spy).toHaveBeenCalledWith([10, 50, 10]);
      spy.mockRestore();
    }
  });

  it('should call navigator.vibrate with pattern on error()', () => {
    if ('vibrate' in navigator) {
      const spy = vi.spyOn(navigator, 'vibrate').mockReturnValue(true);
      service.error();
      expect(spy).toHaveBeenCalledWith([50, 30, 50]);
      spy.mockRestore();
    }
  });

  it('should not throw when Vibration API is unavailable', () => {
    // Even if vibrate doesn't exist, calling methods should be safe
    expect(() => service.vibrate(10)).not.toThrow();
    expect(() => service.tap()).not.toThrow();
    expect(() => service.success()).not.toThrow();
    expect(() => service.error()).not.toThrow();
  });
});
