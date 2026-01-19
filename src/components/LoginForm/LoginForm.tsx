import { useState } from 'react';
import type { LoginFormProps, MessageState, FormState } from './LoginForm.types';
import Spinner from '../Spinner/Spinner';
import './LoginForm.scss';

export default function LoginForm({}: LoginFormProps) {
  const [formState, setFormState] = useState<FormState>({ username: '', password: '' });
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('username', formState.username.trim());
    formData.append('password', formState.password.trim());

    try {
      const response = await fetch('/api/auth/login', {
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
          value={formState.username}
          onChange={(e) => setFormState({ ...formState, username: e.target.value })}
        />
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
          value={formState.password}
          onChange={(e) => setFormState({ ...formState, password: e.target.value })}
        />
      </div>

      <button type="submit" className="button primary full-width" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner size="small" /> Logging in...
          </>
        ) : (
          'Login'
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
