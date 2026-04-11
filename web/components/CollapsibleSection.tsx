import React, { useRef, useEffect, useState, type ReactNode } from 'react';

type Props = {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  /** Unique id for CSS — must be stable across renders */
  id?: string;
  children: ReactNode;
};

/**
 * Mobile-only collapsible accordion. On screens >= 1024px the section is always
 * expanded and the toggle is invisible. Uses native <details>/<summary> for
 * accessibility, with a CSS-driven height animation for smooth open/close.
 */
export default function CollapsibleSection({
  title,
  icon,
  defaultOpen = false,
  id,
  children,
}: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1024px)');
    const sync = () => {
      if (mql.matches && detailsRef.current) {
        detailsRef.current.open = true;
        setIsOpen(true);
      }
    };
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  const handleToggle = () => {
    if (!detailsRef.current) return;
    setIsOpen(detailsRef.current.open);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .collapsible-section summary { list-style: none; }
        .collapsible-section summary::-webkit-details-marker { display: none; }
        .collapsible-section summary::marker { display: none; content: ''; }
        .collapsible-section .cs-body {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.25s ease;
        }
        @media (min-width: 1024px) {
          .collapsible-section { border: none !important; background: transparent !important; padding: 0 !important; margin: 0 !important; }
          .collapsible-section summary { display: none !important; }
          .collapsible-section .cs-body { max-height: none !important; opacity: 1 !important; overflow: visible !important; padding: 0 !important; }
        }
      `}} />
      <details
        ref={detailsRef}
        open={defaultOpen}
        onToggle={handleToggle}
        className="collapsible-section"
        id={id}
        style={{
          margin: '0.75rem 0',
          borderRadius: '10px',
          border: '1px solid #e2ebe2',
          background: '#f8faf8',
          overflow: 'hidden',
        }}
      >
        <summary
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1rem',
            cursor: 'pointer',
            userSelect: 'none',
            WebkitTapHighlightColor: 'transparent',
            fontWeight: 600,
            fontSize: '0.95rem',
            color: '#204051',
            background: isOpen ? '#eef4ee' : '#f8faf8',
            transition: 'background 0.2s ease',
          }}
        >
          {icon && <span aria-hidden="true" style={{ fontSize: '1.1rem', flexShrink: 0 }}>{icon}</span>}
          <span style={{ flex: 1 }}>{title}</span>
          <span
            aria-hidden="true"
            style={{
              display: 'inline-block',
              fontSize: '0.75rem',
              color: '#888',
              transition: 'transform 0.25s ease',
              transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              flexShrink: 0,
            }}
          >
            ▶
          </span>
        </summary>
        <div
          ref={contentRef}
          className="cs-body"
          style={{
            padding: '0 1rem 1rem',
          }}
        >
          {children}
        </div>
      </details>
    </>
  );
}
