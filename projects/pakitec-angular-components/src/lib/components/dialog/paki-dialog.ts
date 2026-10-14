import { ChangeDetectionStrategy, Component, ElementRef, effect, input, model, output, viewChild } from '@angular/core';

/** Modal acessível baseado no elemento nativo `<dialog>`: foco preso, Esc fecha e o fundo fica inerte. */
@Component({
  selector: 'paki-dialog',
  templateUrl: './paki-dialog.html',
  styleUrl: './paki-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PakiDialog {
  /** Controla a abertura. Esc e o botão de fechar atualizam o valor. */
  readonly open = model(false);
  /** Título exibido no cabeçalho e usado como nome acessível. */
  readonly heading = input.required<string>();
  /** Rótulo do botão de fechar. */
  readonly closeLabel = input('Fechar');
  /** Impede o fechamento ao clicar fora do diálogo. */
  readonly persistent = input(false);
  /** Emite quando o diálogo fecha, por qualquer motivo. */
  readonly closed = output<void>();

  private readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>('dialog');

  constructor() {
    effect(() => {
      const element = this.dialog().nativeElement;
      if (this.open() && !element.open) element.showModal();
      if (!this.open() && element.open) element.close();
    });
  }

  protected close(): void {
    this.open.set(false);
  }

  protected onNativeClose(): void {
    if (this.open()) this.open.set(false);
    this.closed.emit();
  }

  protected onCancel(event: Event): void {
    if (this.persistent()) event.preventDefault();
  }

  protected onBackdropClick(event: MouseEvent): void {
    if (!this.persistent() && event.target === this.dialog().nativeElement) this.close();
  }
}
