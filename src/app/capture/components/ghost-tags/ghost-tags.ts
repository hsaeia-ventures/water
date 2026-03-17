import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GhostTag } from '../../models/ghost-tag.model';
import { ChipComponent } from '../../../shared/components/chip/chip';

@Component({
  selector: 'app-ghost-tags',
  standalone: true,
  imports: [CommonModule, ChipComponent],
  templateUrl: './ghost-tags.html',
  styleUrl: './ghost-tags.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GhostTagsComponent {
  /** Las etiquetas extraídas del canvas */
  public tags = input.required<GhostTag[]>();

  /** Devuelve el color del chip según el tipo de GhostTag */
  public mapTagTypeToColor(type: GhostTag['type']): 'teal' | 'amber' | 'violet' {
    switch (type) {
      case 'context': return 'teal';
      case 'date': return 'amber';
      case 'person': return 'violet';
    }
  }
}
