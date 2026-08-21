import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CdkConnectedOverlay, CdkOverlayOrigin } from '@angular/cdk/overlay';

function pad(n: number): string {
  return String(n).padStart(2, '0');
}

function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseIsoDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  const d = new Date(year, month - 1, day);
  if (d.getFullYear() !== year || d.getMonth() !== month - 1 || d.getDate() !== day) return null;
  return d;
}

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function endOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0);
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function clampDate(d: Date, min: string | undefined, max: string | undefined): Date {
  const minDate = parseIsoDate(min);
  const maxDate = parseIsoDate(max);
  if (minDate && d < minDate) return new Date(minDate);
  if (maxDate && d > maxDate) return new Date(maxDate);
  return d;
}

@Component({
  selector: 'paki-date',
  templateUrl: './paki-date.component.html',
  styleUrl: './paki-date.component.scss',
  imports: [CdkOverlayOrigin, CdkConnectedOverlay],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PakiDate), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiDate implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('');
  readonly min = input<string>();
  readonly max = input<string>();
  readonly blurred = output<void>();

  protected readonly value = signal<string>('');
  protected readonly open = signal(false);
  protected readonly disabled = signal(false);
  protected readonly viewDate = signal<Date>(new Date());
  protected readonly focusedDate = signal<Date | null>(null);

  protected readonly triggerRef = viewChild.required<ElementRef<HTMLInputElement>>('trigger');
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  protected isSameDay(a: Date, b: Date): boolean {
    return isSameDay(a, b);
  }

  readonly monthYearLabel = computed(() => {
    const d = this.viewDate();
    return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  });

  readonly weeks = computed(() => {
    const view = this.viewDate();
    const start = startOfMonth(view);
    const end = endOfMonth(view);
    const firstDayOfWeek = start.getDay();
    const days: Array<{ date: Date; day: number; inMonth: boolean; iso: string; disabled: boolean }> = [];
    const cursor = new Date(start);
    cursor.setDate(cursor.getDate() - firstDayOfWeek);

    while (cursor <= end || cursor.getDay() !== 0) {
      const inMonth = cursor.getMonth() === view.getMonth();
      const iso = toIsoDate(cursor);
      const minDate = parseIsoDate(this.min());
      const maxDate = parseIsoDate(this.max());
      const isDisabled = Boolean((minDate && cursor < minDate) || (maxDate && cursor > maxDate));
      days.push({ date: new Date(cursor), day: cursor.getDate(), inMonth, iso, disabled: isDisabled });
      cursor.setDate(cursor.getDate() + 1);
    }

    const weeks: Array<typeof days> = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }
    return weeks;
  });

  readonly displayValue = computed(() => {
    const v = this.value();
    if (!v) return '';
    const d = parseIsoDate(v);
    if (!d) return v;
    return d.toLocaleDateString('pt-BR');
  });

  constructor() {
    effect(() => {
      const valueDate = parseIsoDate(this.value());
      if (valueDate) {
        this.viewDate.set(new Date(valueDate.getFullYear(), valueDate.getMonth(), 1));
      }
    });
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
    if (disabled) this.open.set(false);
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.open.update((o) => !o);
    if (this.open()) {
      const current = parseIsoDate(this.value()) ?? new Date();
      this.viewDate.set(new Date(current.getFullYear(), current.getMonth(), 1));
      this.focusedDate.set(new Date(current));
    }
  }

  protected close(): void {
    this.open.set(false);
    this.onTouched();
    this.blurred.emit();
  }

  protected select(date: Date, event?: MouseEvent): void {
    if (event) event.preventDefault();
    const clamped = clampDate(date, this.min(), this.max());
    const iso = toIsoDate(clamped);
    this.value.set(iso);
    this.onChange(iso);
    this.open.set(false);
    this.onTouched();
    this.blurred.emit();
  }

  protected selectFocused(): void {
    const focused = this.focusedDate();
    if (focused) {
      this.select(focused);
    }
  }

  protected navigateMonth(delta: number): void {
    this.viewDate.update((d) => new Date(d.getFullYear(), d.getMonth() + delta, 1));
  }

  protected onInputKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Enter' || event.key === 'Escape' || event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault();
    }

    if (event.key === 'Escape') {
      this.close();
      return;
    }

    if (event.key === 'Enter') {
      if (!this.open()) {
        this.toggle();
      } else {
        this.selectFocused();
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      if (!this.open()) {
        this.toggle();
      } else {
        this.moveFocused(7);
      }
      return;
    }

    if (event.key === 'ArrowUp') {
      if (this.open()) {
        this.moveFocused(-7);
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      if (this.open()) {
        this.moveFocused(-1);
      }
      return;
    }

    if (event.key === 'ArrowRight') {
      if (this.open()) {
        this.moveFocused(1);
      }
      return;
    }

    if (event.key === 'PageUp') {
      if (!this.open()) this.toggle();
      this.navigateMonth(-1);
      return;
    }

    if (event.key === 'PageDown') {
      if (!this.open()) this.toggle();
      this.navigateMonth(1);
      return;
    }
  }

  protected onDayKeydown(event: KeyboardEvent, day: { date: Date; disabled: boolean }): void {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!day.disabled) {
        this.select(day.date);
      }
      return;
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.close();
      this.triggerRef().nativeElement.focus();
      return;
    }
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'PageUp', 'PageDown'].includes(event.key)) {
      event.preventDefault();
      this.onInputKeydown(event);
    }
  }

  private moveFocused(days: number): void {
    const current = this.focusedDate() ?? parseIsoDate(this.value()) ?? new Date();
    const next = new Date(current);
    next.setDate(next.getDate() + days);
    const clamped = clampDate(next, this.min(), this.max());
    this.focusedDate.set(clamped);
    this.viewDate.set(new Date(clamped.getFullYear(), clamped.getMonth(), 1));
  }
}
