import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { PakiButton, PakiPageHeader } from '../public-api';
const meta: Meta<PakiPageHeader> = { title: 'Componentes/Page Header', component: PakiPageHeader, decorators: [moduleMetadata({ imports: [PakiButton] })], args: { title: 'Agenda', subtitle: 'Gerencie os próximos atendimentos' } };
export default meta;
type Story = StoryObj<PakiPageHeader>;
export const Playground: Story = { render: (args) => ({ props: args, template: '<paki-page-header [title]="title" [subtitle]="subtitle"><button pakiButton>Novo atendimento</button></paki-page-header>' }) };
