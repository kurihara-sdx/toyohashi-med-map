'use client';

import { useDashboard } from '@/context/DashboardContext';
import { DEPARTMENT_MASTER } from '@/data/departments';

export default function DepartmentFilter() {
  const { filters, toggleDepartment } = useDashboard();

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">診療科</h3>
      <div className="grid grid-cols-2 gap-x-1 gap-y-0.5">
        {DEPARTMENT_MASTER.map((dept) => (
          <label key={dept.id} className="flex items-center gap-1.5 py-0.5 px-1 rounded hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.departments.includes(dept.id)}
              onChange={() => toggleDepartment(dept.id)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500 w-3.5 h-3.5 shrink-0"
            />
            <span className="text-xs text-slate-700 truncate">{dept.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
