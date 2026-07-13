import React from 'react';
import type { InventoryItem } from '../InventoryList/InventoryList';
import './_InventoryCard.scss';

interface Props {
  item: InventoryItem;
  onEdit: () => void;
  onDelete: () => void;
}

export default function InventoryCard({ item, onEdit, onDelete }: Props) {
  // Convert grams to ounces for display
  const weightOz = (item.weight_g * 0.035274).toFixed(2);
  
  // Format date
  const dateAdded = new Date(item.created_at).toLocaleDateString();

  return (
    <div className={`inventory-card ${!item.is_owned ? 'wishlist' : ''}`}>
      <div className="card-header">
        <div className="title-group">
          <h4>{item.name}</h4>
          {item.brand && <span className="brand">{item.brand}</span>}
        </div>
        <div className="actions">
          <button onClick={onEdit} className="btn-icon" aria-label="Edit item">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
            </svg>
          </button>
          <button onClick={onDelete} className="btn-icon danger" aria-label="Delete item">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2" fill="none">
              <polyline points="3 6 5 6 21 6"></polyline>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            </svg>
          </button>
        </div>
      </div>
      
      <div className="card-body">
        <div className="metrics">
          <div className="metric">
            <span className="label">Weight</span>
            <span className="value">
              {item.weight_g} <small>g</small> / {weightOz} <small>oz</small>
            </span>
          </div>
          
          {item.category && (
            <div className="metric category-badge">
              {item.category}
            </div>
          )}
        </div>
        
        {item.notes && <p className="notes">{item.notes}</p>}
        
        {!item.is_owned && (
          <div className="status-badge">Wishlist Item</div>
        )}
      </div>
      
      <div className="card-footer">
        <span className="date">Added {dateAdded}</span>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer" className="external-link">
            View Product
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="2" fill="none">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
