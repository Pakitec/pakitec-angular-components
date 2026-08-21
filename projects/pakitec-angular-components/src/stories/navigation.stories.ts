import type { Meta, StoryObj } from '@storybook/angular-vite';
import { moduleMetadata } from '@storybook/angular-vite';
import { provideRouter } from '@angular/router';
import { PakiModuleTabs, PakiPagination } from '../public-api';

const meta: Meta = {
  title: 'Pakitec/Navegação',
  decorators: [moduleMetadata({ imports: [PakiModuleTabs, PakiPagination], providers: [provideRouter([])] })],
  parameters: { layout: 'padded' },
};
export default meta;
type Story = StoryObj;

export const TabsAndPagination: Story = {
  render: () => ({
    props: {
      tabs: [{ label: 'Visão geral', route: '/' }, { label: 'Histórico', route: '/history' }, { label: 'Configurações', route: '/settings' }],
      page: { number: 2, size: 10, totalElements: 47, totalPages: 5, first: false, last: false },
    },
    template: `<paki-module-tabs [tabs]="tabs" /><paki-pagination [page]="page" />`,
  }),
};
