'use client';

import 'leaflet/dist/leaflet.css';
import { MapContainer, TileLayer } from 'react-leaflet';
import { useDashboard } from '@/context/DashboardContext';
import { MAP_CENTER, MAP_DEFAULT_ZOOM } from '@/lib/constants';
import HospitalMarker from './HospitalMarker';
import MapLegend from './MapLegend';

export default function Map() {
  const { filteredFacilities } = useDashboard();

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[MAP_CENTER.lat, MAP_CENTER.lng]}
        zoom={MAP_DEFAULT_ZOOM}
        className="h-full w-full z-0"
        zoomControl={true}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        {filteredFacilities.map((facility) => (
          <HospitalMarker key={facility.id} facility={facility} />
        ))}
      </MapContainer>
      <MapLegend />
    </div>
  );
}
