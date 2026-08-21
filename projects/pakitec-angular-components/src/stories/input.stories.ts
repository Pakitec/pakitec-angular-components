import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiInput } from '../public-api';
const meta: Meta<PakiInput> = { title: 'Componentes/Input', component: PakiInput, decorators: [moduleMetadata({ imports: [FormsModule] })], args: { label: 'Nome', placeholder: 'Digite um nome', type: 'text', hint: '' } };
export default meta;
type Story = StoryObj<PakiInput>;
export const Playground: Story = { render: (args) => ({ props: { ...args, value: '' }, template: '<paki-input [label]="label" [placeholder]="placeholder" [type]="type" [hint]="hint" [error]="error" [(ngModel)]="value" />' }) };
