import { Component, ChangeDetectionStrategy, inject, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureStore } from '../../services/capture.store';
import { InboxReminderService } from '../../services/inbox-reminder.service';

@Component({
  selector: 'app-inbox-badge',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inbox-badge.html',
  styleUrl: './inbox-badge.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InboxBadgeComponent {
  private store = inject(CaptureStore);
  private reminder = inject(InboxReminderService);

  public count = this.store.inboxCount;
  public level = this.reminder.reminderLevel;

  // Reactivity to trigger a small CSS bounce animation every time count increases
  public isBouncing = signal(false);

  constructor() {
    effect(() => {
      // Registrar el valor para triggerear el efecto cuando cambie
      const currentCount = this.count();
      if (currentCount > 0) {
        this.triggerBounce();
      }
    });
  }

  private triggerBounce(): void {
    this.isBouncing.set(true);
    setTimeout(() => {
      this.isBouncing.set(false);
    }, 300); // Duración de la animación CSS
  }
}
