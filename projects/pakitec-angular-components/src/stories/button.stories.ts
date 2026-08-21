import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiButton } from '../public-api';
const meta: Meta<PakiButton> = { title: 'Componentes/Button', component: PakiButton, args: { variant: 'primary', size: 'md' }, argTypes: { variant: { control: 'select', options: ['primary', 'secondary', 'outline', 'ghost', 'danger'] }, size: { control: 'select', options: ['sm', 'md', 'lg'] } } };
export default meta;
type Story = StoryObj<PakiButton>;
export const Playground: Story = { render: (args) => ({ props: args, template: '<button pakiButton [variant]="variant" [size]="size">Continuar</button>' }) };
