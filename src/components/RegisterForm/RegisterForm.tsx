import { useState } from 'react';
import type { RegisterFormProps, MessageState, FormState } from './RegisterForm.types';
import Spinner from '../Spinner/Spinner';
import { FormGroup } from '../FormGroup';
import { Input } from '../Input';
import { Button } from '../Button';
import './RegisterForm.scss';

export default function RegisterForm({}: RegisterFormProps) {
  const [formState, setFormState] = useState<FormState>({ username: '', email: '', password: '' });
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    const formData = new FormData();
    formData.append('username', formState.username.trim());
    formData.append('email', formState.email.trim().toLowerCase());
    formData.append('password', formState.password.trim());

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
      <FormGroup label="Username" htmlFor="username" required hint="3-31 characters, letters, numbers, hyphens, and underscores only">
        <Input
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
      </FormGroup>

      <FormGroup label="Email" htmlFor="email" required>
        <Input
          type="email"
          name="email"
          id="email"
          placeholder="Enter email"
          required
          value={formState.email}
          onChange={(e) => setFormState({ ...formState, email: e.target.value })}
        />
      </FormGroup>

      <FormGroup label="Password" htmlFor="password" required hint="At least 6 characters">
        <Input
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
      </FormGroup>

      <Button type="submit" variant="primary" className="full-width" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Spinner size="small" /> Registering...
          </>
        ) : (
          'Register'
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
