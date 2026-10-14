import { TestBed } from '@angular/core/testing';
import { PakiTimeline } from './paki-timeline';

describe('PakiTimeline', () => {
  async function render(items: PakiTimeline['items'] extends () => infer R ? R : never) {
    await TestBed.configureTestingModule({ imports: [PakiTimeline] }).compileComponents();
    const fixture = TestBed.createComponent(PakiTimeline);
    fixture.componentRef.setInput('items', items);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('lista os itens como lista ordenada acessível', async () => {
    const element = await render([
      { id: '1', title: 'Alerta resolvido', time: '14/10 10:00', datetime: '2026-10-14T10:00:00Z', author: 'Ana', tone: 'success' },
      { id: '2', title: 'Investigação iniciada', description: 'Conferir fatura', time: '13/10 09:00' },
    ]);
    expect(element.querySelector('ol')?.getAttribute('aria-label')).toBe('Histórico');
    expect(element.querySelectorAll('li')).toHaveLength(2);
    expect(element.querySelector('time')?.getAttribute('datetime')).toBe('2026-10-14T10:00:00Z');
    expect(element.textContent).toContain('Ana');
  });

  it('mostra texto vazio sem itens', async () => {
    const element = await render([]);
    expect(element.querySelector('ol')).toBeNull();
    expect(element.textContent).toContain('Nenhum registro');
  });
});
