import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PakiDataTable, PakiTableCell, type PakiTableColumn, type PakiTableSort } from './paki-data-table';

interface Row { id: number; vendor: string; total: number }

@Component({
  imports: [PakiDataTable, PakiTableCell],
  template: `
    <paki-data-table label="Documentos" [columns]="columns" [rows]="rows()" [loading]="loading()" [selectable]="true"
      [rowKey]="key" [(sort)]="sort" (rowSelect)="selected = $event" emptyTitle="Nada aqui">
      <ng-template pakiCell="vendor" let-row><b class="cell">{{ row.vendor }}</b></ng-template>
    </paki-data-table>`,
})
class Host {
  readonly columns: PakiTableColumn<Row>[] = [
    { key: 'vendor', header: 'Fornecedor', sortable: true },
    { key: 'total', header: 'Total', sortable: true, align: 'end', value: (row) => row.total.toFixed(2) },
  ];
  readonly rows = signal<Row[]>([{ id: 1, vendor: 'Enel', total: 120 }, { id: 2, vendor: 'Sabesp', total: 80.5 }]);
  readonly loading = signal(false);
  readonly sort = signal<PakiTableSort | null>(null);
  readonly key = (row: Row) => row.id;
  selected: Row | null = null;
}

describe('PakiDataTable', () => {
  async function setup() {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('renderiza linhas, valores e template de célula personalizado', async () => {
    const { el } = await setup();
    expect(el.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(el.querySelector('.cell')?.textContent).toBe('Enel');
    expect(el.textContent).toContain('80.50');
    expect(el.querySelector('td')?.getAttribute('data-label')).toBe('Fornecedor');
  });

  it('alterna ordenação asc, desc e nenhuma, com aria-sort', async () => {
    const { fixture, el } = await setup();
    const button = () => el.querySelector<HTMLButtonElement>('th button')!;
    const th = () => el.querySelector('th')!;
    expect(th().getAttribute('aria-sort')).toBe('none');
    button().click(); fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toEqual({ key: 'vendor', direction: 'asc' });
    expect(th().getAttribute('aria-sort')).toBe('ascending');
    button().click(); fixture.detectChanges();
    expect(th().getAttribute('aria-sort')).toBe('descending');
    button().click(); fixture.detectChanges();
    expect(fixture.componentInstance.sort()).toBeNull();
  });

  it('emite a linha selecionada por clique e Enter', async () => {
    const { fixture, el } = await setup();
    el.querySelectorAll<HTMLElement>('tbody tr')[1]!.click();
    expect(fixture.componentInstance.selected?.vendor).toBe('Sabesp');
    el.querySelectorAll<HTMLElement>('tbody tr')[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(fixture.componentInstance.selected?.vendor).toBe('Enel');
  });

  it('mostra carregamento e estado vazio', async () => {
    const { fixture, el } = await setup();
    fixture.componentInstance.loading.set(true); fixture.detectChanges();
    expect(el.querySelector('table')?.getAttribute('aria-busy')).toBe('true');
    expect(el.querySelectorAll('.paki-table__row--loading')).toHaveLength(5);
    fixture.componentInstance.loading.set(false);
    fixture.componentInstance.rows.set([]); fixture.detectChanges();
    expect(el.textContent).toContain('Nada aqui');
  });
});
