import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { PakiToastContainer } from './paki-toast-container';
import { PakiToastService } from './paki-toast.service';

/**
 * Um `<dialog>` modal fica na top layer e deixa o resto da página inerte; o
 * container precisa morar dentro dele para os toasts ficarem visíveis e clicáveis.
 */
@Component({
  imports: [PakiToastContainer],
  template: `
    <main id="home"><paki-toast-container /></main>
    <dialog id="first">primeiro</dialog>
    <dialog id="second">segundo</dialog>
    @if (showLate()) {
      <dialog id="late">tardio</dialog>
    }
  `,
})
class Host {
  readonly showLate = signal(false);
}

/** Abre como modal (top layer); em ambientes sem showModal, cai para o atributo. */
const openModal = (dialog: HTMLDialogElement) =>
  typeof dialog.showModal === 'function' ? dialog.showModal() : dialog.setAttribute('open', '');
const closeModal = (dialog: HTMLDialogElement) =>
  typeof dialog.close === 'function' ? dialog.close() : dialog.removeAttribute('open');

/** Aguarda a entrega do MutationObserver (microtask). */
const flush = () => new Promise((resolve) => setTimeout(resolve));

describe('PakiToastContainer com diálogos modais', () => {
  function setup() {
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    document.body.appendChild(fixture.nativeElement);
    const el = fixture.nativeElement as HTMLElement;
    const container = () => el.querySelector('paki-toast-container') as HTMLElement;
    const dialog = (id: string) => el.querySelector(`#${id}`) as HTMLDialogElement;
    return { fixture, el, container, dialog };
  }

  afterEach(() => document.body.replaceChildren());

  it('entra no diálogo aberto e volta para o lugar original ao fechar', async () => {
    const { container, dialog, el } = setup();
    expect(container().parentElement?.id).toBe('home');

    openModal(dialog('first'));
    await flush();
    expect(container().parentElement?.id).toBe('first');

    closeModal(dialog('first'));
    await flush();
    expect(container().parentElement?.id).toBe('home');
    expect(el.querySelectorAll('paki-toast-container')).toHaveLength(1);
  });

  it('acompanha o diálogo aberto por último e volta ao anterior quando ele fecha', async () => {
    const { container, dialog } = setup();
    openModal(dialog('first'));
    await flush();
    openModal(dialog('second'));
    await flush();
    expect(container().parentElement?.id).toBe('second');

    closeModal(dialog('second'));
    await flush();
    expect(container().parentElement?.id).toBe('first');
  });

  it('não se perde quando o diálogo aberto é removido do DOM', async () => {
    const { fixture, container, el } = setup();
    // O @if do Angular remove o <dialog> com o container dentro; ele precisa voltar para casa.
    fixture.componentInstance.showLate.set(true);
    fixture.detectChanges();
    openModal(el.querySelector('#late') as HTMLDialogElement);
    await flush();
    expect(container().parentElement?.id).toBe('late');

    fixture.componentInstance.showLate.set(false);
    fixture.detectChanges();
    await flush();
    expect(el.querySelector('paki-toast-container')?.parentElement?.id).toBe('home');
  });

  it('os toasts continuam sendo renderizados dentro do diálogo', async () => {
    const { container, dialog, fixture } = setup();
    openModal(dialog('first'));
    await flush();
    TestBed.inject(PakiToastService).error('Horário indisponível', 'O profissional já possui compromisso.');
    fixture.detectChanges();
    expect(dialog('first').querySelector('paki-toast')?.textContent).toContain('Horário indisponível');
    expect(container().parentElement?.id).toBe('first');
  });
});
