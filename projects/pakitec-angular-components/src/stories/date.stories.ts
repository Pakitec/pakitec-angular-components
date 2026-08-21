import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiDate } from '../public-api';
const meta: Meta<PakiDate> = { title: 'Componentes/Date', component: PakiDate, decorators: [moduleMetadata({ imports: [FormsModule] })], args: { label: 'Data da consulta', placeholder: 'Selecione uma data' } };
export default meta;
type Story = StoryObj<PakiDate>;
export const Playground: Story = { render: (args) => ({ props: { ...args, value: '' }, template: '<div style="width:360px"><paki-date [label]="label" [placeholder]="placeholder" [(ngModel)]="value" /></div>' }) };
