import { render } from '@testing-library/angular';
import { AutoFocusDirective } from './auto-focus.directive';

describe('AutoFocusDirective', () => {
  it('should focus the input element after rendering', async () => {
    await render('<input data-testid="focus-target" appAutoFocus />', {
      imports: [AutoFocusDirective],
    });

    // Wait for requestAnimationFrame
    await new Promise((resolve) => requestAnimationFrame(resolve));

    const input = document.querySelector('[data-testid="focus-target"]') as HTMLElement;
    expect(input).toHaveFocus();
  });

  it('should delay focus when autoFocusDelay is set', async () => {
    await render('<input data-testid="delayed-focus" appAutoFocus [autoFocusDelay]="50" />', {
      imports: [AutoFocusDirective],
    });

    const input = document.querySelector('[data-testid="delayed-focus"]') as HTMLElement;

    // Should NOT be focused immediately
    expect(input).not.toHaveFocus();

    // Wait for the delay + buffer
    await new Promise((resolve) => setTimeout(resolve, 100));

    expect(input).toHaveFocus();
  });

  it('should focus a textarea as well', async () => {
    await render('<textarea data-testid="textarea-focus" appAutoFocus></textarea>', {
      imports: [AutoFocusDirective],
    });

    await new Promise((resolve) => requestAnimationFrame(resolve));

    const textarea = document.querySelector('[data-testid="textarea-focus"]') as HTMLElement;
    expect(textarea).toHaveFocus();
  });
});
