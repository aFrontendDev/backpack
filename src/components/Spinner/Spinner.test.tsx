import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Spinner from './Spinner';

describe('Spinner', () => {
  it('renders with status role for accessibility', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('has accessible aria-label', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies medium size by default', () => {
    render(<Spinner />);
    expect(screen.getByRole('status')).toHaveClass('spinner', 'spinner-medium');
  });

  it('applies small size', () => {
    render(<Spinner size="small" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-small');
  });

  it('applies large size', () => {
    render(<Spinner size="large" />);
    expect(screen.getByRole('status')).toHaveClass('spinner-large');
  });

  it('applies custom className', () => {
    render(<Spinner className="custom-spinner" />);
    expect(screen.getByRole('status')).toHaveClass('spinner', 'custom-spinner');
  });

  it('renders as a span element', () => {
    render(<Spinner />);
    expect(screen.getByRole('status').tagName).toBe('SPAN');
  });
});
