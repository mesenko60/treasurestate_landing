import Head from 'next/head';
import Header from '../components/Header';
import Hero from '../components/Hero';
import AffiliateBanner from '../components/AffiliateBanner';
import ComingSoon from '../components/ComingSoon';
import Footer from '../components/Footer';

export default function Home() {
  return (
    <>
      <Head>
        <title>Treasure State - Explore the Wonders of Montana</title>
        <meta
          name="description"
          content="Discover the meaning of 'Treasure State' and explore upcoming travel planners for Montana's backroads, hot springs, and the Bitterroot Valley. Your adventure in Montana starts here."
        />
        <meta
          name="keywords"
          content="Montana, Treasure State, Montana Travel, Big Sky Country, Montana Backroads, Montana Hot Springs, Bitterroot Valley, Expedia, AdSense, Travel Planner"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'Montana - The Treasure State',
              alternateName: ['Treasure State', 'TreasureState'],
              url: 'https://treasurestate.com/',
            }),
          }}
        />
      </Head>
      <Header />
      <Hero
        title="Welcome to the Treasure State"
        subtitle="Discover the unparalleled beauty and rich history of Montana"
        image="/images/hero-image.jpg"
        alt="Scenic Montana Landscape - The Treasure State"
      />
      <main>
        <section id="description" className="content-section">
          <h2>What Does "Treasure State" Mean?</h2>
          <p>
            Montana, often referred to as "The Treasure State," earned this evocative nickname due to its immense wealth of
            natural resources, particularly its rich mineral reserves that have played a pivotal role in its history and
            development. The story of this nickname is deeply intertwined with the dramatic era of westward expansion,
            lawlessness, and the allure of gold and silver that drew prospectors and settlers to its rugged landscapes. Learn
            more about this era in the <a href="/Information/story-of-montana-vigilantes.html" className="mining-link">Story of the
            Montana Vigilantes</a>.
          </p>
          <p>
            The origins of "The Treasure State" moniker can be traced back to the mid-1800s, a period marked by significant
            mineral discoveries across the mountainous regions of what would eventually become Montana. The first substantial
            <a href="/Information/mining-history-of-montana.html" className="mining-link">gold strikes</a> occurred in the early
            1860s, igniting a rush of fortune-seekers to areas like Bannack, Virginia City, and Helena. These discoveries were
            not isolated incidents but rather the beginning of a sustained period of <a href="/Information/mining-history-of-montana.html" className="mining-link">mining activity</a> that would unearth vast
            quantities of <a href="/Information/mining-history-of-montana.html" className="mining-link">gold</a>, <a href="/Information/mining-history-of-montana.html" className="mining-link">silver</a>, <a href="/Information/mining-history-of-montana.html" className="mining-link">copper</a>, lead, zinc, manganese, and coal. The sheer abundance and variety of these mineral
            deposits solidified Montana's reputation as a land of hidden riches, a veritable treasure chest waiting to be
            unlocked.
          </p>
          <p>
            The state's motto, "Oro y Plata," which is Spanish for "Gold and Silver," further underscores the historical
            significance of these precious metals to Montana's identity and economy. This motto, adopted in 1865, even before
            Montana officially became a state in 1889, reflects the profound impact that mining had on the territory's early
            growth and character. Towns grew rapidly around mining operations, and the wealth extracted from the earth fueled
            the development of infrastructure, commerce, and communities.
          </p>
          <p>
            Beyond gold and silver, Montana's geological bounty extends to other valuable resources. The state is also known for
            its sapphires, particularly the Yogo sapphire, which is prized for its unique cornflower blue color and exceptional
            clarity. These gemstones add another layer to the "treasure" aspect of Montana's nickname, highlighting not just its
            industrial minerals but also its precious and semi-precious stones. <a href="/Information/geology-of-western-montana.html" className="mining-link">Learn more about Montana's fascinating geological history</a> and how it
            shaped the state's mineral wealth.
          </p>
          <p>
            While the initial boom centered on precious metals, the discovery and exploitation of <a href="/Information/mining-history-of-montana.html" className="mining-link">copper</a>, especially in the <a href="/montana-towns/butte.html" className="mining-link">Butte</a> area, proved to be of even greater long-term economic significance.
            <a href="/montana-towns/butte.html" className="mining-link">Butte</a>, known as <a href="/Information/mining-history-of-montana.html" className="mining-link">"The Richest Hill on Earth"</a>, became a global center for <a href="/Information/mining-history-of-montana.html" className="mining-link">copper production</a>, powering the electrical revolution of the late 19th and early 20th centuries. The immense wealth generated from <a href="/Information/mining-history-of-montana.html" className="mining-link">copper mining</a> further
            cemented Montana's status as "The Treasure State," a place where the earth yielded fortunes that shaped not only the
            state's destiny but also contributed significantly to the industrial development of the nation.
          </p>
          <p>
            In essence, "The Treasure State" is more than just a catchy phrase; it is a testament to Montana's extraordinary
            <a href="/Information/geology-of-western-montana.html" className="mining-link">geological heritage</a> and the profound impact of its mineral wealth on its history, culture, and economy. It speaks to a legacy of exploration, discovery, and the enduring allure of the treasures hidden within its majestic mountains and expansive plains.
          </p>
        </section>
        <AffiliateBanner />
        <ComingSoon />
      </main>
      <Footer />
    </>
  );
}
