import type { GearList } from './GearListContainer';
import './_GearListCard.scss';

interface GearListCardProps {
  list: GearList;
  onEdit: (list: GearList) => void;
  onDelete: (id: string) => void;
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

export default function GearListCard({ list, onEdit, onDelete }: GearListCardProps) {
  const date = new Date(list.updated_at).toLocaleDateString();

  return (
    <div className="gear-list-card">
      <div className="card-header">
        <div className="title-group">
          <h4>{list.name}</h4>
        </div>
        <div className="actions">
          <button className="btn-icon" onClick={() => onEdit(list)} title="Edit List Details">
            ✏️
          </button>
          <button className="btn-icon danger" onClick={() => onDelete(list.id)} title="Delete List">
            🗑️
          </button>
        </div>
      </div>
      
      <div className="card-body">
        {list.description && (
          <p className="description">{list.description}</p>
        )}
        
        {list.target_weight_g !== null && (
          <div className="target-weight">
            <span className="label">Target Weight</span>
            <span className="value">
              {formatWeight(list.target_weight_g)} 
              <small> / {formatOz(list.target_weight_g * 0.035274)}</small>
            </span>
          </div>
        )}
      </div>

      <div className="card-footer">
        <span className="date">Updated: {date}</span>
        <a href={`/gear-lists/${list.id}`} className="button secondary small">Open List Builder</a>
      </div>
    </div>
  );
}
