import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PakiInput } from './paki-input';
@Component({
  imports: [PakiInput, ReactiveFormsModule],
  template: '<paki-input label="Nome" [formControl]="control" />',
})
class Host {
  control = new FormControl('Amora');
}
@Component({
  imports: [PakiInput, ReactiveFormsModule],
  template: '<paki-input label="Senha" type="password" [formControl]="control" />',
})
class PasswordHost {
  control = new FormControl('Secret@123');
}
@Component({ imports: [PakiInput, ReactiveFormsModule], template: '<paki-input label="CEP" mask="cep" [formControl]="control" />' })
class CepHost { control = new FormControl(''); }
@Component({ imports: [PakiInput, ReactiveFormsModule], template: '<paki-input label="Telefone" mask="phone" [formControl]="control" />' })
class PhoneHost { control = new FormControl(''); }
@Component({ imports: [PakiInput, ReactiveFormsModule], template: '<paki-input label="CPF" [formControl]="control" />' })
class CpfHost { control = new FormControl('42831472814'); }
@Component({ imports: [PakiInput, ReactiveFormsModule], template: '<paki-input label="CNPJ" [formControl]="control" />' })
class CnpjHost { control = new FormControl('33748083000150'); }
@Component({ imports: [PakiInput, ReactiveFormsModule], template: '<paki-input label="Preço" type="currency" [formControl]="control" />' })
class CurrencyHost { control = new FormControl(35); }
describe('PakiInput', () => {
  it('works with reactive forms', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    expect((fixture.nativeElement.querySelector('input') as HTMLInputElement).value).toBe('Amora');
  });
  it('shows and hides password values accessibly', async () => {
    await TestBed.configureTestingModule({ imports: [PasswordHost] }).compileComponents();
    const fixture = TestBed.createComponent(PasswordHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const toggle = fixture.nativeElement.querySelector('.password-toggle') as HTMLButtonElement;
    expect(input.type).toBe('password');
    expect(toggle.getAttribute('aria-label')).toBe('Mostrar senha');
    toggle.click();
    fixture.detectChanges();
    expect(input.type).toBe('text');
    expect(toggle.getAttribute('aria-label')).toBe('Ocultar senha');
  });
  it('formats CEP while typing', async () => {
    await TestBed.configureTestingModule({ imports: [CepHost] }).compileComponents();
    const fixture = TestBed.createComponent(CepHost); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '13233681'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(input.value).toBe('13233-681');
    expect(fixture.componentInstance.control.value).toBe('13233-681');
  });
  it('formats Brazilian phone numbers while typing', async () => {
    await TestBed.configureTestingModule({ imports: [PhoneHost] }).compileComponents();
    const fixture = TestBed.createComponent(PhoneHost); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = '119982151482'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(input.value).toBe('(11) 99821-5148');
    expect(fixture.componentInstance.control.value).toBe('(11) 99821-5148');
  });
  it('formats CPF values', async () => {
    await TestBed.configureTestingModule({ imports: [CpfHost] }).compileComponents();
    const fixture = TestBed.createComponent(CpfHost); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('428.314.728-14');
    input.value = '12345678901'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(input.value).toBe('123.456.789-01');
  });
  it('formats CNPJ values', async () => {
    await TestBed.configureTestingModule({ imports: [CnpjHost] }).compileComponents();
    const fixture = TestBed.createComponent(CnpjHost); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('33.748.083/0001-50');
    input.value = '12345678000199'; input.dispatchEvent(new Event('input')); fixture.detectChanges();
    expect(input.value).toBe('12.345.678/0001-99');
  });
  it('keeps monetary values numeric and displays two decimal places', async () => {
    await TestBed.configureTestingModule({ imports: [CurrencyHost] }).compileComponents();
    const fixture = TestBed.createComponent(CurrencyHost); fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('35.00');
    expect(input.inputMode).toBe('decimal');
    input.value = '42,5'; input.dispatchEvent(new Event('input')); input.dispatchEvent(new Event('blur')); fixture.detectChanges();
    expect(input.value).toBe('42.50');
    expect(fixture.componentInstance.control.value).toBe(42.5);
  });
});
