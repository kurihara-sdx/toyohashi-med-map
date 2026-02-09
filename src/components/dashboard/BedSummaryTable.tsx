'use client';

import { useDashboard } from '@/context/DashboardContext';
import { SEVERITY_LABELS } from '@/lib/constants';
import { SeverityLevel } from '@/types';

export default function BedSummaryTable() {
  const { filteredFacilities } = useDashboard();

  const severityLevels: SeverityLevel[] = [1, 2, 3, 4, 5];

  const summaryByLevel = severityLevels.map((level) => {
    let totalBeds = 0;
    let inUse = 0;
    let available = 0;
    let scheduledDischarges = 0;
    let facilityCount = 0;

    filteredFacilities.forEach((f) => {
      const bed = f.beds.find((b) => b.severityLevel === level);
      if (bed) {
        totalBeds += bed.totalBeds;
        inUse += bed.inUse;
        available += bed.available;
        scheduledDischarges += bed.scheduledDischarges;
        facilityCount++;
      }
    });

    const occupancyRate = totalBeds > 0 ? (inUse / totalBeds) * 100 : 0;

    return { level, totalBeds, inUse, available, scheduledDischarges, facilityCount, occupancyRate };
  });

  const totals = summaryByLevel.reduce(
    (acc, row) => ({
      totalBeds: acc.totalBeds + row.totalBeds,
      inUse: acc.inUse + row.inUse,
      available: acc.available + row.available,
      scheduledDischarges: acc.scheduledDischarges + row.scheduledDischarges,
      facilityCount: acc.facilityCount + row.facilityCount,
    }),
    { totalBeds: 0, inUse: 0, available: 0, scheduledDischarges: 0, facilityCount: 0 }
  );
  const totalOccupancy = totals.totalBeds > 0 ? (totals.inUse / totals.totalBeds) * 100 : 0;

  function rateColor(rate: number) {
    if (rate >= 90) return 'text-red-600 font-bold';
    if (rate >= 70) return 'text-amber-600 font-semibold';
    return 'text-green-600';
  }

  return (
    <div className="bg-white p-4">
      <h3 className="text-sm font-bold text-slate-800 mb-3">病床集計（重症度レベル別）</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="text-left py-2 px-3 font-semibold text-slate-600">重症度</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">施設数</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">総病床</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">使用中</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">空き</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">稼働率</th>
              <th className="text-right py-2 px-3 font-semibold text-slate-600">退院予定</th>
            </tr>
          </thead>
          <tbody>
            {summaryByLevel.map((row) => (
              <tr
                key={row.level}
                className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
              >
                <td className="py-2 px-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-slate-200 text-[10px] font-bold text-slate-700">
                      L{row.level}
                    </span>
                    <span className="text-slate-700">{SEVERITY_LABELS[row.level].short}</span>
                  </div>
                </td>
                <td className="text-right py-2 px-3 text-slate-600">{row.facilityCount}</td>
                <td className="text-right py-2 px-3 text-slate-700 font-medium">{row.totalBeds}</td>
                <td className="text-right py-2 px-3 text-slate-600">{row.inUse}</td>
                <td className="text-right py-2 px-3 text-green-600 font-medium">{row.available}</td>
                <td className="text-right py-2 px-3">
                  {row.totalBeds > 0 ? (
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            row.occupancyRate >= 90 ? 'bg-red-500' : row.occupancyRate >= 70 ? 'bg-amber-500' : 'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(row.occupancyRate, 100)}%` }}
                        />
                      </div>
                      <span className={rateColor(row.occupancyRate)}>{row.occupancyRate.toFixed(1)}%</span>
                    </div>
                  ) : (
                    <span className="text-slate-400">-</span>
                  )}
                </td>
                <td className="text-right py-2 px-3 text-slate-600">{row.scheduledDischarges}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-slate-50 border-t-2 border-slate-300">
              <td className="py-2 px-3 font-bold text-slate-800">合計</td>
              <td className="text-right py-2 px-3 font-bold text-slate-800">{totals.facilityCount}</td>
              <td className="text-right py-2 px-3 font-bold text-slate-800">{totals.totalBeds}</td>
              <td className="text-right py-2 px-3 font-bold text-slate-700">{totals.inUse}</td>
              <td className="text-right py-2 px-3 font-bold text-green-600">{totals.available}</td>
              <td className="text-right py-2 px-3">
                <div className="flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        totalOccupancy >= 90 ? 'bg-red-500' : totalOccupancy >= 70 ? 'bg-amber-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(totalOccupancy, 100)}%` }}
                    />
                  </div>
                  <span className={`font-bold ${rateColor(totalOccupancy)}`}>{totalOccupancy.toFixed(1)}%</span>
                </div>
              </td>
              <td className="text-right py-2 px-3 font-bold text-slate-700">{totals.scheduledDischarges}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
