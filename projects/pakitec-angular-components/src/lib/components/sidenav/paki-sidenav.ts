import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';

/** Item de navegação do sidenav. */
export interface PakiSidenavItem {
  /** Texto obrigatório do item. */
  label: string;
  /** Rota opcional usada com RouterLink. */
  route?: string;
  /** Nome da classe CSS do ícone opcional. */
  icon?: string;
  /** Estado inicial do grupo. */
  expanded?: boolean;
  /** Filhos de um grupo, limitados a um nível. */
  children?: readonly PakiSidenavItem[];
}

/** Estado atual do sidenav. */
export interface PakiSidenavState {
  /** Indica se o sidenav está expandido. */
  expanded: boolean;
}

/**
 * Componente de navegação lateral Pakitec.
 *
 * Renderiza uma lista de itens de navegação e emite eventos de alternância de largura.
 * O consumidor controla o estado expandido/colapsado por input/output.
 */
@Component({
  selector: 'paki-sidenav',
  standalone: true,
  imports: [],
  templateUrl: './paki-sidenav.html',
  styleUrl: './paki-sidenav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiSidenav {
  /** Lista de itens de navegação. */
  readonly items = input.required<readonly PakiSidenavItem[]>();

  /** Indica se o sidenav está expandido. */
  readonly expanded = input(false);

  /** Emite o novo valor quando o estado expandido/colapsado muda. */
  readonly toggle = output<boolean>();

  /** Estado interno refletindo o input expanded. */
  protected readonly state = signal<PakiSidenavState>({ expanded: false });
}
