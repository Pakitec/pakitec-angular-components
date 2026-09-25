import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { PakiToastData } from './paki-toast.models';

/**
 * Item individual de toast. Exibe titulo, descricao e botao de fechar e
 * emite `closed` para o container remover o toast da fila. Esta primeira
 * versao (TASK-003) cobre so o esqueleto; icone por tipo, tokens por tipo e
 * transicoes chegam nas TASK-007 e TASK-017.
 */
@Component({
  selector: 'paki-toast',
  templateUrl: './paki-toast.html',
  styleUrl: './paki-toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiToast {
  /** Dados resolvidos do toast, gerados pelo {@link PakiToastService}. */
  readonly data = input.required<PakiToastData>();

  /**
   * Emitido quando o usuario pede o fechamento. O container ouve o evento e
   * chama `dismiss` no servico; o item nao se remove sozinho.
   */
  readonly closed = output<void>();

  /**
   * Classe CSS do tipo do toast (`paki-toast--success` etc.). Permite ao
   * estilo aplicar os tokens de feedback do tema em cada variante.
   */
  protected readonly typeClass = computed(() => `paki-toast--${this.data().type}`);

  /** Emite o pedido de fechamento ao clicar no botao. */
  protected close(): void {
    this.closed.emit();
  }
}
