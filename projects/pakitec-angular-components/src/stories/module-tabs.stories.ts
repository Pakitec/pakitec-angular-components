import type { Meta, StoryObj } from '@storybook/angular-vite';
import { applicationConfig } from '@storybook/angular-vite';
import { provideRouter } from '@angular/router';
import { Component } from '@angular/core';
import { PakiModuleTabs } from '../public-api';
@Component({ standalone: true, template: '' })
class StoryRoute {}
const meta: Meta<PakiModuleTabs> = { title: 'Componentes/Module Tabs', component: PakiModuleTabs, decorators: [applicationConfig({ providers: [provideRouter([{ path: '**', component: StoryRoute }])] })], args: { label: 'Seções do módulo', tabs: [{ label: 'Visão geral', route: '/' }, { label: 'Histórico', route: '/history' }, { label: 'Configurações', route: '/settings' }] } };
export default meta;
type Story = StoryObj<PakiModuleTabs>;
export const Playground: Story = {};
