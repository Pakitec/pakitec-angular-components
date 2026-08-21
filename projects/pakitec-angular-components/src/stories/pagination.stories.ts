import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiPagination } from '../public-api';
const meta: Meta<PakiPagination> = { title: 'Componentes/Pagination', component: PakiPagination, args: { page: { number: 2, size: 10, totalElements: 47, totalPages: 5, first: false, last: false } } };
export default meta;
type Story = StoryObj<PakiPagination>;
export const Playground: Story = {};
export const Empty: Story = { args: { page: { number: 1, size: 10, totalElements: 0, totalPages: 0, first: true, last: true } } };
