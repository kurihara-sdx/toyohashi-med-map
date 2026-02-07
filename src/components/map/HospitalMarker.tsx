'use client';

import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Facility } from '@/types';
import { getAvailabilityStatus, getOccupancyRate } from '@/lib/utils';
import { FACILITY_TYPE_LABELS, AVAILABILITY_COLORS } from '@/lib/constants';
import { useDashboard } from '@/context/DashboardContext';

function createMarkerIcon(facility: Facility) {
  const status = facility.beds.length > 0 ? getAvailabilityStatus(facility.beds) : 'available';
  const bgColor = facility.beds.length > 0 ? AVAILABILITY_COLORS[status] : '#94a3b8';
  const typeInfo = FACILITY_TYPE_LABELS[facility.type];
  const size = facility.type === 'clinic' || facility.type === 'visiting_nurse' ? 28 : 36;

  return L.divIcon({
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: `
      <div style="
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
      ">${typeInfo.icon}</div>
    `,
  });
}

export default function HospitalMarker({ facility }: { facility: Facility }) {
  const { setSelectedFacilityId } = useDashboard();
  const icon = createMarkerIcon(facility);
  const occupancy = facility.beds.length > 0 ? getOccupancyRate(facility.beds) : null;
  const totalAvailable = facility.beds.reduce((s, b) => s + b.available, 0);

  return (
    <Marker
      position={[facility.lat, facility.lng]}
      icon={icon}
      eventHandlers={{
        click: () => setSelectedFacilityId(facility.id),
      }}
    >
      <Popup>
        <div className="min-w-[180px]">
          <p className="font-bold text-sm">{facility.name}</p>
          <p className="text-xs text-slate-500">{FACILITY_TYPE_LABELS[facility.type].label}</p>
          {occupancy !== null && (
            <div className="mt-1">
              <p className="text-xs">稼働率: <span className="font-semibold">{occupancy.toFixed(1)}%</span></p>
              <p className="text-xs">空き病床: <span className="font-semibold">{totalAvailable}床</span></p>
            </div>
          )}
          <p className="text-xs text-teal-600 mt-1 cursor-pointer">クリックで詳細を表示</p>
        </div>
      </Popup>
    </Marker>
  );
}
