import { ChangeDetectionStrategy, Component, computed, input, model, signal } from '@angular/core';

export type PakiPeriodPreset = 'current-month' | 'previous-month' | 'last-3-months' | 'last-6-months' | 'last-12-months' | 'current-year' | 'custom';

export interface PakiPeriod {
  preset: PakiPeriodPreset;
  /** Data inicial (YYYY-MM-DD), inclusive. */
  start: string;
  /** Data final (YYYY-MM-DD), inclusive. */
  end: string;
}

export const PAKI_PERIOD_PRESETS: readonly { value: PakiPeriodPreset; label: string }[] = [
  { value: 'current-month', label: 'Mês atual' },
  { value: 'previous-month', label: 'Mês anterior' },
  { value: 'last-3-months', label: 'Últimos 3 meses' },
  { value: 'last-6-months', label: 'Últimos 6 meses' },
  { value: 'last-12-months', label: 'Últimos 12 meses' },
  { value: 'current-year', label: 'Ano atual' },
  { value: 'custom', label: 'Personalizado' },
];

const pad = (value: number): string => String(value).padStart(2, '0');
/** Formata em data local, evitando o deslocamento de fuso do `toISOString`. */
const format = (date: Date): string => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

/** Calcula o intervalo de um período predefinido. Os meses terminam no último dia do mês, exceto o mês atual. */
export function resolvePeriodPreset(preset: Exclude<PakiPeriodPreset, 'custom'>, today: Date): Pick<PakiPeriod, 'start' | 'end'> {
  const year = today.getFullYear();
  const month = today.getMonth();
  const monthsBack = (count: number) => ({ start: format(new Date(year, month - (count - 1), 1)), end: format(new Date(year, month + 1, 0)) });
  switch (preset) {
    case 'current-month': return monthsBack(1);
    case 'previous-month': return { start: format(new Date(year, month - 1, 1)), end: format(new Date(year, month, 0)) };
    case 'last-3-months': return monthsBack(3);
    case 'last-6-months': return monthsBack(6);
    case 'last-12-months': return monthsBack(12);
    case 'current-year': return { start: `${year}-01-01`, end: `${year}-12-31` };
  }
}

/** Seletor de período com atalhos e intervalo personalizado. */
@Component({
  selector: 'paki-period-picker',
  templateUrl: './paki-period-picker.html',
  styleUrl: './paki-period-picker.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiPeriodPicker {
  readonly value = model<PakiPeriod | null>(null);
  readonly label = input('Período');
  /** Data de referência dos atalhos. Útil em testes. */
  readonly today = input<Date>(new Date());
  protected readonly presets = PAKI_PERIOD_PRESETS;
  protected readonly customStart = signal('');
  protected readonly customEnd = signal('');
  protected readonly selectedPreset = computed<PakiPeriodPreset>(() => this.customMode() ? 'custom' : (this.value()?.preset ?? 'current-month'));
  protected readonly customMode = signal(false);
  protected readonly error = computed(() => {
    const start = this.customStart();
    const end = this.customEnd();
    return this.customMode() && start && end && start > end ? 'A data inicial deve ser anterior ou igual à data final.' : '';
  });

  protected selectPreset(preset: PakiPeriodPreset): void {
    if (preset === 'custom') {
      this.customMode.set(true);
      const current = this.value();
      this.customStart.set(current?.start ?? '');
      this.customEnd.set(current?.end ?? '');
      return;
    }
    this.customMode.set(false);
    this.value.set({ preset, ...resolvePeriodPreset(preset, this.today()) });
  }

  protected setCustom(edge: 'start' | 'end', date: string): void {
    (edge === 'start' ? this.customStart : this.customEnd).set(date);
    const start = this.customStart();
    const end = this.customEnd();
    if (start && end && start <= end) this.value.set({ preset: 'custom', start, end });
  }
}
