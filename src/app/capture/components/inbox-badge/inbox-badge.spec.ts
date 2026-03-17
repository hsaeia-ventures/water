import { render, screen } from '@testing-library/angular';
import { InboxBadgeComponent } from './inbox-badge';
import { CaptureStore } from '../../services/capture.store';
import { InboxReminderService } from '../../services/inbox-reminder.service';
import { signal } from '@angular/core';

describe('InboxBadgeComponent', () => {
  let mockStore: any;
  let mockReminder: any;

  beforeEach(() => {
    mockStore = {
      inboxCount: signal(0)
    };
    mockReminder = {
      reminderLevel: signal('none')
    };
  });

  const setup = async () => {
    return render(InboxBadgeComponent, {
      providers: [
        { provide: CaptureStore, useValue: mockStore },
        { provide: InboxReminderService, useValue: mockReminder }
      ]
    });
  };

  it('should not render anything if count is 0', async () => {
    await setup();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should render the count and correct level class', async () => {
    mockStore.inboxCount.set(3);
    mockReminder.reminderLevel.set('info');

    const { fixture } = await setup();
    fixture.detectChanges();

    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('3');
    expect(badge).toHaveClass('inbox-badge--info');
  });

  it('should display "99+" when count exceeds 99', async () => {
    mockStore.inboxCount.set(105);
    mockReminder.reminderLevel.set('critical');

    const { fixture } = await setup();
    fixture.detectChanges();

    const badge = screen.getByRole('status');
    expect(badge).toHaveTextContent('99+');
    expect(badge).toHaveClass('inbox-badge--critical');
  });
});
