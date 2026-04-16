import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';
import AppInstallCTA from '../../components/AppInstallCTA';

const url = 'https://treasurestate.com/events/';
const title = 'Montana Events & Festivals 2026 — Annual Calendar';
const desc = 'The complete guide to Montana\'s best annual events and festivals — from the Sweet Pea Festival in Bozeman to the Montana Folk Festival in Butte. Plan your visit around Montana\'s biggest celebrations.';

type Event = {
  name: string;
  town: string;
  townSlug: string;
  month: string;
  description: string;
};

const featuredEvents: Event[] = [
  { name: 'Sweet Pea Festival', town: 'Bozeman', townSlug: 'bozeman', month: 'August', description: 'Three-day arts and music festival in Lindley Park featuring live performances, art exhibits, and family activities.' },
  { name: 'Montana Folk Festival', town: 'Butte', townSlug: 'butte', month: 'July', description: 'Free outdoor music festival, one of the largest in the Northwest, celebrating traditional and contemporary folk music.' },
  { name: 'Whitefish Winter Carnival', town: 'Whitefish', townSlug: 'whitefish', month: 'February', description: 'Parade, snow sculptures, and ski events at Whitefish Mountain Resort celebrating winter in Big Sky Country.' },
  { name: 'Little Bighorn Days', town: 'Hardin', townSlug: 'hardin', month: 'June', description: 'Reenactment of the Battle of Little Bighorn with period costumes, parades, and historical education.' },
  { name: 'Crow Fair', town: 'Crow Agency', townSlug: 'hardin', month: 'August', description: 'One of the largest Native American gatherings in North America featuring traditional dancing, rodeo, and culture.' },
  { name: 'Livingston Roundup Rodeo', town: 'Livingston', townSlug: 'livingston', month: 'July', description: 'PRCA-sanctioned rodeo held July 4th weekend with parade and traditional western festivities.' },
  { name: 'Missoula Marathon', town: 'Missoula', townSlug: 'missoula', month: 'July', description: 'One of the most scenic road races in the country running through the beautiful Bitterroot Valley.' },
  { name: 'Red Ants Pants Music Festival', town: 'White Sulphur Springs', townSlug: 'white-sulphur-springs', month: 'July', description: 'Country and roots music on the Montana prairie supporting women in agriculture and rural communities.' },
  { name: 'Montana State Fair', town: 'Great Falls', townSlug: 'great-falls', month: 'August', description: 'Largest annual fair in the state featuring rodeo, carnival, concerts, and agricultural exhibits.' },
  { name: 'Glacier Jazz Stampede', town: 'Kalispell', townSlug: 'kalispell', month: 'October', description: 'Jazz festival across multiple Flathead Valley venues featuring traditional and contemporary jazz.' },
  { name: 'Helena Vigilante Parade', town: 'Helena', townSlug: 'helena', month: 'May', description: 'One of Montana\'s oldest parades celebrating the state\'s mining heritage and vigilante history.' },
  { name: 'Miles City Bucking Horse Sale', town: 'Miles City', townSlug: 'miles-city', month: 'May', description: 'Legendary rodeo and wild horse sale, a Montana tradition since 1914.' },
  { name: 'Rendezvous Cross Country Ski Race', town: 'West Yellowstone', townSlug: 'west-yellowstone', month: 'March', description: 'One of the oldest Nordic ski races in the US held at the Rendezvous Ski Trails.' },
  { name: 'Beartooth Rally', town: 'Red Lodge', townSlug: 'red-lodge', month: 'June', description: 'Motorcycle rally along the scenic Beartooth Highway, one of America\'s most dramatic drives.' },
  { name: 'Flathead Lake Cherry Festival', town: 'Polson', townSlug: 'polson', month: 'July', description: 'Celebrates the Flathead Valley cherry harvest with food, music, and family activities.' },
  { name: 'Havre Festival Days', town: 'Havre', townSlug: 'havre', month: 'July', description: 'Community festival with parade, carnival, entertainment, and celebration of Hi-Line heritage.' },
  { name: 'Bigfork Summer Playhouse', town: 'Bigfork', townSlug: 'bigfork', month: 'June–August', description: 'Professional summer theater in a lakeside village featuring Broadway-style productions.' },
  { name: 'Bozeman Ice Festival', town: 'Bozeman', townSlug: 'bozeman', month: 'January', description: 'Ice climbing competition, clinics, and film screenings at Hyalite Canyon.' },
  { name: 'Dillon Jaycee Rodeo', town: 'Dillon', townSlug: 'dillon', month: 'July', description: 'Traditional small-town Montana rodeo held July 4th weekend with PRCA-sanctioned events.' },
  { name: 'Lewistown Art Center Harvest Show', town: 'Lewistown', townSlug: 'lewistown', month: 'October', description: 'Juried art show in the heart of Montana featuring regional artists and craftspeople.' },
];

export default function EventsPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Events & Festivals', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description: desc,
    url,
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://treasurestate.com/' },
        { '@type': 'ListItem', position: 2, name: 'Events & Festivals', item: url },
      ],
    },
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{`${title} | Treasure State`}</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Montana events, Montana festivals, Sweet Pea Festival, Montana Folk Festival, Montana State Fair, Crow Fair, Montana rodeo, Montana music festivals, things to do Montana" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero title="Montana Events & Festivals" subtitle="Annual Calendar 2026" image="/images/hero-image.jpg" alt="Montana festival celebration" small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .events-page { max-width: 1000px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .events-intro { font-size: 1.05rem; line-height: 1.7; color: #333; margin-bottom: 2rem; }
        .events-section-title { font-family: var(--font-primary); font-size: 1.4rem; color: #204051; margin: 2.5rem 0 1rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .events-table { width: 100%; border-collapse: collapse; font-size: 0.92rem; margin: 1rem 0 2rem; }
        .events-table th, .events-table td { padding: 0.75rem 1rem; border: 1px solid #e8ede8; text-align: left; }
        .events-table th { background: #f8faf8; font-weight: 600; color: #204051; font-family: var(--font-primary); }
        .events-table tr:hover { background: #fafcfa; }
        .events-table td:first-child { font-weight: 600; color: #204051; }
        .events-table a { color: #3b6978; text-decoration: none; }
        .events-table a:hover { text-decoration: underline; }
        .events-season { background: #f8f9fa; border-radius: 10px; padding: 1.5rem; margin: 1.5rem 0; }
        .events-season h3 { font-family: var(--font-primary); font-size: 1.1rem; color: #204051; margin: 0 0 0.75rem; }
        .events-season p { font-size: 0.95rem; line-height: 1.6; color: #444; margin: 0; }
        .events-cta { text-align: center; margin-top: 2.5rem; padding: 2rem; background: linear-gradient(135deg, #f8faf8 0%, #eef3ee 100%); border-radius: 12px; }
        .events-cta-title { font-family: var(--font-primary); font-size: 1.25rem; color: #204051; margin: 0 0 0.5rem; }
        .events-cta-text { font-size: 0.95rem; color: #555; margin: 0 0 1.25rem; }
        .events-cta a { display: inline-block; padding: 0.75rem 1.75rem; border-radius: 8px; font-weight: 600; font-family: var(--font-primary); font-size: 0.95rem; text-decoration: none; margin: 0 0.5rem 0.5rem; }
        .events-cta-primary { background: #3b6978; color: #fff; }
        .events-cta-secondary { background: #fff; color: #204051; border: 1px solid #ddd; }
        @media (max-width: 700px) {
          .events-table { font-size: 0.82rem; }
          .events-table th, .events-table td { padding: 0.5rem 0.6rem; }
        }
      `}} />

      <main className="events-page">
        <p className="events-intro">
          Montana's event calendar runs year-round — from winter ski festivals and ice climbing competitions to summer rodeos, music festivals, and fall harvest celebrations. Whether you're planning around a specific event or looking to discover what's happening during your visit, this guide covers the state's biggest annual gatherings.
        </p>

        <h2 className="events-section-title">Featured Annual Events</h2>
        <div style={{ overflowX: 'auto' }}>
          <table className="events-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Town</th>
                <th>Month</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {featuredEvents.map((event, i) => (
                <tr key={i}>
                  <td>{event.name}</td>
                  <td><Link href={`/montana-towns/${event.townSlug}/`}>{event.town}</Link></td>
                  <td>{event.month}</td>
                  <td>{event.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 className="events-section-title">Events by Season</h2>

        <div className="events-season">
          <h3>Winter (December – February)</h3>
          <p>
            Montana's winter event season centers on skiing and outdoor adventure. The <strong>Whitefish Winter Carnival</strong> kicks off February with snow sculptures, parades, and ski events. <strong>Bozeman Ice Festival</strong> draws ice climbers from across the region to Hyalite Canyon. Smaller communities host snowmobile rallies, cross-country ski races, and holiday markets throughout the season.
          </p>
        </div>

        <div className="events-season">
          <h3>Spring (March – May)</h3>
          <p>
            Spring brings the <strong>Rendezvous Cross Country Ski Race</strong> in West Yellowstone and the <strong>Helena Vigilante Parade</strong> celebrating Montana's mining heritage. The legendary <strong>Miles City Bucking Horse Sale</strong> in May marks the start of rodeo season. Many towns host opening-day celebrations for fishing season and early-season farmers markets.
          </p>
        </div>

        <div className="events-season">
          <h3>Summer (June – August)</h3>
          <p>
            Summer is peak festival season. <strong>Crow Fair</strong> in August is one of the largest Native American gatherings in North America. The <strong>Montana Folk Festival</strong> in Butte and <strong>Sweet Pea Festival</strong> in Bozeman draw tens of thousands. July 4th brings rodeos across the state including <strong>Livingston Roundup</strong> and <strong>Dillon Jaycee Rodeo</strong>. The <strong>Montana State Fair</strong> in Great Falls caps the summer season.
          </p>
        </div>

        <div className="events-season">
          <h3>Fall (September – November)</h3>
          <p>
            Fall brings harvest festivals and art shows. The <strong>Glacier Jazz Stampede</strong> in Kalispell celebrates traditional jazz across Flathead Valley venues. <strong>Lewistown Art Center Harvest Show</strong> showcases regional artists. Many communities host Oktoberfest celebrations, harvest dinners featuring local produce, and hunting-season kickoff events.
          </p>
        </div>

        <div style={{ maxWidth: '480px', margin: '2rem auto 0' }}>
          <AppInstallCTA
            variant="card"
            headline="Never Miss a Montana Landmark"
            body="Get alerted to historic sites, hot springs, and trails as you drive through Montana."
          />
        </div>

        <div className="events-cta">
          <h3 className="events-cta-title">Planning Your Montana Trip?</h3>
          <p className="events-cta-text">
            Explore town profiles, compare communities, and find the perfect base for your Montana adventure.
          </p>
          <Link href="/montana-towns/" className="events-cta-primary">Browse All Towns</Link>
          <Link href="/lodging/" className="events-cta-secondary">Find Lodging</Link>
        </div>

        <p style={{ fontSize: '0.78rem', color: '#555', fontStyle: 'italic', textAlign: 'center', marginTop: '2rem' }}>
          Event dates and details reflect 2026 information compiled from Montana Office of Tourism and local event organizers.
          Always verify current dates and details with official event websites before planning your trip.
        </p>
      </main>
      <Footer />
    </>
  );
}
