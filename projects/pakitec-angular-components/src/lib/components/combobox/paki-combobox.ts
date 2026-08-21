import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
/**
 * @deprecated Use `PakiSelect` com busca ativa (`[searchFn]` ou `[items]`). Será removido após migração de todos os consumidores.
 */
@Component({
  selector: 'paki-combobox',
  template: `<label
    ><span>{{ label() }}</span>
    <div>
      <input
        [value]="value()"
        [disabled]="disabled()"
        [placeholder]="placeholder()"
        (input)="update($event)"
        (focus)="open.set(true)"
        (blur)="close()"
      />
      @if (open() && filtered().length) {
        <ul role="listbox">
          @for (option of filtered(); track option) {
            <li>
              <button type="button" (mousedown)="choose($event, option)">{{ option }}</button>
            </li>
          }
        </ul>
      }
    </div></label
  >`,
  styleUrl: './paki-combobox.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PakiCombobox), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiCombobox implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('Digite para buscar');
  readonly options = input<string[]>([]);
  protected value = signal('');
  protected disabled = signal(false);
  protected open = signal(false);
  protected filtered = computed(() => {
    const q = this.value().toLocaleLowerCase('pt-BR');
    return this.options()
      .filter((v) => !q || v.toLocaleLowerCase('pt-BR').includes(q))
      .slice(0, 12);
  });
  private change = (v: string) => {};
  private touch = () => {};
  writeValue(v: string | null) {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void) {
    this.change = fn;
  }
  registerOnTouched(fn: () => void) {
    this.touch = fn;
  }
  setDisabledState(v: boolean) {
    this.disabled.set(v);
  }
  protected update(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    this.value.set(v);
    this.change(v);
    this.open.set(true);
  }
  protected choose(e: MouseEvent, v: string) {
    e.preventDefault();
    this.value.set(v);
    this.change(v);
    this.open.set(false);
  }
  protected close() {
    this.touch();
    setTimeout(() => this.open.set(false));
  }
}
