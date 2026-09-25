import { Injectable, signal } from '@angular/core';

import {
  PAKI_TOAST_DEFAULT_DURATIONS,
  PakiToastConfig,
  PakiToastData,
  PakiToastType,
} from './paki-toast.models';

/**
 * Servico central do PakiToast. Mantem a fila de toasts visiveis e expoe um
 * metodo por tipo de feedback (`success`, `error`, `warning`, `info`).
 *
 * E um singleton (`providedIn: 'root'`): uma unica instancia atende toda a
 * aplicacao, entao o consumidor nao precisa registrar o servico em cada
 * modulo. Esta primeira versao (TASK-003) entrega apenas o contrato: os
 * metodos retornam ids, mas nao enfileiram nem programam o autodismiss.
 * A fila, as duracoes e o empilhamento chegam nas TASK-006 e TASK-009.
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
   * Remove um toast da fila pelo id.
   * @param _id Id retornado pelos metodos de criacao.
   */
  dismiss(_id: number): void {
    // Stub da TASK-003: a remocao real chega na TASK-006.
  }

  /** Remove todos os toasts da fila de uma vez. */
  dismissAll(): void {
    // Stub da TASK-003: a remocao real chega na TASK-006.
  }

  /**
   * Ponto unico de criacao de toast. Este stub devolve apenas o proximo id;
   * a TASK-006 resolve a duracao padrao do tipo, aplica `config.duration` e
   * insere o {@link PakiToastData} na fila.
   */
  protected show(
    _type: PakiToastType,
    _title: string,
    _description: string,
    _config?: PakiToastConfig,
  ): number {
    void PAKI_TOAST_DEFAULT_DURATIONS;
    return ++this.nextId;
  }
}
