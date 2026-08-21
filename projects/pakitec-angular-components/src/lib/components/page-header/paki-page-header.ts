import { ChangeDetectionStrategy, Component, input } from '@angular/core';
@Component({
  selector: 'paki-page-header',
  templateUrl: './paki-page-header.html',
  styleUrl: './paki-page-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiPageHeader {
  readonly title = input.required<string>();
  readonly subtitle = input('');
}
