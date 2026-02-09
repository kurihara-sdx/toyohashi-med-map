'use client';

import { useState } from 'react';
import MapDynamic from '@/components/map/MapDynamic';
import FacilityList from './FacilityList';
import SummaryDashboard from './SummaryDashboard';
import ViewToggle, { ViewMode } from './ViewToggle';

export default function MainContent() {
  const [view, setView] = useState<ViewMode>('map');

  return (
    <main className="flex-1 flex flex-col min-w-0">
      <ViewToggle view={view} onChangeView={setView} />
      <div className="flex-1 relative min-h-0 overflow-hidden">
        {view === 'map' && <MapDynamic />}
        {view === 'list' && <FacilityList />}
        {view === 'table' && <SummaryDashboard />}
      </div>
    </main>
  );
}
