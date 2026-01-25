import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResetPasswordForm from './ResetPasswordForm';

describe('ResetPasswordForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders password inputs when token is provided', () => {
    render(<ResetPasswordForm token="valid-token" />);

    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset password/i })).toBeInTheDocument();
  });

  it('shows error state when no token is provided', () => {
    render(<ResetPasswordForm token="" />);

    expect(screen.getByText(/invalid or missing reset token/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /request new link/i })).toHaveAttribute('href', '/forgot-password');
  });

  it('allows typing in password fields', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="valid-token" />);

    const passwordInput = screen.getByLabelText(/new password/i);
    const confirmInput = screen.getByLabelText(/confirm password/i);

    await user.type(passwordInput, 'newpassword123');
    await user.type(confirmInput, 'newpassword123');

    expect(passwordInput).toHaveValue('newpassword123');
    expect(confirmInput).toHaveValue('newpassword123');
  });

  it('shows error when passwords do not match', async () => {
    const user = userEvent.setup();
    render(<ResetPasswordForm token="valid-token" />);

    await user.type(screen.getByLabelText(/new password/i), 'password123456');
    await user.type(screen.getByLabelText(/confirm password/i), 'differentpass123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
  });

  it('submits successfully with matching passwords', async () => {
    const user = userEvent.setup();

    // Mock window.location
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { ...originalLocation, href: '' };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({
        success: true,
        message: 'Password reset successful'
      })
    });

    render(<ResetPasswordForm token="valid-token" />);

    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/reset-password', {
        method: 'POST',
        body: expect.any(FormData)
      });
    });

    // Restore window.location
    window.location = originalLocation;
  });

  it('shows error message on failed submission', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({
        error: 'Invalid or expired reset link'
      })
    });

    render(<ResetPasswordForm token="expired-token" />);

    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid or expired reset link/i)).toBeInTheDocument();
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

    render(<ResetPasswordForm token="valid-token" />);

    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    expect(screen.getByText(/resetting/i)).toBeInTheDocument();
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

    render(<ResetPasswordForm token="valid-token" />);

    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  it('includes token in form submission', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ success: true, message: 'Done' })
    });

    // Mock window.location
    const originalLocation = window.location;
    // @ts-ignore
    delete window.location;
    window.location = { ...originalLocation, href: '' };

    render(<ResetPasswordForm token="my-secret-token" />);

    await user.type(screen.getByLabelText(/new password/i), 'newpassword123');
    await user.type(screen.getByLabelText(/confirm password/i), 'newpassword123');
    await user.click(screen.getByRole('button', { name: /reset password/i }));

    await waitFor(() => {
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const formData = fetchCall[1].body as FormData;
      expect(formData.get('token')).toBe('my-secret-token');
    });

    // Restore window.location
    window.location = originalLocation;
  });
});
