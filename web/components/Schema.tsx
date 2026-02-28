import React from 'react';
import Head from 'next/head';

interface RecreationPlace {
  name: string;
  type: string;
  distMiles: number;
}

interface SchemaProps {
  townName: string;
  slug: string;
  description: string;
  population?: number | null;
  elevation?: number | null;
  county?: string | null;
  lat?: number | null;
  lng?: number | null;
  recreationPlaces?: RecreationPlace[] | null;
  aeoData?: {
    faqs: { question: string; answer: string }[];
  };
}

const ATTRACTION_TYPES = new Set([
  'National Park', 'Wilderness', 'National Forest', 'Ski Area',
  'Hot Spring', 'Scenic Drive', 'National HQ', 'State Park',
]);

export default function Schema({
  townName, slug, description, population, elevation, county,
  lat, lng, recreationPlaces, aeoData,
}: SchemaProps) {
  const websiteUrl = 'https://treasurestate.com';
  const url = `${websiteUrl}/montana-towns/${slug}/`;

  const schemas: object[] = [];

  const citySchema: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'City',
    name: townName,
    description,
    url,
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: county ? `${county} County` : 'Montana',
      containedInPlace: { '@type': 'State', name: 'Montana', containedInPlace: { '@type': 'Country', name: 'United States' } },
    },
  };

  if (lat != null && lng != null) {
    citySchema.geo = { '@type': 'GeoCoordinates', latitude: lat, longitude: lng };
  }
  if (population != null) {
    citySchema.population = { '@type': 'QuantitativeValue', value: population };
  }
  if (elevation != null) {
    citySchema.elevation = { '@type': 'QuantitativeValue', value: elevation, unitCode: 'FOT' };
  }

  schemas.push(citySchema);

  if (recreationPlaces && recreationPlaces.length > 0) {
    const attractions = recreationPlaces
      .filter(p => ATTRACTION_TYPES.has(p.type))
      .slice(0, 10);

    if (attractions.length > 0) {
      for (const a of attractions) {
        schemas.push({
          '@context': 'https://schema.org',
          '@type': 'TouristAttraction',
          name: a.name,
          touristType: a.type,
          description: `${a.name} (${a.type}) — ${a.distMiles} miles from ${townName}, Montana`,
          isAccessibleForFree: true,
          containedInPlace: { '@type': 'State', name: 'Montana' },
        });
      }
    }
  }

  if (aeoData && aeoData.faqs && aeoData.faqs.length > 0) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: aeoData.faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: { '@type': 'Answer', text: faq.answer },
      })),
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
