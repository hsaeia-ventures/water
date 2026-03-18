import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CaptureStore } from '../../capture/services/capture.store';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state';
import { GhostTagsComponent } from '../../capture/components/ghost-tags/ghost-tags';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';
import { ButtonComponent } from '../../shared/components/button/button';

@Component({
  selector: 'app-inbox-page',
  standalone: true,
  imports: [
    CommonModule, 
    EmptyStateComponent, 
    GhostTagsComponent, 
    RelativeTimePipe,
    ButtonComponent
  ],
  templateUrl: './inbox.page.html',
  styleUrl: './inbox.page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class InboxPage {
  public store = inject(CaptureStore);

  public async deleteItem(id: string): Promise<void> {
    await this.store.deleteCapture(id);
  }
}
