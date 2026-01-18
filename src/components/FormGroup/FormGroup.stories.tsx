import type { Meta, StoryObj } from '@storybook/react-vite';
import FormGroup from './FormGroup';
import Input from '../Input/Input';

const meta: Meta<typeof FormGroup> = {
  title: 'Components/FormGroup',
  component: FormGroup,
  argTypes: {
    required: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof FormGroup>;

export const Default: Story = {
  args: {
    label: 'Username',
    htmlFor: 'username',
    children: <Input name="username" placeholder="Enter username" />,
  },
};

export const WithHint: Story = {
  args: {
    label: 'Password',
    htmlFor: 'password',
    hint: 'Must be at least 8 characters',
    children: <Input name="password" type="password" placeholder="Enter password" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email',
    htmlFor: 'email',
    error: 'Please enter a valid email address',
    children: <Input name="email" type="email" placeholder="Enter email" />,
  },
};

export const Required: Story = {
  args: {
    label: 'Required Field',
    htmlFor: 'required',
    required: true,
    children: <Input name="required" placeholder="This field is required" />,
  },
};
