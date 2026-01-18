import { useState } from 'react';
import type { DashboardFormProps, MessageState, FormState } from './DashboardForm.types';
import Spinner from '../Spinner/Spinner';
import './DashboardForm.scss';

export default function DashboardForm({ onDataSaved }: DashboardFormProps) {
  const [formState, setFormState] = useState<FormState>({ key: '', value: '' });
  const [message, setMessage] = useState<MessageState>({ text: '', type: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate JSON
    let parsedValue;
    try {
      parsedValue = JSON.parse(formState.value);
    } catch (error) {
      setMessage({ text: 'Invalid JSON value', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ text: '', type: '' });

    try {
      const response = await fetch('/api/data/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key: formState.key, value: parsedValue })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ text: data.message, type: 'success' });
        setFormState({ key: '', value: '' });
        // Notify parent component to reload data
        onDataSaved?.();
      } else {
        setMessage({ text: data.error, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: 'An error occurred. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="data-section">
      <h2>Save Data</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="key">Key</label>
          <input
            type="text"
            id="key"
            name="key"
            required
            placeholder="e.g., note, settings, preferences"
            value={formState.key}
            onChange={(e) => setFormState({ ...formState, key: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label htmlFor="value">Value (JSON)</label>
          <textarea
            id="value"
            name="value"
            required
            rows={4}
            placeholder='e.g., {"title": "My Note", "content": "Hello World"}'
            value={formState.value}
            onChange={(e) => setFormState({ ...formState, value: e.target.value })}
          />
        </div>

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Spinner size="small" /> Saving...
            </>
          ) : (
            'Save Data'
          )}
        </button>

        {message.text && (
          <p className={`message ${message.type}`}>
            {message.text}
          </p>
        )}
      </form>
    </div>
  );
}
