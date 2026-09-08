import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig } from '@storybook/angular-vite';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { PakiSidenav } from '../lib/components/sidenav/paki-sidenav';

@Component({ standalone: true, template: '' })
class StoryRoute {}

const meta: Meta<PakiSidenav> = {
  title: 'Componentes/Sidenav',
  component: PakiSidenav,
  decorators: [
    applicationConfig({
      providers: [provideRouter([{ path: '**', component: StoryRoute }])],
    }),
  ],
  args: {
    items: [
      { label: 'Dashboard', route: '/dashboard', icon: 'icon-dashboard' },
      { label: 'Relatórios', route: '/reports', icon: 'icon-reports' },
      {
        label: 'Configurações',
        icon: 'icon-settings',
        expanded: true,
        children: [
          { label: 'Geral', route: '/settings/general' },
          { label: 'Usuários', route: '/settings/users' },
        ],
      },
      { label: 'Ajuda', route: '/help' },
    ],
    expanded: true,
  },
};

export default meta;
type Story = StoryObj<PakiSidenav>;

export const Playground: Story = {};

export const CollapsedGroup: Story = {
  args: {
    items: [
      {
        label: 'Configurações',
        icon: 'icon-settings',
        expanded: false,
        children: [
          { label: 'Geral', route: '/settings/general' },
          { label: 'Usuários', route: '/settings/users' },
        ],
      },
    ],
  },
};
