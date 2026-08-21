import { Directive, input } from '@angular/core';

export type PakiButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type PakiButtonSize = 'sm' | 'md' | 'lg';

@Directive({
  selector: 'button[pakiButton], a[pakiButton]',
  host: {
    class: 'paki-button',
    '[class]': '"paki-button paki-button--" + variant() + " paki-button--" + size()',
  },
})
export class PakiButton {
  readonly variant = input<PakiButtonVariant>('primary');
  readonly size = input<PakiButtonSize>('md');
}
