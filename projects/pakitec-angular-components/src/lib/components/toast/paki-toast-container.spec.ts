import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PakiToastContainer } from './paki-toast-container';
import { PakiToastService } from './paki-toast.service';

/**
 * Testes do PakiToastContainer com o PakiToastService real (TDD). A montagem
 * com fila vazia ja funciona contra o esqueleto da TASK-003; os cenarios de
 * AC-001 e AC-002 dependem de insercao e remocao reais na fila e so ficam
 * verdes com a implementacao da TASK-006.
 */
describe('PakiToastContainer', () => {
  let service: PakiToastService;
  let fixture: ComponentFixture<PakiToastContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PakiToastContainer] }).compileComponents();
    service = TestBed.inject(PakiToastService);
    fixture = TestBed.createComponent(PakiToastContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    service.dismissAll();
  });

  function createErrorToast(description: string): number {
    const id = service.error('Nao foi possivel salvar', description);
    fixture.detectChanges();
    return id;
  }

  it('monta com a fila vazia, sem itens renderizados', () => {
    expect(service.toasts()).toHaveLength(0);
    expect(fixture.nativeElement.querySelectorAll('paki-toast')).toHaveLength(0);
  });

  describe('AC-001: renderizacao da fila', () => {
    it('renderiza um item por toast inserido pelo servico', () => {
      createErrorToast('Falha de rede');
      service.success('Salvo', 'Registro atualizado');
      fixture.detectChanges();
      const items = fixture.nativeElement.querySelectorAll('paki-toast');
      expect(items).toHaveLength(2);
    });

    it('item renderizado exibe titulo e descricao do toast', () => {
      createErrorToast('Falha de rede');
      const title = fixture.nativeElement.querySelector('.paki-toast__title') as HTMLElement;
      const description = fixture.nativeElement.querySelector('.paki-toast__description') as HTMLElement;
      expect(title.textContent).toContain('Nao foi possivel salvar');
      expect(description.textContent).toContain('Falha de rede');
    });
  });

  describe('AC-002: fechamento manual', () => {
    it('clique no botao de fechar remove o toast da fila', () => {
      const id = createErrorToast('Falha de rede');
      const closeButton = fixture.nativeElement.querySelector('.paki-toast__close') as HTMLButtonElement;
      closeButton.click();
      fixture.detectChanges();
      expect(service.toasts().some((toast) => toast.id === id)).toBe(false);
      expect(fixture.nativeElement.querySelectorAll('paki-toast')).toHaveLength(0);
    });

    it('clique no botao de fechar remove apenas o toast clicado', () => {
      const primeiro = createErrorToast('Falha de rede');
      const segundo = createErrorToast('Saldo insuficiente');
      const items = fixture.nativeElement.querySelectorAll('paki-toast');
      expect(items).toHaveLength(2);
      expect(primeiro).not.toBe(segundo);
      const closeButton = items[0]?.querySelector('.paki-toast__close') as HTMLButtonElement;
      closeButton.click();
      fixture.detectChanges();
      expect(service.toasts().map((toast) => toast.id)).toEqual([segundo]);
    });
  });

  /**
   * Pausa do autodismiss por hover e foco (AC-007, TASK-008). Escritos antes
   * da implementacao da TASK-009 (TDD): sem pausa, o toast expira durante o
   * hover/foco e estes testes falham. Timers falsos tambem controlam o
   * `Date.now()` que o servico usa para medir o tempo restante.
   */
  describe('AC-007: pausa do autodismiss por hover e foco', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    /** Primeiro item de toast renderizado na pilha. */
    function toastRenderizado(): HTMLElement {
      return fixture.nativeElement.querySelector('paki-toast') as HTMLElement;
    }

    /** Verdadeiro quando o toast ainda ocupa a janela ativa (nao saiu nem entrou em `leaving`). */
    function naJanelaAtiva(id: number): boolean {
      return service.toasts().some((toast) => toast.id === id && !toast.leaving);
    }

    it('mouseenter pausa o timer e mouseleave retoma com o tempo restante', () => {
      const id = service.success('Salvo', 'Registro atualizado');
      fixture.detectChanges();
      vi.advanceTimersByTime(1000);

      toastRenderizado().dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(10000);
      expect(naJanelaAtiva(id)).toBe(true);
      expect(fixture.nativeElement.querySelectorAll('paki-toast')).toHaveLength(1);

      toastRenderizado().dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(3999);
      expect(naJanelaAtiva(id)).toBe(true);
      vi.advanceTimersByTime(1);
      expect(naJanelaAtiva(id)).toBe(false);
    });

    it('focusin pausa o timer e focusout retoma com o tempo restante', () => {
      const id = service.warning('Atencao', 'Estoque baixo');
      fixture.detectChanges();
      vi.advanceTimersByTime(2000);

      toastRenderizado().dispatchEvent(new FocusEvent('focusin'));
      vi.advanceTimersByTime(10000);
      expect(naJanelaAtiva(id)).toBe(true);

      toastRenderizado().dispatchEvent(new FocusEvent('focusout'));
      vi.advanceTimersByTime(4999);
      expect(naJanelaAtiva(id)).toBe(true);
      vi.advanceTimersByTime(1);
      expect(naJanelaAtiva(id)).toBe(false);
    });
  });
});
