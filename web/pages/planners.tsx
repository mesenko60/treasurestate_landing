import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AffiliateBanner from '../components/AffiliateBanner';
import ComingSoon from '../components/ComingSoon';
import Footer from '../components/Footer';

export default function Planners() {
  return (
    <>
      <Head>
        <title>Montana Travel Planners - Treasure State</title>
        <meta name="description" content="Plan your perfect Montana adventure with our upcoming travel planners." />
      </Head>
      <Header />
      <Hero
        title="Montana Travel Planners"
        subtitle="Plan your perfect Montana adventure"
        image="/images/hero-image.jpg"
        alt="Scenic Montana Landscape - The Treasure State"
        small
      />
      <main>
        <ComingSoon />
        <AffiliateBanner />
      </main>
      <Footer />
    </>
  );
}
