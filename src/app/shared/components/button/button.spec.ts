import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { ButtonComponent } from './button';

describe('ButtonComponent', () => {
  const user = userEvent.setup();

  it('should render a button with primary variant by default', async () => {
    await render(ButtonComponent);

    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('btn-primary');
  });

  it('should render ghost variant', async () => {
    await render(ButtonComponent, {
      inputs: { variant: 'ghost' },
    });

    expect(screen.getByRole('button')).toHaveClass('btn-ghost');
  });

  it('should render icon-only variant with an icon', async () => {
    await render(ButtonComponent, {
      inputs: { variant: 'icon-only', iconName: 'plus' },
    });

    const button = screen.getByRole('button');
    expect(button).toHaveClass('btn-icon-only');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should be disabled when disabled input is true', async () => {
    await render(ButtonComponent, {
      inputs: { disabled: true },
    });

    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('should show a loading spinner when loading', async () => {
    const { container } = await render(ButtonComponent, {
      inputs: { loading: true },
    });

    expect(container.querySelector('.btn-spinner')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-busy', 'true');
  });

  it('should not show spinner when not loading', async () => {
    const { container } = await render(ButtonComponent, {
      inputs: { loading: false },
    });

    expect(container.querySelector('.btn-spinner')).not.toBeInTheDocument();
  });

  it('should render an icon when iconName is provided', async () => {
    await render(ButtonComponent, {
      inputs: { iconName: 'send' },
    });

    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).toBeInTheDocument();
  });

  it('should not render an icon when iconName is not provided', async () => {
    await render(ButtonComponent);

    const button = screen.getByRole('button');
    expect(button.querySelector('svg')).not.toBeInTheDocument();
  });

  it('should have type="button" by default', async () => {
    await render(ButtonComponent);

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should be clickable when not disabled', async () => {
    const clickSpy = vi.fn();
    await render(ButtonComponent, {
      inputs: { disabled: false },
    });

    const button = screen.getByRole('button');
    button.addEventListener('click', clickSpy);
    await user.click(button);

    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it('should not be clickable when disabled', async () => {
    const clickSpy = vi.fn();
    await render(ButtonComponent, {
      inputs: { disabled: true },
    });

    const button = screen.getByRole('button');
    button.addEventListener('click', clickSpy);
    await user.click(button);

    expect(clickSpy).not.toHaveBeenCalled();
  });
});
