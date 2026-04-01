import React from 'react';
import Link from 'next/link';

export const MONTANA_1910_FIRE_ARTICLE_HREF = '/information/1910_fire/' as const;

const HAS_PHRASE = /\b(?:Great Fire of 1910|1910 Fires|1910 fires|Big Blowup)\b/i;

function isLinkedPhrase(part: string): boolean {
  return /^(Great Fire of 1910|1910 Fires|1910 fires|Big Blowup)$/i.test(part);
}

export type FireArticleLinkOptions = {
  linkClassName?: string;
};

/**
 * Wraps known phrases about the 1910 Northern Rockies fire complex in a link to the
 * site’s narrative article. Use in marker inscriptions and short excerpts (not in the
 * article body itself, which is markdown HTML).
 */
export function renderTextWith1910FireArticleLinks(
  text: string,
  options?: FireArticleLinkOptions,
): React.ReactNode {
  if (!text || !HAS_PHRASE.test(text)) {
    return text;
  }

  const parts = text.split(
    /(\bGreat Fire of 1910\b|\b1910 Fires\b|\b1910 fires\b|\bBig Blowup\b)/gi,
  );
  const linkClass = options?.linkClassName;

  return parts.map((part, i) => {
    if (part === '') {
      return null;
    }
    if (isLinkedPhrase(part)) {
      return (
        <Link key={`f-${i}`} href={MONTANA_1910_FIRE_ARTICLE_HREF} className={linkClass}>
          {part}
        </Link>
      );
    }
    return <React.Fragment key={`t-${i}`}>{part}</React.Fragment>;
  });
}
