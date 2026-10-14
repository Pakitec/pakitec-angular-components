import { TestBed } from '@angular/core/testing';
import { PakiChart, niceStep, type PakiChartSelection, type PakiChartSeries } from './paki-chart';

const series: PakiChartSeries[] = [{ name: 'Energia', points: [{ label: 'Ago', value: 100 }, { label: 'Set', value: null }, { label: 'Out', value: 180 }] }];

describe('niceStep', () => {
  it('arredonda para passos legíveis', () => {
    expect(niceStep(0)).toBe(1);
    expect(niceStep(37)).toBe(50);
    expect(niceStep(1.2)).toBe(2);
    expect(niceStep(0.04)).toBeCloseTo(0.05);
  });
});

describe('PakiChart', () => {
  async function setup(type: 'line' | 'bar', data: readonly PakiChartSeries[] = series) {
    await TestBed.configureTestingModule({ imports: [PakiChart] }).compileComponents();
    const fixture = TestBed.createComponent(PakiChart);
    fixture.componentRef.setInput('series', data);
    fixture.componentRef.setInput('label', 'Despesas por mês, em reais');
    fixture.componentRef.setInput('type', type);
    fixture.detectChanges();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('não desenha ponto para dado ausente e interrompe a linha', async () => {
    const { el } = await setup('line');
    expect(el.querySelectorAll('circle')).toHaveLength(2);
    expect(el.querySelector('path')?.getAttribute('d')?.match(/M/g)).toHaveLength(2);
  });

  it('expõe tabela acessível com "Sem dados" para o valor ausente', async () => {
    const { el } = await setup('bar');
    expect(el.querySelectorAll('rect')).toHaveLength(2);
    expect(el.querySelector('table caption')?.textContent).toContain('em reais');
    expect(el.querySelectorAll('tbody td')[1]?.textContent).toBe('Sem dados');
  });

  it('emite a seleção por clique e teclado', async () => {
    const { fixture, el } = await setup('line');
    const selected: PakiChartSelection[] = [];
    fixture.componentInstance.pointSelect.subscribe((value) => selected.push(value));
    const circles = el.querySelectorAll('circle');
    circles[1]!.dispatchEvent(new Event('click'));
    circles[0]!.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    expect(selected).toEqual([{ series: 'Energia', label: 'Out', index: 2, value: 180 }, { series: 'Energia', label: 'Ago', index: 0, value: 100 }]);
  });

  it('mostra estado vazio sem nenhum valor', async () => {
    const { el } = await setup('line', [{ name: 'Gás', points: [{ label: 'Ago', value: null }] }]);
    expect(el.querySelector('svg')).toBeNull();
    expect(el.textContent).toContain('Sem dados');
  });
});
