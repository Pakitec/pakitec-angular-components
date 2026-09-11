import type { Meta, StoryObj } from '@storybook/angular-vite';
import { PakiSkeleton } from '../public-api';

const meta: Meta<PakiSkeleton> = {
  title: 'Componentes/Skeleton', component: PakiSkeleton,
  args: { shape: 'text', width: '100%', height: '16px' },
  argTypes: { shape: { control: 'select', options: ['text', 'circle', 'rectangle'] } },
};
export default meta;
type Story = StoryObj<PakiSkeleton>;
export const Playground: Story = { render: (args) => ({ props: args, template: '<paki-skeleton [shape]="shape" [width]="width" [height]="height" />' }) };
