'use client';

export default function ViewToggle({
  view,
  onChangeView,
}: {
  view: 'map' | 'list';
  onChangeView: (v: 'map' | 'list') => void;
}) {
  return (
    <div className="flex bg-slate-100 rounded-lg p-0.5 w-fit">
      <button
        onClick={() => onChangeView('map')}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          view === 'map' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        地図
      </button>
      <button
        onClick={() => onChangeView('list')}
        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
          view === 'list' ? 'bg-white text-teal-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
        }`}
      >
        リスト
      </button>
    </div>
  );
}
