import React, { useState } from 'react';

type RecreationPlace = {
  name: string;
  type: string;
  distMiles: number;
};

type NearbyRecreationProps = {
  townName: string;
  places: RecreationPlace[];
};

const TYPE_META: Record<string, { icon: string; color: string; label: string; priority: number }> = {
  'National Park':     { icon: '🏔️', color: '#2d7d46', label: 'National Parks',           priority: 1 },
  'National Forest':   { icon: '🌲', color: '#3a7d44', label: 'National Forests',          priority: 2 },
  'Wilderness':        { icon: '🏕️', color: '#4a7c59', label: 'Wilderness Areas',          priority: 3 },
  'State Park':        { icon: '🌳', color: '#5a8f3c', label: 'State Parks',               priority: 4 },
  'Lake':              { icon: '🏞️', color: '#3b6978', label: 'Lakes & Swimming',          priority: 5 },
  'River':             { icon: '🎣', color: '#2980b9', label: 'Rivers & Streams',          priority: 6 },
  'Hot Spring':        { icon: '♨️', color: '#c0392b', label: 'Hot Springs',               priority: 7 },
  'Ski Area':          { icon: '⛷️', color: '#5b6abf', label: 'Ski Areas',                 priority: 8 },
  'Campground':        { icon: '⛺', color: '#6b8e23', label: 'Campgrounds & Picnic Areas', priority: 9 },
  'Trailhead':         { icon: '🥾', color: '#8b6914', label: 'Trailheads',                priority: 10 },
  'Waterfall':         { icon: '💧', color: '#2e86ab', label: 'Waterfalls',                priority: 11 },
  'Fishing Access':    { icon: '🐟', color: '#2471a3', label: 'Fishing Access',            priority: 12 },
  'Boat Launch':       { icon: '🚣', color: '#1a5276', label: 'Boat Launches',             priority: 13 },
  'Museum':            { icon: '🏛️', color: '#6c3483', label: 'Museums & Visitor Centers', priority: 14 },
  'Historic Site':     { icon: '📜', color: '#8b4513', label: 'Historic Sites',            priority: 15 },
  'Golf':              { icon: '⛳', color: '#27ae60', label: 'Golf Courses',              priority: 16 },
  'Scenic Drive':      { icon: '🛣️', color: '#d68910', label: 'Scenic Drives',             priority: 17 },
  'Wildlife Refuge':   { icon: '🦅', color: '#7d6608', label: 'Wildlife Refuges & Nature Reserves', priority: 18 },
  'National Rec Area': { icon: '🏞️', color: '#2e86ab', label: 'National Recreation Areas', priority: 19 },
  'Viewpoint':         { icon: '👀', color: '#a04000', label: 'Scenic Viewpoints',         priority: 20 },
};

const INITIAL_SHOW = 4;

function CategoryGroup({ type, places }: { type: string; places: RecreationPlace[] }) {
  const [expanded, setExpanded] = useState(false);
  const meta = TYPE_META[type] || { icon: '📍', color: '#3b6978', label: type, priority: 99 };
  const visible = expanded ? places : places.slice(0, INITIAL_SHOW);
  const hasMore = places.length > INITIAL_SHOW;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '0.5rem',
        padding: '0.5rem 0', borderBottom: `2px solid ${meta.color}20`,
        marginBottom: '0.5rem',
      }}>
        <span style={{ fontSize: '1.2rem' }}>{meta.icon}</span>
        <span style={{ fontWeight: 600, fontSize: '0.9rem', color: meta.color }}>{meta.label}</span>
        <span style={{
          fontSize: '0.72rem', background: `${meta.color}15`, color: meta.color,
          padding: '0.15rem 0.5rem', borderRadius: '10px', fontWeight: 500,
        }}>
          {places.length}
        </span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '0.4rem' }}>
        {visible.map((place, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.45rem 0.7rem', background: '#f8f9fa', borderRadius: '5px',
            borderLeft: `3px solid ${meta.color}`,
          }}>
            <span style={{
              fontSize: '0.84rem', color: '#204051', fontWeight: 400,
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
              marginRight: '0.5rem',
            }}>
              {place.name}
            </span>
            <span style={{ fontSize: '0.76rem', color: '#999', flexShrink: 0 }}>
              {place.distMiles} mi
            </span>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          style={{
            display: 'block', margin: '0.4rem auto 0', padding: '0.3rem 1rem',
            background: 'transparent', border: `1px solid ${meta.color}40`,
            borderRadius: '4px', cursor: 'pointer', fontSize: '0.76rem',
            color: meta.color, fontWeight: 500,
          }}
        >
          {expanded ? 'Show fewer' : `Show all ${places.length}`}
        </button>
      )}
    </div>
  );
}

export default function NearbyRecreation({ townName, places }: NearbyRecreationProps) {
  if (!places || places.length === 0) return null;

  const grouped: Record<string, RecreationPlace[]> = {};
  for (const p of places) {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type].push(p);
  }

  const sortedTypes = Object.keys(grouped).sort((a, b) => {
    const pa = TYPE_META[a]?.priority ?? 99;
    const pb = TYPE_META[b]?.priority ?? 99;
    return pa - pb;
  });

  const totalCategories = sortedTypes.length;

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h3 style={{ fontSize: '1.2rem', color: '#204051', marginBottom: '0.25rem' }}>
        Outdoor Recreation &amp; Attractions Near {townName}
      </h3>
      <p style={{ fontSize: '0.82rem', color: '#888', marginBottom: '1rem', marginTop: 0 }}>
        {places.length} destinations within 50 miles across {totalCategories} categories
      </p>
      {sortedTypes.map(type => (
        <CategoryGroup key={type} type={type} places={grouped[type]} />
      ))}
      <p style={{ fontSize: '0.68rem', color: '#bbb', marginTop: '0.5rem', fontStyle: 'italic' }}>
        Distances are straight-line estimates. Driving distances may be longer. Data: OpenStreetMap contributors &amp; editorial research.
      </p>
    </section>
  );
}
