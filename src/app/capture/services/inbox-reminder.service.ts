import { Injectable, computed, inject } from '@angular/core';
import { CaptureStore } from './capture.store';

@Injectable({
  providedIn: 'root'
})
export class InboxReminderService {
  private store = inject(CaptureStore);

  // Consideramos que necesita "Reminder" (alerta roja) si 
  // el ítem de captura más viejo tiene más de 12 horas.
  public readonly shouldRemind = computed(() => {
    const items = this.store.items();
    if (items.length === 0) return false;

    // Los items están ordenados: [0] es el más nuevo, [length - 1] el más viejo
    const oldestItem = items[items.length - 1];
    const oldestDate = new Date(oldestItem.created_at).getTime();
    const now = new Date().getTime();

    const hoursElapsed = (now - oldestDate) / (1000 * 60 * 60);

    return hoursElapsed >= 12;
  });

  public readonly reminderLevel = computed(() => {
    const count = this.store.inboxCount();
    if (count === 0) return 'none';
    if (this.shouldRemind() || count >= 10) return 'critical';
    if (count >= 5) return 'warning';
    return 'info';
  });
}
