import { useState } from 'react';
import DashboardForm from '../DashboardForm/DashboardForm';
import DataDisplay from '../DataDisplay/DataDisplay';

export default function Dashboard() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleDataSaved = () => {
    // Increment trigger to force DataDisplay to reload
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <DashboardForm onDataSaved={handleDataSaved} />
      <DataDisplay refreshTrigger={refreshTrigger} />
    </>
  );
}
