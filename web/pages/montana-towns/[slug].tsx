import Head from 'next/head';
import type { GetStaticPaths, GetStaticProps } from 'next';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import AffiliateBanner from '../../components/AffiliateBanner';
import Footer from '../../components/Footer';
import { getTownList, getTownNameFromSlug } from '../../lib/towns';
import { readTownMarkdownByTownName } from '../../lib/markdown';

type Props = {
  slug: string;
  townName: string;
  contentHtml: string;
  description: string;
};

export default function TownPage({ slug, townName, contentHtml, description }: Props) {
  const title = `${townName}, Montana`;
  return (
    <>
      <Head>
        <title>{title} - Treasure State</title>
        <meta name="description" content={description || `${townName} travel guide: history, things to do, lodging and more.`} />
      </Head>
      <Header />
      <Hero
        title={title}
        subtitle="A Montana Community"
        image={`/images/towns/${slug}.jpg`}
        alt={`${townName} - Scenic View`}
        small
      />
      <main>
        <article className="content-section" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        <AffiliateBanner />
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
  const description = md?.excerpt || `${townName} travel guide: history, things to do, lodging and more.`;
  return { props: { slug, townName, contentHtml, description } };
};
