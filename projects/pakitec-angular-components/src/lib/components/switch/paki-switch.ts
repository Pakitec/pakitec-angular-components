import { ChangeDetectionStrategy, Component, model, input } from '@angular/core';
@Component({
  selector: 'paki-switch',
  templateUrl: './paki-switch.html',
  styleUrl: './paki-switch.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiSwitch {
  readonly checked = model(false);
  readonly label = input.required<string>();
  readonly disabled = input(false);
  protected toggle(): void {
    if (!this.disabled()) this.checked.update((value) => !value);
  }
}
