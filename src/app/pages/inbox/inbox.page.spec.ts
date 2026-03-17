import { render, screen } from '@testing-library/angular';
import InboxPage from './inbox.page';
import { CaptureStore } from '../../capture/services/capture.store';
import { signal } from '@angular/core';
import userEvent from '@testing-library/user-event';

describe('InboxPage', () => {
  let mockStore: any;

  beforeEach(() => {
    mockStore = {
      items: signal([]),
      inboxCount: signal(0),
      deleteCapture: vi.fn().mockResolvedValue(undefined)
    };
  });

  const user = userEvent.setup();

  const setup = async () => {
    return render(InboxPage, {
      providers: [
        { provide: CaptureStore, useValue: mockStore }
      ]
    });
  };

  it('should render empty state when inbox is empty', async () => {
    await setup();
    expect(screen.getByText('Tu mente está como el agua')).toBeInTheDocument();
  });

  it('should render items when store has elements', async () => {
    mockStore.items.set([
      { id: '1', text: 'Task 1', createdAt: new Date(), ghostTags: [] },
      { id: '2', text: 'Idea 2', createdAt: new Date(), ghostTags: [] }
    ]);
    mockStore.inboxCount.set(2);
    
    await setup();
    
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Idea 2')).toBeInTheDocument();
    expect(screen.queryByText('Tu mente está como el agua')).not.toBeInTheDocument();
  });

  it('should allow deleting an item', async () => {
    mockStore.items.set([
      { id: '1', text: 'Task to delete', createdAt: new Date(), ghostTags: [] }
    ]);
    mockStore.inboxCount.set(1);
    
    await setup();
    
    const btn = screen.getByRole('button', { name: /Procesar y eliminar/i });
    await user.click(btn);

    expect(mockStore.deleteCapture).toHaveBeenCalledWith('1');
  });
});
