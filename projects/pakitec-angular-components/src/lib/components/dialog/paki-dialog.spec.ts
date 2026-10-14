import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PakiDialog } from './paki-dialog';

@Component({
  imports: [PakiDialog],
  template: `<paki-dialog heading="Resolver alerta" [(open)]="open" (closed)="closedCount = closedCount + 1">Conteúdo</paki-dialog>`,
})
class Host {
  readonly open = signal(false);
  closedCount = 0;
}

describe('PakiDialog', () => {
  // O jsdom não implementa showModal/close; este stub reproduz o comportamento do navegador.
  beforeEach(() => {
    HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) { this.setAttribute('open', ''); };
    HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
      this.removeAttribute('open');
      this.dispatchEvent(new Event('close'));
    };
  });

  async function setup() {
    await TestBed.configureTestingModule({ imports: [Host] }).compileComponents();
    const fixture = TestBed.createComponent(Host);
    fixture.detectChanges();
    const dialog: HTMLDialogElement = fixture.nativeElement.querySelector('dialog');
    return { fixture, dialog };
  }

  it('abre e fecha conforme o modelo', async () => {
    const { fixture, dialog } = await setup();
    expect(dialog.open).toBe(false);
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    expect(dialog.open).toBe(true);
    expect(dialog.getAttribute('aria-label')).toBe('Resolver alerta');
    fixture.componentInstance.open.set(false);
    fixture.detectChanges();
    expect(dialog.open).toBe(false);
  });

  it('atualiza o modelo e emite closed ao fechar pelo botão', async () => {
    const { fixture, dialog } = await setup();
    fixture.componentInstance.open.set(true);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('.paki-dialog__close').click();
    fixture.detectChanges();
    expect(fixture.componentInstance.open()).toBe(false);
    expect(dialog.open).toBe(false);
    expect(fixture.componentInstance.closedCount).toBe(1);
  });
});
