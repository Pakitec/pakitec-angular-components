import { TestBed } from '@angular/core/testing';
import { PakiPeriodPicker, resolvePeriodPreset } from './paki-period-picker';

describe('resolvePeriodPreset', () => {
  const today = new Date(2026, 9, 14);
  it('calcula atalhos em data local', () => {
    expect(resolvePeriodPreset('current-month', today)).toEqual({ start: '2026-10-01', end: '2026-10-31' });
    expect(resolvePeriodPreset('previous-month', today)).toEqual({ start: '2026-09-01', end: '2026-09-30' });
    expect(resolvePeriodPreset('last-3-months', today)).toEqual({ start: '2026-08-01', end: '2026-10-31' });
    expect(resolvePeriodPreset('last-12-months', today)).toEqual({ start: '2025-11-01', end: '2026-10-31' });
    expect(resolvePeriodPreset('current-year', today)).toEqual({ start: '2026-01-01', end: '2026-12-31' });
  });
  it('trata virada de ano e fevereiro bissexto', () => {
    expect(resolvePeriodPreset('previous-month', new Date(2026, 0, 5))).toEqual({ start: '2025-12-01', end: '2025-12-31' });
    expect(resolvePeriodPreset('current-month', new Date(2028, 1, 10)).end).toBe('2028-02-29');
  });
});

describe('PakiPeriodPicker', () => {
  async function setup() {
    await TestBed.configureTestingModule({ imports: [PakiPeriodPicker] }).compileComponents();
    const fixture = TestBed.createComponent(PakiPeriodPicker);
    fixture.componentRef.setInput('today', new Date(2026, 9, 14));
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    const choose = (value: string) => {
      const select = el.querySelector('select')!;
      select.value = value;
      select.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    const type = (index: number, value: string) => {
      const input = el.querySelectorAll('input')[index]!;
      input.value = value;
      input.dispatchEvent(new Event('change'));
      fixture.detectChanges();
    };
    return { fixture, el, choose, type };
  }

  it('emite o intervalo ao escolher um atalho', async () => {
    const { fixture, choose } = await setup();
    choose('last-6-months');
    expect(fixture.componentInstance.value()).toEqual({ preset: 'last-6-months', start: '2026-05-01', end: '2026-10-31' });
  });

  it('só emite intervalo personalizado válido e mostra erro quando invertido', async () => {
    const { fixture, el, choose, type } = await setup();
    choose('custom');
    type(0, '2026-10-20');
    type(1, '2026-10-10');
    expect(fixture.componentInstance.value()).toBeNull();
    expect(el.querySelector('[role="alert"]')?.textContent).toContain('anterior');
    type(1, '2026-10-25');
    expect(fixture.componentInstance.value()).toEqual({ preset: 'custom', start: '2026-10-20', end: '2026-10-25' });
    expect(el.querySelector('[role="alert"]')).toBeNull();
  });
});
