import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Message from './Message';

describe('Message', () => {
  it('renders children correctly', () => {
    render(<Message>This is a message</Message>);
    expect(screen.getByText('This is a message')).toBeInTheDocument();
  });

  it('applies info type by default', () => {
    render(<Message>Info message</Message>);
    expect(screen.getByText('Info message')).toHaveClass('message', 'info');
  });

  it('applies success type', () => {
    render(<Message type="success">Success!</Message>);
    expect(screen.getByText('Success!')).toHaveClass('message', 'success');
  });

  it('applies error type', () => {
    render(<Message type="error">Error occurred</Message>);
    expect(screen.getByText('Error occurred')).toHaveClass('message', 'error');
  });

  it('applies warning type', () => {
    render(<Message type="warning">Warning!</Message>);
    expect(screen.getByText('Warning!')).toHaveClass('message', 'warning');
  });

  it('applies id attribute', () => {
    render(<Message id="msg-1">Message with ID</Message>);
    expect(screen.getByText('Message with ID')).toHaveAttribute('id', 'msg-1');
  });

  it('applies custom className', () => {
    render(<Message className="custom-message">Custom</Message>);
    expect(screen.getByText('Custom')).toHaveClass('message', 'custom-message');
  });

  it('renders as a p element', () => {
    render(<Message>Paragraph message</Message>);
    expect(screen.getByText('Paragraph message').tagName).toBe('P');
  });

  it('combines type and custom className', () => {
    render(<Message type="error" className="extra">Combined</Message>);
    const message = screen.getByText('Combined');
    expect(message).toHaveClass('message', 'error', 'extra');
  });
});
