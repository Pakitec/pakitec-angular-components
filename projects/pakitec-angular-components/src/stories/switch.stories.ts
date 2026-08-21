import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiSwitch } from '../public-api';
const meta: Meta<PakiSwitch> = { title: 'Componentes/Switch', component: PakiSwitch, args: { label: 'Ativar recurso', checked: true, disabled: false } };
export default meta;
type Story = StoryObj<PakiSwitch>;
export const Playground: Story = {};
