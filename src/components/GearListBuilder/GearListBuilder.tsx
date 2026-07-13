import { useState, useEffect } from 'react';
import type { GearList } from '../GearLists/GearListContainer';
import Spinner from '../Spinner/Spinner';
import './_GearListBuilder.scss';

// Inventory Item interface
interface InventoryItem {
  id: string;
  name: string;
  brand: string | null;
  weight_g: number;
  category: string | null;
}

// Gear List Item interface (joined with Inventory Item)
interface GearListItem extends InventoryItem {
  list_item_id: string;
  quantity: number;
}

interface GearListWithItems extends GearList {
  items: GearListItem[];
}

const formatWeight = (g: number) => {
  if (g > 999) {
    return `${(g / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}kg`;
  }
  return `${g.toLocaleString()}g`;
};

const formatOz = (oz: number) => {
  if (oz >= 16) {
    return `${(oz / 16).toFixed(2)}lb`;
  }
  return `${oz.toFixed(1)}oz`;
};

export default function GearListBuilder({ listId }: { listId: string }) {
  const [list, setList] = useState<GearListWithItems | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // For adding items: filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, [listId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch both list and full inventory in parallel
      const [listRes, invRes] = await Promise.all([
        fetch(`/api/gear-lists/${listId}`),
        fetch('/api/inventory')
      ]);

      if (!listRes.ok) throw new Error('Failed to load gear list');
      if (!invRes.ok) throw new Error('Failed to load inventory');

      const listData = await listRes.json();
      const invData = await invRes.json();

      setList(listData);
      setInventory(invData.data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const addItemToList = async (itemId: string) => {
    try {
      const res = await fetch(`/api/gear-lists/${listId}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ item_id: itemId, quantity: 1 })
      });
      
      if (!res.ok) throw new Error('Failed to add item');
      
      const newItem = await res.json();
      if (list) {
        setList({
          ...list,
          items: [...list.items, newItem]
        });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const updateQuantity = async (listItemId: string, delta: number, currentQuantity: number) => {
    const newQuantity = currentQuantity + delta;
    
    if (newQuantity <= 0) {
      return removeListItem(listItemId);
    }

    try {
      const res = await fetch(`/api/gear-lists/${listId}/items/${listItemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quantity: newQuantity })
      });
      
      if (!res.ok) throw new Error('Failed to update quantity');
      
      const updatedItem = await res.json();
      if (list) {
        setList({
          ...list,
          items: list.items.map(item => item.list_item_id === listItemId ? updatedItem : item)
        });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const removeListItem = async (listItemId: string) => {
    try {
      const res = await fetch(`/api/gear-lists/${listId}/items/${listItemId}`, {
        method: 'DELETE'
      });
      
      if (!res.ok) throw new Error('Failed to remove item');
      
      if (list) {
        setList({
          ...list,
          items: list.items.filter(item => item.list_item_id !== listItemId)
        });
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading) {
    return <div className="gear-list-builder loading"><Spinner size="large" /></div>;
  }

  if (error || !list) {
    return <div className="gear-list-builder error">{error || 'List not found'}</div>;
  }

  // Derived calculations
  const totalWeightG = list.items.reduce((sum, item) => sum + (item.weight_g * item.quantity), 0);
  const totalWeightOz = totalWeightG * 0.035274;
  const isOverTarget = list.target_weight_g ? totalWeightG > list.target_weight_g : false;

  // Inventory filtering logic
  const itemsInListIds = new Set(list.items.map(i => i.id)); // Original item IDs
  const availableInventory = inventory.filter(item => !itemsInListIds.has(item.id));
  
  const categories = Array.from(new Set(inventory.map(i => i.category).filter(Boolean))) as string[];

  const filteredInventory = availableInventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.brand && item.brand.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === '' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="gear-list-builder">
      <div className="header">
        <h2>{list.name}</h2>
        {list.description && <p className="description">{list.description}</p>}
      </div>

      <div className="builder-layout">
        
        {/* Left Column: Current List & Weight Summary */}
        <div className="main-column">
          <div className="weight-summary-card">
            <div className="weight-metrics">
              <div className="metric primary">
                <span className="label">Total Pack Weight</span>
                <span className={`value ${isOverTarget ? 'danger' : ''}`}>
                  {formatWeight(totalWeightG)} <small>/ {formatOz(totalWeightOz)}</small>
                </span>
              </div>
              
              {list.target_weight_g && (
                <div className="metric">
                  <span className="label">Target Weight</span>
                  <span className="value">
                    {formatWeight(list.target_weight_g)} <small>/ {formatOz(list.target_weight_g * 0.035274)}</small>
                  </span>
                </div>
              )}
            </div>
            
            {/* Simple progress bar if target exists */}
            {list.target_weight_g && (
              <div className="progress-bar-container">
                <div 
                  className={`progress-bar ${isOverTarget ? 'danger' : 'success'}`} 
                  style={{ width: `${Math.min((totalWeightG / list.target_weight_g) * 100, 100)}%` }}
                ></div>
              </div>
            )}
          </div>

          <div className="list-items-card">
            <h3>Pack Items ({list.items.reduce((s, i) => s + i.quantity, 0)})</h3>
            
            {list.items.length === 0 ? (
              <div className="empty-list">
                <p>Your pack is empty! Add items from your inventory on the right.</p>
              </div>
            ) : (
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Weight</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {list.items.map(item => (
                    <tr key={item.list_item_id}>
                      <td>
                        <div className="item-name">{item.name}</div>
                        {item.brand && <div className="item-brand">{item.brand}</div>}
                        {item.category && <span className="badge">{item.category}</span>}
                      </td>
                      <td>{formatWeight(item.weight_g)}</td>
                      <td>
                        <div className="quantity-controls">
                          <button onClick={() => updateQuantity(item.list_item_id, -1, item.quantity)}>-</button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.list_item_id, 1, item.quantity)}>+</button>
                        </div>
                      </td>
                      <td className="total-weight">{formatWeight(item.weight_g * item.quantity)}</td>
                      <td>
                        <button className="btn-remove" onClick={() => removeListItem(item.list_item_id)} title="Remove Item">
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Right Column: Inventory Picker */}
        <div className="side-column">
          <div className="inventory-picker-card">
            <h3>Add from Inventory</h3>
            
            <div className="filters">
              <input 
                type="text" 
                placeholder="Search items..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <select 
                value={categoryFilter} 
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="category-select"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="available-items">
              {filteredInventory.length === 0 ? (
                <p className="no-items">No available items match your search.</p>
              ) : (
                filteredInventory.map(item => (
                  <div key={item.id} className="picker-item">
                    <div className="item-details">
                      <span className="name">{item.name} {item.brand ? `(${item.brand})` : ''}</span>
                      <span className="weight">{formatWeight(item.weight_g)}</span>
                    </div>
                    <button className="btn-add" onClick={() => addItemToList(item.id)}>
                      + Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
