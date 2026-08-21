import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiCard } from '../public-api';
const meta: Meta<PakiCard> = { title: 'Componentes/Card', component: PakiCard, args: { flat: false } };
export default meta;
type Story = StoryObj<PakiCard>;
export const Playground: Story = { render: (args) => ({ props: args, template: '<paki-card [flat]="flat" style="display:block;padding:24px;width:360px"><strong>Consulta veterinária</strong><p style="color:var(--color-text-secondary)">Conteúdo projetado dentro do card.</p></paki-card>' }) };
