import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';

export interface PakiChartPoint {
  label: string;
  /** `null` indica dado ausente, que é diferente de zero. */
  value: number | null;
}

export interface PakiChartSeries {
  name: string;
  points: readonly PakiChartPoint[];
}

export interface PakiChartSelection {
  series: string;
  label: string;
  index: number;
  value: number;
}

export type PakiChartType = 'line' | 'bar';

const WIDTH = 640;
const MARGIN = { top: 16, right: 16, bottom: 32, left: 64 };
const TICKS = 4;
const COLORS = ['var(--color-accent)', 'var(--info-500)', 'var(--warning-500)', 'var(--success-500)', 'var(--ink-500)'];
const defaultFormat = (value: number): string => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 }).format(value);

/** Arredonda o passo do eixo para 1, 2, 2,5, 5 ou 10 vezes uma potência de 10. */
export function niceStep(rawStep: number): number {
  if (rawStep <= 0) return 1;
  const magnitude = 10 ** Math.floor(Math.log10(rawStep));
  const fraction = rawStep / magnitude;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * magnitude;
}

interface Mark { series: string; label: string; index: number; value: number; x: number; y: number; width: number; height: number; color: string; text: string }

/**
 * Gráfico de linhas ou barras em SVG, com um único eixo de valores.
 * Não misture unidades diferentes (por exemplo, reais e kWh) no mesmo gráfico.
 * Cada ponto é focável e emite `pointSelect`, e uma tabela oculta oferece o mesmo dado a leitores de tela.
 */
@Component({
  selector: 'paki-chart',
  templateUrl: './paki-chart.html',
  styleUrl: './paki-chart.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiChart {
  readonly series = input.required<readonly PakiChartSeries[]>();
  readonly type = input<PakiChartType>('line');
  /** Nome acessível do gráfico, incluindo a unidade (por exemplo, "Despesas por mês, em reais"). */
  readonly label = input.required<string>();
  readonly height = input(280);
  readonly valueFormat = input<(value: number) => string>(defaultFormat);
  readonly pointSelect = output<PakiChartSelection>();

  protected readonly width = WIDTH;
  protected readonly margin = MARGIN;
  protected readonly colors = COLORS;

  protected readonly labels = computed(() => this.series()[0]?.points.map((point) => point.label) ?? []);
  protected readonly hasData = computed(() => this.series().some((series) => series.points.some((point) => point.value !== null)));

  protected readonly axis = computed(() => {
    const max = Math.max(0, ...this.series().flatMap((series) => series.points.map((point) => point.value ?? 0)));
    const step = niceStep(max / TICKS);
    const top = step * TICKS;
    const plotHeight = this.height() - MARGIN.top - MARGIN.bottom;
    const ticks = Array.from({ length: TICKS + 1 }, (_, index) => {
      const value = step * index;
      return { value, y: MARGIN.top + plotHeight - (value / top) * plotHeight, text: this.valueFormat()(value) };
    });
    return { top, plotHeight, ticks };
  });

  protected readonly marks = computed<Mark[]>(() => {
    const series = this.series();
    const count = this.labels().length;
    if (!count) return [];
    const { top, plotHeight } = this.axis();
    const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
    const slot = plotWidth / count;
    const barWidth = Math.max(4, (slot * 0.7) / series.length);
    const format = this.valueFormat();
    return series.flatMap((item, seriesIndex) => item.points.flatMap((point, index) => {
      if (point.value === null) return [];
      const height = (point.value / top) * plotHeight;
      const y = MARGIN.top + plotHeight - height;
      const center = MARGIN.left + slot * index + slot / 2;
      const x = this.type() === 'bar' ? center - (barWidth * series.length) / 2 + barWidth * seriesIndex : center;
      return [{ series: item.name, label: point.label, index, value: point.value, x, y, width: barWidth, height, color: COLORS[seriesIndex % COLORS.length]!, text: `${item.name}, ${point.label}: ${format(point.value)}` }];
    }));
  });

  /** Caminhos das linhas. Valores ausentes interrompem o traço em vez de ligar pontos distantes. */
  protected readonly paths = computed(() => this.series().map((item, seriesIndex) => {
    const marks = this.marks().filter((mark) => mark.series === item.name);
    const byIndex = new Map(marks.map((mark) => [mark.index, mark]));
    let path = '';
    let drawing = false;
    item.points.forEach((_, index) => {
      const mark = byIndex.get(index);
      if (!mark) { drawing = false; return; }
      path += `${drawing ? 'L' : 'M'}${mark.x.toFixed(1)} ${mark.y.toFixed(1)} `;
      drawing = true;
    });
    return { name: item.name, color: COLORS[seriesIndex % COLORS.length]!, d: path.trim() };
  }));

  protected readonly labelStep = computed(() => Math.ceil(this.labels().length / 8) || 1);

  protected labelX(index: number): number {
    const slot = (WIDTH - MARGIN.left - MARGIN.right) / this.labels().length;
    return MARGIN.left + slot * index + slot / 2;
  }

  protected select(mark: Mark): void {
    this.pointSelect.emit({ series: mark.series, label: mark.label, index: mark.index, value: mark.value });
  }

  protected cell(point: PakiChartPoint | undefined): string {
    return point?.value == null ? 'Sem dados' : this.valueFormat()(point.value);
  }
}
