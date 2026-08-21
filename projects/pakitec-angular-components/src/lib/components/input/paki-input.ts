import { ChangeDetectionStrategy, Component, computed, forwardRef, input, output, signal } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'paki-input',
  templateUrl: './paki-input.html',
  styleUrl: './paki-input.scss',
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => PakiInput), multi: true },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiInput implements ControlValueAccessor {
  readonly label = input('');
  readonly type = input<'text' | 'email' | 'password' | 'search' | 'number' | 'currency'>('text');
  readonly placeholder = input('');
  readonly autocomplete = input('off');
  readonly hint = input('');
  readonly list = input('');
  readonly error = input('');
  readonly mask = input<'cep' | 'phone' | 'cpf' | 'cnpj' | null>(null);
  protected readonly effectiveMask = computed(() => this.mask() ?? (this.label() === 'CPF' ? 'cpf' : this.label() === 'CNPJ' ? 'cnpj' : null));
  readonly blurred = output<void>();
  /** Exibe o controle de mostrar/ocultar em campos de senha. */
  readonly showPasswordToggle = input(true);
  protected readonly value = signal('');
  protected readonly disabled = signal(false);
  protected readonly passwordVisible = signal(false);
  private onChange: (value: string | number) => void = () => undefined;
  private onTouched: () => void = () => undefined;
  writeValue(value: string | number | null): void {
    this.value.set(this.type() === 'currency' ? this.formatCurrency(value) : this.formatValue(String(value ?? '')));
  }
  registerOnChange(fn: (value: string | number) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
  setDisabledState(disabled: boolean): void {
    this.disabled.set(disabled);
  }
  protected update(event: Event): void {
    let value = (event.target as HTMLInputElement).value;
    if (this.type() === 'currency') {
      this.value.set(value);
      const parsed = this.parseCurrency(value);
      if (parsed !== null) this.onChange(parsed);
      return;
    }
    value = this.formatValue(value);
    this.value.set(value);
    this.onChange(value);
  }
  protected touch(): void {
    if (this.type() === 'currency') {
      const parsed = this.parseCurrency(this.value()) ?? 0;
      this.value.set(parsed.toFixed(2));
      this.onChange(parsed);
    }
    this.onTouched();
    this.blurred.emit();
  }
  protected togglePasswordVisibility(): void {
    this.passwordVisible.update((visible) => !visible);
  }
  private formatCep(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 8);
    return digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
  }
  private formatPhone(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits ? `(${digits}` : '';
    if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    const split = digits.length === 11 ? 7 : 6;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, split)}-${digits.slice(split)}`;
  }
  private formatValue(value: string): string {
    if (this.effectiveMask() === 'cep') return this.formatCep(value);
    if (this.effectiveMask() === 'phone') return this.formatPhone(value);
    if (this.effectiveMask() === 'cpf') return this.formatCpf(value);
    if (this.effectiveMask() === 'cnpj') return this.formatCnpj(value);
    return value;
  }
  private formatCurrency(value: string | number | null): string {
    const parsed = typeof value === 'number' ? value : this.parseCurrency(String(value ?? ''));
    return Number.isFinite(parsed) ? Number(parsed).toFixed(2) : '0.00';
  }
  private parseCurrency(value: string): number | null {
    const cleaned = value.trim().replace(/[^\d,.-]/g, '');
    if (!cleaned) return 0;
    const normalized = cleaned.includes(',')
      ? cleaned.replace(/\./g, '').replace(',', '.')
      : cleaned;
    const parsed = Number(normalized);
    return Number.isFinite(parsed) ? Math.round((parsed + Number.EPSILON) * 100) / 100 : null;
  }
  private formatCpf(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    return digits
      .replace(/^(\d{3})(\d)/, '$1.$2')
      .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }
  private formatCnpj(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 14);
    return digits
      .replace(/^(\d{2})(\d)/, '$1.$2')
      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
      .replace(/\.(\d{3})(\d)/, '.$1/$2')
      .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
  }
}
