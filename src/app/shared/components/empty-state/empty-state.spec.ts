import { render, screen } from '@testing-library/angular';
import { EmptyStateComponent } from './empty-state';

describe('EmptyStateComponent', () => {
  it('should display the title text', async () => {
    await render(EmptyStateComponent, {
      inputs: { title: 'Tu mente está como el agua' },
    });

    expect(screen.getByText('Tu mente está como el agua')).toBeInTheDocument();
  });

  it('should display subtitle when provided', async () => {
    await render(EmptyStateComponent, {
      inputs: {
        title: 'Bandeja vacía',
        subtitle: 'Captura tu primera idea con Cmd+K',
      },
    });

    expect(screen.getByText('Captura tu primera idea con Cmd+K')).toBeInTheDocument();
  });

  it('should not display subtitle when not provided', async () => {
    await render(EmptyStateComponent, {
      inputs: { title: 'Bandeja vacía' },
    });

    expect(screen.queryByText('Captura tu primera idea con Cmd+K')).not.toBeInTheDocument();
  });

  it('should render icon when iconName is provided', async () => {
    const { container } = await render(EmptyStateComponent, {
      inputs: { title: 'Vacío', iconName: 'inbox' },
    });

    expect(container.querySelector('app-icon')).toBeInTheDocument();
  });

  it('should not render icon when iconName is not provided', async () => {
    const { container } = await render(EmptyStateComponent, {
      inputs: { title: 'Vacío' },
    });

    expect(container.querySelector('app-icon')).not.toBeInTheDocument();
  });

  it('should render projected content', async () => {
    await render(
      `<app-empty-state title="Sin datos">
        <p>Prueba de contenido proyectado</p>
      </app-empty-state>`,
      { imports: [EmptyStateComponent] }
    );

    expect(screen.getByText('Sin datos')).toBeInTheDocument();
    expect(screen.getByText('Prueba de contenido proyectado')).toBeInTheDocument();
  });
});
