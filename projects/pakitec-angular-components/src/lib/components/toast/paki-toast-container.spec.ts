import { ComponentFixture, TestBed } from '@angular/core/testing';

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
});
