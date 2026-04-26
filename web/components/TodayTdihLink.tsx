'use client';

import { useMemo, type ReactNode } from 'react';
import Link from 'next/link';
import { getTodayTdihPath } from '../lib/tdih';

type Props = {
  className?: string;
  children: ReactNode;
};

/**
 * Resolves to today’s full TDIH story URL (America/Denver), e.g. /this-day-in-history/april/26/
 */
export default function TodayTdihLink({ className, children }: Props) {
  const href = useMemo(() => getTodayTdihPath(), []);
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
