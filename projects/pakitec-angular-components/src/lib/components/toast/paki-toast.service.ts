import { Injectable, signal } from '@angular/core';

import {
  PAKI_TOAST_DEFAULT_DURATIONS,
  PakiToastConfig,
  PakiToastData,
  PakiToastType,
} from './paki-toast.models';

/**
 * Registro interno do timer de autodismiss de um toast. Guarda o handle do
 * `setTimeout` ativo, o instante de inicio e o tempo restante em milissegundos.
 *
 * A pausa ao passar o mouse (TASK-009) le este registro para cancelar o timer
 * e depois o reagenda com o `remainingMs` atualizado:
 * `remainingMs - (Date.now() - startedAt)`.
 *
 * @internal Uso restrito ao componente PakiToast; nao faz parte da API publica.
 */
export interface PakiToastTimer {
  /** Handle do `setTimeout` ativo, usado para cancelar ou reagendar. */
  handle: ReturnType<typeof setTimeout>;
  /** Marca de tempo (`Date.now()`) do inicio do timer atual. */
  startedAt: number;
  /** Milissegundos restantes ate o autodismiss. */
  remainingMs: number;
}

/**
 * Servico central do PakiToast. Mantem a fila de toasts visiveis num signal e
 * expoe um metodo por tipo de feedback (`success`, `error`, `warning`, `info`).
 *
 * E um singleton (`providedIn: 'root'`): uma unica instancia atende toda a
 * aplicacao, entao o consumidor nao precisa registrar o servico em cada
 * modulo. Esta versao (TASK-006) entrega a fila, as duracoes e o autodismiss;
 * o limite de tres toasts (FIFO) e a pausa chegam na TASK-009.
 */
@Injectable({ providedIn: 'root' })
export class PakiToastService {
  /**
   * Fila de toasts prontos para renderizacao pelo PakiToastContainer.
   * Comeca vazia; apenas leitura para o consumidor — a mutacao ocorre dentro
   * do servico.
   */
  readonly toasts = signal<readonly PakiToastData[]>([]);

  /** Contador interno que gera ids unicos e crescentes para cada toast. */
  private nextId = 0;

  /**
   * Timers de autodismiss ativos, indexados pelo id do toast.
   * Toasts com duracao `0` nao entram neste mapa.
   */
  private readonly timers = new Map<number, PakiToastTimer>();

  /**
   * Cria um toast de sucesso.
   * @param title Titulo exibido em destaque.
   * @param description Descricao exibida abaixo do titulo.
   * @param config Configuracao opcional; `duration` sobrescreve o padrao do
   * tipo e `0` desliga o autodismiss.
   * @returns Id do toast criado, usado depois em {@link dismiss}.
   */
  success(title: string, description: string, config?: PakiToastConfig): number {
    return this.show('success', title, description, config);
  }

  /**
   * Cria um toast de erro. O padrao do tipo e sem autodismiss
   * ({@link PAKI_TOAST_DEFAULT_DURATIONS}): o toast so sai por fechamento
   * manual.
   * @param title Titulo exibido em destaque.
   * @param description Descricao exibida abaixo do titulo.
   * @param config Configuracao opcional de duracao e posicao.
   * @returns Id do toast criado, usado depois em {@link dismiss}.
   */
  error(title: string, description: string, config?: PakiToastConfig): number {
    return this.show('error', title, description, config);
  }

  /**
   * Cria um toast de aviso.
   * @param title Titulo exibido em destaque.
   * @param description Descricao exibida abaixo do titulo.
   * @param config Configuracao opcional de duracao e posicao.
   * @returns Id do toast criado, usado depois em {@link dismiss}.
   */
  warning(title: string, description: string, config?: PakiToastConfig): number {
    return this.show('warning', title, description, config);
  }

  /**
   * Cria um toast informativo.
   * @param title Titulo exibido em destaque.
   * @param description Descricao exibida abaixo do titulo.
   * @param config Configuracao opcional de duracao e posicao.
   * @returns Id do toast criado, usado depois em {@link dismiss}.
   */
  info(title: string, description: string, config?: PakiToastConfig): number {
    return this.show('info', title, description, config);
  }

  /**
   * Remove um toast da fila pelo id e cancela o timer de autodismiss dele,
   * quando existir. Ids desconhecidos sao ignorados sem erro.
   * @param id Id retornado pelos metodos de criacao.
   */
  dismiss(id: number): void {
    this.cancelTimer(id);
    this.toasts.update((current) => current.filter((toast) => toast.id !== id));
  }

  /** Remove todos os toasts da fila de uma vez e cancela todos os timers. */
  dismissAll(): void {
    for (const timer of this.timers.values()) {
      clearTimeout(timer.handle);
    }
    this.timers.clear();
    this.toasts.set([]);
  }

  /**
   * Registro do timer de autodismiss do toast, ou `undefined` quando o toast
   * nao tem timer ativo (duracao `0` ou toast ja removido).
   *
   * Expoe o estado necessario para a pausa da TASK-009, que cancela o handle,
   * recalcula `remainingMs` e reagenda o timer atualizando o registro.
   *
   * @internal Uso restrito ao componente PakiToast; nao faz parte da API publica.
   * @param id Id do toast retornado pelos metodos de criacao.
   * @returns O registro mutavel do timer, atualizado em pausa e retomada.
   */
  autodismissTimer(id: number): PakiToastTimer | undefined {
    return this.timers.get(id);
  }

  /**
   * Ponto unico de criacao de toast. Resolve a duracao (padrao do tipo, com
   * override por `config.duration`; `0` significa sem autodismiss), gera o id
   * no contador interno, insere o toast na fila e agenda o autodismiss quando
   * a duracao resolvida e maior que zero.
   * @returns Id do toast criado.
   */
  protected show(
    type: PakiToastType,
    title: string,
    description: string,
    config?: PakiToastConfig,
  ): number {
    const duration = config?.duration ?? PAKI_TOAST_DEFAULT_DURATIONS[type];
    const toast: PakiToastData = {
      id: ++this.nextId,
      type,
      title,
      description,
      duration,
      leaving: false,
    };
    this.toasts.update((current) => [...current, toast]);
    if (duration > 0) {
      this.scheduleAutodismiss(toast.id, duration);
    }
    return toast.id;
  }

  /**
   * Agenda o autodismiss do toast com `setTimeout` e registra o timer no mapa
   * interno. `startedAt` e `remainingMs` servem de base para a pausa da
   * TASK-009.
   * @param id Id do toast removido quando o timer dispara.
   * @param durationMs Tempo de espera em milissegundos; deve ser maior que zero.
   */
  private scheduleAutodismiss(id: number, durationMs: number): void {
    this.timers.set(id, {
      handle: setTimeout(() => this.dismiss(id), durationMs),
      startedAt: Date.now(),
      remainingMs: durationMs,
    });
  }

  /**
   * Cancela o timer de autodismiss do toast e remove o registro do mapa.
   * @param id Id do toast; sem efeito quando nao ha timer ativo.
   */
  private cancelTimer(id: number): void {
    const timer = this.timers.get(id);
    if (timer) {
      clearTimeout(timer.handle);
      this.timers.delete(id);
    }
  }
}
