import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PakiToastType } from './paki-toast.models';
import { PakiToastService } from './paki-toast.service';

/**
 * Testes do PakiToastService escritos antes da implementacao (TDD).
 * Contra o stub da TASK-003, todos devem falhar; a implementacao da TASK-006
 * os torna verdes. Timers falsos (`vi.useFakeTimers`) controlam o autodismiss
 * sem espera real.
 */
describe('PakiToastService', () => {
  let service: PakiToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    service = TestBed.inject(PakiToastService);
  });

  afterEach(() => {
    service.dismissAll();
    vi.useRealTimers();
  });

  // Cada metodo publico mapeia para um tipo e uma duracao padrao (AC-001, AC-003, AC-004).
  const methods: Array<{
    call: (title: string, description: string, config?: { duration?: number }) => number;
    type: PakiToastType;
    defaultDuration: number;
  }> = [
    { call: (t, d, c) => service.success(t, d, c), type: 'success', defaultDuration: 5000 },
    { call: (t, d, c) => service.error(t, d, c), type: 'error', defaultDuration: 0 },
    { call: (t, d, c) => service.warning(t, d, c), type: 'warning', defaultDuration: 7000 },
    { call: (t, d, c) => service.info(t, d, c), type: 'info', defaultDuration: 7000 },
  ];

  describe('AC-001: insercao por metodo', () => {
    for (const { call, type, defaultDuration } of methods) {
      it(`${type} insere o toast com titulo, descricao e duracao resolvida`, () => {
        const id = call('Titulo ' + type, 'Descricao ' + type);
        const toasts = service.toasts();
        expect(toasts).toHaveLength(1);
        expect(toasts[0]).toMatchObject({
          id,
          type,
          title: 'Titulo ' + type,
          description: 'Descricao ' + type,
          duration: defaultDuration,
        });
      });
    }
  });

  describe('AC-003: autodismiss pelas duracoes padrao', () => {
    it('success sai da fila apos 5 s', () => {
      service.success('Ok', 'Salvo');
      vi.advanceTimersByTime(4999);
      expect(service.toasts()).toHaveLength(1);
      vi.advanceTimersByTime(1);
      expect(service.toasts()).toHaveLength(0);
    });

    it('warning sai da fila apos 7 s', () => {
      service.warning('Atencao', 'Estoque baixo');
      vi.advanceTimersByTime(6999);
      expect(service.toasts()).toHaveLength(1);
      vi.advanceTimersByTime(1);
      expect(service.toasts()).toHaveLength(0);
    });

    it('info sai da fila apos 7 s', () => {
      service.info('Informacao', 'Nova versao');
      vi.advanceTimersByTime(6999);
      expect(service.toasts()).toHaveLength(1);
      vi.advanceTimersByTime(1);
      expect(service.toasts()).toHaveLength(0);
    });

    it('duracao customizada sobrescreve o padrao do tipo', () => {
      const id = service.success('Ok', 'Rapido', { duration: 1000 });
      expect(service.toasts()[0]?.duration).toBe(1000);
      vi.advanceTimersByTime(999);
      expect(service.toasts().some((t) => t.id === id)).toBe(true);
      vi.advanceTimersByTime(1);
      expect(service.toasts().some((t) => t.id === id)).toBe(false);
    });
  });

  describe('AC-004: error sem autodismiss', () => {
    it('error permanece na fila sem autodismiss por padrao', () => {
      service.error('Falha', 'Nao foi possivel salvar');
      vi.advanceTimersByTime(60000);
      expect(service.toasts()).toHaveLength(1);
      expect(service.toasts()[0]?.duration).toBe(0);
    });

    it('duration 0 desliga o autodismiss de qualquer tipo', () => {
      service.success('Fixo', 'Sem saida automatica', { duration: 0 });
      vi.advanceTimersByTime(60000);
      expect(service.toasts()).toHaveLength(1);
    });
  });

  describe('fechamento manual', () => {
    it('dismiss(id) remove o toast correspondente', () => {
      const primeiro = service.success('Um', 'Primeiro');
      const segundo = service.info('Dois', 'Segundo');
      service.dismiss(primeiro);
      expect(service.toasts().map((t) => t.id)).toEqual([segundo]);
    });

    it('dismissAll() esvazia a fila', () => {
      service.success('Um', 'Primeiro');
      service.info('Dois', 'Segundo');
      expect(service.toasts()).toHaveLength(2);
      service.dismissAll();
      expect(service.toasts()).toHaveLength(0);
    });
  });

  /**
   * Empilhamento e fase de saida (US-002, TASK-008). Escritos antes da
   * implementacao da TASK-009 (TDD): contra o servico atual, AC-005, AC-006 e
   * R-I falham porque ainda nao ha limite de janela nem fase `leaving`.
   *
   * `ativos()` devolve a janela de toasts que contam para o limite de 3.
   * Toasts em fase `leaving` ja liberaram a vaga, mas seguem na fila durante
   * a transicao de saida, entao nao entram na contagem (risco R-I).
   */
  describe('US-002: empilhamento seguro', () => {
    const ativos = () => service.toasts().filter((toast) => !toast.leaving);

    it('AC-005: com 3 toasts visiveis, o quarto remove o mais antigo (FIFO)', () => {
      const um = service.success('Um', 'Primeiro');
      const dois = service.info('Dois', 'Segundo');
      const tres = service.warning('Tres', 'Terceiro');
      const quatro = service.success('Quatro', 'Quarto');
      expect(ativos()).toHaveLength(3);
      expect(ativos().map((toast) => toast.id)).toEqual([dois, tres, quatro]);
      expect(ativos().some((toast) => toast.id === um)).toBe(false);
    });

    it('AC-005: o descarte FIFO preserva a ordem de chegada dos demais', () => {
      service.success('Um', 'Primeiro');
      service.info('Dois', 'Segundo');
      const tres = service.warning('Tres', 'Terceiro');
      const quatro = service.success('Quatro', 'Quarto');
      const cinco = service.info('Cinco', 'Quinto');
      expect(ativos().map((toast) => toast.id)).toEqual([tres, quatro, cinco]);
    });

    it('AC-006: com um erro visivel, o nao critico mais antigo sai primeiro e o erro permanece', () => {
      const um = service.success('Um', 'Nao critico mais antigo');
      const erro = service.error('Falha', 'Nao foi possivel salvar');
      const tres = service.info('Tres', 'Terceiro');
      const quatro = service.warning('Quatro', 'Quarto');
      expect(ativos().map((toast) => toast.id)).toEqual([erro, tres, quatro]);
      expect(ativos().some((toast) => toast.id === um)).toBe(false);
    });

    it('AC-006: se todos os visiveis forem erros, a fila cresce alem de 3', () => {
      const erro1 = service.error('Falha 1', 'Primeira falha');
      const erro2 = service.error('Falha 2', 'Segunda falha');
      const erro3 = service.error('Falha 3', 'Terceira falha');
      const erro4 = service.error('Falha 4', 'Quarta falha');
      expect(ativos().map((toast) => toast.id)).toEqual([erro1, erro2, erro3, erro4]);
    });

    it('R-I: toast em fase leaving libera a janela sem aguardar o fim da transicao', () => {
      const um = service.success('Um', 'Expira em 5 s');
      const dois = service.error('Falha', 'Nao foi possivel salvar');
      const tres = service.warning('Tres', 'Terceiro');
      vi.advanceTimersByTime(5000);
      expect(service.toasts().find((toast) => toast.id === um)?.leaving).toBe(true);
      const quatro = service.success('Quatro', 'Quarto');
      expect(ativos().map((toast) => toast.id)).toEqual([dois, tres, quatro]);
    });
  });
});
