import React, { useState } from 'react';
import { filterNearbyRecreation } from '../lib/recreation';
import { trackDirectoryExpand } from '../lib/gtag';

type RecreationPlace = {
  name: string;
  type: string;
  lat: number;
  lng: number;
  distMiles: number;
};

type NearbyRecreationProps = {
  townName: string;
  places: RecreationPlace[];
  onSelectPlace?: (place: RecreationPlace) => void;
};

const TYPE_META: Record<string, { icon: string; color: string; label: string; priority: number; weight: number }> = {
  'National Park':     { icon: '🏔️', color: '#2d7d46', label: 'National Parks',       priority: 1,  weight: 10 },
  'National Forest':   { icon: '🌲', color: '#3a7d44', label: 'National Forests',      priority: 2,  weight: 6 },
  'Wilderness':        { icon: '🏕️', color: '#4a7c59', label: 'Wilderness',            priority: 3,  weight: 7 },
  'State Park':        { icon: '🌳', color: '#5a8f3c', label: 'State Parks',           priority: 4,  weight: 5 },
  'Lake':              { icon: '🏞️', color: '#3b6978', label: 'Lakes',                 priority: 5,  weight: 4 },
  'River':             { icon: '🎣', color: '#2980b9', label: 'Rivers',                priority: 6,  weight: 5 },
  'Hot Spring':        { icon: '♨️', color: '#c0392b', label: 'Hot Springs',            priority: 7,  weight: 6 },
  'Ski Area':          { icon: '⛷️', color: '#5b6abf', label: 'Ski Areas',              priority: 8,  weight: 5 },
  'Campground':        { icon: '⛺', color: '#6b8e23', label: 'Campgrounds',            priority: 9,  weight: 2 },
  'Trailhead':         { icon: '🥾', color: '#8b6914', label: 'Trailheads',             priority: 10, weight: 2 },
  'Waterfall':         { icon: '💧', color: '#2e86ab', label: 'Waterfalls',             priority: 11, weight: 4 },
  'Fishing Access':    { icon: '🐟', color: '#2471a3', label: 'Fishing',                priority: 12, weight: 3 },
  'Boat Launch':       { icon: '🚣', color: '#1a5276', label: 'Boating',                priority: 13, weight: 2 },
  'Museum':            { icon: '🏛️', color: '#6c3483', label: 'Museums',                priority: 14, weight: 3 },
  'Historic Site':     { icon: '📜', color: '#8b4513', label: 'Historic',               priority: 15, weight: 3 },
  'Golf':              { icon: '⛳', color: '#27ae60', label: 'Golf',                   priority: 16, weight: 2 },
  'Disc Golf':         { icon: '🥏', color: '#e67e22', label: 'Disc Golf',             priority: 16, weight: 2 },
  'Scenic Drive':      { icon: '🛣️', color: '#d68910', label: 'Scenic Drives',          priority: 17, weight: 4 },
  'Wildlife Refuge':   { icon: '🦅', color: '#7d6608', label: 'Wildlife',               priority: 18, weight: 3 },
  'National Rec Area': { icon: '🏞️', color: '#2e86ab', label: 'Rec Areas',              priority: 19, weight: 4 },
  'Viewpoint':         { icon: '👀', color: '#a04000', label: 'Viewpoints',             priority: 21, weight: 1 },
};

function computeScore(places: RecreationPlace[]): number {
  const types = new Set(places.length > 0 ? places.map(p => p.type) : []);

  // Diversity: more categories = higher (0-3 pts)
  const diversity = Math.min(types.size / 8, 1) * 3;

  // Volume: total sites, diminishing returns (0-2.5 pts)
  const volume = Math.min(Math.log10(Math.max(places.length, 1)) / Math.log10(400), 1) * 2.5;

  // Quality: weighted sum of premium categories present (0-3 pts)
  let qualityRaw = 0;
  Array.from(types).forEach(t => {
    qualityRaw += TYPE_META[t]?.weight ?? 1;
  });
  const quality = Math.min(qualityRaw / 40, 1) * 3;

  // Proximity: how close is the nearest notable site (0-1.5 pts)
  const notable = places.filter(p => (TYPE_META[p.type]?.weight ?? 0) >= 4);
  const nearestNotable = notable.length > 0 ? notable[0].distMiles : 30;
  const proximity = Math.max(1 - nearestNotable / 30, 0) * 1.5;

  return Math.min(Math.round((diversity + volume + quality + proximity) * 10) / 10, 10);
}

function getScoreLabel(score: number): string {
  if (score >= 9) return 'World-Class';
  if (score >= 7.5) return 'Excellent';
  if (score >= 6) return 'Very Good';
  if (score >= 4.5) return 'Good';
  if (score >= 3) return 'Moderate';
  return 'Limited';
}

function getScoreColor(score: number): string {
  if (score >= 9) return '#1a7d37';
  if (score >= 7.5) return '#2d7d46';
  if (score >= 6) return '#3b6978';
  if (score >= 4.5) return '#8b6914';
  if (score >= 3) return '#c0862b';
  return '#999';
}

function pickHighlights(places: RecreationPlace[]): RecreationPlace[] {
  const picked: RecreationPlace[] = [];
  const usedNames = new Set<string>();

  // Priority pass: one per high-value category, closest first
  const priorityTypes = Object.entries(TYPE_META)
    .filter(([, m]) => m.weight >= 4)
    .sort((a, b) => a[1].priority - b[1].priority)
    .map(([t]) => t);

  for (const type of priorityTypes) {
    if (picked.length >= 10) break;
    const match = places.find(p => p.type === type && !usedNames.has(p.name));
    if (match) { picked.push(match); usedNames.add(match.name); }
  }

  // Fill remaining with closest overall
  for (const p of places) {
    if (picked.length >= 10) break;
    if (!usedNames.has(p.name)) { picked.push(p); usedNames.add(p.name); }
  }

  return picked;
}

function ScoreRing({ score }: { score: number }) {
  const color = getScoreColor(score);
  const pct = score / 10;
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - pct);

  return (
    <div style={{ position: 'relative', width: 90, height: 90, flexShrink: 0 }}>
      <svg viewBox="0 0 90 90" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
        <circle cx="45" cy="45" r={r} fill="none" stroke="#eee" strokeWidth="6" />
        <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="6"
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: '1.5rem', fontWeight: 700, color, lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.6rem', color: '#999', marginTop: '2px' }}>/10</span>
      </div>
    </div>
  );
}

function scrollToMap(place: RecreationPlace, onSelect?: (place: RecreationPlace) => void) {
  if (onSelect) onSelect(place);
  const el = document.getElementById('town-map');
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function FullDirectory({ grouped, sortedTypes, onSelectPlace, openType, setOpenType }: { grouped: Record<string, RecreationPlace[]>; sortedTypes: string[]; onSelectPlace?: (place: RecreationPlace) => void; openType: string | null; setOpenType: (t: string | null) => void }) {

  return (
    <div style={{ marginTop: '0.5rem' }}>
      {sortedTypes.map(type => {
        const meta = TYPE_META[type] || { icon: '📍', color: '#3b6978', label: type };
        const items = grouped[type];
        const isOpen = openType === type;
        return (
          <div key={type} style={{ borderBottom: '1px solid #f0f0f0' }}>
            <button
              onClick={() => setOpenType(isOpen ? null : type)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%',
                padding: '0.55rem 0.5rem', background: 'transparent', border: 'none',
                cursor: 'pointer', textAlign: 'left', fontSize: '0.85rem',
              }}
            >
              <span>{meta.icon}</span>
              <span style={{ fontWeight: 500, color: '#204051', flex: 1 }}>{meta.label}</span>
              <span style={{
                fontSize: '0.72rem', background: `${meta.color}12`, color: meta.color,
                padding: '0.1rem 0.45rem', borderRadius: '10px', fontWeight: 600,
              }}>{items.length}</span>
              <span style={{ fontSize: '0.7rem', color: '#bbb', marginLeft: '0.25rem' }}>
                {isOpen ? '▾' : '▸'}
              </span>
            </button>
            {isOpen && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '0.3rem', padding: '0 0.5rem 0.6rem',
              }}>
                {items.map((p, i) => (
                  <a
                    key={i}
                    href="#town-map"
                    onClick={(e) => { e.preventDefault(); scrollToMap(p, onSelectPlace); }}
                    style={{
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '0.3rem 0.6rem', background: '#fafafa', borderRadius: '4px',
                      borderLeft: `3px solid ${meta.color}`,
                      fontSize: '0.82rem', textDecoration: 'none',
                      cursor: 'pointer', transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#f0f4f0'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = '#fafafa'; }}
                  >
                    <span style={{
                      color: '#204051', overflow: 'hidden', textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap', flex: 1, marginRight: '0.4rem',
                    }}>{p.name}</span>
                    <span style={{ color: '#aaa', flexShrink: 0, fontSize: '0.76rem' }}>{p.distMiles} mi</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function NearbyRecreation({ townName, places, onSelectPlace }: NearbyRecreationProps) {
  const [showDirectory, setShowDirectory] = useState(false);
  const [openType, setOpenType] = useState<string | null>(null);
  const visiblePlaces = filterNearbyRecreation(places);

  if (visiblePlaces.length === 0) return null;

  const score = computeScore(visiblePlaces);
  const highlights = pickHighlights(visiblePlaces);

  const grouped: Record<string, RecreationPlace[]> = {};
  for (const p of visiblePlaces) {
    if (!grouped[p.type]) grouped[p.type] = [];
    grouped[p.type].push(p);
  }
  const sortedTypes = Object.keys(grouped).sort((a, b) =>
    (TYPE_META[a]?.priority ?? 99) - (TYPE_META[b]?.priority ?? 99)
  );

  return (
    <section
      className="content-section"
      style={{ marginBottom: '2rem', scrollMarginTop: '90px' }}
      aria-labelledby="outdoor-recreation-heading"
    >
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '0.75rem',
        marginBottom: '1rem',
        flexWrap: 'wrap',
      }}>
        <h2 id="outdoor-recreation-heading" style={{ fontSize: '1.2rem', color: '#204051', margin: 0 }}>
          Outdoor Recreation Near {townName}
        </h2>
        <a
          href="#town-map"
          onClick={(e) => {
            e.preventDefault();
            const mapEl = document.getElementById('town-map');
            if (mapEl) {
              const y = mapEl.getBoundingClientRect().top + window.scrollY - 80;
              window.scrollTo({ top: y, behavior: 'smooth' });
            }
          }}
          style={{
            color: '#3b6978',
            textDecoration: 'none',
            fontSize: '0.82rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Jump to map →
        </a>
      </div>

      {/* Score + Category Badges */}
      <div style={{
        display: 'flex', gap: '1.25rem', alignItems: 'center',
        padding: '1rem 1.25rem', background: '#f8faf8', borderRadius: '10px',
        border: '1px solid #e8ede8', marginBottom: '1.25rem',
        flexWrap: 'wrap',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ScoreRing score={score} />
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: getScoreColor(score) }}>
              {getScoreLabel(score)}
            </div>
            <div style={{ fontSize: '0.76rem', color: '#888', marginTop: '2px' }}>
              {visiblePlaces.length} sites within 30 mi
            </div>
            <div style={{ fontSize: '0.72rem', color: '#aaa' }}>
              {sortedTypes.length} categories
            </div>
          </div>
        </div>

        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.35rem', flex: 1, minWidth: 180,
        }}>
          {sortedTypes.map(type => {
            const meta = TYPE_META[type] || { icon: '📍', color: '#888', label: type };
            return (
              <button
                key={type}
                onClick={() => {
                  setShowDirectory(true);
                  setOpenType(type);
                  setTimeout(() => {
                    const el = document.getElementById('rec-directory');
                    if (el) {
                      const y = el.getBoundingClientRect().top + window.scrollY - 80;
                      window.scrollTo({ top: y, behavior: 'smooth' });
                    }
                  }, 50);
                }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: '0.25rem',
                  padding: '0.2rem 0.55rem', borderRadius: '12px',
                  background: `${meta.color}10`, border: `1px solid ${meta.color}25`,
                  fontSize: '0.74rem', color: meta.color, fontWeight: 500,
                  whiteSpace: 'nowrap', cursor: 'pointer',
                  transition: 'background 0.15s, border-color 0.15s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${meta.color}20`; e.currentTarget.style.borderColor = `${meta.color}50`; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${meta.color}10`; e.currentTarget.style.borderColor = `${meta.color}25`; }}
              >
                <span style={{ fontSize: '0.85rem' }}>{meta.icon}</span>
                {grouped[type].length}
              </button>
            );
          })}
        </div>
      </div>

      {/* Top 10 Highlights */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{
          fontSize: '0.88rem', fontWeight: 600, color: '#204051',
          marginBottom: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.5px',
        }}>
          Must-See Highlights
        </div>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '0.5rem',
        }}>
          {highlights.map((place, i) => {
            const meta = TYPE_META[place.type] || { icon: '📍', color: '#3b6978', label: place.type };
            return (
              <a
                key={i}
                href="#town-map"
                onClick={(e) => { e.preventDefault(); scrollToMap(place, onSelectPlace); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.6rem 0.8rem', background: '#fff', borderRadius: '8px',
                  border: '1px solid #eee', boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                  textDecoration: 'none', cursor: 'pointer',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = meta.color; e.currentTarget.style.boxShadow = '0 2px 6px rgba(0,0,0,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#eee'; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
              >
                <span style={{ fontSize: '1.3rem', flexShrink: 0 }}>{meta.icon}</span>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{
                    fontWeight: 600, fontSize: '0.88rem', color: '#204051',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {place.name}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.7rem', color: meta.color, fontWeight: 500 }}>
                      {meta.label}
                    </span>
                    <span style={{ fontSize: '0.76rem', color: '#999' }}>
                      {place.distMiles} mi
                    </span>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Full Directory Toggle */}
      <div id="rec-directory" style={{
        borderTop: '1px solid #eee', paddingTop: '0.75rem',
      }}>
        <button
          onClick={() => { if (!showDirectory) trackDirectoryExpand('recreation', townName); setShowDirectory(!showDirectory); if (showDirectory) setOpenType(null); }}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            width: '100%', padding: '0.6rem', background: showDirectory ? '#f0f4f0' : '#fff',
            border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer',
            fontSize: '0.84rem', fontWeight: 500, color: '#3b6978',
          }}
        >
          {showDirectory ? 'Hide' : 'Browse'} Full Directory ({places.length} sites)
          <span style={{ fontSize: '0.7rem' }}>{showDirectory ? '▲' : '▼'}</span>
        </button>

        {showDirectory && (
          <FullDirectory grouped={grouped} sortedTypes={sortedTypes} onSelectPlace={onSelectPlace} openType={openType} setOpenType={setOpenType} />
        )}
      </div>

      <p style={{ fontSize: '0.68rem', color: '#bbb', marginTop: '0.75rem', fontStyle: 'italic' }}>
        Distances are straight-line estimates. Driving distances may be longer. Data: OpenStreetMap contributors &amp; editorial research.
      </p>
    </section>
  );
}
