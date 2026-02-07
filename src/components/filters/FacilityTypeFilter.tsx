'use client';

import { useDashboard } from '@/context/DashboardContext';
import { FACILITY_TYPE_LABELS } from '@/lib/constants';
import { FacilityType } from '@/types';

export default function FacilityTypeFilter() {
  const { filters, toggleFacilityType } = useDashboard();
  const types = Object.entries(FACILITY_TYPE_LABELS) as [FacilityType, typeof FACILITY_TYPE_LABELS[FacilityType]][];

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">施設種別</h3>
      <div className="space-y-1">
        {types.map(([type, info]) => (
          <label key={type} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.facilityTypes.includes(type)}
              onChange={() => toggleFacilityType(type)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] font-bold"
              style={{ backgroundColor: info.color }}
            >
              {info.icon}
            </span>
            <span className="text-sm text-slate-700">{info.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
