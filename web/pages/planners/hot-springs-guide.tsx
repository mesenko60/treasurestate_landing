import Head from 'next/head';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import AffiliateBanner from '../../components/AffiliateBanner';
import StoreBanner from '../../components/StoreBanner';
import Footer from '../../components/Footer';
import TableOfContents from '../../components/TableOfContents';

export default function HotSpringsGuide() {
  return (
    <>
      <Head>
        <title>Montana Hot Springs Guide - Treasure State</title>
        <meta name="description" content="A comprehensive guide to the best natural and developed hot springs across Montana. Relax and soak in the Treasure State." />
      </Head>
      <Header />
      <Hero
        title="Montana Hot Springs Guide"
        subtitle="Soak in the Treasure State's Natural Geothermal Waters"
        image="/images/hero-image.jpg"
        alt="Relaxing in a natural hot spring pool"
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
          <section className="content-section">
            <h2>The Healing Waters of Big Sky Country</h2>
            <p>Montana's rich geothermal activity, a product of its mountainous terrain and volcanic history, has gifted the state with dozens of stunning natural hot springs. Ranging from primitive backcountry pools only accessible by foot, to luxurious historic resorts, these thermal waters have been attracting travelers seeking relaxation and rejuvenation for over a century.</p>

            <h3>Chico Hot Springs (Pray, MT)</h3>
            <p>Nestled in the breathtaking Paradise Valley near Livingston, Chico Hot Springs Resort & Day Spa has been a beloved destination since 1900. This rustic yet elegant resort features two large, open-air mineral pools naturally heated by geothermal waters. Beyond the soaking, Chico is renowned for its historic fine dining room, horseback riding, dog sledding, and proximity to Yellowstone National Park.</p>

            <h3>Quinn's Hot Springs (Paradise, MT)</h3>
            <p>Located along the Clark Fork River in Western Montana, Quinn's Hot Springs Resort offers a spectacular terraced canyon setting. The resort boasts six distinct pools of varying temperatures, ranging from a brisk cold plunge to a steamy 106°F mineral bath. Known for its family-friendly atmosphere and the historic Harwood House restaurant, Quinn's is an ideal getaway year-round.</p>

            <h3>Norris Hot Springs (Norris, MT)</h3>
            <p>Often referred to as the "Water of the Gods," Norris Hot Springs is an eclectic, artsy destination just west of Bozeman. The pool itself is framed by rustic wood and features a unique geodesic dome structure over a performance stage. Visitors can soak in the 120°F water (cooled by natural artesian springs) while enjoying live music, organic food sourced from their on-site garden, and local craft beer.</p>

            <h3>Symes Hot Springs (Hot Springs, MT)</h3>
            <p>Tucked away in the quirky town of Hot Springs, Montana, the Symes Hot Springs Hotel & Mineral Baths offers a true step back in time. This historic, 1928 mission-style hotel boasts one of the few "hot artesian" flows in the world, renowned for its high mineral content and purported healing properties. The atmosphere is laid-back, vintage, and fiercely independent.</p>

            <h3>Sleeping Child Hot Springs (Bitterroot Valley)</h3>
            <p>For those seeking luxury and absolute privacy, Sleeping Child Hot Springs is a massive 25,000-square-foot resort property located deep in the Bitterroot Mountains. Available primarily as an exclusive, private rental, it features a massive multi-level pool, incredible architecture, and absolute seclusion.</p>

            <h3>Undeveloped & Natural Soaks</h3>
            <p>If resorts aren't your style, Montana also offers incredible primitive hot springs for the adventurous hiker. <strong>Boiling River</strong> (in Yellowstone, though access varies), <strong>Jerry Johnson Hot Springs</strong> (just over the border in Idaho off Highway 12), and <strong>Lolo Hot Springs</strong> backcountry pools provide rugged, natural soaking experiences surrounded completely by wilderness.</p>

            <h3>Hot Springs Etiquette</h3>
            <ul>
              <li><strong>Hydrate:</strong> Geothermal water and high altitudes can quickly cause dehydration. Bring plenty of fresh drinking water.</li>
              <li><strong>Respect the Peace:</strong> Hot springs are generally places of quiet relaxation. Keep noise to a minimum, especially in primitive pools.</li>
              <li><strong>Leave No Trace:</strong> Pack out all trash, especially if visiting undeveloped backcountry springs.</li>
              <li><strong>Check Restrictions:</strong> Some hot springs (like Boiling River) close during spring runoff for safety. Always verify accessibility before you travel.</li>
            </ul>
          </section>
          <StoreBanner />
          <AffiliateBanner />
        </div>
      </main>
      <Footer />
    </>
  );
}
