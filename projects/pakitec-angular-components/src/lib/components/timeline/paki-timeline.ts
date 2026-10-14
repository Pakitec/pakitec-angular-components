import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type PakiTimelineTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export interface PakiTimelineItem {
  id: string;
  title: string;
  description?: string;
  /** Texto de data/hora já formatado para exibição. */
  time: string;
  /** Data ISO usada no atributo `datetime`, quando disponível. */
  datetime?: string;
  author?: string;
  tone?: PakiTimelineTone;
}

/** Linha do tempo vertical para histórico de decisões, auditoria e tentativas. */
@Component({
  selector: 'paki-timeline',
  templateUrl: './paki-timeline.html',
  styleUrl: './paki-timeline.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiTimeline {
  readonly items = input.required<readonly PakiTimelineItem[]>();
  readonly label = input('Histórico');
  /** Texto exibido quando não há itens. */
  readonly emptyText = input('Nenhum registro no histórico.');
}
