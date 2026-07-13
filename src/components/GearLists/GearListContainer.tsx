import { useState, useEffect } from 'react';
import GearListCard from './GearListCard';
import GearListForm from './GearListForm';
import Spinner from '../Spinner/Spinner';
import './_GearListContainer.scss';

export interface GearList {
  id: string;
  name: string;
  description: string | null;
  target_weight_g: number | null;
  created_at: number;
  updated_at: number;
}

export default function GearListContainer() {
  const [lists, setLists] = useState<GearList[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingList, setEditingList] = useState<GearList | null>(null);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const res = await fetch('/api/gear-lists');
      if (!res.ok) throw new Error('Failed to fetch gear lists');
      const data = await res.json();
      setLists(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gear list?')) return;
    
    try {
      const res = await fetch(`/api/gear-lists/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete list');
      setLists(lists.filter(list => list.id !== id));
    } catch (err) {
      alert('Error deleting gear list');
    }
  };

  if (isLoading) {
    return (
      <div className="gear-list-container loading">
        <Spinner size="large" />
      </div>
    );
  }

  return (
    <div className="gear-list-container">
      <div className="toolbar">
        <h2>Your Gear Lists</h2>
        <button 
          className="button primary" 
          onClick={() => {
            setEditingList(null);
            setIsFormOpen(true);
          }}
        >
          + Create New List
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {lists.length === 0 && !error ? (
        <div className="empty-state">
          <p>You haven't created any gear lists yet.</p>
          <button 
            className="button primary" 
            onClick={() => setIsFormOpen(true)}
          >
            Create Your First List
          </button>
        </div>
      ) : (
        <div className="grid">
          {lists.map(list => (
            <GearListCard 
              key={list.id} 
              list={list} 
              onEdit={(list) => {
                setEditingList(list);
                setIsFormOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {isFormOpen && (
        <GearListForm
          list={editingList}
          onClose={() => setIsFormOpen(false)}
          onSave={(savedList) => {
            if (editingList) {
              setLists(lists.map(l => l.id === savedList.id ? savedList : l));
            } else {
              setLists([savedList, ...lists]);
            }
            setIsFormOpen(false);
          }}
        />
      )}
    </div>
  );
}
