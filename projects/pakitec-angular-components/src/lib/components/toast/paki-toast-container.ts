import { ChangeDetectionStrategy, Component, computed, inject, input, isDevMode, OnInit } from '@angular/core';

import { PakiToast } from './paki-toast';
import { PakiToastPosition } from './paki-toast.models';
import { PakiToastService } from './paki-toast.service';

/**
 * Container que renderiza a fila de toasts do {@link PakiToastService} num
 * canto fixo da tela. Pausa o autodismiss de cada toast em hover ou foco e
 * retoma ao sair (AC-007). O consumidor deve montar uma unica instancia no
 * shell da aplicacao (FR-010); o aviso sobre instancias duplicadas chega na
 * TASK-017.
 */
@Component({
  selector: 'paki-toast-container',
  imports: [PakiToast],
  templateUrl: './paki-toast-container.html',
  styleUrl: './paki-toast-container.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiToastContainer implements OnInit {
  /** Contador de instâncias montadas para detectar containers duplicados (FR-010). */
  private static instanceCount = 0;

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

  /** Pausa o autodismiss do toast enquanto o cursor ou o foco estao sobre ele. */
  protected pause(id: number): void {
    this.service.pauseAutodismiss(id);
  }

  /** Retoma o autodismiss do toast quando o cursor ou o foco saem. */
  protected resume(id: number): void {
    this.service.resumeAutodismiss(id);
  }

  ngOnInit(): void {
    PakiToastContainer.instanceCount++;
    if (isDevMode() && PakiToastContainer.instanceCount > 1) {
      console.warn(
        'paki-toast-container: mais de uma instância detectada. Mantenha apenas um container por aplicação para evitar toasts duplicados.',
      );
    }
  }
}
