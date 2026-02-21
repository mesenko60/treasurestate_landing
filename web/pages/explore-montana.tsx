import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AffiliateBanner from '../components/AffiliateBanner';
import ComingSoon from '../components/ComingSoon';
import Footer from '../components/Footer';

export default function ExploreMontana() {
  return (
    <>
      <Head>
        <title>Explore Montana - Treasure State</title>
        <meta name="description" content="Explore Montana: Discover upcoming features and adventures on Treasure State." />
      </Head>
      <Header />
      <Hero
        title="Explore Montana"
        subtitle="Discover upcoming features and adventures"
        image="/images/hero-image.jpg"
        alt="Scenic Montana Landscape - The Treasure State"
        small
      />
      <main>
        <AffiliateBanner />
        <ComingSoon />
      </main>
      <Footer />
    </>
  );
}
