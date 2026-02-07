'use client';

import { useDashboard } from '@/context/DashboardContext';
import { FACILITY_TYPE_LABELS, SEVERITY_LABELS } from '@/lib/constants';
import { getAvailabilityStatus, getOccupancyRate } from '@/lib/utils';
import OccupancyBar from './OccupancyBar';

export default function FacilityList() {
  const { filteredFacilities, setSelectedFacilityId } = useDashboard();

  return (
    <div className="h-full overflow-y-auto bg-white p-4">
      <p className="text-xs text-slate-500 mb-3">{filteredFacilities.length}件の施設</p>
      <div className="space-y-3">
        {filteredFacilities.map((facility) => {
          const status = facility.beds.length > 0 ? getAvailabilityStatus(facility.beds) : null;
          const occupancy = facility.beds.length > 0 ? getOccupancyRate(facility.beds) : null;
          const totalAvailable = facility.beds.reduce((s, b) => s + b.available, 0);
          const totalBeds = facility.beds.reduce((s, b) => s + b.totalBeds, 0);
          const typeInfo = FACILITY_TYPE_LABELS[facility.type];

          return (
            <div
              key={facility.id}
              onClick={() => setSelectedFacilityId(facility.id)}
              className="border border-slate-200 rounded-lg p-4 hover:border-teal-300 hover:shadow-sm cursor-pointer transition-all"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: typeInfo.color }}
                    >
                      {typeInfo.icon}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800">{facility.name}</h3>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5 ml-8">{facility.address}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {facility.emergencyAccepting && (
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                      救急可
                    </span>
                  )}
                  {status && (
                    <span
                      className={`w-3 h-3 rounded-full ${
                        status === 'available' ? 'bg-green-500' : status === 'few' ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                    />
                  )}
                </div>
              </div>

              {facility.beds.length > 0 && (
                <div className="ml-8">
                  <div className="flex items-center gap-4 mb-1.5">
                    <span className="text-xs text-slate-500">
                      病床: <span className="font-semibold text-slate-700">{totalBeds}</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      空き: <span className="font-semibold text-green-600">{totalAvailable}</span>
                    </span>
                    <span className="text-xs text-slate-500">
                      稼働率: <span className="font-semibold text-slate-700">{occupancy?.toFixed(1)}%</span>
                    </span>
                  </div>
                  <OccupancyBar rate={occupancy ?? 0} />
                  <div className="flex flex-wrap gap-1 mt-2">
                    {facility.beds.map((bed) => (
                      <span
                        key={bed.severityLevel}
                        className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                      >
                        {SEVERITY_LABELS[bed.severityLevel].short}: 空き{bed.available}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {facility.departments.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2 ml-8">
                  {facility.departments.map((dept) => (
                    <span key={dept.id} className="text-[10px] text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded">
                      {dept.name}
                    </span>
                  ))}
                </div>
              )}

              {facility.notes && (
                <p className="text-[10px] text-slate-400 mt-1.5 ml-8">{facility.notes}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
