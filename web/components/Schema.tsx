import React from 'react';
import Head from 'next/head';

interface SchemaProps {
  townName: string;
  slug: string;
  description: string;
  aeoData?: {
    faqs: { question: string; answer: string }[];
  };
}

export default function Schema({ townName, slug, description, aeoData }: SchemaProps) {
  const websiteUrl = 'https://treasurestate.com';
  const url = `${websiteUrl}/montana-towns/${slug}/`;

  const schemas = [];

  // 1. Place / City Schema
  schemas.push({
    '@context': 'https://schema.org',
    '@type': 'City',
    name: townName,
    description: description,
    url: url,
    containedInPlace: {
      '@type': 'State',
      name: 'Montana'
    }
  });

  // 2. FAQPage Schema (for AEO)
  if (aeoData && aeoData.faqs && aeoData.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: aeoData.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    });
  }

  return (
    <Head>
      {schemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </Head>
  );
}
