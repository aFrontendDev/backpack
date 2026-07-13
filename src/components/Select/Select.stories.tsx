import type { Meta, StoryObj } from '@storybook/react';
import { Select } from '.';

const meta = {
  title: 'Components/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

const sampleOptions = [
  { value: 'shelter', label: 'Shelter' },
  { value: 'sleep', label: 'Sleep System' },
  { value: 'pack', label: 'Backpack' },
  { value: 'cooking', label: 'Cooking Gear' },
];

export const Default: Story = {
  args: {
    name: 'category',
    options: sampleOptions,
  },
};

export const Disabled: Story = {
  args: {
    name: 'category-disabled',
    options: sampleOptions,
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    name: 'category-required',
    options: sampleOptions,
    required: true,
  },
};

export const WithChildren: Story = {
  args: {
    name: 'category-children',
    children: (
      <>
        <option value="">Select an option...</option>
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </>
    ),
  },
};
