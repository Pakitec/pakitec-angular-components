import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig, moduleMetadata } from '@storybook/angular-vite';
import { Component, afterNextRender, inject, input } from '@angular/core';
import { Router, provideRouter } from '@angular/router';

import {
  PakiNavigationRail,
  type PakiNavigationRailBrand,
  type PakiNavigationRailItem,
} from '../public-api';

/**
 * Rota vazia usada pelas stories que precisam de RouterLink.
 * O Angular exige um componente para cada rota registrada.
 */
@Component({ standalone: true, template: '' })
class StoryRoute {}

/**
 * Host da story ItemAtivo.
 * Navega para a rota do item ativo após a renderização inicial.
 * Assim, RouterLinkActive aplica a classe `active` e o aria-current="page".
 */
@Component({
  standalone: true,
  imports: [PakiNavigationRail],
  template:
    '<paki-navigation-rail [items]="items()" [brand]="brand()" [expanded]="expanded()"></paki-navigation-rail>',
})
class NavigationRailActiveItemHost {
  private readonly router = inject(Router);

  readonly items = input.required<readonly PakiNavigationRailItem[]>();
  readonly brand = input<PakiNavigationRailBrand | undefined>(undefined);
  readonly expanded = input<boolean>(false);

  constructor() {
    afterNextRender(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}

/**
 * Marca de exemplo navegável.
 * As imagens compactImageUrl/expandedImageUrl ficam apenas aqui nas stories
 * (premissa R4). Elas não fazem parte do contrato público do componente.
 */
const brandNavegavel: PakiNavigationRailBrand = {
  label: 'Pakitec',
  route: '/',
};

/**
 * Itens base do grupo principal.
 * Cobrem item com rota, item sem rota, item disabled e item sem ícone.
 */
const mainItems: readonly PakiNavigationRailItem[] = [
  { id: 'dashboard', label: 'Painel', route: '/dashboard', icon: 'icon-dashboard' },
  { id: 'reports', label: 'Relatórios', route: '/reports', icon: 'icon-reports' },
  { id: 'actions', label: 'Ações rápidas', icon: 'icon-bolt' },
  { id: 'archive', label: 'Arquivados', route: '/archive', icon: 'icon-archive', disabled: true },
  { id: 'legacy', label: 'Sem ícone', route: '/legacy' },
];

/**
 * Item ancorado ao rodapé, separado do grupo principal (AC-005).
 */
const footerItem: PakiNavigationRailItem = {
  id: 'settings',
  label: 'Configurações',
  route: '/settings',
  icon: 'icon-settings',
  position: 'footer',
};

/**
 * Lista completa: itens main mais o item de rodapé.
 */
const baseItems: readonly PakiNavigationRailItem[] = [...mainItems, footerItem];

/**
 * Metadados da story do paki-navigation-rail.
 *
 * O Storybook alterna entre tema claro e escuro pela toolbar global "Tema visual".
 * Cada story abaixo aparece nos dois temas sem configuração extra.
 */
const meta: Meta<PakiNavigationRail> = {
  title: 'Componentes/Navigation Rail',
  component: PakiNavigationRail,
  decorators: [
    applicationConfig({
      providers: [provideRouter([{ path: '**', component: StoryRoute }])],
    }),
  ],
  args: {
    items: baseItems,
    brand: brandNavegavel,
    expanded: false,
  },
};

export default meta;
type Story = StoryObj<PakiNavigationRail>;

/**
 * Recolhido (padrão): expanded=false.
 * Demonstra o modo só-ícone (AC-007) e a largura de 64px (AC-001).
 */
export const Recolhido: Story = {
  args: {
    expanded: false,
  },
};

/**
 * Expandido: expanded=true.
 * Demonstra a largura de 216px e os labels visíveis (AC-001).
 */
export const Expandido: Story = {
  args: {
    expanded: true,
  },
};

/**
 * Marca navegável e itens com rota.
 * Navega para /dashboard para que RouterLinkActive aplique `active` e
 * aria-current="page" no item ativo (AC-002, AC-006).
 */
export const ItemAtivo: Story = {
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
      imports: [NavigationRailActiveItemHost],
    }),
  ],
  render: (args) => ({
    props: args,
    template:
      '<app-navigation-rail-active-item-host [items]="items" [brand]="brand" [expanded]="expanded"></app-navigation-rail-active-item-host>',
  }),
  args: {
    items: baseItems,
    brand: brandNavegavel,
    expanded: true,
  },
};

/**
 * Item de rodapé separado dos itens main (AC-005).
 * Mantém o item Configurações ancorado ao rodapé via position='footer'.
 */
export const ComRodape: Story = {
  args: {
    items: [
      { id: 'dashboard', label: 'Painel', route: '/dashboard', icon: 'icon-dashboard' },
      { id: 'reports', label: 'Relatórios', route: '/reports', icon: 'icon-reports' },
      footerItem,
    ],
    expanded: true,
  },
};

/**
 * Lista vazia com marca presente.
 * Exercita a robustez visual sem itens (complementa AC-008).
 */
export const ListaVazia: Story = {
  args: {
    items: [],
    brand: brandNavegavel,
    expanded: true,
  },
};
