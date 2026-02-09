'use client';

import { useDashboard } from '@/context/DashboardContext';
import { FACILITY_TYPE_LABELS, SEVERITY_LABELS } from '@/lib/constants';
import { getOccupancyRate } from '@/lib/utils';
import OccupancyBar from '@/components/dashboard/OccupancyBar';
import OutpatientCalendar from '@/components/detail/OutpatientCalendar';

export default function FacilityDetailPanel() {
  const { facilities, selectedFacilityId, setSelectedFacilityId } = useDashboard();
  const facility = facilities.find((f) => f.id === selectedFacilityId);

  return (
    <>
      {/* Backdrop overlay */}
      {facility && (
        <div
          className="fixed inset-0 bg-black/20 z-40 transition-opacity"
          onClick={() => setSelectedFacilityId(null)}
        />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          facility ? 'translate-x-0' : 'translate-x-full'
        } overflow-y-auto`}
      >
        {facility && (
          <div className="p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">{facility.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="text-xs text-white px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: FACILITY_TYPE_LABELS[facility.type].color }}
                >
                  {FACILITY_TYPE_LABELS[facility.type].label}
                </span>
                {facility.emergencyAccepting ? (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                    救急受入可
                  </span>
                ) : (
                  <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-medium">
                    救急受入なし
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setSelectedFacilityId(null)}
              className="text-slate-400 hover:text-slate-600 p-1"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15 5L5 15M5 5l10 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Contact */}
          <div className="bg-slate-50 rounded-lg p-3 mb-4">
            <p className="text-xs text-slate-500 mb-1">{facility.address}</p>
            <p className="text-sm font-medium text-slate-700">TEL: {facility.phone}</p>
            {facility.fax && <p className="text-xs text-slate-500">FAX: {facility.fax}</p>}
            {facility.notes && <p className="text-xs text-teal-600 mt-1">{facility.notes}</p>}
          </div>

          {/* Bed Status */}
          {facility.beds.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">病床状況</h3>
              <div className="space-y-3">
                {facility.beds.map((bed) => {
                  const rate = bed.totalBeds > 0 ? (bed.inUse / bed.totalBeds) * 100 : 0;
                  return (
                    <div key={bed.severityLevel} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-slate-600">
                          L{bed.severityLevel}: {SEVERITY_LABELS[bed.severityLevel].short}
                        </span>
                        <span className="text-xs text-slate-500">{rate.toFixed(0)}%</span>
                      </div>
                      <OccupancyBar rate={rate} />
                      <div className="flex justify-between mt-2 text-xs text-slate-500">
                        <span>総数: <span className="font-medium text-slate-700">{bed.totalBeds}</span></span>
                        <span>使用中: <span className="font-medium text-slate-700">{bed.inUse}</span></span>
                        <span>空き: <span className="font-medium text-green-600">{bed.available}</span></span>
                        <span>退院予定: <span className="font-medium text-amber-600">{bed.scheduledDischarges}</span></span>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-3 bg-teal-50 rounded-lg p-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-teal-800">合計稼働率</span>
                  <span className="text-lg font-bold text-teal-700">
                    {getOccupancyRate(facility.beds).toFixed(1)}%
                  </span>
                </div>
                <OccupancyBar rate={getOccupancyRate(facility.beds)} />
              </div>
            </div>
          )}

          {/* Visiting Nurse Capacity */}
          {facility.serviceCapacity && (
            <div className="mb-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3">受け入れ状況</h3>
              <div className="bg-slate-50 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-600">利用状況</span>
                  <span className="text-xs text-slate-500">
                    {((facility.serviceCapacity.currentPatients / facility.serviceCapacity.maxPatients) * 100).toFixed(0)}%
                  </span>
                </div>
                <OccupancyBar rate={(facility.serviceCapacity.currentPatients / facility.serviceCapacity.maxPatients) * 100} />
                <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-slate-500">
                  <span>スタッフ数: <span className="font-medium text-slate-700">{facility.serviceCapacity.totalStaff}名</span></span>
                  <span>最大受入: <span className="font-medium text-slate-700">{facility.serviceCapacity.maxPatients}名</span></span>
                  <span>対応中: <span className="font-medium text-slate-700">{facility.serviceCapacity.currentPatients}名</span></span>
                  <span>受入可能: <span className="font-medium text-green-600">{facility.serviceCapacity.availableSlots}名</span></span>
                </div>
              </div>
            </div>
          )}

          {/* Departments & Outpatient Calendar */}
          {facility.departments.length > 0 && (
            <OutpatientCalendar departments={facility.departments} />
          )}

          {/* Last Updated */}
          <p className="text-xs text-slate-400 text-center">
            最終更新: {new Date(facility.lastUpdated).toLocaleString('ja-JP')}
          </p>

          {/* Action Buttons (mockup) */}
          <div className="mt-4 space-y-2">
            <button className="w-full bg-teal-600 text-white rounded-lg py-2.5 text-sm font-medium hover:bg-teal-700 transition-colors">
              この施設にコンタクト
            </button>
            <button className="w-full bg-white text-teal-600 border border-teal-600 rounded-lg py-2.5 text-sm font-medium hover:bg-teal-50 transition-colors">
              紹介状を作成
            </button>
          </div>
        </div>
      )}
    </div>
    </>
  );
}
