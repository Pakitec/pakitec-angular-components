import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';

import { PakiToast } from './paki-toast';
import { PakiToastPosition } from './paki-toast.models';
import { PakiToastService } from './paki-toast.service';

/**
 * Container que renderiza a fila de toasts do {@link PakiToastService} num
 * canto fixo da tela. O consumidor deve montar uma unica instancia no shell
 * da aplicacao (FR-010); o aviso sobre instancias duplicadas chega na
 * TASK-017.
 */
@Component({
  selector: 'paki-toast-container',
  imports: [PakiToast],
  templateUrl: './paki-toast-container.html',
  styleUrl: './paki-toast-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiToastContainer {
  protected readonly service = inject(PakiToastService);

  /** Canto da tela onde a pilha fica fixada. Padrao: `top-right` (FR-008). */
  readonly position = input<PakiToastPosition>('top-right');

  /**
   * Classe CSS da posicao aplicada na pilha. Derivada do input; a TASK-017
   * complementa o estilo de cada posicao.
   */
  protected readonly positionClass = computed(() => `paki-toast-stack--${this.position()}`);

  /** Fecha o toast que emitiu `closed`, removendo-o da fila do servico. */
  protected close(id: number): void {
    this.service.dismiss(id);
  }
}
