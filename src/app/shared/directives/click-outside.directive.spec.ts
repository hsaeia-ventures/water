import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ClickOutsideDirective } from './click-outside.directive';

describe('ClickOutsideDirective', () => {
  const user = userEvent.setup();

  it('should emit clickOutside when clicking outside the host element', async () => {
    const onClickOutside = vi.fn();

    await render(
      `<div>
        <button data-testid="outside-btn">Fuera</button>
        <div appClickOutside (clickOutside)="onClickOutside()">
          <span>Dentro</span>
        </div>
      </div>`,
      {
        imports: [ClickOutsideDirective],
        componentProperties: { onClickOutside },
      }
    );

    // Wait for setTimeout in directive
    await new Promise((resolve) => setTimeout(resolve, 20));

    await user.click(screen.getByTestId('outside-btn'));

    expect(onClickOutside).toHaveBeenCalledTimes(1);
  });

  it('should NOT emit when clicking inside the host element', async () => {
    const onClickOutside = vi.fn();

    await render(
      `<div>
        <button data-testid="outside-btn">Fuera</button>
        <div appClickOutside (clickOutside)="onClickOutside()">
          <span>Dentro del host</span>
        </div>
      </div>`,
      {
        imports: [ClickOutsideDirective],
        componentProperties: { onClickOutside },
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 20));

    await user.click(screen.getByText('Dentro del host'));

    expect(onClickOutside).not.toHaveBeenCalled();
  });
});
