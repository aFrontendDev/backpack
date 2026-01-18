import { useState, useEffect } from 'react';
import type { DataDisplayProps, DataItem } from './DataDisplay.types';
import Spinner from '../Spinner/Spinner';
import './DataDisplay.scss';

export default function DataDisplay({ refreshTrigger }: DataDisplayProps) {
  const [data, setData] = useState<DataItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/data/get');
      const result = await response.json();

      if (response.ok && result.data) {
        setData(result.data);
      } else {
        setData({});
      }
    } catch (err) {
      setError('Failed to load data');
      setData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (key: string) => {
    if (!confirm(`Delete data for key "${key}"?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/data/delete?key=${encodeURIComponent(key)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadData();
      } else {
        alert('Failed to delete data');
      }
    } catch (err) {
      alert('An error occurred while deleting data');
    }
  };

  useEffect(() => {
    loadData();
  }, [refreshTrigger]);

  const renderData = () => {
    if (isLoading) {
      return <p className="empty-state">Loading...</p>;
    }

    if (error) {
      return <p className="empty-state error">{error}</p>;
    }

    if (!data || Object.keys(data).length === 0) {
      return <p className="empty-state">No data found</p>;
    }

    return Object.keys(data).map(key => (
      <div key={key} className="data-item">
        <h3>
          <span>{key}</span>
          <button className="delete-btn" onClick={() => handleDelete(key)}>
            Delete
          </button>
        </h3>
        <pre>{JSON.stringify(data[key], null, 2)}</pre>
      </div>
    ));
  };

  return (
    <div className="data-section">
      <h2>Your Data</h2>
      <button
        className="secondary"
        onClick={loadData}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Spinner size="small" /> Loading...
          </>
        ) : (
          'Load All Data'
        )}
      </button>
      <div className="data-display">
        {renderData()}
      </div>
    </div>
  );
}
