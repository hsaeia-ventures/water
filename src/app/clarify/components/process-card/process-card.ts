import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GtdItem } from '../../../core/models/gtd-item.model';
import { GhostTagsComponent } from '../../../capture/components/ghost-tags/ghost-tags';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-process-card',
  standalone: true,
  imports: [CommonModule, GhostTagsComponent, RelativeTimePipe],
  template: `
    <article class="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden group">
      <!-- Glow effect -->
      <div class="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>
      
      <!-- Meta info -->
      <header class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2">
          <span class="flex h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
          <span class="text-xs font-medium text-amber-500 uppercase tracking-wider">Inbox</span>
        </div>
        <time class="text-sm text-zinc-500 font-mono">{{ item.created_at | relativeTime }}</time>
      </header>

      <!-- Main Content -->
      <div class="mb-6">
        <h2 class="text-2xl sm:text-3xl font-light leading-snug text-white">{{ item.title }}</h2>
      </div>

      <!-- Ghost tags -->
      @if (item.ghost_tags && item.ghost_tags.length > 0) {
        <div class="pt-4 border-t border-zinc-800/50">
          <app-ghost-tags [tags]="item.ghost_tags" />
        </div>
      }
    </article>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      animation: cardEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    @keyframes cardEnter {
      0% {
        opacity: 0;
        transform: translateY(20px) scale(0.98);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
  `]
})
export class ProcessCardComponent {
  @Input({ required: true }) item!: GtdItem;
}
