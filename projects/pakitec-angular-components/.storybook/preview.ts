import type { Preview } from '@storybook/angular-vite';
import { setCompodocJson } from '@storybook/addon-docs/angular';
import docJson from '../documentation.json';
import '../src/styles/pakitec-theme.scss';
setCompodocJson(docJson);

const preview: Preview = {
  globalTypes: {
    theme: {
      description: 'Tema visual',
      defaultValue: 'light',
      toolbar: { icon: 'paintbrush', items: ['light', 'dark'] },
    },
  },
  decorators: [
    (story, context) => {
      document.documentElement.dataset['theme'] = context.globals['theme'];
      return story();
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
};

export default preview;
