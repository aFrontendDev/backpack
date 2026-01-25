import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './Card';

describe('Card', () => {
  it('renders children correctly', () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('applies default medium padding', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('card', 'padding-medium');
  });

  it('applies small padding', () => {
    const { container } = render(<Card padding="small">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('card', 'padding-small');
  });

  it('applies large padding', () => {
    const { container } = render(<Card padding="large">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('card', 'padding-large');
  });

  it('applies custom className', () => {
    const { container } = render(<Card className="custom-card">Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card).toHaveClass('card', 'custom-card');
  });

  it('renders as a div element', () => {
    const { container } = render(<Card>Content</Card>);
    const card = container.firstChild as HTMLElement;
    expect(card.tagName).toBe('DIV');
  });

  it('renders complex children', () => {
    render(
      <Card>
        <h1>Title</h1>
        <p>Description</p>
      </Card>
    );
    expect(screen.getByRole('heading', { name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });
});
