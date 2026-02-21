import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </Head>
      <nav aria-label="breadcrumb" className="breadcrumbs-nav" style={{ padding: '20px 20px 0 20px', maxWidth: '1200px', margin: '0 auto' }}>
        <ol style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: '8px', fontSize: '14px', color: '#555' }}>
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <li key={item.url} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isLast ? (
                  <span style={{ color: '#000', fontWeight: 'bold' }} aria-current="page">
                    {item.name}
                  </span>
                ) : (
                  <>
                    <Link href={item.url} style={{ color: '#0a5cff', textDecoration: 'none' }}>
                      {item.name}
                    </Link>
                    <span>&gt;</span>
                  </>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
