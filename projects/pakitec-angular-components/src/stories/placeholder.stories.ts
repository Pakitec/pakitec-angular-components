import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiPlaceholder } from '../public-api';

const meta: Meta<PakiPlaceholder> = { title: 'Componentes/Placeholder', component: PakiPlaceholder, args: { title: 'Nenhum resultado', description: 'Ajuste os filtros ou tente novamente.' } };
export default meta;
type Story = StoryObj<PakiPlaceholder>;
export const Playground: Story = { render: (args) => ({ props: args, template: '<paki-placeholder [title]="title" [description]="description" />' }) };
