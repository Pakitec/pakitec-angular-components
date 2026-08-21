import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PakiDate } from './paki-date.component';

@Component({
  imports: [PakiDate, ReactiveFormsModule],
  template: `
    <paki-date label="Data" placeholder="Selecione" [formControl]="control" />
  `,
})
class Host {
  control = new FormControl('');
}

@Component({
  imports: [PakiDate, ReactiveFormsModule],
  template: `
    <paki-date label="Data" [formControl]="control" [min]="'2024-01-15'" [max]="'2024-01-20'" />
  `,
})
class ConstrainedHost {
  control = new FormControl('');
}

describe('PakiDate', () => {
  it('renders the trigger input with label', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('span');
    const input = fixture.nativeElement.querySelector('input');
    expect(label.textContent).toBe('Data');
    expect(input).toBeTruthy();
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('readonly')).not.toBeNull();
  });

  it('opens calendar on click', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.click();
    fixture.detectChanges();
    const calendar = document.querySelector('.calendar');
    expect(calendar).toBeTruthy();
  });

  it('selects a date via keyboard and updates form control', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    const focusedButton = document.querySelector('td.focused button') as HTMLButtonElement;
    expect(focusedButton).toBeTruthy();
    focusedButton.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.control.value).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(input.value).toMatch(/^\d{2}\/\d{2}\/\d{4}$/);
  });

  it('navigates months with PageUp and PageDown', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.focus();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();

    const monthYearBefore = document.querySelector('.month-year')?.textContent ?? '';
    const calendar = document.querySelector('.calendar') as HTMLElement;
    calendar.dispatchEvent(new KeyboardEvent('keydown', { key: 'PageDown', bubbles: true }));
    fixture.detectChanges();
    const monthYearAfter = document.querySelector('.month-year')?.textContent ?? '';
    expect(monthYearAfter).not.toBe(monthYearBefore);
  });

  it('closes calendar on Escape', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.click();
    fixture.detectChanges();
    expect(document.querySelector('.calendar')).toBeTruthy();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    expect(document.querySelector('.calendar')).toBeFalsy();
  });

  it('respects min and max constraints', async () => {
    await TestBed.configureTestingModule({ imports: [ConstrainedHost] }).compileComponents();
    const fixture = TestBed.createComponent(ConstrainedHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    input.click();
    fixture.detectChanges();

    const disabledButtons = document.querySelectorAll('td.disabled button:disabled');
    expect(disabledButtons.length).toBeGreaterThan(0);
  });

  it('reflects an external form control value', async () => {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.componentInstance.control.setValue('2024-06-15');
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input');
    expect(input.value).toBe('15/06/2024');
  });
});
