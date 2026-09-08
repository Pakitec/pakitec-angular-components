import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
  signal,
  type WritableSignal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
 * Cada grupo de itens mantém seu próprio estado de expansão via Signals.
 */
@Component({
  selector: 'paki-sidenav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
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

  /** Guarda o estado de expansão de cada grupo pelo índice do item. */
  private readonly groupStates = new Map<number, WritableSignal<boolean>>();

  /**
   * Retorna o Signal de expansão do grupo.
   * Cria o Signal com o valor inicial quando o grupo ainda não possui estado.
   */
  protected groupExpanded(index: number, initial = false): WritableSignal<boolean> {
    const existing = this.groupStates.get(index);
    if (existing) {
      return existing;
    }

    const created = signal(initial);
    this.groupStates.set(index, created);
    return created;
  }

  /** Alterna o estado de expansão do grupo. */
  protected toggleGroup(index: number, initial = false): void {
    const groupSignal = this.groupExpanded(index, initial);
    groupSignal.set(!groupSignal());
  }
}
