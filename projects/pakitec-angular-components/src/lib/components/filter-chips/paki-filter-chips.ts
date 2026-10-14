import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

export interface PakiFilterChip {
  value: string;
  label: string;
  /** Quantidade exibida ao lado do rótulo. */
  count?: number;
}

/** Grupo de chips de filtro. Com `multiple`, aceita várias seleções; sem ele, uma só, que o clique repetido desmarca. */
@Component({
  selector: 'paki-filter-chips',
  templateUrl: './paki-filter-chips.html',
  styleUrl: './paki-filter-chips.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiFilterChips {
  readonly options = input.required<readonly PakiFilterChip[]>();
  /** Valores selecionados. */
  readonly selected = model<readonly string[]>([]);
  readonly multiple = input(false);
  /** Nome acessível do grupo. */
  readonly label = input('Filtros');

  protected isSelected(value: string): boolean {
    return this.selected().includes(value);
  }

  protected toggle(value: string): void {
    const current = this.selected();
    if (current.includes(value)) {
      this.selected.set(current.filter((item) => item !== value));
    } else {
      this.selected.set(this.multiple() ? [...current, value] : [value]);
    }
  }
}
