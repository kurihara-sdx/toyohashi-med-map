'use client';

import { useDashboard } from '@/context/DashboardContext';
import { SEVERITY_LABELS, FACILITY_TYPE_LABELS } from '@/lib/constants';
import { getOverallOccupancyRate, getTotalAvailableBeds, getTotalScheduledDischarges } from '@/lib/utils';
import { SeverityLevel, FacilityType } from '@/types';

// ─── SVG Donut Chart ───────────────────────────────────────
function DonutChart({ rate, size = 120, stroke = 12 }: { rate: number; size?: number; stroke?: number }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(rate, 100) / 100) * circumference;
  const color = rate >= 90 ? '#ef4444' : rate >= 70 ? '#eab308' : '#22c55e';

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#e2e8f0" strokeWidth={stroke} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className="transition-all duration-700 ease-out"
      />
    </svg>
  );
}

// ─── Horizontal Bar ───────────────────────────────────────
function HorizontalBar({ used, total, label, sublabel }: { used: number; total: number; label: string; sublabel?: string }) {
  const rate = total > 0 ? (used / total) * 100 : 0;
  const color = rate >= 90 ? 'bg-red-500' : rate >= 70 ? 'bg-amber-500' : 'bg-green-500';
  const available = total - used;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">{label}</span>
          {sublabel && <span className="text-slate-400">{sublabel}</span>}
        </div>
        <div className="flex items-center gap-3 text-slate-500">
          <span>空き <span className="font-bold text-green-600">{available}</span></span>
          <span className="font-bold text-slate-700">{rate.toFixed(0)}%</span>
        </div>
      </div>
      <div className="h-5 bg-slate-100 rounded-full overflow-hidden flex">
        <div
          className={`${color} rounded-full transition-all duration-700 ease-out flex items-center justify-end pr-1.5`}
          style={{ width: `${Math.max(rate, 2)}%` }}
        >
          {rate >= 15 && <span className="text-[10px] text-white font-medium">{used}</span>}
        </div>
        {rate < 15 && <span className="text-[10px] text-slate-500 font-medium ml-1 self-center">{used}</span>}
      </div>
    </div>
  );
}

// ─── Mini Stat Card ───────────────────────────────────────
function MiniStat({ value, unit, label, accent }: { value: string | number; unit: string; label: string; accent: string }) {
  return (
    <div className="text-center p-3">
      <p className="text-2xl md:text-3xl font-bold" style={{ color: accent }}>
        {value}<span className="text-xs md:text-sm font-normal text-slate-400 ml-0.5">{unit}</span>
      </p>
      <p className="text-[11px] text-slate-500 mt-0.5">{label}</p>
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────
export default function SummaryDashboard() {
  const { filteredFacilities } = useDashboard();

  const occupancyRate = getOverallOccupancyRate(filteredFacilities);
  const totalBeds = filteredFacilities.reduce((s, f) => s + f.beds.reduce((s2, b) => s2 + b.totalBeds, 0), 0);
  const totalInUse = filteredFacilities.reduce((s, f) => s + f.beds.reduce((s2, b) => s2 + b.inUse, 0), 0);
  const availableBeds = getTotalAvailableBeds(filteredFacilities);
  const scheduledDischarges = getTotalScheduledDischarges(filteredFacilities);

  // Severity breakdown
  const severityLevels: SeverityLevel[] = [1, 2, 3, 4, 5];
  const severityData = severityLevels.map((level) => {
    let beds = 0, inUse = 0;
    filteredFacilities.forEach((f) => {
      const bed = f.beds.find((b) => b.severityLevel === level);
      if (bed) { beds += bed.totalBeds; inUse += bed.inUse; }
    });
    return { level, beds, inUse };
  }).filter((d) => d.beds > 0);

  // Facility type breakdown
  const typeKeys = Object.keys(FACILITY_TYPE_LABELS) as FacilityType[];
  const facilityTypeData = typeKeys.map((type) => {
    const list = filteredFacilities.filter((f) => f.type === type);
    const totalServiceCap = list.reduce((s, f) => s + (f.serviceCapacity?.maxPatients ?? 0), 0);
    const usedServiceCap = list.reduce((s, f) => s + (f.serviceCapacity?.currentPatients ?? 0), 0);
    return { type, count: list.length, totalServiceCap, usedServiceCap, ...FACILITY_TYPE_LABELS[type] };
  }).filter((d) => d.count > 0);

  // Service facilities (visiting nurse, home care, day service)
  const serviceFacilities = filteredFacilities.filter((f) => f.serviceCapacity);
  const totalServiceMax = serviceFacilities.reduce((s, f) => s + (f.serviceCapacity?.maxPatients ?? 0), 0);
  const totalServiceUsed = serviceFacilities.reduce((s, f) => s + (f.serviceCapacity?.currentPatients ?? 0), 0);
  const serviceOccupancy = totalServiceMax > 0 ? (totalServiceUsed / totalServiceMax) * 100 : 0;

  return (
    <div className="h-full overflow-y-auto bg-slate-50">
      <div className="p-3 md:p-5 space-y-4 md:space-y-5 max-w-5xl mx-auto">
        {/* ── Row 1: KPI + Donut ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Donut: Bed Occupancy */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">病床稼働率</h3>
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <DonutChart rate={occupancyRate} size={130} stroke={14} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">{occupancyRate.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400">%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 flex-1">
                <MiniStat value={totalBeds} unit="床" label="総病床数" accent="#334155" />
                <MiniStat value={totalInUse} unit="床" label="使用中" accent="#2563eb" />
                <MiniStat value={availableBeds} unit="床" label="空き病床" accent="#22c55e" />
                <MiniStat value={scheduledDischarges} unit="名" label="退院予定" accent="#d97706" />
              </div>
            </div>
          </div>

          {/* Donut: Service Occupancy */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">在宅・介護サービス利用率</h3>
            <div className="flex items-center gap-6">
              <div className="relative shrink-0">
                <DonutChart rate={serviceOccupancy} size={130} stroke={14} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-slate-800">{serviceOccupancy.toFixed(1)}</span>
                  <span className="text-[10px] text-slate-400">%</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-1 flex-1">
                <MiniStat value={serviceFacilities.length} unit="施設" label="サービス施設" accent="#334155" />
                <MiniStat value={totalServiceMax} unit="名" label="最大受入" accent="#2563eb" />
                <MiniStat value={totalServiceUsed} unit="名" label="利用中" accent="#d97706" />
                <MiniStat value={totalServiceMax - totalServiceUsed} unit="名" label="受入可能" accent="#22c55e" />
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Facility Type Breakdown ── */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">施設種別 内訳</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {facilityTypeData.map((d) => (
              <div key={d.type} className="text-center p-3 rounded-lg bg-slate-50">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center mx-auto text-white text-xs font-bold"
                  style={{ backgroundColor: d.color }}
                >
                  {d.icon}
                </div>
                <p className="text-xl font-bold text-slate-800 mt-2">{d.count}</p>
                <p className="text-[11px] text-slate-500">{d.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 3: Severity Bed Chart ── */}
        {severityData.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">重症度レベル別 病床稼働</h3>
            <div className="space-y-3">
              {severityData.map((d) => (
                <HorizontalBar
                  key={d.level}
                  used={d.inUse}
                  total={d.beds}
                  label={`L${d.level}: ${SEVERITY_LABELS[d.level].short}`}
                  sublabel={`${d.beds}床`}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Row 4: Service Facility Bars ── */}
        {serviceFacilities.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 md:p-5">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4">サービス施設別 利用状況</h3>
            <div className="space-y-3">
              {serviceFacilities.map((f) => {
                const cap = f.serviceCapacity!;
                return (
                  <HorizontalBar
                    key={f.id}
                    used={cap.currentPatients}
                    total={cap.maxPatients}
                    label={f.name}
                    sublabel={FACILITY_TYPE_LABELS[f.type].label}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
