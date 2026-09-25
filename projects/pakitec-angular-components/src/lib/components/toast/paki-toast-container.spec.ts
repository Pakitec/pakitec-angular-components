import { Component, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PakiInput } from '../input/paki-input';
import { PakiSelect } from '../select/paki-select.component';
import { PakiToast, PakiToastContainer, PakiToastService } from '../index';
import { PakiToastContainer as DirectPakiToastContainer } from './paki-toast-container';
import { PakiToastService as DirectPakiToastService } from './paki-toast.service';

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

describe('AC-012/AC-013: feedback combinado em falha de salvamento (TASK-014)', () => {
  @Component({
    imports: [PakiInput, PakiSelect, PakiToastContainer],
    template: `
      <paki-input label="Nome" [error]="nameError()" />
      <paki-select label="Espécie" [items]="items" [error]="speciesError()" />
      <paki-toast-container />
    `,
  })
  class SaveFailureHost {
    items = [
      { value: '1', label: 'Cachorro' },
      { value: '2', label: 'Gato' },
    ];
    nameError = signal('');
    speciesError = signal('');
  }

  afterEach(() => {
    TestBed.inject(PakiToastService).dismissAll();
  });

  it('toast de erro global e erros inline aparecem ao mesmo tempo (AC-012)', async () => {
    await TestBed.configureTestingModule({ imports: [SaveFailureHost] }).compileComponents();
    const fixture = TestBed.createComponent(SaveFailureHost);
    const toastService = TestBed.inject(PakiToastService);
    toastService.dismissAll();
    fixture.detectChanges();

    fixture.componentInstance.nameError.set('Nome é obrigatório.');
    fixture.componentInstance.speciesError.set('Espécie é obrigatória.');
    toastService.error('Não foi possível salvar', 'Verifique os campos informados.');
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('paki-toast');
    const inlineErrors = fixture.nativeElement.querySelectorAll('small.error');

    expect(toasts.length).toBe(1);
    expect(fixture.nativeElement.querySelector('.paki-toast__title')?.textContent).toContain('Não foi possível salvar');
    expect(inlineErrors.length).toBe(2);
    expect(Array.from(inlineErrors).some((el) => (el as HTMLElement).textContent === 'Nome é obrigatório.')).toBe(true);
    expect(Array.from(inlineErrors).some((el) => (el as HTMLElement).textContent === 'Espécie é obrigatória.')).toBe(true);
  });

  it('erro sem campo específico mostra somente o toast (AC-013)', async () => {
    await TestBed.configureTestingModule({ imports: [SaveFailureHost] }).compileComponents();
    const fixture = TestBed.createComponent(SaveFailureHost);
    const toastService = TestBed.inject(PakiToastService);
    toastService.dismissAll();
    fixture.detectChanges();

    toastService.error('Não foi possível salvar', 'Tente novamente mais tarde.');
    fixture.detectChanges();

    const toasts = fixture.nativeElement.querySelectorAll('paki-toast');
    const inlineErrors = fixture.nativeElement.querySelectorAll('small.error');

    expect(toasts.length).toBe(1);
    expect(inlineErrors.length).toBe(0);
  });
});

describe('PakiToastContainer: acessibilidade, posição e publicação (TASK-016)', () => {
  let service: PakiToastService;
  let fixture: ComponentFixture<PakiToastContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DirectPakiToastContainer] }).compileComponents();
    service = TestBed.inject(DirectPakiToastService);
    fixture = TestBed.createComponent(DirectPakiToastContainer);
    fixture.detectChanges();
  });

  afterEach(() => {
    service.dismissAll();
  });

  it('container usa região live polite para anúncio (FR-009, NFR-003)', () => {
    const stack = fixture.nativeElement.querySelector('.paki-toast-stack') as HTMLElement;
    expect(stack.getAttribute('aria-live')).toBe('polite');
  });

  it('classe de posição segue o input padrão top-right (FR-008)', () => {
    const stack = fixture.nativeElement.querySelector('.paki-toast-stack') as HTMLElement;
    expect(stack.classList.contains('paki-toast-stack--top-right')).toBe(true);
  });

  it('classe de posição reflete as quatro opções (FR-008)', () => {
    const positions = ['top-left', 'bottom-right', 'bottom-left'] as const;
    for (const position of positions) {
      fixture.componentRef.setInput('position', position);
      fixture.detectChanges();
      const stack = fixture.nativeElement.querySelector('.paki-toast-stack') as HTMLElement;
      expect(stack.classList.contains(`paki-toast-stack--${position}`)).toBe(true);
    }
  });

  it('avisa sobre instância duplicada do container em dev mode (FR-010)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    try {
      TestBed.createComponent(DirectPakiToastContainer);
      expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('paki-toast-container'));
    } finally {
      warnSpy.mockRestore();
    }
  });

  it('símbolos do toast são exportáveis pelo barrel (FR-011, AC-016)', () => {
    expect(PakiToast).toBeDefined();
    expect(PakiToastContainer).toBeDefined();
    expect(PakiToastService).toBeDefined();
  });
});
