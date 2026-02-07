'use client';

import dynamic from 'next/dynamic';

const MapDynamic = dynamic(() => import('./MapContainer'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-full bg-slate-100">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full mx-auto mb-2" />
        <p className="text-slate-400 text-sm">地図を読み込み中...</p>
      </div>
    </div>
  ),
});

export default MapDynamic;
