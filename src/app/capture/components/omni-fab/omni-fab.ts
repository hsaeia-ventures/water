import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Si necesitamos nsNgClass
import { CaptureUiService } from '../../services/capture-ui.service';
import { HapticService } from '../../../core/services/haptic.service';
import { IconComponent } from '../../../shared/components/icon/icon';
import { PlatformService } from '../../../core/services/platform.service';

@Component({
  selector: 'app-omni-fab',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './omni-fab.html',
  styleUrl: './omni-fab.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OmniFabComponent {
  public captureUi = inject(CaptureUiService);
  private haptic = inject(HapticService);
  public platform = inject(PlatformService);

  public onFabClick(): void {
    this.haptic.tap();
    this.captureUi.toggle();
  }
}
