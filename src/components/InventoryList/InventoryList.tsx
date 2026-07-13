import React, { useState, useEffect } from 'react';
import InventoryCard from '../InventoryCard/InventoryCard';
import InventoryItemForm from '../InventoryItemForm/InventoryItemForm';
import Spinner from '../Spinner/Spinner';
import { Button } from '../Button';
import './_InventoryList.scss';

export interface InventoryItem {
  id: string;
  name: string;
  brand?: string;
  weight_g: number;
  category?: string;
  is_owned: number;
  url?: string;
  notes?: string;
  created_at: number;
  updated_at: number;
}

export default function InventoryList() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const fetchItems = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory');
      const data = await res.json();
      if (data.success) {
        setItems(data.data);
      } else {
        setError(data.error || 'Failed to fetch inventory');
      }
    } catch (err) {
      setError('An error occurred while fetching inventory');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    
    try {
      const res = await fetch(`/api/inventory/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setItems(items.filter(item => item.id !== id));
      } else {
        alert(data.error || 'Failed to delete item');
      }
    } catch (err) {
      alert('Error deleting item');
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingItem(null);
  };

  const handleSave = (savedItem: InventoryItem) => {
    if (editingItem) {
      setItems(items.map(i => i.id === savedItem.id ? savedItem : i));
    } else {
      setItems([savedItem, ...items]);
    }
    handleFormClose();
  };

  if (loading && items.length === 0) return <Spinner />;

  return (
    <div className="inventory-container">
      <div className="inventory-header">
        <h2>My Gear</h2>
        <Button className="add-btn" variant="primary" onClick={() => setShowForm(true)}>+ Add Item</Button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="modal-overlay" onClick={handleFormClose}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <InventoryItemForm 
              item={editingItem} 
              onSave={handleSave} 
              onCancel={handleFormClose} 
            />
          </div>
        </div>
      )}

      {items.length === 0 && !loading && !error ? (
        <div className="empty-state">
          <p>You haven't added any gear yet. Click the button above to get started!</p>
        </div>
      ) : (
        <div className="inventory-grid">
          {items.map(item => (
            <InventoryCard 
              key={item.id} 
              item={item} 
              onEdit={() => handleEdit(item)} 
              onDelete={() => handleDelete(item.id)} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
