import { useState } from 'react';
import type { RegisterFormProps, MessageState, FormState } from './RegisterForm.types';
import Spinner from '../Spinner/Spinner';
import './RegisterForm.scss';

export default function RegisterForm({}: RegisterFormProps) {
  const [formState, setFormState] = useState<FormState>({ username: '', password: '' });
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('username', formState.username);
    formData.append('password', formState.password);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        // Keep loading state and redirect immediately
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

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">
          Username <span className="required">*</span>
        </label>
        <input
          type="text"
          name="username"
          id="username"
          placeholder="Enter username"
          required
          minLength={3}
          maxLength={31}
          pattern="[a-zA-Z0-9_-]+"
          value={formState.username}
          onChange={(e) => setFormState({ ...formState, username: e.target.value })}
        />
        <small className="hint">3-31 characters, letters, numbers, hyphens, and underscores only</small>
      </div>

      <div className="form-group">
        <label htmlFor="password">
          Password <span className="required">*</span>
        </label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter password"
          required
          minLength={6}
          maxLength={255}
          value={formState.password}
          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
        />
        <small className="hint">At least 6 characters</small>
      </div>

      <button type="submit" className="button primary full-width" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner size="small" /> Registering...
          </>
        ) : (
          'Register'
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
