import { render, screen } from '@testing-library/angular';
import userEvent from '@testing-library/user-event';
import { BackdropComponent } from './backdrop';

describe('BackdropComponent', () => {
  const user = userEvent.setup();

  it('should not render overlay when not visible', async () => {
    await render(BackdropComponent, {
      inputs: { visible: false },
    });

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('should render overlay when visible', async () => {
    await render(BackdropComponent, {
      inputs: { visible: true },
    });

    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('should emit backdropClick when the overlay is clicked', async () => {
    const onBackdropClick = vi.fn();
    await render(BackdropComponent, {
      inputs: { visible: true },
      on: { backdropClick: onBackdropClick },
    });

    await user.click(screen.getByRole('presentation'));

    expect(onBackdropClick).toHaveBeenCalledTimes(1);
  });

  it('should show and hide based on visible input', async () => {
    const { fixture } = await render(BackdropComponent, {
      inputs: { visible: false },
    });

    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();

    fixture.componentRef.setInput('visible', true);
    fixture.detectChanges();
    expect(screen.getByRole('presentation')).toBeInTheDocument();

    fixture.componentRef.setInput('visible', false);
    fixture.detectChanges();
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });
});
