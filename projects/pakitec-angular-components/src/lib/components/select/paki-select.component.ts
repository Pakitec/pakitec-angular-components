import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable, of, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { highlightParts, PakiHighlightPart } from './select-highlight';

export interface PakiOption {
  label: string;
  value: string;
}

export type PakiSearchFn = (term: string) => Observable<PakiOption[]> | PakiOption[];

const INITIAL_VISIBLE = 10;
const MAX_RESULTS = 50;
const DEBOUNCE_MS = 300;

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLocaleLowerCase('pt-BR');
}

function toObservable<T>(value: T | Observable<T>): Observable<T> {
  return value instanceof Observable ? value : of(value);
}

@Component({
  selector: 'paki-select',
  templateUrl: './paki-select.component.html',
  styleUrl: './paki-select.component.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PakiSelect), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiSelect implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('Selecione');
  readonly items = input<PakiOption[]>([]);
  /** @deprecated Use `items` instead. Kept temporarily for backward compatibility during migration. */
  readonly options = input<PakiOption[]>([]);
  readonly searchFn = input<PakiSearchFn | undefined>(undefined);
  readonly noResultsMessage = input('Nenhum resultado');

  protected readonly value = signal<string>('');
  protected readonly disabled = signal(false);
  protected readonly open = signal(false);
  protected readonly searchTerm = signal('');
  protected readonly filtered = signal<PakiOption[]>([]);
  protected readonly activeIndex = signal(-1);
  protected readonly visibleCount = signal(INITIAL_VISIBLE);
  protected readonly searching = signal(false);
  /** true enquanto o usuário digita: o campo mostra a busca em vez do rótulo selecionado. */
  protected readonly editing = signal(false);
  /** Última opção escolhida: garante o rótulo na busca remota, quando ela não está em `items`. */
  private readonly selectedOption = signal<PakiOption | null>(null);

  readonly effectiveItems = computed(() => (this.items().length > 0 ? this.items() : this.options()));

  private readonly search$ = new Subject<string>();
  private searchSubscription: Subscription | null = null;
  private onChange: (value: string) => void = () => undefined;
  private onTouched: () => void = () => undefined;

  readonly selectedLabel = computed(() => {
    const v = this.value();
    if (!v) return '';
    const picked = this.selectedOption();
    return this.effectiveItems().find((o) => o.value === v)?.label ?? (picked?.value === v ? picked.label : v);
  });

  /** Texto exibido no campo: a busca enquanto edita; senão o rótulo selecionado. */
  readonly displayText = computed(() =>
    this.editing() ? this.searchTerm() : this.selectedLabel() || this.searchTerm(),
  );

  readonly displayOptions = computed(() => {
    const all = this.filtered();
    const count = Math.min(this.visibleCount(), MAX_RESULTS, all.length);
    return all.slice(0, count);
  });

  readonly hasResults = computed(() => this.displayOptions().length > 0);
  readonly showNoResults = computed(() => this.open() && !this.searching() && this.filtered().length === 0);

  constructor() {
    this.searchSubscription = this.search$
      .pipe(
        debounceTime(DEBOUNCE_MS),
        distinctUntilChanged(),
        switchMap((term) => {
          this.searching.set(true);
          const fn = this.searchFn();
          if (fn) {
            return toObservable(fn(term));
          }
          const normalized = normalize(term);
          const local = this.effectiveItems().filter((o) =>
            normalize(o.label).includes(normalized),
          );
          return of(local);
        }),
      )
      .subscribe((results) => {
        const limited = results.slice(0, MAX_RESULTS);
        this.filtered.set(limited);
        this.activeIndex.set(limited.length > 0 ? 0 : -1);
        this.visibleCount.set(INITIAL_VISIBLE);
        this.searching.set(false);
      });

    effect(() => {
      this.effectiveItems();
      if (!this.searchFn() && this.open()) {
        this.search$.next(this.searchTerm());
      }
    });
  }

  writeValue(value: string | null | undefined): void {
    this.value.set(value ?? '');
    this.editing.set(false);
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

  protected onInput(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.editing.set(true);
    this.searchTerm.set(term);
    this.open.set(true);
    this.search$.next(term);
  }

  protected onFocus(event?: FocusEvent): void {
    this.open.set(true);
    if (this.filtered().length === 0) {
      this.search$.next(this.searchTerm());
    }
    // Seleciona o rótulo atual: digitar substitui em vez de concatenar.
    (event?.target as HTMLInputElement | undefined)?.select();
  }

  protected onBlur(): void {
    this.onTouched();
    this.open.set(false);
    this.resetQuery();
  }

  /** Sai do modo de edição e limpa a busca, para a lista reabrir completa. */
  private resetQuery(): void {
    this.editing.set(false);
    if (this.searchTerm() !== '') {
      this.searchTerm.set('');
      this.search$.next('');
    }
  }

  protected highlight(label: string): PakiHighlightPart[] {
    return highlightParts(label, this.editing() ? this.searchTerm() : '');
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.open.update((o) => !o);
    if (this.open()) {
      this.editing.set(false);
      this.searchTerm.set('');
      this.search$.next('');
    }
  }

  protected select(option: PakiOption): void {
    this.value.set(option.value);
    this.selectedOption.set(option);
    this.onChange(option.value);
    this.open.set(false);
    this.resetQuery();
    this.onTouched();
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(event.key)) {
      event.preventDefault();
    }

    if (event.key === 'Escape') {
      this.open.set(false);
      this.resetQuery();
      return;
    }

    if (event.key === 'Tab') {
      this.open.set(false);
      this.resetQuery();
      return;
    }

    if (event.key === 'Enter') {
      const idx = this.activeIndex();
      const options = this.displayOptions();
      if (this.open() && idx >= 0 && idx < options.length) {
        this.select(options[idx]);
      } else {
        this.open.set(!this.open());
        if (this.open()) this.search$.next(this.searchTerm());
      }
      return;
    }

    if (event.key === 'ArrowDown') {
      if (!this.open()) {
        this.open.set(true);
        this.search$.next(this.searchTerm());
      }
      this.activeIndex.update((i) => {
        const next = i + 1;
        return next >= this.displayOptions().length ? 0 : next;
      });
      return;
    }

    if (event.key === 'ArrowUp') {
      if (!this.open()) return;
      this.activeIndex.update((i) => {
        const next = i - 1;
        return next < 0 ? this.displayOptions().length - 1 : next;
      });
      return;
    }
  }

  protected onScroll(event: Event): void {
    const target = event.target as HTMLElement;
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 20;
    if (nearBottom) {
      this.visibleCount.update((c) => Math.min(c + INITIAL_VISIBLE, MAX_RESULTS));
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }
}
