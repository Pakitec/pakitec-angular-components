import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Component, inject, signal } from '@angular/core';

import { PakiInput } from '../lib/components/input/paki-input';
import { PakiSelect } from '../lib/components/select/paki-select.component';
import { PakiToastContainer } from '../lib/components/toast/paki-toast-container';
import { PakiToastService } from '../lib/components/toast/paki-toast.service';

@Component({
  selector: 'paki-save-failure-demo',
  imports: [PakiInput, PakiSelect, PakiToastContainer],
  template: `
    <div style="display:grid;gap:16px;max-width:360px">
      <paki-input label="Nome" [error]="nameError()" />
      <paki-select label="Espécie" [items]="items" [error]="speciesError()" />
      <button type="button" (click)="simulateFailure()">Salvar</button>
      <button type="button" (click)="simulateGenericFailure()">Salvar (erro genérico)</button>
    </div>
    <paki-toast-container />
  `,
})
class SaveFailureDemo {
  private readonly toast = inject(PakiToastService);

  readonly items = [
    { value: '1', label: 'Cachorro' },
    { value: '2', label: 'Gato' },
    { value: '3', label: 'Pássaro' },
  ];

  nameError = signal('');
  speciesError = signal('');

  simulateFailure(): void {
    this.nameError.set('Nome é obrigatório.');
    this.speciesError.set('Espécie é obrigatória.');
    this.toast.error('Não foi possível salvar', 'Verifique os campos informados.');
  }

  simulateGenericFailure(): void {
    this.nameError.set('');
    this.speciesError.set('');
    this.toast.error('Não foi possível salvar', 'Tente novamente mais tarde.');
  }
}

const meta: Meta<SaveFailureDemo> = {
  title: 'Componentes/Toast',
  component: SaveFailureDemo,
};

export default meta;
type Story = StoryObj<SaveFailureDemo>;

/**
 * Cenário central da issue: falha de salvamento mostra ao mesmo tempo o toast de erro
 * global e os erros inline dos campos informados (AC-012).
 */
export const SaveFailureCombined: Story = {};
