import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import {
  PakiBadge,
  PakiButton,
  PakiCard,
  PakiInput,
  PakiPageHeader,
  PakiSwitch,
  PakiTextarea,
} from '../public-api';

const meta: Meta = {
  title: 'Pakitec/Visão geral',
  decorators: [
    moduleMetadata({
      imports: [FormsModule, PakiBadge, PakiButton, PakiCard, PakiInput, PakiPageHeader, PakiSwitch, PakiTextarea],
    }),
  ],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Components: Story = {
  render: () => ({
    props: { enabled: true, name: '', notes: '' },
    template: `
      <paki-page-header title="Componentes Pakitec" subtitle="Extraídos do design system do Amora">
        <button pakiButton>Nova ação</button>
      </paki-page-header>
      <paki-card style="padding: 24px; display: grid; gap: 18px; max-width: 680px">
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <paki-badge>Neutro</paki-badge>
          <paki-badge tone="success">Sucesso</paki-badge>
          <paki-badge tone="warning">Atenção</paki-badge>
          <paki-badge tone="danger">Erro</paki-badge>
          <paki-badge tone="info">Informação</paki-badge>
        </div>
        <paki-input label="Nome" placeholder="Digite um nome" [(ngModel)]="name" />
        <paki-textarea label="Observações" placeholder="Detalhes" [(ngModel)]="notes" />
        <div style="display:flex;align-items:center;gap:10px">
          <paki-switch label="Ativo" [(checked)]="enabled" /> <span>Ativo</span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <button pakiButton>Primário</button>
          <button pakiButton variant="secondary">Secundário</button>
          <button pakiButton variant="outline">Contorno</button>
          <button pakiButton variant="ghost">Ghost</button>
          <button pakiButton variant="danger">Excluir</button>
        </div>
      </paki-card>
    `,
  }),
};
