import { render, screen } from '@testing-library/angular';
import { IconComponent } from './icon';

describe('IconComponent', () => {
  it('should render an SVG element', async () => {
    await render(IconComponent, {
      inputs: { name: 'plus' },
    });

    const svg = document.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });

  it('should set correct default size', async () => {
    await render(IconComponent, {
      inputs: { name: 'plus' },
    });

    const svg = document.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '24');
    expect(svg).toHaveAttribute('height', '24');
  });

  it('should use custom size', async () => {
    await render(IconComponent, {
      inputs: { name: 'plus', size: 20 },
    });

    const svg = document.querySelector('svg')!;
    expect(svg).toHaveAttribute('width', '20');
    expect(svg).toHaveAttribute('height', '20');
  });

  it('should render a valid path for a known icon', async () => {
    await render(IconComponent, {
      inputs: { name: 'send' },
    });

    const path = document.querySelector('path')!;
    expect(path).toBeInTheDocument();
    expect(path.getAttribute('d')!.length).toBeGreaterThan(0);
  });

  it('should render empty path for an unknown icon', async () => {
    await render(IconComponent, {
      inputs: { name: 'nonexistent-icon' },
    });

    const path = document.querySelector('path')!;
    expect(path).toHaveAttribute('d', '');
  });
});
