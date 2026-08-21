import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiTextarea } from '../public-api';
const meta: Meta<PakiTextarea> = { title: 'Componentes/Textarea', component: PakiTextarea, decorators: [moduleMetadata({ imports: [FormsModule] })], args: { label: 'Observações', placeholder: 'Digite os detalhes', rows: 4 } };
export default meta;
type Story = StoryObj<PakiTextarea>;
export const Playground: Story = { render: (args) => ({ props: { ...args, value: '' }, template: '<paki-textarea [label]="label" [placeholder]="placeholder" [rows]="rows" [(ngModel)]="value" />' }) };
