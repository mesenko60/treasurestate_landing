'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import TdihCard from './TdihCard';
import { TdihEntry, findEntryByDate, getTodayTdihPath } from '../lib/tdih';

type Props = {
  heading?: string;
  variant?: 'card' | 'pill';
  tone?: 'light' | 'glass';
};

export default function TodayInHistory({ heading = 'Today in Montana History', variant = 'card', tone = 'light' }: Props) {
  const [entries, setEntries] = useState<TdihEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch('/data/tdih.json')
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        if (cancelled) return;
        setEntries(Array.isArray(data) ? data : []);
        setLoaded(true);
      })
      .catch(() => {
        if (cancelled) return;
        setEntries([]);
        setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const todayEntry = useMemo(() => findEntryByDate(entries), [entries]);
  const todayPath = useMemo(() => getTodayTdihPath(), []);

  if (variant === 'pill') {
    const isGlass = tone === 'glass';

    return (
      <section aria-label={heading} style={{ display: 'flex', justifyContent: 'center', padding: '0 1rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 'fit-content',
            background: isGlass ? 'rgba(10,25,35,0.58)' : 'rgba(255,255,255,0.96)',
            border: isGlass ? '1px solid rgba(255,255,255,0.28)' : '1px solid #dce6ed',
            borderRadius: '999px',
            boxShadow: isGlass ? '0 6px 20px rgba(0,0,0,0.18)' : '0 6px 24px rgba(15,35,48,0.10)',
            padding: '0.34rem 0.8rem',
            color: isGlass ? '#fff' : '#204051',
            backdropFilter: isGlass ? 'blur(8px)' : undefined,
          }}
        >
          <Link
            href={todayPath}
            style={{
              color: isGlass ? '#f5c97a' : '#3b6978',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              lineHeight: 1.2,
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            Today in Montana History
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section style={{ background: '#f8fbfd', border: '1px solid #dce6ed', borderRadius: '12px', padding: '1rem' }}>
      <h2 style={{ margin: '0 0 0.75rem', fontFamily: 'var(--font-primary)', fontSize: '1.2rem', color: '#1f3f51' }}>
        {heading}
      </h2>
      {!loaded && <p style={{ margin: 0, color: '#4b5563' }}>Loading today&apos;s story...</p>}
      {loaded && !todayEntry && <p style={{ margin: 0, color: '#4b5563' }}>No story available for this date.</p>}
      {todayEntry && <TdihCard entry={todayEntry} />}
    </section>
  );
}
