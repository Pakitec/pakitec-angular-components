import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

import { PakiToastData, PakiToastType } from './paki-toast.models';

/**
 * Glifo exibido no icone de cada tipo de toast. Sao caracteres de texto (nao
 * emoji nem imagem): herdam a cor do texto do tipo e nao exigem fonte externa.
 */
const PAKI_TOAST_ICONS: Record<PakiToastType, string> = {
  success: '✓',
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
};

/**
 * Item individual de toast. Exibe icone do tipo, titulo, descricao e botao de
 * fechar e emite `closed` para o container remover o toast da fila. As
 * transicoes de entrada/saida chegam na TASK-017.
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

  /**
   * Glifo do icone conforme o tipo do toast. O span que o exibe tem
   * `aria-hidden="true"`: o tipo ja esta no titulo e na descricao, entao o
   * icone e apenas reforco visual.
   */
  protected readonly icon = computed(() => PAKI_TOAST_ICONS[this.data().type]);

  /** Emite o pedido de fechamento ao clicar no botao. */
  protected close(): void {
    this.closed.emit();
  }
}
