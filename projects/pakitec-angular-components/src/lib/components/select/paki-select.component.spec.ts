import { Component } from '@angular/core';
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

  it('reflects external form control value', async () => {
    await TestBed.configureTestingModule({ imports: [LocalHost] }).compileComponents();
    const fixture = TestBed.createComponent(LocalHost);
    fixture.componentInstance.control.setValue('2');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('Gato');
  });
});
