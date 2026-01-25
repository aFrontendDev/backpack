import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormGroup from './FormGroup';

describe('FormGroup', () => {
  it('renders children correctly', () => {
    render(
      <FormGroup>
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(
      <FormGroup label="Username" htmlFor="username">
        <input id="username" type="text" />
      </FormGroup>
    );
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('does not render label when not provided', () => {
    render(
      <FormGroup>
        <input type="text" />
      </FormGroup>
    );
    expect(screen.queryByRole('label')).not.toBeInTheDocument();
  });

  it('applies required class to label when required', () => {
    render(
      <FormGroup label="Email" htmlFor="email" required>
        <input id="email" type="email" />
      </FormGroup>
    );
    const label = screen.getByText('Email');
    expect(label).toHaveClass('required');
  });

  it('does not apply required class when not required', () => {
    render(
      <FormGroup label="Optional" htmlFor="optional">
        <input id="optional" type="text" />
      </FormGroup>
    );
    const label = screen.getByText('Optional');
    expect(label).not.toHaveClass('required');
  });

  it('renders hint text when provided and no error', () => {
    render(
      <FormGroup hint="Enter your username">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('Enter your username')).toBeInTheDocument();
    expect(screen.getByText('Enter your username')).toHaveClass('hint');
  });

  it('renders error message when provided', () => {
    render(
      <FormGroup error="This field is required">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByText('This field is required')).toHaveClass('error-message');
  });

  it('shows error instead of hint when both provided', () => {
    render(
      <FormGroup hint="Helpful hint" error="Error message">
        <input type="text" />
      </FormGroup>
    );
    expect(screen.queryByText('Helpful hint')).not.toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <FormGroup className="custom-form-group">
        <input type="text" />
      </FormGroup>
    );
    const formGroup = screen.getByRole('textbox').parentElement;
    expect(formGroup).toHaveClass('form-group', 'custom-form-group');
  });

  it('wraps content in a div', () => {
    render(
      <FormGroup>
        <input type="text" data-testid="input" />
      </FormGroup>
    );
    const input = screen.getByTestId('input');
    expect(input.parentElement?.tagName).toBe('DIV');
  });

  it('correctly associates label with input via htmlFor', () => {
    render(
      <FormGroup label="Password" htmlFor="password-field">
        <input id="password-field" type="password" />
      </FormGroup>
    );
    const label = screen.getByText('Password');
    expect(label).toHaveAttribute('for', 'password-field');
  });
});
