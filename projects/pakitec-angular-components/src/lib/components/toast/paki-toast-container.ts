import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  isDevMode,
  OnInit,
} from '@angular/core';

import { PakiToast } from './paki-toast';
import { PakiToastPosition } from './paki-toast.models';
import { PakiToastService } from './paki-toast.service';

/**
 * Container que renderiza a fila de toasts do {@link PakiToastService} num
 * canto fixo da tela. Pausa o autodismiss de cada toast em hover ou foco e
 * retoma so quando hover e foco saem (AC-007). O consumidor deve montar uma
 * unica instancia no shell da aplicacao (FR-010); o aviso sobre instancias
 * duplicadas chega na TASK-017.
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

  /**
   * Ids dos toasts com o cursor sobre eles. Junto com {@link focused}, decide
   * quando pausar e quando retomar o autodismiss (FR-005).
   */
  private readonly hovered = new Set<number>();

  /** Ids dos toasts com o foco do teclado dentro deles. */
  private readonly focused = new Set<number>();

  constructor() {
    // Remove o estado de hover e foco dos toasts que sairam da fila. Sem esta
    // limpeza, os conjuntos cresceriam a cada toast removido com o cursor ou
    // o foco sobre ele.
    effect(() => {
      const ids = new Set(this.service.toasts().map((toast) => toast.id));
      for (const set of [this.hovered, this.focused]) {
        for (const id of set) {
          if (!ids.has(id)) set.delete(id);
        }
      }
    });
  }

  /** Registra o cursor sobre o toast e pausa o autodismiss. */
  protected onMouseEnter(id: number): void {
    this.hovered.add(id);
    this.updatePause(id);
  }

  /** Registra a saida do cursor; retoma so se o foco tambem saiu. */
  protected onMouseLeave(id: number): void {
    this.hovered.delete(id);
    this.updatePause(id);
  }

  /** Registra o foco dentro do toast e pausa o autodismiss. */
  protected onFocusIn(id: number): void {
    this.focused.add(id);
    this.updatePause(id);
  }

  /**
   * Registra a saida do foco; retoma so se o cursor tambem saiu. O foco que
   * passa para outro elemento do mesmo toast (`relatedTarget` dentro do host)
   * nao conta como saida.
   * @param id Id do toast que perdeu o foco.
   * @param event Evento `focusout` emitido pelo host `<paki-toast>`.
   */
  protected onFocusOut(id: number, event: FocusEvent): void {
    const host = event.currentTarget as Node | null;
    const next = event.relatedTarget as Node | null;
    if (host && next && host.contains(next)) return;
    this.focused.delete(id);
    this.updatePause(id);
  }

  /**
   * Pausa o autodismiss enquanto houver hover ou foco no toast e retoma
   * quando os dois saem. O servico ignora pausas e retomadas repetidas, entao
   * so a transicao entre "nenhum" e "algum" muda o timer.
   */
  private updatePause(id: number): void {
    if (this.hovered.has(id) || this.focused.has(id)) {
      this.service.pauseAutodismiss(id);
    } else {
      this.service.resumeAutodismiss(id);
    }
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
