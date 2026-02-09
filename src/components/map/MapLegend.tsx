'use client';

import { useState } from 'react';
import { AVAILABILITY_COLORS } from '@/lib/constants';

const availabilityItems = [
  { status: 'available' as const, label: '余裕あり', desc: '稼働率 70%未満' },
  { status: 'few' as const, label: '残りわずか', desc: '稼働率 70〜90%' },
  { status: 'full' as const, label: 'ほぼ満床', desc: '稼働率 90%以上' },
];

export default function MapLegend() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="absolute bottom-5 left-5 z-[1000] bg-white rounded-lg shadow-lg border border-slate-200 text-xs max-w-[220px]">
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 transition-colors rounded-lg"
      >
        <span>凡例</span>
        <span className="text-slate-400 text-[10px]">{collapsed ? '▶' : '▼'}</span>
      </button>

      {!collapsed && (
        <div className="px-3 pb-3">
          <div>
            <p className="text-[10px] text-slate-500 font-medium mb-1.5">病床空き状況</p>
            <div className="space-y-1">
              {availabilityItems.map((item) => (
                <div key={item.status} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: AVAILABILITY_COLORS[item.status] }}
                  />
                  <span className="text-slate-600">{item.label}</span>
                  <span className="text-slate-400 text-[10px]">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
