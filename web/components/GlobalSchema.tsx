import React from 'react';
import Head from 'next/head';

export default function GlobalSchema() {
  const websiteUrl = 'https://treasurestate.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Treasure State',
    url: websiteUrl,
    logo: `${websiteUrl}/images/hero-image.jpg`,
    description: 'Your ultimate travel guide and directory for exploring the cities, towns, and history of Montana, The Treasure State.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Montana - The Treasure State',
    alternateName: ['Treasure State', 'TreasureState'],
    url: websiteUrl,
    description: 'Explore the wonders of Montana with our comprehensive town directory and travel planners.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${websiteUrl}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </Head>
  );
}