'use client';

import { useDashboard } from '@/context/DashboardContext';
import { DEPARTMENT_MASTER } from '@/data/departments';

export default function DepartmentFilter() {
  const { filters, toggleDepartment } = useDashboard();

  return (
    <div>
      <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">診療科</h3>
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {DEPARTMENT_MASTER.map((dept) => (
          <label key={dept.id} className="flex items-center gap-2 py-1 px-2 rounded hover:bg-slate-50 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.departments.includes(dept.id)}
              onChange={() => toggleDepartment(dept.id)}
              className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
            />
            <span className="text-sm text-slate-700">{dept.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}
