import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import AffiliateBanner from '../../components/AffiliateBanner';
import Footer from '../../components/Footer';
import Schema from '../../components/Schema';
import Breadcrumbs from '../../components/Breadcrumbs';
import NearbyTowns from '../../components/NearbyTowns';
import TableOfContents from '../../components/TableOfContents';
import { getTownList, getTownNameFromSlug, getRelatedTowns } from '../../lib/towns';
import { readTownMarkdownByTownName, AEOData } from '../../lib/markdown';

type Props = {
  slug: string;
  townName: string;
  contentHtml: string;
  description: string;
  aeoData: AEOData | null;
  relatedTowns: { name: string; slug: string }[];
};

export default function TownPage({ slug, townName, contentHtml, description, aeoData, relatedTowns }: Props) {
  const title = `${townName}, Montana - Complete Travel Guide & Things to Do`;
  const metaDesc = description || `Discover ${townName}, Montana. Explore top attractions, outdoor activities, history, and where to stay in ${townName}. Your ultimate travel guide.`;
  const url = `https://treasurestate.com/montana-towns/${slug}/`;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://treasurestate.com/' },
    { name: 'Cities and Towns', url: 'https://treasurestate.com/Montana-towns/' },
    { name: townName, url: url }
  ];

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        
        {/* OpenGraph / Social Meta Tags */}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={`https://treasurestate.com/images/towns/${slug}.jpg`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={metaDesc} />
        <meta name="twitter:image" content={`https://treasurestate.com/images/towns/${slug}.jpg`} />
      </Head>

      <Schema townName={townName} slug={slug} description={metaDesc} aeoData={aeoData || undefined} />

      <Header />
      
      <Breadcrumbs items={breadcrumbItems} />

      <Hero
        title={townName}
        subtitle="A Montana Community"
        image={`/images/towns/${slug}.jpg`}
        alt={`${townName} - Scenic View`}
        small
      />
      
      <main style={{ display: 'flex', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
        <style dangerouslySetInnerHTML={{__html: `
          .toc-desktop {
            display: none;
          }
          @media (min-width: 1024px) {
            .toc-desktop {
              display: block;
              width: 300px;
              flex-shrink: 0;
            }
          }
        `}} />
        <div className="toc-desktop">
          <TableOfContents contentSelector=".content-section" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <article className="content-section" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          <NearbyTowns towns={relatedTowns} />
          <AffiliateBanner />
        </div>
      </main>
      
      <Footer />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const towns = getTownList();
  const paths = towns.map(t => ({ params: { slug: t.slug } }));
  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = String(ctx.params?.slug);
  const townName = getTownNameFromSlug(slug);
  const md = await readTownMarkdownByTownName(townName);
  
  const contentHtml = md?.contentHtml || `<h2>About ${townName}</h2><p>Content coming soon.</p>`;
  const description = md?.excerpt || '';
  const aeoData = md?.aeoData || null;
  
  // Try to use the specifically parsed nearby destinations from the markdown file first.
  // If the markdown file doesn't have any, fall back to our deterministic algorithm.
  let relatedTowns = [];
  if (md?.nearbyDestinations && md.nearbyDestinations.length > 0) {
    const allTowns = getTownList();
    relatedTowns = md.nearbyDestinations.map(name => {
      const match = allTowns.find(t => t.name.toLowerCase() === name.toLowerCase());
      return match ? { name: match.name, slug: match.slug } : null;
    }).filter(Boolean) as { name: string; slug: string }[];
    
    // If we only found 1 or 2 valid ones, pad it out with the fallback algorithm so it looks full
    if (relatedTowns.length < 3) {
      const fallbacks = getRelatedTowns(slug, 3);
      for (const fallback of fallbacks) {
        if (relatedTowns.length >= 3) break;
        if (!relatedTowns.find(t => t.slug === fallback.slug)) {
          relatedTowns.push(fallback);
        }
      }
    }
  } else {
    relatedTowns = getRelatedTowns(slug, 3);
  }

  return { props: { slug, townName, contentHtml, description, aeoData, relatedTowns } };
};
