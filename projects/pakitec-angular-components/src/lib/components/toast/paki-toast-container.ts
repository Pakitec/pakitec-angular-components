import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  ElementRef,
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

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  /** Onde o container nasceu; é para lá que ele volta quando nenhum diálogo modal está aberto. */
  private homeParent: Node | null = null;
  private homeNextSibling: Node | null = null;
  /** Diálogos modais abertos, na ordem em que abriram (o último fica por cima). */
  private readonly modalStack: HTMLDialogElement[] = [];

  /**
   * Um `<dialog>` aberto com `showModal()` fica na top layer do navegador: nenhum
   * z-index o ultrapassa e todo o resto da página fica inerte. Para os toasts
   * continuarem visíveis e clicáveis, o container passa a morar dentro do diálogo
   * modal aberto mais recente e volta ao lugar original quando ele fecha.
   */
  private followModalDialogs(): void {
    const view = this.document.defaultView;
    if (!view || typeof view.MutationObserver === 'undefined') return;
    this.homeParent = this.host.parentNode;
    this.homeNextSibling = this.host.nextSibling;
    for (const dialog of Array.from(this.document.querySelectorAll('dialog'))) {
      if (isModalOpen(dialog)) this.modalStack.push(dialog);
    }
    const observer = new view.MutationObserver((records) => {
      for (const record of records) {
        const target = record.target as Element;
        if (record.type === 'attributes' && target.tagName === 'DIALOG') {
          const dialog = target as HTMLDialogElement;
          const index = this.modalStack.indexOf(dialog);
          if (index >= 0) this.modalStack.splice(index, 1);
          if (isModalOpen(dialog)) this.modalStack.push(dialog);
        }
      }
      // Diálogos removidos do DOM saem da pilha.
      for (let i = this.modalStack.length - 1; i >= 0; i--) {
        if (!this.modalStack[i].isConnected || !isModalOpen(this.modalStack[i])) this.modalStack.splice(i, 1);
      }
      this.relocate();
    });
    observer.observe(this.document.documentElement, {
      subtree: true,
      childList: true,
      attributes: true,
      attributeFilter: ['open'],
    });
    this.relocate();
    this.destroyRef.onDestroy(() => {
      observer.disconnect();
      this.modalStack.length = 0;
      this.relocate();
    });
  }

  private relocate(): void {
    const dialog = this.modalStack.at(-1);
    if (dialog) {
      if (this.host.parentNode !== dialog) dialog.appendChild(this.host);
      return;
    }
    const home = this.homeParent;
    if (!home || this.host.parentNode === home) return;
    if (!home.isConnected && this.host.isConnected) return;
    const next = this.homeNextSibling && this.homeNextSibling.parentNode === home ? this.homeNextSibling : null;
    home.insertBefore(this.host, next);
  }

  ngOnInit(): void {
    this.followModalDialogs();
    PakiToastContainer.instanceCount++;
    if (isDevMode() && PakiToastContainer.instanceCount > 1) {
      console.warn(
        'paki-toast-container: mais de uma instância detectada. Mantenha apenas um container por aplicação para evitar toasts duplicados.',
      );
    }
  }
}

/** `true` para um `<dialog>` aberto como modal (`showModal()`). */
function isModalOpen(dialog: HTMLDialogElement): boolean {
  if (!dialog.open) return false;
  // Ambientes sem diálogo modal (ex.: jsdom): qualquer diálogo aberto conta como modal.
  if (typeof dialog.showModal !== 'function') return true;
  try {
    return dialog.matches(':modal');
  } catch {
    return true;
  }
}
