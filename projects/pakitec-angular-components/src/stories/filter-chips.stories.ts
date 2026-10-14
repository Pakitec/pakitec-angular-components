import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiFilterChips } from '../public-api';
const options = [{ value: 'open', label: 'Abertos', count: 5 }, { value: 'investigating', label: 'Em investigação', count: 2 }, { value: 'resolved', label: 'Resolvidos', count: 31 }];
const meta: Meta<PakiFilterChips> = { title: 'Componentes/Filter chips', component: PakiFilterChips, args: { options, selected: ['open'], multiple: false, label: 'Estado do alerta' } };
export default meta;
type Story = StoryObj<PakiFilterChips>;
export const Playground: Story = {};
export const Multipla: Story = { args: { multiple: true, selected: ['open', 'resolved'] } };
