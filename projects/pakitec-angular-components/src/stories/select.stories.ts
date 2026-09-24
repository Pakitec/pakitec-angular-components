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


const REGIMES = [
  { label: 'Simples Nacional', value: 'SIMPLES_NACIONAL' },
  { label: 'Simples Nacional - excesso de sublimite', value: 'SIMPLES_EXCESSO' },
  { label: 'Lucro Presumido', value: 'LUCRO_PRESUMIDO' },
  { label: 'Lucro Real', value: 'LUCRO_REAL' },
  { label: 'MEI', value: 'MEI' },
];

/**
 * Select no fim de um card com overflow: hidden (ex.: "Regime tributário" nas
 * configurações). A lista não pode ser recortada pela borda do card.
 */
export const InsideClippedCard: Story = {
  args: { label: 'Regime tributário', placeholder: 'Selecione', items: REGIMES },
  render: (args) => ({
    props: { ...args, selected: 'SIMPLES_NACIONAL' },
    template: `<section style="width:360px;height:96px;overflow:hidden;padding:16px;border:1px solid #ddd;border-radius:12px;background:#fff">
      <paki-select [label]="label" [placeholder]="placeholder" [items]="items" [(ngModel)]="selected" />
    </section>`,
  }),
};

/**
 * Select dentro de um <dialog> modal (top layer), como o cadastro do animal no amora.
 * A lista precisa aparecer por cima do modal, não atrás dele.
 */
export const InsideModalDialog: Story = {
  args: { label: 'Raça', placeholder: 'Selecione', items: BREEDS },
  render: (args) => ({
    props: { ...args, selected: '' },
    template: `<button type="button" id="open-dialog" (click)="dialog.showModal()">Abrir modal</button>
      <dialog #dialog style="width:420px;padding:0;border:0;border-radius:12px">
        <div style="max-height:220px;overflow:auto;padding:20px">
          <p style="margin:0 0 12px">Cadastro do animal</p>
          <paki-select [label]="label" [placeholder]="placeholder" [items]="items" [(ngModel)]="selected" />
        </div>
      </dialog>`,
  }),
};
