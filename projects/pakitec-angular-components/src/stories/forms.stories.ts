import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiCombobox, PakiDate, PakiInput, PakiSelect, PakiTextarea } from '../public-api';

const meta: Meta = {
  title: 'Pakitec/Formulários',
  decorators: [moduleMetadata({ imports: [FormsModule, PakiCombobox, PakiDate, PakiInput, PakiSelect, PakiTextarea] })],
  parameters: { layout: 'centered' },
};
export default meta;
type Story = StoryObj;

export const Controls: Story = {
  render: () => ({
    props: {
      value: '',
      options: [
        { label: 'Clínica geral', value: 'general' },
        { label: 'Cirurgia', value: 'surgery' },
        { label: 'Dermatologia', value: 'dermatology' },
      ],
      cities: ['São Paulo', 'Campinas', 'Santos', 'Sorocaba'],
    },
    template: `<div style="display:grid;gap:18px;width:min(520px,80vw)">
      <paki-input label="Nome" placeholder="Nome completo" [(ngModel)]="value" />
      <paki-select label="Especialidade" [items]="options" [(ngModel)]="value" />
      <paki-combobox label="Cidade" [options]="cities" [(ngModel)]="value" />
      <paki-date label="Data" [(ngModel)]="value" />
      <paki-textarea label="Observações" [(ngModel)]="value" />
    </div>`,
  }),
};
