import React from 'react';
import Head from 'next/head';

export default function GlobalSchema() {
  const websiteUrl = 'https://treasurestate.com';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${websiteUrl}/#organization`,
    name: 'Treasure State',
    url: websiteUrl,
    logo: {
      '@type': 'ImageObject',
      url: `${websiteUrl}/favicon-512x512.png`,
      width: 512,
      height: 512,
    },
    description: 'Your ultimate travel guide and directory for exploring the cities, towns, and history of Montana, The Treasure State.',
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${websiteUrl}/#website`,
    name: 'Montana - The Treasure State',
    alternateName: ['Treasure State', 'TreasureState'],
    url: websiteUrl,
    description: 'The complete guide to living and exploring Montana. Compare housing, cost of living, schools, and outdoor recreation across 130+ towns.',
    publisher: { '@id': `${websiteUrl}/#organization` },
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