import Head from 'next/head';
import Link from 'next/link';
import { useMemo } from 'react';
import { GetStaticProps } from 'next';
import fs from 'fs';
import path from 'path';
import dynamic from 'next/dynamic';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import { slugify } from '../../lib/slug';

const DirectoryMap = dynamic(() => import('../../components/DirectoryMap'), { ssr: false });

/** Cities in golf data that are not town profile slugs */
const CITY_TO_TOWN_SLUG: Record<string, string> = {
  'Black Eagle': 'great-falls',
  'East Glacier Park': 'east-glacier',
  Emigrant: 'livingston',
  Fortine: 'eureka',
  Frenchtown: 'missoula',
  Huntley: 'billings',
  'Saint Regis': 'superior',
};

type RawCourse = {
  course_name: string;
  city: string;
  county: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  website: string;
  holes: number;
  par: number;
  course_type: string;
  yardage: number;
  rating: string;
  slope: string;
  designer: string;
  year_opened: string;
  description: string;
};

type GolfCourse = RawCourse & {
  slug: string;
  townSlug: string;
  townInSite: boolean;
  categoryKey: 'public' | 'semi-private' | 'resort' | 'private' | 'other';
};

type Props = {
  courses: GolfCourse[];
  totalCount: number;
  compiledDate: string;
};

const CATEGORY_ORDER: GolfCourse['categoryKey'][] = ['public', 'semi-private', 'resort', 'private', 'other'];

const CATEGORY_LABELS: Record<string, string> = {
  public: 'Public',
  'semi-private': 'Semi-Private',
  resort: 'Resort',
  private: 'Private',
  other: 'Other',
};

const CATEGORY_COLORS: Record<string, string> = {
  public: '#3b6978',
  'semi-private': '#d8973c',
  resort: '#5a8a5c',
  private: '#6b5b95',
  other: '#888888',
};

function courseCategoryKey(courseType: string): GolfCourse['categoryKey'] {
  const t = (courseType || '').trim().toLowerCase().replace(/\s+/g, '-');
  if (t === 'semi-private') return 'semi-private';
  if (t === 'public') return 'public';
  if (t === 'private') return 'private';
  if (t === 'resort') return 'resort';
  if (t === 'municipal') return 'public';
  return 'other';
}

function parseCourseRating(r: string): number | null {
  if (!r || r === 'Unknown') return null;
  const n = parseFloat(r);
  return Number.isFinite(n) ? n : null;
}

function websiteUrl(w: string): string | null {
  if (!w || w === 'Unknown') return null;
  const t = w.trim();
  if (!/^https?:\/\//i.test(t)) return null;
  return t;
}

function assignUniqueSlugs(raw: RawCourse[]): (RawCourse & { slug: string })[] {
  const used = new Set<string>();
  return raw.map((c) => {
    let base = slugify(c.course_name);
    if (!base) base = 'course';
    let s = base;
    let n = 0;
    while (used.has(s)) {
      n += 1;
      s = `${base}-${n}`;
    }
    used.add(s);
    return { ...c, slug: s };
  });
}

function townSlugForCity(city: string): string {
  return CITY_TO_TOWN_SLUG[city] || slugify(city);
}

function CourseCard({ c }: { c: GolfCourse }) {
  const color = CATEGORY_COLORS[c.categoryKey] || '#3b6978';
  const label = CATEGORY_LABELS[c.categoryKey] || c.course_type;
  const web = websiteUrl(c.website);
  const courseRating = parseCourseRating(c.rating);

  return (
    <div id={c.slug} style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)', overflow: 'hidden', marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.25rem 0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#204051' }}>{c.course_name}</h3>
        <span style={{ fontSize: '0.72rem', fontWeight: 600, padding: '0.25rem 0.6rem', borderRadius: '4px', background: color, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          {label}
        </span>
      </div>
      <div style={{ padding: '0.5rem 1.25rem 1.25rem' }}>
        <p style={{ fontSize: '0.92rem', color: '#555', lineHeight: 1.6, margin: '0 0 0.75rem' }}>{c.description}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0.5rem 1rem', fontSize: '0.85rem', color: '#555' }}>
          <div><strong>City:</strong> {c.city}</div>
          <div><strong>County:</strong> {c.county}</div>
          <div><strong>Holes / Par:</strong> {c.holes} · Par {c.par}</div>
          {c.yardage > 0 && <div><strong>Yardage:</strong> {c.yardage.toLocaleString()}</div>}
          {courseRating != null && <div><strong>Course rating:</strong> {courseRating}</div>}
          {c.slope && c.slope !== 'Unknown' && <div><strong>Slope:</strong> {c.slope}</div>}
          {c.designer && c.designer !== 'Unknown' && <div><strong>Designer:</strong> {c.designer}</div>}
          {c.year_opened && c.year_opened !== 'Unknown' && <div><strong>Opened:</strong> {c.year_opened}</div>}
          {c.address && <div style={{ gridColumn: '1 / -1' }}><strong>Address:</strong> {c.address}</div>}
          {c.phone && c.phone !== 'Unknown' && (
            <div>
              <strong>Phone:</strong>{' '}
              <a href={`tel:${c.phone.replace(/[^+\d]/g, '')}`} style={{ color: '#3b6978', textDecoration: 'none' }}>
                {c.phone}
              </a>
            </div>
          )}
        </div>
        <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.85rem' }}>
          {c.townInSite && (
            <Link href={`/montana-towns/${c.townSlug}/`} style={{ color: '#3b6978', textDecoration: 'none', fontWeight: 600 }}>
              {c.city} town profile →
            </Link>
          )}
          <a href={`https://www.google.com/maps/dir/?api=1&destination=${c.latitude},${c.longitude}`} target="_blank" rel="noopener noreferrer" style={{ color: '#5a8a5c', textDecoration: 'none', fontWeight: 600 }}>
            Get directions →
          </a>
          {web && (
            <a href={web} target="_blank" rel="noopener noreferrer" style={{ color: '#999', textDecoration: 'none' }}>
              Official website →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GolfCoursesGuide({ courses, totalCount, compiledDate }: Props) {
  const { byCategory, categoryOrder } = useMemo(() => {
    const map: Record<GolfCourse['categoryKey'], GolfCourse[]> = {
      public: [],
      'semi-private': [],
      resort: [],
      private: [],
      other: [],
    };
    for (const c of courses) {
      map[c.categoryKey].push(c);
    }
    for (const k of CATEGORY_ORDER) {
      map[k].sort((a, b) => a.course_name.localeCompare(b.course_name));
    }
    return { byCategory: map, categoryOrder: CATEGORY_ORDER };
  }, [courses]);
  const url = 'https://treasurestate.com/guides/golf-courses-guide/';
  const title = `Montana Golf Courses: Complete Directory of All ${totalCount} Courses`;
  const desc = `Every Montana golf course with map, holes, par, yardage, designer, and directions. Public, private, resort, and semi-private courses statewide. Data compiled ${compiledDate}.`;

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners/' },
    { name: 'Montana Golf Courses', url },
  ];

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'How many golf courses are in Montana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: `This directory lists ${totalCount} Montana golf courses with verified coordinates, including public, private, resort, and semi-private layouts across the state.`,
        },
      },
      {
        '@type': 'Question',
        name: 'Where can I play public golf in Montana?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Montana has many municipal and daily-fee public courses in cities and towns such as Billings, Missoula, Bozeman, Great Falls, Helena, Kalispell, and Butte. Use the Public section of this guide or filter the map by category.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are Montana golf courses open year-round?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most Montana courses operate primarily in the warmer months (typically spring through fall). Snow and freezing conditions limit winter play at most locations; contact the course or check their website for seasonal hours.',
        },
      },
    ],
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    author: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    datePublished: `${compiledDate}T00:00:00-07:00`,
    dateModified: `${compiledDate}T00:00:00-07:00`,
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  /** Course USGA-style ratings are not 1–5 stars; omit from DirectoryMap popup. */
  const mapItems = courses.map((c) => ({
    name: c.course_name,
    slug: c.slug,
    lat: c.latitude,
    lng: c.longitude,
    category: c.categoryKey,
    rating: null,
    reviews: null,
    address: c.address || null,
  }));

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana golf courses, Montana golf directory, public golf Montana, resort golf Big Sky, golf near Bozeman Billings Missoula, Montana tee times, golf map Montana" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </Head>
      <Header />
      <Hero title="Montana Golf Course Directory" subtitle={`${totalCount} courses — map, stats, and town links`} image="/images/hero-image.jpg" alt="Golf fairway in Montana" small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .gc-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .gc-toc { background: #fff; border-radius: 10px; padding: 1.25rem 1.5rem; box-shadow: 0 2px 8px rgba(0,0,0,0.05); margin-bottom: 2rem; }
        .gc-toc h2 { font-size: 1rem; margin: 0 0 0.75rem; color: #204051; }
        .gc-toc-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 0.35rem 1rem; max-height: 280px; overflow-y: auto; }
        .gc-toc-grid a { font-size: 0.85rem; color: #3b6978; text-decoration: none; }
        .gc-toc-grid a:hover { text-decoration: underline; }
        .gc-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .gc-section-count { font-size: 0.85rem; color: #999; font-weight: 400; }
        .gc-note { background: #f0f7f4; border-left: 4px solid #5a8a5c; border-radius: 0 8px 8px 0; padding: 1rem 1.25rem; margin: 0 0 1.25rem; font-size: 0.9rem; color: #444; line-height: 1.6; }
        .gc-cta { text-align: center; margin-top: 2rem; }
        .gc-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 700; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .gc-cta-primary { background: #3b6978; color: #fff; }
        .gc-cta-secondary { background: #f5f5f5; color: #204051; border: 1px solid #ddd; }
        @media (max-width: 600px) {
          .gc-toc-grid { grid-template-columns: 1fr; max-height: 220px; }
        }
      `}} />

      <main className="gc-page">
        <div className="gc-toc">
          <h2>Jump to a course</h2>
          <div className="gc-toc-grid">
            {courses.map((c) => (
              <a key={c.slug} href={`#${c.slug}`}>
                {c.course_name}
              </a>
            ))}
          </div>
        </div>

        <p style={{ fontSize: '1rem', lineHeight: 1.7, color: '#444', marginBottom: '1.5rem' }}>
          From championship resort layouts to small-town nines, Montana offers golf at high elevation, along rivers, and in the shadow of the Rockies.
          This directory lists every course in our dataset with coordinates, hole counts, designers where known, and quick links to directions and town profiles.
        </p>

        <div className="gc-note">
          <strong>Sources &amp; updates:</strong> Course facts are compiled from the Montana State Golf Association directory and supplementary research.
          Hours, fees, and guest policies change — call ahead or check the course website before you visit.
        </div>

        <DirectoryMap
          items={mapItems}
          categoryColors={CATEGORY_COLORS}
          categoryLabels={CATEGORY_LABELS}
          height="420px"
        />

        {categoryOrder.map((key) => {
          const list = byCategory[key];
          if (!list?.length) return null;
          const label = CATEGORY_LABELS[key] || key;
          return (
            <section key={key}>
              <h2 className="gc-section-title">
                ⛳ {label} <span className="gc-section-count">({list.length})</span>
              </h2>
              {list.map((c) => (
                <CourseCard key={c.slug} c={c} />
              ))}
            </section>
          );
        })}

        <div className="gc-cta">
          <Link href="/guides/hot-springs-guide/" className="gc-cta-primary">
            Montana Hot Springs Guide
          </Link>
          <Link href="/guides/skiing-guide/" className="gc-cta-secondary">
            Skiing Guide
          </Link>
          <Link href="/guides/state-parks-guide/" className="gc-cta-secondary">
            State Parks Guide
          </Link>
          <Link href="/montana-towns/" className="gc-cta-secondary">
            Browse all towns
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const dataPath = path.join(process.cwd(), 'data', 'golf-courses.json');
  const coordsPath = path.join(process.cwd(), 'data', 'town-coordinates.json');
  const rawFile = JSON.parse(fs.readFileSync(dataPath, 'utf8')) as {
    metadata?: { date_compiled?: string };
    courses: RawCourse[];
  };
  const coords = JSON.parse(fs.readFileSync(coordsPath, 'utf8')) as Record<string, { name?: string }>;

  const withSlugs = assignUniqueSlugs(rawFile.courses);
  const courses: GolfCourse[] = withSlugs.map((c) => {
    const townSlug = townSlugForCity(c.city);
    return {
      ...c,
      townSlug,
      townInSite: Boolean(coords[townSlug]),
      categoryKey: courseCategoryKey(c.course_type),
    };
  });

  courses.sort((a, b) => a.course_name.localeCompare(b.course_name));

  const compiledDate = rawFile.metadata?.date_compiled || '2026-04-06';

  return {
    props: {
      courses,
      totalCount: courses.length,
      compiledDate,
    },
  };
};
