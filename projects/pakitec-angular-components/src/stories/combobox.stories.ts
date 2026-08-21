import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiCombobox } from '../public-api';
const meta: Meta<PakiCombobox> = { title: 'Componentes/Combobox (legado)', component: PakiCombobox, decorators: [moduleMetadata({ imports: [FormsModule] })], args: { label: 'Cidade', placeholder: 'Digite para buscar', options: ['São Paulo', 'Campinas', 'Santos', 'Sorocaba'] } };
export default meta;
type Story = StoryObj<PakiCombobox>;
export const Playground: Story = { render: (args) => ({ props: { ...args, value: '' }, template: '<div style="width:360px"><paki-combobox [label]="label" [placeholder]="placeholder" [options]="options" [(ngModel)]="value" /></div>' }) };
