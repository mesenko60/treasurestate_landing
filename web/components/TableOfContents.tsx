import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string;
}

export default function TableOfContents({ contentSelector = '.content-section' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    setHeadings([]);
    setActiveId('');

    const timer = setTimeout(() => {
      const contentAreas = document.querySelectorAll(contentSelector);
      if (contentAreas.length === 0) return;

      const elements: Element[] = [];
      contentAreas.forEach(area => {
        elements.push(...Array.from(area.querySelectorAll('h2, h3')));
      });

      const items: TOCItem[] = elements.map((elem) => {
        if (!elem.id) {
          elem.id = elem.textContent
            ?.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') || `heading-${Math.random().toString(36).substr(2, 9)}`;
        }
        return {
          id: elem.id,
          text: elem.textContent || '',
          level: Number(elem.tagName.charAt(1)),
        };
      });

      setHeadings(items);

      const callback: IntersectionObserverCallback = (entries) => {
        const visibleEntries = entries.filter((entry) => entry.isIntersecting);
        if (visibleEntries.length > 0) {
          setActiveId(visibleEntries[0].target.id);
        }
      };

      const observer = new IntersectionObserver(callback, {
        rootMargin: '0px 0px -80% 0px',
      });

      elements.forEach((elem) => observer.observe(elem));

      return () => observer.disconnect();
    }, 150);

    return () => clearTimeout(timer);
  }, [contentSelector, router.asPath]);

  if (headings.length === 0) return null;

  return (
    <aside 
      className="table-of-contents" 
      style={{
        position: 'sticky',
        top: '20px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #ddd',
        maxHeight: 'calc(100vh - 40px)',
        overflowY: 'auto',
        minWidth: '250px'
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: '15px', fontSize: '1.2rem', color: '#333' }}>Table of Contents</h3>
      <nav aria-label="Table of Contents">
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {headings.map((heading) => (
            <li 
              key={heading.id} 
              style={{ 
                marginBottom: '8px',
                paddingLeft: heading.level === 3 ? '15px' : '0px'
              }}
            >
              <a 
                href={`#${heading.id}`}
                style={{
                  textDecoration: 'none',
                  color: activeId === heading.id ? '#0a5cff' : '#555',
                  fontWeight: activeId === heading.id ? '600' : '400',
                  transition: 'color 0.2s',
                  display: 'block',
                  fontSize: '0.95rem',
                  lineHeight: '1.4'
                }}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
