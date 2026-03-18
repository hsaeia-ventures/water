import { render, screen } from '@testing-library/angular';
import { GhostTagsComponent } from './ghost-tags';
import { GhostTag } from '../../models/ghost-tag.model';

describe('GhostTagsComponent', () => {
  const setup = async (tags: GhostTag[] = []) => {
    return render(GhostTagsComponent, {
      componentInputs: { tags }
    });
  };

  it('should not render anything when tags array is empty', async () => {
    const { container } = await setup([]);
    // Solo un comentario de Angular u host vacío debería estar presente
    expect(container.querySelector('.ghost-tags-container')).toBeNull();
  });

  it('should render mapped chips correctly for each tag type', async () => {
    const mockTags: GhostTag[] = [
      { type: 'context', value: 'oficina', raw: '@oficina' },
      { type: 'date', value: 'mañana', raw: 'mañana' },
      { type: 'person', value: 'Sara', raw: 'a Sara' }
    ];

    await setup(mockTags);
    
    // Verificamos que se renderice el contenedor
    expect(screen.getByText('oficina')).toBeInTheDocument();
    expect(screen.getByText('mañana')).toBeInTheDocument();
    expect(screen.getByText('Sara')).toBeInTheDocument();
  });
});
