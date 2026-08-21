import { ChangeDetectionStrategy, Component, input } from '@angular/core';
export type PakiBadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';
@Component({
  selector: 'paki-badge',
  template: '<ng-content />',
  styleUrl: './paki-badge.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': '"paki-badge--" + tone()' },
})
export class PakiBadge {
  readonly tone = input<PakiBadgeTone>('neutral');
}
