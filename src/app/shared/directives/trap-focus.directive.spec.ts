import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { TrapFocusDirective } from './trap-focus.directive';

describe('TrapFocusDirective', () => {
  const user = userEvent.setup();

  it('should keep focus within the container when tabbing forward from last element', async () => {
    await render(
      `<div appTrapFocus>
        <button>Primero</button>
        <input placeholder="Campo medio" />
        <button>Último</button>
      </div>`,
      { imports: [TrapFocusDirective] }
    );

    // Focus the last button
    screen.getByText('Último').focus();
    expect(screen.getByText('Último')).toHaveFocus();

    // Tab forward → should wrap to first
    await user.tab();

    expect(screen.getByText('Primero')).toHaveFocus();
  });

  it('should keep focus within the container when tabbing backward from first element', async () => {
    await render(
      `<div appTrapFocus>
        <button>Primero</button>
        <input placeholder="Campo medio" />
        <button>Último</button>
      </div>`,
      { imports: [TrapFocusDirective] }
    );

    // Focus the first button
    screen.getByText('Primero').focus();
    expect(screen.getByText('Primero')).toHaveFocus();

    // Shift+Tab backward → should wrap to last
    await user.tab({ shift: true });

    expect(screen.getByText('Último')).toHaveFocus();
  });

  it('should allow normal tabbing between middle elements', async () => {
    await render(
      `<div appTrapFocus>
        <button>Primero</button>
        <button>Segundo</button>
        <button>Tercero</button>
      </div>`,
      { imports: [TrapFocusDirective] }
    );

    // Focus the first
    screen.getByText('Primero').focus();
    expect(screen.getByText('Primero')).toHaveFocus();

    // Tab forward → should go to Segundo (normal behavior, not trapped)
    await user.tab();

    expect(screen.getByText('Segundo')).toHaveFocus();
  });
});
