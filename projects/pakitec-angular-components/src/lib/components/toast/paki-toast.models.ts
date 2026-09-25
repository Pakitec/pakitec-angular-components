/**
 * Tipos de feedback do PakiToast. Cada tipo define aparencia e significado proprios
 * (FR-001) e uma duracao padrao de autodismiss (FR-004).
 */
export type PakiToastType = 'success' | 'error' | 'warning' | 'info';

/** Cantos da tela em que o container de toasts pode ser fixado (FR-008). */
export type PakiToastPosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

/**
 * Configuracao opcional aceita pelos metodos do PakiToastService.
 * Cada campo ausente cai no padrao do tipo ou do container.
 */
export interface PakiToastConfig {
  /**
   * Duracao do autodismiss em milissegundos. Sobrescreve a duracao padrao do tipo
   * (AC-003). O valor `0` desliga o autodismiss: o toast permanece na tela ate o
   * fechamento manual (AC-004).
   */
  duration?: number;
  /** Posicao do container na tela. Padrao: `top-right` (FR-008). */
  position?: PakiToastPosition;
}

/**
 * Toast resolvido na fila do PakiToastService, pronto para renderizacao.
 * A duracao ja reflete o padrao do tipo ou a configuracao do consumidor.
 */
export interface PakiToastData {
  /** Identificador unico gerado pelo servico (contador interno). */
  id: number;
  /** Tipo do feedback, usado para aparencia, icone e duracao padrao. */
  type: PakiToastType;
  /** Titulo exibido em destaque no toast (FR-002). */
  title: string;
  /** Descricao exibida abaixo do titulo (FR-002). */
  description: string;
  /**
   * Duracao resolvida do autodismiss em milissegundos.
   * O valor `0` significa sem autodismiss: o toast so sai por fechamento manual.
   */
  duration: number;
  /**
   * Fase de saida animada. Quando `true`, o item entra na transicao de saida e o
   * servico ja o libera da janela de toasts visiveis, sem aguardar o fim da
   * animacao (risco R-I do research).
   */
  leaving: boolean;
}

/**
 * Duracao padrao do autodismiss por tipo, em milissegundos (FR-004).
 * O valor `0` de `error` significa sem autodismiss: toasts de erro permanecem na
 * tela ate o fechamento manual (AC-004).
 */
export const PAKI_TOAST_DEFAULT_DURATIONS: Record<PakiToastType, number> = {
  success: 5000,
  warning: 7000,
  info: 7000,
  error: 0,
};
