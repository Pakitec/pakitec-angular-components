import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiBadge } from '../public-api';
const meta: Meta<PakiBadge> = { title: 'Componentes/Badge', component: PakiBadge, args: { tone: 'neutral' }, argTypes: { tone: { control: 'select', options: ['neutral', 'success', 'warning', 'danger', 'info'] } } };
export default meta;
type Story = StoryObj<PakiBadge>;
export const Playground: Story = { render: (args) => ({ props: args, template: '<paki-badge [tone]="tone">Status do pedido</paki-badge>' }) };
