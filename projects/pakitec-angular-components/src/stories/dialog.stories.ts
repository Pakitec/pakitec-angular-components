import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiButton, PakiDialog } from '../public-api';
import { moduleMetadata } from '@storybook/angular-vite';
const meta: Meta<PakiDialog> = { title: 'Componentes/Dialog', component: PakiDialog, decorators: [moduleMetadata({ imports: [PakiButton] })], args: { heading: 'Resolver alerta' } };
export default meta;
type Story = StoryObj<PakiDialog>;
export const Playground: Story = {
  render: (args) => ({
    props: { ...args, open: false },
    template: `<button pakiButton (click)="open = true">Abrir diálogo</button>
      <paki-dialog [heading]="heading" [(open)]="open">
        Registre o motivo para manter o histórico de auditoria.
        <ng-container pakiDialogActions><button pakiButton variant="ghost" (click)="open = false">Cancelar</button><button pakiButton (click)="open = false">Resolver</button></ng-container>
      </paki-dialog>`,
  }),
};
