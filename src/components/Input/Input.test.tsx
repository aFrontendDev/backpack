import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input', () => {
  it('renders with default type="text"', () => {
    render(<Input name="test" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text');
  });

  it('accepts different input types', () => {
    render(<Input name="email" type="email" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('type', 'email');
  });

  it('renders password type (no textbox role)', () => {
    render(<Input name="password" type="password" />);
    const input = document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('applies name attribute', () => {
    render(<Input name="username" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'username');
  });

  it('uses name as id when id not provided', () => {
    render(<Input name="field" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'field');
  });

  it('uses explicit id when provided', () => {
    render(<Input name="field" id="custom-id" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('id', 'custom-id');
  });

  it('applies placeholder', () => {
    render(<Input name="search" placeholder="Search..." />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  it('can be required', () => {
    render(<Input name="required-field" required />);
    expect(screen.getByRole('textbox')).toBeRequired();
  });

  it('is not required by default', () => {
    render(<Input name="optional-field" />);
    expect(screen.getByRole('textbox')).not.toBeRequired();
  });

  it('can be disabled', () => {
    render(<Input name="disabled-field" disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('is enabled by default', () => {
    render(<Input name="enabled-field" />);
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('displays controlled value', () => {
    render(<Input name="controlled" value="test value" onChange={() => {}} />);
    expect(screen.getByRole('textbox')).toHaveValue('test value');
  });

  it('applies minLength attribute', () => {
    render(<Input name="min" minLength={5} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('minLength', '5');
  });

  it('applies maxLength attribute', () => {
    render(<Input name="max" maxLength={100} />);
    expect(screen.getByRole('textbox')).toHaveAttribute('maxLength', '100');
  });

  it('applies pattern attribute', () => {
    render(<Input name="pattern" pattern="[A-Za-z]+" />);
    expect(screen.getByRole('textbox')).toHaveAttribute('pattern', '[A-Za-z]+');
  });

  it('applies custom className', () => {
    render(<Input name="styled" className="custom-input" />);
    expect(screen.getByRole('textbox')).toHaveClass('input', 'custom-input');
  });

  it('calls onChange when value changes', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(<Input name="changeable" onChange={handleChange} />);

    await user.type(screen.getByRole('textbox'), 'hello');

    expect(handleChange).toHaveBeenCalled();
  });
});
