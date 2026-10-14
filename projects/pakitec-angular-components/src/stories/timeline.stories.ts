import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiTimeline } from '../public-api';
const items = [
  { id: '3', title: 'Alerta resolvido', description: 'Cobrança confirmada com a operadora.', time: '14/10/2026 10:12', author: 'Ana', tone: 'success' as const },
  { id: '2', title: 'Investigação iniciada', time: '13/10/2026 09:03', author: 'Ana', tone: 'info' as const },
  { id: '1', title: 'Alerta aberto', description: 'Valor 32% maior que a fatura anterior.', time: '12/10/2026 18:40', tone: 'warning' as const },
];
const meta: Meta<PakiTimeline> = { title: 'Componentes/Timeline', component: PakiTimeline, args: { items } };
export default meta;
type Story = StoryObj<PakiTimeline>;
export const Playground: Story = {};
export const Vazia: Story = { args: { items: [] } };
