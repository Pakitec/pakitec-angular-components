import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { Component, afterNextRender, inject, input } from '@angular/core';
import { Router, provideRouter } from '@angular/router';

import { PakiSidenav, type PakiSidenavItem } from '../lib/components/sidenav/paki-sidenav';

/**
 * Rota vazia usada pelas stories que precisam de RouterLink.
 * O Angular exige um componente para cada rota registrada.
 */
@Component({ standalone: true, template: '' })
class StoryRoute {}

/**
 * Host usado na story ActiveItem.
 * Navega para a rota do item ativo após a renderização inicial.
 * Assim, RouterLinkActive aplica a classe visual de seleção.
 */
@Component({
  standalone: true,
  imports: [PakiSidenav],
  template: '<paki-sidenav [items]="items()" [expanded]="expanded()"></paki-sidenav>',
})
class SidenavActiveItemHost {
  private readonly router = inject(Router);

  readonly items = input.required<readonly PakiSidenavItem[]>();
  readonly expanded = input<boolean>(false);

  constructor() {
    afterNextRender(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}

/**
 * Lista base de itens usada pelas variações da story.
 * Contém itens simples, item com grupo e item sem ícone.
 */
const baseItems: readonly PakiSidenavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'icon-dashboard' },
  { label: 'Relatórios', route: '/reports', icon: 'icon-reports' },
  {
    label: 'Configurações',
    icon: 'icon-settings',
    expanded: true,
    children: [
      { label: 'Geral', route: '/settings/general', icon: 'icon-general' },
      { label: 'Usuários', route: '/settings/users', icon: 'icon-users' },
    ],
  },
  { label: 'Ajuda', route: '/help', icon: 'icon-help' },
];

/**
 * Metadados da story do paki-sidenav.
 *
 * O Storybook já alterna entre tema claro e escuro pela toolbar global "Tema visual".
 * Portanto, cada story abaixo pode ser exibida nos dois temas sem configuração extra.
 */
const meta: Meta<PakiSidenav> = {
  title: 'Componentes/Sidenav',
  component: PakiSidenav,
  decorators: [
    applicationConfig({
      providers: [provideRouter([{ path: '**', component: StoryRoute }])],
    }),
  ],
  args: {
    items: baseItems,
    expanded: true,
  },
};

export default meta;
type Story = StoryObj<PakiSidenav>;

/**
 * Variação padrão: sidenav expandido com grupo aberto.
 * Use a toolbar de tema para alternar entre claro e escuro.
 */
export const Playground: Story = {};

/**
 * Sidenav colapsado.
 * Demonstra a largura reduzida e o comportamento dos ícones.
 */
export const Collapsed: Story = {
  args: {
    expanded: false,
  },
};

/**
 * Grupo fechado.
 * Demonstra o estado recolhido de um grupo com filhos.
 */
export const GroupClosed: Story = {
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

/**
 * Item ativo.
 * Navega para /dashboard para que RouterLinkActive aplique a classe `active`.
 * Demonstra o estilo visual de seleção.
 */
export const ActiveItem: Story = {
  decorators: [
    applicationConfig({
      providers: [
        provideRouter([
          { path: 'dashboard', component: StoryRoute },
          { path: '**', component: StoryRoute },
        ]),
      ],
    }),
    moduleMetadata({
      imports: [SidenavActiveItemHost],
    }),
  ],
  render: (args) => ({
    props: args,
    template:
      '<app-sidenav-active-item-host [items]="items" [expanded]="expanded"></app-sidenav-active-item-host>',
  }),
  args: {
    items: [
      { label: 'Dashboard', route: '/dashboard', icon: 'icon-dashboard' },
      { label: 'Relatórios', route: '/reports', icon: 'icon-reports' },
    ],
    expanded: true,
  },
};
