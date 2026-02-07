'use client';

import { useDashboard } from '@/context/DashboardContext';
import { getTotalAvailableBeds, getTotalScheduledDischarges, getOverallOccupancyRate } from '@/lib/utils';

export default function StatsOverview() {
  const { filteredFacilities } = useDashboard();

  const totalFacilities = filteredFacilities.length;
  const occupancyRate = getOverallOccupancyRate(filteredFacilities);
  const availableBeds = getTotalAvailableBeds(filteredFacilities);
  const scheduledDischarges = getTotalScheduledDischarges(filteredFacilities);

  const stats = [
    { label: '医療施設数', value: totalFacilities, unit: '施設', color: 'bg-teal-500' },
    { label: '全体病床稼働率', value: occupancyRate.toFixed(1), unit: '%', color: 'bg-blue-500' },
    { label: '空き病床数', value: availableBeds, unit: '床', color: 'bg-green-500' },
    { label: '本日退院予定', value: scheduledDischarges, unit: '名', color: 'bg-amber-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
              <span className="text-white text-lg font-bold">
                {stat.label === '医療施設数' && '🏥'}
                {stat.label === '全体病床稼働率' && '📊'}
                {stat.label === '空き病床数' && '🛏'}
                {stat.label === '本日退院予定' && '📋'}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">
                {stat.value}<span className="text-sm font-normal text-slate-500 ml-1">{stat.unit}</span>
              </p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
