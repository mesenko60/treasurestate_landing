import React, { useEffect, useState } from 'react';

interface TOCItem {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  contentSelector?: string; // The CSS selector for the main content area (e.g., 'main', '.content-section')
}

export default function TableOfContents({ contentSelector = '.content-section' }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // 1. Find all headings in the content area
    const contentArea = document.querySelector(contentSelector);
    if (!contentArea) return;

    const elements = Array.from(contentArea.querySelectorAll('h2, h3'));
    
    // 2. Add IDs to headings if they don't have them, and collect them for the TOC
    const items: TOCItem[] = elements.map((elem) => {
      if (!elem.id) {
        // Generate an ID based on the text content
        elem.id = elem.textContent
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '') || `heading-${Math.random().toString(36).substr(2, 9)}`;
      }
      return {
        id: elem.id,
        text: elem.textContent || '',
        level: Number(elem.tagName.charAt(1)), // 2 for H2, 3 for H3
      };
    });

    setHeadings(items);

    // 3. Set up Intersection Observer to track which heading is currently active
    const callback: IntersectionObserverCallback = (entries) => {
      // Find the first intersecting entry
      const visibleEntries = entries.filter((entry) => entry.isIntersecting);
      if (visibleEntries.length > 0) {
        setActiveId(visibleEntries[0].target.id);
      }
    };

    const observer = new IntersectionObserver(callback, {
      rootMargin: '0px 0px -80% 0px', // Trigger when heading is near the top of the viewport
    });

    elements.forEach((elem) => observer.observe(elem));

    return () => observer.disconnect();
  }, [contentSelector]);

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
