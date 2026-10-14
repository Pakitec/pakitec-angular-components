import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiDocumentViewer } from '../public-api';
const meta: Meta<PakiDocumentViewer> = { title: 'Componentes/Document viewer', component: PakiDocumentViewer, args: { src: 'https://placehold.co/600x800.png', mimeType: 'image/png', fileName: 'fatura.png' } };
export default meta;
type Story = StoryObj<PakiDocumentViewer>;
export const Imagem: Story = {};
export const Carregando: Story = { args: { loading: true } };
export const UrlInvalida: Story = { args: { src: 'javascript:alert(1)' } };
export const FormatoNaoSuportado: Story = { args: { mimeType: 'application/msword', fileName: 'conta.docx' } };
