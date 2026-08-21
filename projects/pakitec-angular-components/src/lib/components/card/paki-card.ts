import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'paki-card',
  template: '<ng-content />',
  styleUrl: './paki-card.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class.paki-card--flat]': 'flat()' },
})
export class PakiCard {
  readonly flat = input(false);
}
