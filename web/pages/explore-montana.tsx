import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import StaysCTA from '../components/StaysCTA';
import ComingSoon from '../components/ComingSoon';
import Footer from '../components/Footer';

export default function ExploreMontana() {
  return (
    <>
      <Head>
        <link rel="canonical" href="https://treasurestate.com/explore-montana.html" />
        <title>Explore Montana - Treasure State</title>
        <meta name="description" content="Explore Montana: Discover upcoming features and adventures on Treasure State." />
        <meta property="og:title" content="Explore Montana - Treasure State" />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta property="og:url" content="https://treasurestate.com/explore-montana.html" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
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
        <StaysCTA />
        <ComingSoon />
      </main>
      <Footer />
    </>
  );
}
