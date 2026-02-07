'use client';

import { useState } from 'react';
import MapDynamic from '@/components/map/MapDynamic';
import FacilityList from './FacilityList';
import ViewToggle from './ViewToggle';

export default function MainContent() {
  const [view, setView] = useState<'map' | 'list'>('map');

  return (
    <main className="flex-1 relative flex flex-col">
      <div className="absolute top-3 right-3 z-10">
        <ViewToggle view={view} onChangeView={setView} />
      </div>
      <div className="flex-1">
        {view === 'map' ? <MapDynamic /> : <FacilityList />}
      </div>
    </main>
  );
}
