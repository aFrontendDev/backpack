import React, { useState, useEffect } from 'react';
import type { InventoryItem } from '../InventoryList/InventoryList';
import './_InventoryItemForm.scss';

interface Props {
  item?: InventoryItem | null;
  onSave: (item: InventoryItem) => void;
  onCancel: () => void;
}

const CATEGORIES = [
  'Shelter', 'Sleep System', 'Pack', 'Cooking', 
  'Water', 'Clothing', 'Electronics', 'First Aid', 'Misc'
];

export default function InventoryItemForm({ item, onSave, onCancel }: Props) {
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    weight_g: '',
    category: '',
    is_owned: true,
    url: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        brand: item.brand || '',
        weight_g: item.weight_g.toString(),
        category: item.category || '',
        is_owned: item.is_owned === 1,
        url: item.url || '',
        notes: item.notes || ''
      });
    }
  }, [item]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const isEdit = !!item;
      const url = isEdit ? `/api/inventory/${item.id}` : '/api/inventory';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        onSave(data.data);
      } else {
        setError(data.error || 'Failed to save item');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="inventory-form-container">
      <h3>{item ? 'Edit Gear' : 'Add New Gear'}</h3>
      
      {error && <div className="form-error">{error}</div>}
      
      <form onSubmit={handleSubmit} className="inventory-form">
        <div className="form-group">
          <label htmlFor="name">Item Name *</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            placeholder="e.g. Copper Spur HV UL2"
          />
        </div>

        <div className="form-row">
          <div className="form-group half">
            <label htmlFor="brand">Brand</label>
            <input 
              type="text" 
              id="brand" 
              name="brand" 
              value={formData.brand} 
              onChange={handleChange} 
              placeholder="e.g. Big Agnes"
            />
          </div>

          <div className="form-group half">
            <label htmlFor="weight_g">Weight (g) *</label>
            <input 
              type="number" 
              id="weight_g" 
              name="weight_g" 
              value={formData.weight_g} 
              onChange={handleChange} 
              required 
              min="0"
              step="any"
              placeholder="e.g. 1420"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select id="category" name="category" value={formData.category} onChange={handleChange}>
            <option value="">Select a category</option>
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div className="form-group checkbox-group">
          <input 
            type="checkbox" 
            id="is_owned" 
            name="is_owned" 
            checked={formData.is_owned} 
            onChange={handleChange} 
          />
          <label htmlFor="is_owned">I own this item</label>
        </div>

        <div className="form-group">
          <label htmlFor="url">Product URL</label>
          <input 
            type="url" 
            id="url" 
            name="url" 
            value={formData.url} 
            onChange={handleChange} 
            placeholder="https://..."
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Notes</label>
          <textarea 
            id="notes" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            rows={3}
            placeholder="Any specific details..."
          />
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn-save" disabled={loading}>
            {loading ? 'Saving...' : 'Save Item'}
          </button>
        </div>
      </form>
    </div>
  );
}
