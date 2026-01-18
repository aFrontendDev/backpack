import type { Meta, StoryObj } from '@storybook/react-vite';
import Message from './Message';

const meta: Meta<typeof Message> = {
  title: 'Components/Message',
  component: Message,
  argTypes: {
    type: {
      control: 'select',
      options: ['info', 'success', 'error', 'warning'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Message>;

export const Info: Story = {
  args: {
    type: 'info',
    children: 'This is an informational message.',
  },
};

export const Success: Story = {
  args: {
    type: 'success',
    children: 'Operation completed successfully!',
  },
};

export const Error: Story = {
  args: {
    type: 'error',
    children: 'An error occurred. Please try again.',
  },
};

export const Warning: Story = {
  args: {
    type: 'warning',
    children: 'Warning: This action cannot be undone.',
  },
};
