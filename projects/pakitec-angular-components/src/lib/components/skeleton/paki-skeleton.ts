import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PakiSkeletonShape = 'text' | 'circle' | 'rectangle';

@Component({
  selector: 'paki-skeleton',
  template: '',
  styleUrl: './paki-skeleton.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': '"paki-skeleton paki-skeleton--" + shape()',
    '[style.width]': 'width()', '[style.height]': 'height()',
    '[attr.aria-label]': 'label()', 'aria-busy': 'true', role: 'status',
  },
})
export class PakiSkeleton {
  /** Define o formato do espaço reservado. */
  readonly shape = input<PakiSkeletonShape>('text');
  /** Define a largura CSS do componente. */
  readonly width = input('100%');
  /** Define a altura CSS do componente. */
  readonly height = input('1em');
  /** Define o texto lido por tecnologias assistivas. */
  readonly label = input('Carregando conteúdo');
}
