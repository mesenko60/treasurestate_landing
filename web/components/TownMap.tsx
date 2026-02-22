import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Component to handle dynamic center/zoom updates
function MapUpdater({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function TownMap({ 
  towns, 
  center = [46.9653, -109.5337],
  zoom = 6 
}: { 
  towns: TownCoordinate[];
  center?: [number, number];
  zoom?: number;
}) {
  return (
    <div className="town-map-container">
      <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', zIndex: 1 }}>
        <MapUpdater center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {towns.map((town) => (
          <Marker 
            key={town.slug} 
            position={[town.lat, town.lng]} 
            icon={customIcon}
            title={town.name}
            eventHandlers={{
              click: () => {
                window.location.href = `/montana-towns/${town.slug}/`;
              }
            }}
          >
            <Popup>
              <div style={{ textAlign: 'center' }}>
                <strong>{town.name}</strong><br/>
                <span style={{ fontSize: '0.85em', color: '#666' }}>Click marker to visit page</span>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
