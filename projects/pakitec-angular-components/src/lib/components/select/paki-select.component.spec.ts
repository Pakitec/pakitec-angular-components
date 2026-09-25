import { Component, signal } from '@angular/core';
import { vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { PakiOption, PakiSearchFn, PakiSelect } from './paki-select.component';

const OPTIONS: PakiOption[] = [
  { value: '1', label: 'Cachorro' },
  { value: '2', label: 'Gato' },
  { value: '3', label: 'Pássaro' },
  { value: '4', label: 'Coelho' },
  { value: '5', label: 'Hamster' },
  { value: '6', label: 'Peixe' },
  { value: '7', label: 'Tartaruga' },
  { value: '8', label: 'Cavalo' },
  { value: '9', label: 'Vaca' },
  { value: '10', label: 'Ovelha' },
  { value: '11', label: 'Cabra' },
  { value: '12', label: 'Porco' },
];

@Component({
  imports: [PakiSelect, ReactiveFormsModule],
  template: `
    <paki-select label="Espécie" placeholder="Selecione" [items]="items" [formControl]="control" />
  `,
})
class LocalHost {
  items = OPTIONS;
  control = new FormControl('');
}

@Component({
  imports: [PakiSelect, ReactiveFormsModule],
  template: `
    <paki-select label="Espécie" [items]="items" [searchFn]="search" [formControl]="control" />
  `,
})
class RemoteHost {
  items: PakiOption[] = [];
  control = new FormControl('');
  search: PakiSearchFn = (term: string): Observable<PakiOption[]> => {
    const filtered = OPTIONS.filter((o) =>
      o.label.toLocaleLowerCase('pt-BR').includes(term.toLocaleLowerCase('pt-BR')),
    );
    return of(filtered).pipe(delay(50));
  };
}

@Component({
  imports: [PakiSelect, ReactiveFormsModule],
  template: '<paki-select label="Espécie" [items]="items" error="Campo obrigatório" />',
})
class SelectErrorHost {
  items = OPTIONS;
}

@Component({
  imports: [PakiSelect, ReactiveFormsModule],
  template: '<paki-select label="Espécie" [items]="items" [invalid]="true" />',
})
class SelectInvalidNoErrorHost {
  items = OPTIONS;
}

@Component({
  imports: [PakiSelect, ReactiveFormsModule],
  template: `
    <paki-select label="Espécie" [items]="items" error="Erro primeiro" />
    <paki-select label="Espécie" [items]="items" error="Erro segundo" />
  `,
})
class TwoSelectsSameLabelHost {
  items = OPTIONS;
}

@Component({
  imports: [PakiSelect, ReactiveFormsModule],
  template: '<paki-select label="Espécie" [items]="items" [error]="errorMessage()" />',
})
class SelectDynamicErrorHost {
  items = OPTIONS;
  errorMessage = signal('Erro inicial');
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('PakiSelect', () => {
  it('renders the input and label', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('span');
    const input = fixture.nativeElement.querySelector('input');
    expect(label.textContent).toBe('Espécie');
    expect(input).toBeTruthy();
    expect(input.getAttribute('role')).toBe('combobox');
  });

  it('filters local options with debounce', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    fixture.detectChanges();

    input.value = 'Ca';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(document.querySelectorAll('li[role="option"]').length).toBe(0);

    await wait(320);
    fixture.detectChanges();
    const options = document.querySelectorAll('li[role="option"]');
    expect(options.length).toBeGreaterThan(0);
    expect(Array.from(options).some((o) => o.textContent?.trim() === 'Cachorro')).toBe(true);
  });

  it('calls searchFn for remote search and debounces', async () => {
    await TestBed.configureTestingModule({ imports: [RemoteHost] }).compileComponents();
    const fixture = TestBed.createComponent(RemoteHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    fixture.detectChanges();

    input.value = 'Ca';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    await wait(320);
    fixture.detectChanges();
    await wait(80);
    fixture.detectChanges();

    const options = document.querySelectorAll('li[role="option"]');
    expect(options.length).toBeGreaterThan(0);
  });

  it('limits visible options to 10 initially and 50 maximum', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    fixture.detectChanges();

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await wait(320);
    fixture.detectChanges();

    expect(document.querySelectorAll('li[role="option"]').length).toBe(10);

    const dropdown = document.querySelector('.paki-select__dropdown') as HTMLElement;
    dropdown.scrollTop = dropdown.scrollHeight;
    dropdown.dispatchEvent(new Event('scroll'));
    await wait(0);
    fixture.detectChanges();

    expect(document.querySelectorAll('li[role="option"]').length).toBe(12);
  });

  it('shows "Nenhum resultado" when search has no matches', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    fixture.detectChanges();

    input.value = 'xyz';
    input.dispatchEvent(new Event('input'));
    await wait(320);
    fixture.detectChanges();

    const feedback = document.querySelector('.paki-select__feedback');
    expect(feedback?.textContent).toBe('Nenhum resultado');
  });

  it('navigates options with keyboard and selects on Enter', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    fixture.detectChanges();

    input.value = '';
    input.dispatchEvent(new Event('input'));
    await wait(320);
    fixture.detectChanges();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toBe(OPTIONS[1].value);
    expect(document.querySelector('.paki-select__dropdown')).toBeFalsy();
  });

  it('closes on Escape and Tab', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    fixture.detectChanges();
    expect(document.querySelector('.paki-select__dropdown')).toBeTruthy();

    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(document.querySelector('.paki-select__dropdown')).toBeFalsy();

    input.focus();
    fixture.detectChanges();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Tab', bubbles: true }));
    fixture.detectChanges();
    expect(document.querySelector('.paki-select__dropdown')).toBeFalsy();
  });

  it('keeps the typed search visible even when a value is already selected', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.componentInstance.control.setValue('2');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Gato');

    input.dispatchEvent(new Event('focus'));
    input.value = 'Ca';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(input.value).toBe('Ca');

    await wait(320);
    fixture.detectChanges();
    expect(input.value).toBe('Ca');
    const labels = Array.from(fixture.nativeElement.querySelectorAll('li[role="option"]')).map((li) => (li as HTMLElement).textContent?.trim());
    expect(labels).toEqual(['Cachorro', 'Cavalo', 'Vaca', 'Cabra']);
  });

  it('restores the selected label and clears the search on blur', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.componentInstance.control.setValue('2');
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));
    input.value = 'Ca';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(input.value).toBe('Gato');
    expect(fixture.componentInstance.control.value).toBe('2');
  });

  it('renders the dropdown inside the positioned control and highlights the match', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));
    input.value = 'pass';
    input.dispatchEvent(new Event('input'));
    await wait(320);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.paki-select__control > .paki-select__dropdown')).toBeTruthy();
    const mark: HTMLElement = fixture.nativeElement.querySelector('li[role="option"] mark');
    expect(mark.textContent).toBe('Páss');
  });

  it('positions the fixed dropdown at the field with the field width', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.detectChanges();
    const control: HTMLElement = fixture.nativeElement.querySelector('.paki-select__control');
    control.getBoundingClientRect = () => ({ top: 100, bottom: 142, left: 40, right: 280, width: 240, height: 42, x: 40, y: 100, toJSON: () => ({}) }) as DOMRect;
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    await wait(320);
    fixture.detectChanges();
    await fixture.whenStable();

    const panel: HTMLElement = fixture.nativeElement.querySelector('.paki-select__dropdown');
    expect(panel.style.width).toBe('240px');
    expect(panel.style.left).toBe('40px');
    expect(panel.style.top).toBe('148px');
    expect(panel.classList.contains('up')).toBe(false);
  });

  it('opens upwards when there is no room below the field', async () => {
    const scroll = vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(200);
    try {
      await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
      const fixture = TestBed.createComponent(LocalHost);
      fixture.detectChanges();
      const bottomEdge = window.innerHeight - 10;
      const control: HTMLElement = fixture.nativeElement.querySelector('.paki-select__control');
      control.getBoundingClientRect = () => ({ top: bottomEdge - 42, bottom: bottomEdge, left: 40, right: 280, width: 240, height: 42, x: 40, y: bottomEdge - 42, toJSON: () => ({}) }) as DOMRect;
      const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
      input.dispatchEvent(new Event('focus'));
      fixture.detectChanges();
      await wait(320);
      fixture.detectChanges();
      await fixture.whenStable();

      const panel: HTMLElement = fixture.nativeElement.querySelector('.paki-select__dropdown');
      expect(panel.classList.contains('up')).toBe(true);
      expect(parseFloat(panel.style.top)).toBe(bottomEdge - 42 - 6 - 200);
    } finally {
      scroll.mockRestore();
    }
  });

  it('reflects external form control value', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.componentInstance.control.setValue('2');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Gato');
  });

  describe('estado de erro (TASK-012)', () => {
    it('error não vazio marca inválido, mostra borda e mensagem (AC-009)', async () => {
      await TestBed.configureTestingModule({ imports: [SelectErrorHost] }).compileComponents();
      const fixture = TestBed.createComponent(SelectErrorHost);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input[role="combobox"]') as HTMLInputElement;
      const message = fixture.nativeElement.querySelector('small.error') as HTMLElement;

      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(message).toBeTruthy();
      expect(message.textContent).toBe('Campo obrigatório');
      expect(input.getAttribute('aria-describedby')).toBe(message.id);
    });

    it('invalid = true sem error mostra somente a borda, sem slot residual', async () => {
      await TestBed.configureTestingModule({ imports: [SelectInvalidNoErrorHost] }).compileComponents();
      const fixture = TestBed.createComponent(SelectInvalidNoErrorHost);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input[role="combobox"]') as HTMLInputElement;

      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(fixture.nativeElement.querySelector('small')).toBeNull();
    });

    it('aria-invalid e aria-describedby apontam para o id real da mensagem (AC-010)', async () => {
      await TestBed.configureTestingModule({ imports: [SelectErrorHost] }).compileComponents();
      const fixture = TestBed.createComponent(SelectErrorHost);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input[role="combobox"]') as HTMLInputElement;
      const message = fixture.nativeElement.querySelector('small.error') as HTMLElement;

      expect(message.id).toBeTruthy();
      expect(input.getAttribute('aria-invalid')).toBe('true');
      expect(input.getAttribute('aria-describedby')).toBe(message.id);
    });

    it('ids de duas instâncias com o mesmo label são distintos', async () => {
      await TestBed.configureTestingModule({ imports: [TwoSelectsSameLabelHost] }).compileComponents();
      const fixture = TestBed.createComponent(TwoSelectsSameLabelHost);
      fixture.detectChanges();

      const inputs = fixture.nativeElement.querySelectorAll('input[role="combobox"]');
      const messages = fixture.nativeElement.querySelectorAll('small.error');

      expect(messages.length).toBe(2);
      expect(messages[0].id).not.toBe(messages[1].id);
      expect(inputs[0].getAttribute('aria-describedby')).toBe(messages[0].id);
      expect(inputs[1].getAttribute('aria-describedby')).toBe(messages[1].id);
    });

    it('mensagem de texto acompanha o estado (AC-011)', async () => {
      await TestBed.configureTestingModule({ imports: [SelectDynamicErrorHost] }).compileComponents();
      const fixture = TestBed.createComponent(SelectDynamicErrorHost);
      fixture.detectChanges();

      const input = fixture.nativeElement.querySelector('input[role="combobox"]') as HTMLInputElement;
      const getMessage = () => fixture.nativeElement.querySelector('small.error') as HTMLElement | null;

      expect(getMessage()?.textContent).toBe('Erro inicial');
      expect(input.getAttribute('aria-describedby')).toBe(getMessage()?.id ?? '');

      fixture.componentInstance.errorMessage.set('Erro atualizado');
      fixture.detectChanges();
      expect(getMessage()?.textContent).toBe('Erro atualizado');

      fixture.componentInstance.errorMessage.set('');
      fixture.detectChanges();
      expect(getMessage()).toBeNull();
      expect(input.getAttribute('aria-describedby')).toBeNull();
    });
  });
});
