import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiSelect } from '../public-api';
const meta: Meta<PakiSelect> = { title: 'Componentes/Select', component: PakiSelect, decorators: [moduleMetadata({ imports: [FormsModule] })], args: { label: 'Especialidade', placeholder: 'Selecione', items: [{ label: 'Clínica geral', value: 'general' }, { label: 'Cirurgia', value: 'surgery' }, { label: 'Dermatologia', value: 'dermatology' }] } };
export default meta;
type Story = StoryObj<PakiSelect>;
export const Playground: Story = { render: (args) => ({ props: { ...args, value: '' }, template: '<div style="width:360px"><paki-select [label]="label" [placeholder]="placeholder" [items]="items" [(ngModel)]="value" /></div>' }) };
