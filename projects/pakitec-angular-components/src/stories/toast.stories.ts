import type { Meta, StoryObj } from '@storybook/angular-vite';
import { Component, inject, signal } from '@angular/core';

import { PakiInput } from '../public-api';
import { PakiSelect } from '../public-api';
import { PakiToastContainer } from '../public-api';
import { PakiToastService, PakiToastPosition } from '../public-api';

@Component({
  selector: 'paki-toast-playground',
  imports: [PakiToastContainer],
  template: `
    <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px">
      <label>
        Posição
        <select (change)="position.set($any($event.target).value)">
          <option value="top-right" [selected]="position() === 'top-right'">top-right</option>
          <option value="top-left" [selected]="position() === 'top-left'">top-left</option>
          <option value="bottom-right" [selected]="position() === 'bottom-right'">bottom-right</option>
          <option value="bottom-left" [selected]="position() === 'bottom-left'">bottom-left</option>
        </select>
      </label>
      <button type="button" (click)="toast.success('Sucesso', 'Operação concluída.')">Success</button>
      <button type="button" (click)="toast.error('Erro', 'Falha ao processar.')">Error</button>
      <button type="button" (click)="toast.warning('Atenção', 'Verifique os dados.')">Warning</button>
      <button type="button" (click)="toast.info('Info', 'Nova atualização disponível.')">Info</button>
      <button type="button" (click)="toast.success('Rápido', 'Fecha em 1s.', { duration: 1000 })">1 segundo</button>
      <button type="button" (click)="stack()">Empilhar 4</button>
    </div>
    <paki-toast-container [position]="position()" />
  `,
})
class ToastPlayground {
  private readonly toast = inject(PakiToastService);
  readonly position = signal<PakiToastPosition>('top-right');

  stack(): void {
    this.toast.success('Primeiro', 'Toast 1');
    this.toast.warning('Segundo', 'Toast 2');
    this.toast.error('Terceiro', 'Toast de erro permanece.');
    this.toast.info('Quarto', 'Toast 4 entra após descarte.');
  }
}

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

const meta: Meta = { title: 'Componentes/Toast' };
export default meta;
type Story = StoryObj;

/** Success: exibe título, descrição e fecha após 5 segundos (AC-001). */
export const Success: Story = {
  render: () => ({
    props: { toast: inject(PakiToastService) },
    template: `
      <button type="button" (click)="toast.success('Sucesso', 'Operação concluída.')">Disparar success</button>
      <paki-toast-container />
    `,
  }),
};

/** Error: permanece na tela até fechamento manual (AC-004). */
export const ErrorPersistent: Story = {
  render: () => ({
    props: { toast: inject(PakiToastService) },
    template: `
      <button type="button" (click)="toast.error('Erro', 'Falha persistente.')">Disparar error</button>
      <paki-toast-container />
    `,
  }),
};

/** Fechamento manual de qualquer toast (AC-002). */
export const Dismissible: Story = {
  render: () => ({
    props: { toast: inject(PakiToastService) },
    template: `
      <button type="button" (click)="toast.info('Info', 'Feche manualmente.', { duration: 30000 })">Disparar info</button>
      <paki-toast-container />
    `,
  }),
};

/** Duração personalizada sobrescreve o padrão (AC-003). */
export const CustomDuration: Story = {
  render: () => ({
    props: { toast: inject(PakiToastService) },
    template: `
      <button type="button" (click)="toast.success('Rápido', 'Fecha em 1 segundo.', { duration: 1000 })">1 segundo</button>
      <paki-toast-container />
    `,
  }),
};

/** Empilhamento: no máximo 3 visíveis, FIFO, erro retido (AC-005, AC-006). */
export const Stacking: Story = {
  render: () => ({
    props: { toast: inject(PakiToastService) },
    template: `
      <button type="button" (click)="toast.success('1', 'Primeiro'); toast.warning('2', 'Segundo'); toast.error('3', 'Erro permanece.'); toast.info('4', 'Quarto entra.');">Empilhar 4 toasts</button>
      <paki-toast-container />
    `,
  }),
};

/** Playground com as 4 posições (FR-008). */
export const Positions: Story = {
  render: () => ({
    props: {},
    template: '<paki-toast-playground />',
  }),
};

/** Cenário central da issue: falha de salvamento mostra toast e erros inline (AC-012). */
export const SaveFailureCombined: Story = {
  render: () => ({
    props: {},
    template: '<paki-save-failure-demo />',
  }),
};
