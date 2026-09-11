import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'paki-placeholder',
  template: `<div class="paki-placeholder__icon" aria-hidden="true"><ng-content select="[pakiPlaceholderIcon]" /></div><strong>{{ title() }}</strong>@if (description()) { <p>{{ description() }}</p> }<div class="paki-placeholder__actions"><ng-content /></div>`,
  styleUrl: './paki-placeholder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiPlaceholder {
  /** Define a mensagem principal exibida no estado vazio. */
  readonly title = input('Nada para mostrar');
  /** Define a orientação complementar exibida abaixo do título. */
  readonly description = input('');
}
