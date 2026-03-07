import React from 'react';
import dynamic from 'next/dynamic';

const TownMap = dynamic(() => import('./TownMap'), { 
  ssr: false, 
  loading: () => (
    <div className="town-map-container" style={{ background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      Loading map...
    </div>
  ) 
});

type TownCoordinate = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

type RecMarker = {
  name: string;
  type: string;
  lat: number;
  lng: number;
  distMiles?: number;
};

export default function SingleTownMap({ 
  currentTown, 
  relatedTowns,
  recreation,
  focusedRec,
  heading,
  description,
  googleMapsLabel,
  layout,
}: { 
  currentTown?: TownCoordinate | null;
  relatedTowns: TownCoordinate[];
  recreation?: RecMarker[];
  focusedRec?: RecMarker | null;
  heading?: string;
  description?: string;
  googleMapsLabel?: string;
  layout?: 'default' | 'mapFirst';
}) {
  const towns = [...(currentTown ? [currentTown] : []), ...relatedTowns];
  
  if (towns.length === 0) return null;

  const center: [number, number] = currentTown 
    ? [currentTown.lat, currentTown.lng]
    : [46.9653, -109.5337];
  const areaName = currentTown?.name || 'this area';
  const nearbyTownCount = Math.max(towns.length - (currentTown ? 1 : 0), 0);
  const mapSummary = [
    nearbyTownCount > 0 ? `${nearbyTownCount} nearby ${nearbyTownCount === 1 ? 'town' : 'towns'}` : null,
    recreation && recreation.length > 0 ? `${recreation.length} highlighted recreation sites` : null,
  ].filter(Boolean).join(' and ');
  const googleMapsHref = currentTown
    ? `https://www.google.com/maps/search/?api=1&query=${currentTown.lat},${currentTown.lng}`
    : null;
  const mapHeading = heading || 'Map & Nearby';
  const mapDescription = description || `Explore ${areaName} on the interactive map${mapSummary ? ` with ${mapSummary}` : ''}. Use the zoom controls or select a recreation item to focus it on the map.`;
  const mapsCta = googleMapsLabel || 'Open Area in Google Maps';
  const isMapFirstLayout = layout === 'mapFirst';
  const srOnlyStyle: React.CSSProperties = {
    position: 'absolute',
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  };
  const mapMeta = (
    <div style={{
      display: 'flex',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: '1rem',
      marginBottom: isMapFirstLayout ? 0 : '1rem',
      marginTop: 0,
      flexWrap: 'wrap',
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        {isMapFirstLayout ? (
          <div
            style={{
              fontSize: '1.6rem',
              color: '#204051',
              marginBottom: '0.35rem',
              borderBottom: '1px solid #e0e0e0',
              paddingBottom: '0.5rem',
              fontWeight: 700,
              fontFamily: 'var(--font-primary)',
            }}
          >
            {mapHeading}
          </div>
        ) : (
          <h2
            id="town-map-heading"
            style={{ fontSize: '1.6rem', color: '#204051', marginBottom: '0.35rem', borderBottom: '1px solid #e0e0e0', paddingBottom: '0.5rem' }}
          >
            {mapHeading}
          </h2>
        )}
        <p id="town-map-description" style={{ margin: 0, color: '#555', fontSize: '0.92rem', lineHeight: 1.6 }}>
          {mapDescription}
        </p>
      </div>
      {googleMapsHref && (
        <a
          href={googleMapsHref}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.55rem 0.85rem',
            borderRadius: '999px',
            border: '1px solid #cfd8dc',
            background: '#fff',
            color: '#3b6978',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '0.85rem',
            whiteSpace: 'nowrap',
          }}
        >
          {mapsCta}
        </a>
      )}
    </div>
  );

  return (
    <section
      id="town-map"
      className="content-section"
      aria-labelledby="town-map-heading"
      aria-describedby="town-map-description"
      style={{
        marginTop: isMapFirstLayout ? 0 : '1rem',
        marginBottom: '2rem',
        scrollMarginTop: '90px',
        padding: isMapFirstLayout ? 0 : undefined,
        overflow: isMapFirstLayout ? 'hidden' : undefined,
      }}
    >
      {isMapFirstLayout ? <h2 id="town-map-heading" style={srOnlyStyle}>{mapHeading}</h2> : mapMeta}
      <TownMap
        towns={towns}
        center={center}
        zoom={currentTown ? 8 : 6}
        recreation={recreation}
        highlightTown={currentTown?.slug}
        focusedRec={focusedRec}
        ariaLabel={`Interactive map of ${areaName} and nearby recreation`}
        containerStyle={isMapFirstLayout ? { marginBottom: 0, borderRadius: 0 } : undefined}
      />
      {isMapFirstLayout ? (
        <div style={{ padding: '1.25rem 2rem 2rem' }}>
          {mapMeta}
        </div>
      ) : null}
    </section>
  );
}
