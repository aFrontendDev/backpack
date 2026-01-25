import { useState } from 'react';
import type { ResetPasswordFormProps, MessageState, FormState } from './ResetPasswordForm.types';
import Spinner from '../Spinner/Spinner';
import './ResetPasswordForm.scss';

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [formState, setFormState] = useState<FormState>({ password: '', confirmPassword: '' });
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formState.password !== formState.confirmPassword) {
      setMessage({ text: 'Passwords do not match', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('token', token);
    formData.append('password', formState.password.trim());

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        // Redirect to home after successful reset
        window.location.href = '/';
      } else {
        setMessage({ text: data.error, type: 'error' });
        setIsSubmitting(false);
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-password-error">
        <p>Invalid or missing reset token.</p>
        <a href="/forgot-password" className="button secondary full-width">Request New Link</a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="password">
          New Password <span className="required">*</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter new password"
          required
          minLength={12}
          maxLength={255}
          value={formState.password}
          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
        />
        <small className="hint">At least 12 characters</small>
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">
          Confirm Password <span className="required">*</span>
        </label>
        <input
          type="password"
          name="confirmPassword"
          id="confirmPassword"
          placeholder="Confirm new password"
          required
          minLength={12}
          maxLength={255}
          value={formState.confirmPassword}
          onChange={(e) => setFormState({ ...formState, confirmPassword: e.target.value })}
        />
      </div>

      <button type="submit" className="button primary full-width" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner size="small" /> Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </button>

      {message.text && (
        <div className={`message ${message.type} visible`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
