import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegisterForm from './RegisterForm';

describe('RegisterForm', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('renders all form inputs', () => {
    render(<RegisterForm />);

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });

  it('shows validation hints', () => {
    render(<RegisterForm />);

    expect(screen.getByText(/3-31 characters/i)).toBeInTheDocument();
    expect(screen.getByText(/at least 12 characters/i)).toBeInTheDocument();
  });

  it('allows typing in all form fields', async () => {
    const user = userEvent.setup();
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(usernameInput, 'newuser');
    await user.type(emailInput, 'newuser@example.com');
    await user.type(passwordInput, 'securepassword123');

    expect(usernameInput).toHaveValue('newuser');
    expect(emailInput).toHaveValue('newuser@example.com');
    expect(passwordInput).toHaveValue('securepassword123');
  });

  it('submits the form and redirects on success', async () => {
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
        message: 'Registration successful'
      })
    });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/email/i), 'newuser@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/auth/register', {
        method: 'POST',
        body: expect.any(FormData)
      });
    });

    await waitFor(() => {
      expect(window.location.href).toBe('/');
    });

    // Restore window.location
    window.location = originalLocation;
  });

  it('shows error message when username already exists', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({
        error: 'Username already exists'
      })
    });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'existinguser');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument();
    });
  });

  it('shows error message when email already registered', async () => {
    const user = userEvent.setup();

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: () => Promise.resolve({
        error: 'Email already registered'
      })
    });

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/email/i), 'existing@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/email already registered/i)).toBeInTheDocument();
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

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    expect(screen.getByText(/registering/i)).toBeInTheDocument();
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

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/email/i), 'new@example.com');
    await user.type(screen.getByLabelText(/password/i), 'securepassword123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(screen.getByText(/an error occurred/i)).toBeInTheDocument();
    });
  });

  it('normalizes email to lowercase before submission', async () => {
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

    render(<RegisterForm />);

    await user.type(screen.getByLabelText(/username/i), 'newuser');
    await user.type(screen.getByLabelText(/email/i), 'TEST@EXAMPLE.COM');
    await user.type(screen.getByLabelText(/password/i), 'securepassword123');
    await user.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      const fetchCall = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0];
      const formData = fetchCall[1].body as FormData;
      expect(formData.get('email')).toBe('test@example.com');
    });

    // Restore window.location
    window.location = originalLocation;
  });

  it('has correct input validation attributes', () => {
    render(<RegisterForm />);

    const usernameInput = screen.getByLabelText(/username/i);
    const passwordInput = screen.getByLabelText(/password/i);

    expect(usernameInput).toHaveAttribute('minLength', '3');
    expect(usernameInput).toHaveAttribute('maxLength', '31');
    expect(usernameInput).toHaveAttribute('pattern', '[a-zA-Z0-9_-]+');

    expect(passwordInput).toHaveAttribute('minLength', '12');
    expect(passwordInput).toHaveAttribute('maxLength', '255');
  });
});
