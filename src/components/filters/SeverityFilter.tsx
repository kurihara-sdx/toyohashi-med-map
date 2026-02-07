'use client';

import { useDashboard } from '@/context/DashboardContext';
import { SEVERITY_LABELS } from '@/lib/constants';
import { SeverityLevel } from '@/types';

export default function SeverityFilter() {
  const { filters, toggleSeverityLevel } = useDashboard();
  const levels = Object.entries(SEVERITY_LABELS) as [string, typeof SEVERITY_LABELS[SeverityLevel]][];

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">重症度レベル</h3>
      <div className="space-y-1">
        {levels.map(([level, info]) => (
          <label key={level} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.severityLevels.includes(Number(level) as SeverityLevel)}
              onChange={() => toggleSeverityLevel(Number(level) as SeverityLevel)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">L{level}</span>
            <span className="text-sm text-slate-700">{info.short}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
