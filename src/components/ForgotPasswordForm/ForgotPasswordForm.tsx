import { useState } from 'react';
import type { ForgotPasswordFormProps, MessageState, FormState } from './ForgotPasswordForm.types';
import Spinner from '../Spinner/Spinner';
import { FormGroup } from '../FormGroup';
import { Input } from '../Input';
import { Button } from '../Button';
import './ForgotPasswordForm.scss';

export default function ForgotPasswordForm({}: ForgotPasswordFormProps) {
  const [formState, setFormState] = useState<FormState>({ email: '' });
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('email', formState.email.trim().toLowerCase());

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setEmailSent(true);
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <div className="forgot-password-success">
        <p>Check your email for a password reset link.</p>
        <p className="hint">If you don't see it, check your spam folder.</p>
        <Button onClick={() => window.location.href = '/login'} variant="secondary" className="full-width">Back to Login</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormGroup label="Email" htmlFor="email" required>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
        />
      </FormGroup>

      <Button type="submit" variant="primary" className="full-width" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner size="small" /> Sending...
          </>
        ) : (
          'Send Reset Link'
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
