import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
  viewChild,
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
const PANEL_MAX_HEIGHT = 260;
const PANEL_MIN_HEIGHT = 120;
const PANEL_GAP = 6;
const VIEWPORT_MARGIN = 8;

interface PanelPosition {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  up: boolean;
  ready: boolean;
}

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
  /** Contador de instâncias para gerar ids únicos e estáveis. */
  private static instanceCounter = 0;

  readonly label = input('');
  readonly placeholder = input('Selecione');
  readonly items = input<PakiOption[]>([]);
  /** @deprecated Use `items` instead. Kept temporarily for backward compatibility during migration. */
  readonly options = input<PakiOption[]>([]);
  readonly searchFn = input<PakiSearchFn | undefined>(undefined);
  readonly noResultsMessage = input('Nenhum resultado');
  /** Texto auxiliar exibido abaixo do campo quando não há erro. */
  readonly hint = input('');
  /** Mensagem de erro inline. Quando preenchida, marca o campo como inválido. */
  readonly error = input('');
  /** Marca o campo como inválido mesmo sem mensagem de erro. */
  readonly invalid = input(false);

  /** Id numérico único desta instância. */
  private readonly instanceId = ++PakiSelect.instanceCounter;
  /** Id da mensagem de erro; usado em `aria-describedby` quando há erro. */
  protected readonly errorId = `paki-select-error-${this.instanceId}`;
  /** Id do hint; usado em `aria-describedby` quando não há erro. */
  protected readonly hintId = `paki-select-hint-${this.instanceId}`;
  /** Indica se existe mensagem de erro preenchida. */
  protected readonly hasError = computed(() => this.error().length > 0);
  /** Regra única de invalidade: `invalid` explícito ou mensagem de erro não vazia. */
  protected readonly isInvalid = computed(() => this.invalid() || this.hasError());
  /** Associação acessível: aponta para a mensagem de erro ou para o hint. */
  protected readonly ariaDescribedBy = computed(() => {
    if (this.hasError()) return this.errorId;
    if (this.hint()) return this.hintId;
    return null;
  });

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

  private readonly injector = inject(Injector);
  private readonly control = viewChild.required<ElementRef<HTMLElement>>('control');
  private readonly panel = viewChild<ElementRef<HTMLElement>>('panel');
  /**
   * Posição da lista (position: fixed) calculada a partir do campo. Fixed escapa do
   * overflow: hidden de cards e continua dentro de <dialog> modais (top layer),
   * o que um overlay no <body> não faria.
   */
  protected readonly panelPos = signal<PanelPosition>({ top: 0, left: 0, width: 0, maxHeight: PANEL_MAX_HEIGHT, up: false, ready: false });

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
        this.schedulePosition();
      });

    // Enquanto aberta, acompanha rolagem (inclusive de containers, via capture) e resize.
    effect((onCleanup) => {
      if (!this.open()) {
        this.panelPos.update((p) => ({ ...p, ready: false }));
        return;
      }
      this.schedulePosition();
      let frame = 0;
      const onMove = () => {
        if (frame) return;
        frame = requestFrame(() => {
          frame = 0;
          this.reposition();
        });
      };
      window.addEventListener('scroll', onMove, true);
      window.addEventListener('resize', onMove);
      onCleanup(() => {
        window.removeEventListener('scroll', onMove, true);
        window.removeEventListener('resize', onMove);
      });
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

  private schedulePosition(): void {
    afterNextRender(() => this.reposition(), { injector: this.injector });
  }

  /** Posiciona a lista junto ao campo; abre para cima quando falta espaço embaixo. */
  private reposition(): void {
    const panel = this.panel()?.nativeElement;
    if (!this.open() || !panel) return;
    const field = this.control().nativeElement.getBoundingClientRect();
    const viewport = window.innerHeight;
    const below = viewport - field.bottom - PANEL_GAP - VIEWPORT_MARGIN;
    const above = field.top - PANEL_GAP - VIEWPORT_MARGIN;
    const content = Math.min(panel.scrollHeight, PANEL_MAX_HEIGHT);
    const up = content > below && above > below;
    const maxHeight = Math.max(PANEL_MIN_HEIGHT, Math.min(PANEL_MAX_HEIGHT, up ? above : below));
    const height = Math.min(content, maxHeight);
    // Se algum ancestral criar bloco de contenção para fixed (transform, filter...),
    // top/left passam a ser relativos a ele: compensa a origem desse ancestral.
    const origin = fixedOrigin(panel);
    const top = up ? field.top - PANEL_GAP - height : field.bottom + PANEL_GAP;
    this.panelPos.set({ top: top - origin.top, left: field.left - origin.left, width: field.width, maxHeight, up, ready: true });
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

function requestFrame(callback: () => void): number {
  return typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame(callback)
    : (setTimeout(callback, 16) as unknown as number);
}

/** Origem de `position: fixed` para o elemento: a viewport, ou o primeiro ancestral que crie bloco de contenção. */
function fixedOrigin(element: HTMLElement): { top: number; left: number } {
  for (let node = element.parentElement; node; node = node.parentElement) {
    const style = getComputedStyle(node);
    const contain = style.contain ?? '';
    const createsBlock =
      (style.transform && style.transform !== 'none') ||
      (style.perspective && style.perspective !== 'none') ||
      (style.filter && style.filter !== 'none') ||
      /paint|layout|strict|content/.test(contain) ||
      /transform|perspective|filter/.test(style.willChange ?? '');
    if (createsBlock) {
      const rect = node.getBoundingClientRect();
      return { top: rect.top + node.clientTop, left: rect.left + node.clientLeft };
    }
  }
  return { top: 0, left: 0 };
}
