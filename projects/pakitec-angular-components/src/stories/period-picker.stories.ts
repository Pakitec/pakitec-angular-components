import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiPeriodPicker } from '../public-api';
const meta: Meta<PakiPeriodPicker> = { title: 'Componentes/Period picker', component: PakiPeriodPicker, args: { label: 'Período' } };
export default meta;
type Story = StoryObj<PakiPeriodPicker>;
export const Playground: Story = {};
