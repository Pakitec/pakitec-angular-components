import { ComponentFixture, TestBed } from '@angular/core/testing';
import { vi } from 'vitest';

import { PakiToast } from './paki-toast';
import { PakiToastData } from './paki-toast.models';

/**
 * Testes do PakiToast (item individual). Cobrem o conteudo visivel e o nome
 * acessivel do botao de fechar, independentes do stub do servico: a TASK-006
 * nao muda este componente.
 */
describe('PakiToast', () => {
  let fixture: ComponentFixture<PakiToast>;

  function setup(data: PakiToastData): ComponentFixture<PakiToast> {
    const created = TestBed.createComponent(PakiToast);
    created.componentRef.setInput('data', data);
    created.detectChanges();
    return created;
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [PakiToast] }).compileComponents();
    fixture = setup({
      id: 1,
      type: 'error',
      title: 'Nao foi possivel salvar',
      description: 'Tente novamente em instantes.',
      duration: 0,
      leaving: false,
    });
  });

  describe('AC-001: conteudo visivel', () => {
    it('exibe titulo e descricao do toast', () => {
      const title = fixture.nativeElement.querySelector('.paki-toast__title') as HTMLElement;
      const description = fixture.nativeElement.querySelector('.paki-toast__description') as HTMLElement;
      expect(title.textContent).toContain('Nao foi possivel salvar');
      expect(description.textContent).toContain('Tente novamente em instantes.');
    });
  });

  describe('acessibilidade do fechamento', () => {
    it('botao de fechar tem nome acessivel', () => {
      const closeButton = fixture.nativeElement.querySelector('.paki-toast__close') as HTMLButtonElement;
      expect(closeButton).not.toBeNull();
      expect(closeButton.getAttribute('aria-label')).toBe('Fechar');
    });
  });

  describe('AC-002: pedido de fechamento', () => {
    it('clique no botao de fechar emite closed', () => {
      const onClosed = vi.fn();
      fixture.componentInstance.closed.subscribe(onClosed);
      const closeButton = fixture.nativeElement.querySelector('.paki-toast__close') as HTMLButtonElement;
      closeButton.click();
      expect(onClosed).toHaveBeenCalledTimes(1);
    });
  });

  describe('US-005: acessibilidade e movimento (TASK-016)', () => {
    it('toast do tipo error anuncia alerta com role="alert" (FR-009, NFR-003)', () => {
      const region = fixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
      expect(region).not.toBeNull();
    });

    it('toast do tipo success nao anuncia alerta (FR-009)', () => {
      const successFixture = setup({
        id: 2,
        type: 'success',
        title: 'Salvo',
        description: 'Registro atualizado.',
        duration: 5000,
        leaving: false,
      });
      const region = successFixture.nativeElement.querySelector('[role="alert"]') as HTMLElement;
      expect(region).toBeNull();
    });
  });
});
