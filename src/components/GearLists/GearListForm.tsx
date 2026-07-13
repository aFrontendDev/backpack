import { useState } from 'react';
import type { GearList } from './GearListContainer';
import Spinner from '../Spinner/Spinner';
import './_GearListForm.scss';

interface GearListFormProps {
  list: GearList | null;
  onClose: () => void;
  onSave: (list: GearList) => void;
}

const formatOz = (oz: number) => {
  if (oz >= 16) {
    return `${(oz / 16).toFixed(2)}lb`;
  }
  return `${oz.toFixed(1)}oz`;
};

export default function GearListForm({ list, onClose, onSave }: GearListFormProps) {
  const [formData, setFormData] = useState({
    name: list?.name || '',
    description: list?.description || '',
    target_weight_g: list?.target_weight_g || ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const url = list ? `/api/gear-lists/${list.id}` : '/api/gear-lists';
    const method = list ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to save gear list');
      }

      onSave(data);
    } catch (err: any) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content gear-list-form-container">
        <h3>{list ? 'Edit Gear List' : 'Create New Gear List'}</h3>
        
        {error && <div className="form-error">{error}</div>}

        <form onSubmit={handleSubmit} className="gear-list-form">
          <div className="form-group">
            <label htmlFor="name">List Name *</label>
            <input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Summer West Highland Way"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Optional notes about this trip or list"
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_weight_g">Target Weight Goal (grams)</label>
            <input
              type="number"
              id="target_weight_g"
              min="0"
              step="any"
              value={formData.target_weight_g}
              onChange={(e) => setFormData({ ...formData, target_weight_g: e.target.value })}
              placeholder="e.g. 8000"
            />
            {formData.target_weight_g && (
              <small className="weight-hint">
                ≈ {formatOz(parseFloat(formData.target_weight_g.toString()) * 0.035274)}
              </small>
            )}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-save" disabled={isSubmitting}>
              {isSubmitting ? <Spinner size="small" /> : 'Save List'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
