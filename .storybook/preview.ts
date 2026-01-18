import type { Preview } from '@storybook/react-vite'
import '../src/styles/global.scss';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f0f4f8' },
        { name: 'white', value: '#ffffff' },
      ],
    },
  },
};

export default preview;