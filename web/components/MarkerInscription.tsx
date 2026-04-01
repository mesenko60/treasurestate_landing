import React from 'react';
import {
  parseMarkerInscription,
  type InscriptionBlock,
} from '../lib/parseMarkerInscription';
import { renderTextWith1910FireArticleLinks } from '../lib/renderMontana1910FireArticleLinks';
import styles from './MarkerInscription.module.css';

type Props = {
  text: string;
  /** Smaller type and spacing for map popups */
  variant?: 'default' | 'compact';
  className?: string;
};

function renderParagraph(lines: string[], key: number) {
  return (
    <p key={key} className={styles.paragraph}>
      {lines.map((line, j) => (
        <React.Fragment key={j}>
          {j > 0 ? <br /> : null}
          {renderTextWith1910FireArticleLinks(line, { linkClassName: styles.fireArticleLink })}
        </React.Fragment>
      ))}
    </p>
  );
}

function renderBlock(block: InscriptionBlock, i: number) {
  switch (block.type) {
    case 'heading':
      return (
        <h3 key={i} className={styles.sectionTitle}>
          {block.label}
        </h3>
      );
    case 'paragraph':
      return renderParagraph(block.lines, i);
    case 'list':
      return (
        <ul key={i} className={styles.list} role="list">
          {block.items.map((item, j) => (
            <li key={j} className={styles.listItem}>
              {renderTextWith1910FireArticleLinks(item, { linkClassName: styles.fireArticleLink })}
            </li>
          ))}
        </ul>
      );
    case 'attribution':
      return (
        <p key={i} className={styles.attribution}>
          {renderTextWith1910FireArticleLinks(block.text, { linkClassName: styles.fireArticleLink })}
        </p>
      );
    default:
      return null;
  }
}

export default function MarkerInscription({
  text,
  variant = 'default',
  className = '',
}: Props) {
  const blocks = parseMarkerInscription(text);
  const rootClass =
    variant === 'compact'
      ? `${styles.root} ${styles.compact} ${className}`.trim()
      : `${styles.root} ${className}`.trim();

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div className={rootClass}>
      {blocks.map((b, i) => renderBlock(b, i))}
    </div>
  );
}
