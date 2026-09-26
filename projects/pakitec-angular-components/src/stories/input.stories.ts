import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiInput } from '../public-api';
const meta: Meta<PakiInput> = { title: 'Componentes/Input', component: PakiInput, decorators: [moduleMetadata({ imports: [FormsModule] })], args: { label: 'Nome', placeholder: 'Digite um nome', type: 'text', hint: '', error: '', invalid: false } };
export default meta;
type Story = StoryObj<PakiInput>;
// O modelo do ngModel se chama `text`: `value` colide com o signal interno do PakiInput.
export const Playground: Story = { render: (args) => ({ props: { ...args, text: '' }, template: '<paki-input [label]="label" [placeholder]="placeholder" [type]="type" [hint]="hint" [error]="error" [(ngModel)]="text" />' }) };

/** Campo inválido com mensagem de erro (AC-008, AC-011). */
export const InvalidWithMessage: Story = {
  args: { error: 'Campo obrigatório.' },
  render: (args) => ({
    props: { ...args, text: '' },
    template: '<paki-input [label]="label" [placeholder]="placeholder" [type]="type" [error]="error" [(ngModel)]="text" />',
  }),
};

/** Campo marcado como inválido sem mensagem de erro. */
export const InvalidNoMessage: Story = {
  args: { invalid: true },
  render: (args) => ({
    props: { ...args, text: '' },
    template: '<paki-input [label]="label" [placeholder]="placeholder" [type]="type" [invalid]="invalid" [(ngModel)]="text" />',
  }),
};
