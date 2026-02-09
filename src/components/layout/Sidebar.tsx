'use client';

import { useState } from 'react';
import { useDashboard } from '@/context/DashboardContext';
import FacilityTypeFilter from '@/components/filters/FacilityTypeFilter';
import SeverityFilter from '@/components/filters/SeverityFilter';
import DepartmentFilter from '@/components/filters/DepartmentFilter';

export default function Sidebar() {
  const { resetFilters, filters } = useDashboard();
  const [mobileOpen, setMobileOpen] = useState(false);
  const hasActiveFilters =
    filters.departments.length > 0 ||
    filters.severityLevels.length > 0 ||
    filters.facilityTypes.length > 0;

  const activeCount =
    filters.departments.length + filters.severityLevels.length + filters.facilityTypes.length;

  const filterContent = (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">フィルタ</h2>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-teal-600 hover:text-teal-800 font-medium"
            >
              リセット
            </button>
          )}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      <FacilityTypeFilter />
      <SeverityFilter />
      <DepartmentFilter />
    </>
  );

  return (
    <>
      {/* Mobile filter toggle */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-4 left-4 z-30 bg-teal-600 text-white px-4 py-2 rounded-full shadow-lg text-xs font-medium flex items-center gap-1.5 hover:bg-teal-700 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
        </svg>
        フィルタ
        {activeCount > 0 && (
          <span className="bg-white text-teal-700 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
            {activeCount}
          </span>
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`md:hidden fixed top-0 left-0 h-full w-72 bg-white z-50 p-4 flex flex-col gap-5 overflow-y-auto shadow-xl transform transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {filterContent}
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 p-4 flex-col gap-5 overflow-y-auto">
        {filterContent}
      </aside>
    </>
  );
}
