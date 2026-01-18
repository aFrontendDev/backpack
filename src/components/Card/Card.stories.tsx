import type { Meta, StoryObj } from '@storybook/react-vite';
import Card from './Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  argTypes: {
    padding: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    padding: 'medium',
    children: 'This is a card with some content inside.',
  },
};

export const SmallPadding: Story = {
  args: {
    padding: 'small',
    children: 'Card with small padding.',
  },
};

export const LargePadding: Story = {
  args: {
    padding: 'large',
    children: 'Card with large padding.',
  },
};
