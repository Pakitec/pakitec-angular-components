import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiBadge, PakiDataTable, PakiTableCell } from '../public-api';
import { moduleMetadata } from '@storybook/angular-vite';
interface Doc { id: number; vendor: string; due: string; total: string; status: string }
const rows: Doc[] = [
  { id: 1, vendor: 'Enel', due: '20/10/2026', total: 'R$ 312,40', status: 'Processado' },
  { id: 2, vendor: 'Sabesp', due: '25/10/2026', total: 'R$ 88,10', status: 'Requer revisão' },
];
const columns = [
  { key: 'vendor', header: 'Fornecedor', sortable: true },
  { key: 'due', header: 'Vencimento', sortable: true },
  { key: 'total', header: 'Total', align: 'end' as const },
  { key: 'status', header: 'Estado' },
];
const meta: Meta<PakiDataTable<Doc>> = {
  title: 'Componentes/Data table',
  component: PakiDataTable,
  decorators: [moduleMetadata({ imports: [PakiTableCell, PakiBadge] })],
  args: { label: 'Documentos', columns, rows, selectable: true },
  render: (args) => ({ props: args, template: `<paki-data-table [label]="label" [columns]="columns" [rows]="rows" [loading]="loading" [selectable]="selectable">
    <ng-template pakiCell="status" let-row><paki-badge [tone]="row.status === 'Processado' ? 'success' : 'warning'">{{ row.status }}</paki-badge></ng-template></paki-data-table>` }),
};
export default meta;
type Story = StoryObj<PakiDataTable<Doc>>;
export const Playground: Story = {};
export const Carregando: Story = { args: { loading: true } };
export const Vazia: Story = { args: { rows: [], emptyTitle: 'Nenhum documento', emptyDescription: 'Encaminhe a primeira conta para o endereço de recebimento.' } };
