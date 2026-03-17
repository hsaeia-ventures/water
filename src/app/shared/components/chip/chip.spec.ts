import { render, screen } from '@testing-library/angular';
import { ChipComponent } from './chip';

describe('ChipComponent', () => {
  it('should display the label text', async () => {
    await render(ChipComponent, {
      inputs: { label: '@casa', color: 'teal' },
    });

    expect(screen.getByText('@casa')).toBeInTheDocument();
  });

  it('should apply teal styling', async () => {
    await render(ChipComponent, {
      inputs: { label: '@trabajo', color: 'teal' },
    });

    expect(screen.getByText('@trabajo')).toHaveClass('chip-teal');
  });

  it('should apply amber styling', async () => {
    await render(ChipComponent, {
      inputs: { label: 'mañana', color: 'amber' },
    });

    expect(screen.getByText('mañana')).toHaveClass('chip-amber');
  });

  it('should apply violet styling', async () => {
    await render(ChipComponent, {
      inputs: { label: 'María', color: 'violet' },
    });

    expect(screen.getByText('María')).toHaveClass('chip-violet');
  });

  it('should apply default styling when no color specified', async () => {
    await render(ChipComponent, {
      inputs: { label: 'genérico' },
    });

    expect(screen.getByText('genérico')).toHaveClass('chip-default');
  });
});
