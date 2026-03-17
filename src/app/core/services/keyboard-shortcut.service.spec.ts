import { TestBed } from '@angular/core/testing';
import { KeyboardShortcutService } from './keyboard-shortcut.service';

describe('KeyboardShortcutService', () => {
  let service: KeyboardShortcutService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KeyboardShortcutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register a shortcut', () => {
    const handler = vi.fn();
    service.register({ combo: 'ctrl+k', handler });
    expect(service.has('ctrl+k')).toBe(true);
  });

  it('should normalize different modifier names to the same combo', () => {
    const handler = vi.fn();
    service.register({ combo: 'Meta+K', handler });

    // 'meta+k', 'ctrl+k', 'cmd+k' should all normalize to 'mod+k'
    expect(service.has('ctrl+k')).toBe(true);
    expect(service.has('cmd+k')).toBe(true);
    expect(service.has('meta+k')).toBe(true);
  });

  it('should fire handler on matching keydown event', () => {
    const handler = vi.fn();
    service.register({ combo: 'ctrl+k', handler });

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should also fire for metaKey (mac Cmd)', () => {
    const handler = vi.fn();
    service.register({ combo: 'meta+k', handler });

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });

  it('should not fire handler for non-matching keydown', () => {
    const handler = vi.fn();
    service.register({ combo: 'ctrl+k', handler });

    const event = new KeyboardEvent('keydown', {
      key: 'j',
      ctrlKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).not.toHaveBeenCalled();
  });

  it('should unregister a shortcut via returned function', () => {
    const handler = vi.fn();
    const unregister = service.register({ combo: 'ctrl+k', handler });

    expect(service.has('ctrl+k')).toBe(true);
    unregister();
    expect(service.has('ctrl+k')).toBe(false);
  });

  it('should unregister a shortcut via unregister method', () => {
    const handler = vi.fn();
    service.register({ combo: 'ctrl+k', handler });
    service.unregister('ctrl+k');
    expect(service.has('ctrl+k')).toBe(false);
  });

  it('should register simple key shortcut like Escape', () => {
    const handler = vi.fn();
    service.register({ combo: 'escape', handler });

    const event = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(handler).toHaveBeenCalledTimes(1);
  });
});
