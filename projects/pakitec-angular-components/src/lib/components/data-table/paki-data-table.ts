import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, Directive, TemplateRef, computed, contentChildren, inject, input, model, output } from '@angular/core';
import { PakiPlaceholder } from '../placeholder/paki-placeholder';

export interface PakiTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'start' | 'end';
  /** Extrai o texto da célula. Sem ela, usa `row[key]`. Para conteúdo rico, use `*pakiCell`. */
  value?: (row: T) => string | number | null | undefined;
}

export interface PakiTableSort {
  key: string;
  direction: 'asc' | 'desc';
}

/** Define o conteúdo de uma coluna: `<ng-template pakiCell="status" let-row>...</ng-template>`. */
@Directive({ selector: 'ng-template[pakiCell]' })
export class PakiTableCell {
  readonly column = input.required<string>({ alias: 'pakiCell' });
  readonly template = inject<TemplateRef<{ $implicit: unknown; index: number }>>(TemplateRef);
}

/**
 * Tabela de dados com ordenação, estado de carregamento e vazio.
 * A ordenação só emite o estado; quem usa o componente ordena os dados (no servidor ou no cliente).
 * Em contêineres estreitos (até 640px), cada linha vira um cartão.
 */
@Component({
  selector: 'paki-data-table',
  imports: [NgTemplateOutlet, PakiPlaceholder],
  templateUrl: './paki-data-table.html',
  styleUrl: './paki-data-table.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiDataTable<T extends object> {
  readonly columns = input.required<readonly PakiTableColumn<T>[]>();
  readonly rows = input.required<readonly T[]>();
  /** Nome acessível da tabela (legenda oculta). */
  readonly label = input.required<string>();
  readonly rowKey = input<(row: T, index: number) => string | number>((_row, index) => index);
  readonly loading = input(false);
  readonly sort = model<PakiTableSort | null>(null);
  /** Torna as linhas focáveis e emite `rowSelect` com clique ou Enter. */
  readonly selectable = input(false);
  readonly emptyTitle = input('Nenhum registro encontrado');
  readonly emptyDescription = input('');
  readonly rowSelect = output<T>();

  private readonly cells = contentChildren(PakiTableCell);
  protected readonly cellTemplates = computed(() => new Map(this.cells().map((cell) => [cell.column(), cell.template])));
  protected readonly skeletonRows = [0, 1, 2, 3, 4];

  protected text(column: PakiTableColumn<T>, row: T): string {
    const value = column.value ? column.value(row) : (row as Record<string, unknown>)[column.key];
    return value === null || value === undefined ? '—' : String(value);
  }

  protected ariaSort(column: PakiTableColumn<T>): 'ascending' | 'descending' | 'none' | null {
    if (!column.sortable) return null;
    const current = this.sort();
    if (current?.key !== column.key) return 'none';
    return current.direction === 'asc' ? 'ascending' : 'descending';
  }

  protected indicator(column: PakiTableColumn<T>): string {
    const current = this.sort();
    if (current?.key !== column.key) return '↕';
    return current.direction === 'asc' ? '↑' : '↓';
  }

  protected toggleSort(column: PakiTableColumn<T>): void {
    const current = this.sort();
    if (current?.key !== column.key) this.sort.set({ key: column.key, direction: 'asc' });
    else if (current.direction === 'asc') this.sort.set({ key: column.key, direction: 'desc' });
    else this.sort.set(null);
  }
}
