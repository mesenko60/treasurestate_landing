import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix Leaflet marker issue in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

type TownCoordinate = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

export default function TownMap({ towns }: { towns: TownCoordinate[] }) {
  // Approximate center of Montana
  const center: [number, number] = [46.9653, -109.5337];
  
  return (
    <div style={{ height: '400px', width: '100%', marginBottom: '2rem', borderRadius: '8px', overflow: 'hidden', zIndex: 1, position: 'relative' }}>
      <MapContainer center={center} zoom={6} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {towns.map((town) => (
          <Marker key={town.slug} position={[town.lat, town.lng]} icon={customIcon}>
            <Popup>
              <a href={`/montana-towns/${town.slug}/`} style={{ fontWeight: 'bold', color: '#3b6978', textDecoration: 'none' }}>
                {town.name}
              </a>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
