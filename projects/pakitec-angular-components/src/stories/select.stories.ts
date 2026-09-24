import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { FormsModule } from '@angular/forms';
import { PakiSelect } from '../public-api';
const meta: Meta<PakiSelect> = { title: 'Componentes/Select', component: PakiSelect, decorators: [moduleMetadata({ imports: [FormsModule] })], args: { label: 'Especialidade', placeholder: 'Selecione', items: [{ label: 'Clínica geral', value: 'general' }, { label: 'Cirurgia', value: 'surgery' }, { label: 'Dermatologia', value: 'dermatology' }] } };
export default meta;
type Story = StoryObj<PakiSelect>;
export const Playground: Story = { render: (args) => ({ props: { ...args, selected: '' }, template: '<div style="width:360px"><paki-select [label]="label" [placeholder]="placeholder" [items]="items" [(ngModel)]="selected" /></div>' }) };

const BREEDS = ['Akita', 'American Bully', 'Basset Hound', 'Beagle', 'Bernese Mountain Dog', 'Border Collie', 'Boston Terrier', 'Boxer', 'Bulldog Francês', 'Chihuahua', 'Dachshund', 'Golden Retriever', 'Labrador Retriever', 'Lhasa Apso', 'Maltês', 'Pastor Alemão', 'Pinscher', 'Poodle', 'Shih-Tzu', 'Spitz Alemão', 'Vira-lata (SRD)', 'Yorkshire Terrier'].map((label) => ({ label, value: label }));

/**
 * Select numa coluna estreita dentro de um card largo e posicionado (como o card do
 * animal no amora). A lista deve acompanhar a largura do campo, e não a do card.
 */
export const InsideWideCard: Story = {
  args: { label: 'Raça', placeholder: 'Selecione', items: BREEDS },
  render: (args) => ({
    props: { ...args, selected: 'Akita' },
    template: `<article style="position:relative;width:900px;padding:16px;border:1px solid #ddd;border-radius:12px;display:grid;grid-template-columns:repeat(4,1fr);gap:12px">
      <div style="height:42px;border:1px dashed #ccc;border-radius:8px"></div>
      <paki-select [label]="label" [placeholder]="placeholder" [items]="items" [(ngModel)]="selected" />
      <div style="height:42px;border:1px dashed #ccc;border-radius:8px"></div>
      <div style="height:42px;border:1px dashed #ccc;border-radius:8px"></div>
    </article>`,
  }),
};

