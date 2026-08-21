import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PakiPageMetadata } from '../../models/page-metadata';

@Component({
  selector: 'paki-pagination',
  templateUrl: './paki-pagination.html',
  styleUrl: './paki-pagination.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiPagination {
  readonly page = input.required<PakiPageMetadata>();
  readonly pageChange = output<number>();
  protected readonly range = computed(() => {
    const page = this.page();
    if (!page.totalElements) return 'Nenhum registro';
    const start = (page.number - 1) * page.size + 1;
    return `${start}–${Math.min(page.number * page.size, page.totalElements)} de ${page.totalElements}`;
  });
}
