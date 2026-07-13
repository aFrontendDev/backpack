import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from '.';

const meta = {
  title: 'Components/Textarea',
  component: Textarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'description',
    placeholder: 'Enter your description here...',
    rows: 4,
  },
};

export const Disabled: Story = {
  args: {
    name: 'disabled-textarea',
    placeholder: 'This is disabled',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    name: 'required-textarea',
    placeholder: 'This field is required',
    required: true,
  },
};
