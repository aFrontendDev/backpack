import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ForgotPasswordForm from './ForgotPasswordForm';

describe('ForgotPasswordForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders the email input and submit button', () => {
    render(<ForgotPasswordForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send reset link/i })).toBeInTheDocument();
  });

  it('allows typing in the email field', async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');

    expect(emailInput).toHaveValue('test@example.com');
  });

  it('submits the form and shows success message', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link.'
      })
    });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/check your email/i)).toBeInTheDocument();
    });

    expect(global.fetch).toHaveBeenCalledWith('/api/auth/forgot-password', {
      method: 'POST',
      body: expect.any(FormData)
    });
  });

  it('shows error message on failed submission', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({
        error: 'An error occurred'
      })
    });

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  it('shows loading state while submitting', async () => {
    const user = userEvent.setup();

    let resolvePromise: (value: any) => void;
    global.fetch = vi.fn().mockReturnValue(
      new Promise((resolve) => {
        resolvePromise = resolve;
      })
    );

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    expect(screen.getByText(/sending/i)).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();

    // Resolve the promise to clean up
    resolvePromise!({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Done' })
    });
  });

  it('handles network errors gracefully', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    render(<ForgotPasswordForm />);

    const emailInput = screen.getByLabelText(/email/i);
    await user.type(emailInput, 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  it('shows back to login link after successful submission', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Email sent' })
    });

    render(<ForgotPasswordForm />);

    await user.type(screen.getByLabelText(/email/i), 'test@example.com');
    await user.click(screen.getByRole('button', { name: /send reset link/i }));

    await waitFor(() => {
      expect(screen.getByRole('link', { name: /back to login/i })).toHaveAttribute('href', '/login');
    });
  });
});
