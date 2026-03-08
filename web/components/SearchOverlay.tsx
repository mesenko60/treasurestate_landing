import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/router';
import Fuse, { FuseResult } from 'fuse.js';

type SearchEntry = {
  type: string;
  title: string;
  description: string;
  url: string;
  keywords: string;
};

type SR = FuseResult<SearchEntry>;

const TYPE_LABELS: Record<string, string> = {
  town: 'Towns',
  guide: 'Guides & Planners',
  ranking: 'Best-Of Rankings',
  article: 'Articles',
  tool: 'Tools',
};

const TYPE_ICONS: Record<string, string> = {
  town: '🏔️',
  guide: '🧭',
  ranking: '🏆',
  article: '📖',
  tool: '⚙️',
};

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SR[]>([]);
  const [fuse, setFuse] = useState<Fuse<SearchEntry> | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetch('/search-index.json')
      .then(r => r.json())
      .then((data: SearchEntry[]) => {
        const f = new Fuse(data, {
          keys: [
            { name: 'title', weight: 0.5 },
            { name: 'keywords', weight: 0.3 },
            { name: 'description', weight: 0.2 },
          ],
          threshold: 0.35,
          includeScore: true,
          minMatchCharLength: 2,
        });
        setFuse(f);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setResults([]);
      setSelectedIdx(-1);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    if (!fuse || query.length < 2) { setResults([]); return; }
    const r = fuse.search(query, { limit: 20 });
    setResults(r);
    setSelectedIdx(-1);
  }, [query, fuse]);

  useEffect(() => {
    const handleRouteChange = () => onClose();
    router.events.on('routeChangeStart', handleRouteChange);
    return () => router.events.off('routeChangeStart', handleRouteChange);
  }, [router.events, onClose]);

  const navigate = useCallback((url: string) => {
    onClose();
    router.push(url);
  }, [onClose, router]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { onClose(); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, 0));
    }
    if (e.key === 'Enter' && selectedIdx >= 0 && results[selectedIdx]) {
      navigate(results[selectedIdx].item.url);
    }
  };

  useEffect(() => {
    if (selectedIdx < 0 || !listRef.current) return;
    const el = listRef.current.children[selectedIdx] as HTMLElement | undefined;
    el?.scrollIntoView({ block: 'nearest' });
  }, [selectedIdx]);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (open) onClose();
        else onClose(); // parent toggle handles open
      }
    };
    window.addEventListener('keydown', handleGlobalKey);
    return () => window.removeEventListener('keydown', handleGlobalKey);
  }, [open, onClose]);

  if (!open) return null;

  const grouped = new Map<string, SR[]>();
  for (const r of results) {
    const t = r.item.type;
    if (!grouped.has(t)) grouped.set(t, []);
    grouped.get(t)!.push(r);
  }

  let flatIndex = 0;

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 10000,
      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)',
      display: 'flex', justifyContent: 'center', paddingTop: '12vh',
    }} onClick={onClose}>
      <div style={{
        background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '600px',
        maxHeight: '70vh', display: 'flex', flexDirection: 'column',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden',
        alignSelf: 'flex-start',
      }} onClick={e => e.stopPropagation()}>

        {/* Search input */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid #e5e7eb',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            placeholder="Search towns, guides, rankings..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              flex: 1, border: 'none', outline: 'none', fontSize: '1rem',
              fontFamily: "'Montserrat', sans-serif", color: '#204051',
            }}
          />
          <kbd style={{
            fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px',
            border: '1px solid #d1d5db', color: '#9ca3af', background: '#f9fafb',
          }}>ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ overflowY: 'auto', flex: 1 }}>
          {loading && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
          )}

          {!loading && query.length >= 2 && results.length === 0 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af' }}>
              No results for &ldquo;{query}&rdquo;
            </div>
          )}

          {!loading && query.length < 2 && (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#9ca3af', fontSize: '0.9rem' }}>
              Type at least 2 characters to search
            </div>
          )}

          {Array.from(grouped.entries()).map(([type, items]) => (
            <div key={type}>
              <div style={{
                padding: '8px 20px', fontSize: '0.75rem', fontWeight: 700,
                color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em',
                background: '#f9fafb', fontFamily: "'Montserrat', sans-serif",
              }}>
                {TYPE_LABELS[type] || type}
              </div>
              {items.map(r => {
                const idx = flatIndex++;
                return (
                  <div
                    key={r.item.url}
                    onClick={() => navigate(r.item.url)}
                    style={{
                      padding: '10px 20px', cursor: 'pointer', display: 'flex',
                      alignItems: 'flex-start', gap: '12px',
                      background: idx === selectedIdx ? '#f0f7fa' : 'transparent',
                      borderLeft: idx === selectedIdx ? '3px solid #3b6978' : '3px solid transparent',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={() => setSelectedIdx(idx)}
                  >
                    <span style={{ fontSize: '1.2rem', marginTop: '2px' }}>{TYPE_ICONS[r.item.type] || '📄'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontWeight: 600, color: '#204051', fontSize: '0.95rem',
                        fontFamily: "'Montserrat', sans-serif",
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {r.item.title}
                      </div>
                      <div style={{
                        fontSize: '0.8rem', color: '#6b7280', marginTop: '2px',
                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                      }}>
                        {r.item.description}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Footer hint */}
        {results.length > 0 && (
          <div style={{
            padding: '8px 20px', borderTop: '1px solid #e5e7eb',
            fontSize: '0.7rem', color: '#9ca3af', display: 'flex', gap: '16px',
            fontFamily: "'Montserrat', sans-serif",
          }}>
            <span>↑↓ navigate</span>
            <span>↵ open</span>
            <span>esc close</span>
          </div>
        )}
      </div>
    </div>
  );
}
