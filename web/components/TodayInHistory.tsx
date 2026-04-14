'use client';

import { useEffect, useMemo, useState } from 'react';
import TdihCard from './TdihCard';
import { TdihEntry, findEntryByDate } from '../lib/tdih';

type Props = {
  heading?: string;
};

export default function TodayInHistory({ heading = 'Today in Montana History' }: Props) {
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
