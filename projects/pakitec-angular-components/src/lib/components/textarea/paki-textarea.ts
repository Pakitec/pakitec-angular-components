import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'paki-textarea',
  template: `<label
    ><span>{{ label() }}</span
    ><textarea
      [rows]="rows()"
      [placeholder]="placeholder()"
      [value]="value()"
      [disabled]="disabled()"
      (input)="update($event)"
      (blur)="touched()"
    ></textarea>
  </label>`,
  styleUrl: './paki-textarea.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PakiTextarea), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiTextarea implements ControlValueAccessor {
  readonly label = input('');
  readonly placeholder = input('');
  readonly rows = input(3);
  protected value = signal('');
  protected disabled = signal(false);
  private change = (v: string) => {};
  protected touched = () => {};
  writeValue(v: string | null) {
    this.value.set(v ?? '');
  }
  registerOnChange(fn: (v: string) => void) {
    this.change = fn;
  }
  registerOnTouched(fn: () => void) {
    this.touched = fn;
  }
  setDisabledState(v: boolean) {
    this.disabled.set(v);
  }
  protected update(e: Event) {
    const v = (e.target as HTMLTextAreaElement).value;
    this.value.set(v);
    this.change(v);
  }
}
