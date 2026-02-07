'use client';

import { useDashboard } from '@/context/DashboardContext';
import FacilityTypeFilter from '@/components/filters/FacilityTypeFilter';
import SeverityFilter from '@/components/filters/SeverityFilter';
import DepartmentFilter from '@/components/filters/DepartmentFilter';

export default function Sidebar() {
  const { resetFilters, filters } = useDashboard();
  const hasActiveFilters =
    filters.departments.length > 0 ||
    filters.severityLevels.length > 0 ||
    filters.facilityTypes.length > 0;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 p-4 flex flex-col gap-5 overflow-y-auto">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">フィルタ</h2>
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="text-xs text-teal-600 hover:text-teal-800 font-medium"
          >
            リセット
          </button>
        )}
      </div>
      <FacilityTypeFilter />
      <SeverityFilter />
      <DepartmentFilter />
    </aside>
  );
}
