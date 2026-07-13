import { useState } from 'react';
import type { ResetPasswordFormProps, MessageState, FormState } from './ResetPasswordForm.types';
import Spinner from '../Spinner/Spinner';
import { FormGroup } from '../FormGroup';
import { Input } from '../Input';
import { Button } from '../Button';
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
        <Button onClick={() => window.location.href = '/forgot-password'} variant="secondary" className="full-width">Request New Link</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup label="New Password" htmlFor="password" required hint="At least 12 characters">
        <Input
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
      </FormGroup>

      <FormGroup label="Confirm Password" htmlFor="confirmPassword" required>
        <Input
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
      </FormGroup>

      <Button type="submit" variant="primary" className="full-width" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner size="small" /> Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </Button>

      {message.text && (
        <div className={`message ${message.type} visible`}>
          {message.text}
        </div>
      )}
    </form>
  );
}
