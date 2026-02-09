'use client';

import { Marker, Tooltip } from 'react-leaflet';
import L from 'leaflet';
import { Facility } from '@/types';
import { getFacilityAvailabilityStatus, getOccupancyRate } from '@/lib/utils';
import { FACILITY_TYPE_LABELS, AVAILABILITY_COLORS } from '@/lib/constants';
import { useDashboard } from '@/context/DashboardContext';

function createMarkerIcon(facility: Facility) {
  const status = getFacilityAvailabilityStatus(facility);
  const hasCapacityInfo = facility.beds.length > 0 || !!facility.serviceCapacity;
  const bgColor = hasCapacityInfo ? AVAILABILITY_COLORS[status] : '#94a3b8';
  const typeInfo = FACILITY_TYPE_LABELS[facility.type];
  const isLargeMarker = facility.type === 'acute' || facility.type === 'recovery';
  const size = isLargeMarker ? 36 : 28;

  const pulseClass = hasCapacityInfo && status === 'available' ? 'marker-pulse-green' : '';
  const outerSize = size + 12;

  return L.divIcon({
    className: '',
    iconSize: [outerSize, outerSize],
    iconAnchor: [outerSize / 2, outerSize / 2],
    html: `
      <div style="
        position: relative;
        width: ${outerSize}px;
        height: ${outerSize}px;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        ${pulseClass ? `<div class="${pulseClass}" style="
          position: absolute;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background-color: ${bgColor};
          opacity: 0.4;
        "></div>` : ''}
        <div style="
          position: relative;
          width: ${size}px;
          height: ${size}px;
          border-radius: 50%;
          background-color: ${bgColor};
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: ${size <= 28 ? 10 : 13}px;
          font-weight: bold;
          cursor: pointer;
          transition: transform 0.2s ease;
        ">${typeInfo.icon}</div>
      </div>
    `,
  });
}

export default function HospitalMarker({ facility }: { facility: Facility }) {
  const { setSelectedFacilityId } = useDashboard();
  const icon = createMarkerIcon(facility);
  const occupancy = facility.beds.length > 0 ? getOccupancyRate(facility.beds) : null;
  const totalAvailable = facility.beds.reduce((s, b) => s + b.available, 0);
  const vnCap = facility.serviceCapacity;

  return (
    <Marker
      position={[facility.lat, facility.lng]}
      icon={icon}
      eventHandlers={{
        click: () => setSelectedFacilityId(facility.id),
      }}
    >
      <Tooltip direction="top" offset={[0, -20]} opacity={0.95}>
        <div className="min-w-[160px]">
          <p className="font-bold text-sm">{facility.name}</p>
          <p className="text-xs text-slate-500">{FACILITY_TYPE_LABELS[facility.type].label}</p>
          {occupancy !== null && (
            <div className="mt-1">
              <p className="text-xs">稼働率: <span className="font-semibold">{occupancy.toFixed(1)}%</span></p>
              <p className="text-xs">空き病床: <span className="font-semibold">{totalAvailable}床</span></p>
            </div>
          )}
          {vnCap && (
            <div className="mt-1">
              <p className="text-xs">受入可能: <span className="font-semibold">{vnCap.availableSlots}名</span></p>
              <p className="text-xs">対応中: <span className="font-semibold">{vnCap.currentPatients}/{vnCap.maxPatients}名</span></p>
            </div>
          )}
          <p className="text-xs text-teal-600 mt-1">クリックで詳細を表示</p>
        </div>
      </Tooltip>
    </Marker>
  );
}
