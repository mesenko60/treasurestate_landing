import Head from 'next/head';
import Link from 'next/link';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import Breadcrumbs from '../../components/Breadcrumbs';
import Footer from '../../components/Footer';

const url = 'https://treasurestate.com/guides/fly-fishing-rivers/';
const title = 'Montana Fly Fishing Rivers: A Deep Dive';
const desc = 'Detailed guides to the Madison, Bitterroot, Big Hole, Gallatin, Yellowstone, Flathead, and Missouri Rivers. History, geography, species, and conservation.';

export default function FlyFishingRivers() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Travel Guides', url: '/planners' },
    { name: 'Fly Fishing Guide', url: '/guides/fly-fishing-guide/' },
    { name: 'Rivers Deep Dive', url },
  ];

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: desc,
    url,
    author: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
    datePublished: '2026-01-15T00:00:00-07:00',
    dateModified: '2026-03-14T00:00:00-07:00',
    publisher: { '@type': 'Organization', name: 'Treasure State', url: 'https://treasurestate.com' },
  };

  return (
    <>
      <Head>
        <link rel="canonical" href={url} />
        <title>{title} | Treasure State</title>
        <meta name="description" content={desc} />
        <meta name="keywords" content="Madison River, Bitterroot River, Big Hole River, Gallatin River, Yellowstone River, Flathead River, Missouri River, Montana trout fishing, Montana fly fishing rivers" />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={desc} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content="https://treasurestate.com/images/hero-image.jpg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </Head>
      <Header />
      <Hero title="Montana Fly Fishing Rivers" subtitle="A Deep Dive Into Legendary Waters" image="/images/hero-image.jpg" alt="Montana trout rivers" small />
      <Breadcrumbs items={breadcrumbs} />

      <style dangerouslySetInnerHTML={{ __html: `
        .ffr-page { max-width: 900px; margin: 0 auto; padding: 1.5rem 1rem 3rem; }
        .ffr-section-title { font-family: var(--font-primary); font-size: 1.3rem; color: #204051; margin: 2rem 0 0.5rem; padding-bottom: 0.5rem; border-bottom: 2px solid #e0e0e0; }
        .ffr-toc { background: #f8faf8; border-radius: 10px; padding: 1.25rem 1.5rem; margin-bottom: 2rem; border: 1px solid #e8ede8; }
        .ffr-toc h2 { font-size: 1rem; margin: 0 0 0.75rem; color: #204051; }
        .ffr-toc a { font-size: 0.9rem; color: #3b6978; text-decoration: none; display: block; padding: 0.2rem 0; }
        .ffr-toc a:hover { text-decoration: underline; }
        .ffr-back { font-size: 0.9rem; margin-bottom: 1.5rem; }
      `}} />

      <main className="ffr-page">
        <p className="ffr-back">
          <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', textDecoration: 'none', fontWeight: 500 }}>← Back to Fly Fishing Guide</Link>
        </p>

        <p style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#333', marginBottom: '1.5rem' }}>
          This deep dive covers Montana&rsquo;s most iconic trout rivers: their origins, history, species, and what makes each one unique. For the broader story of Montana fly fishing—including early techniques, Glacier and Yellowstone, and the Skwala hatch—see our <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', fontWeight: 600 }}>Fly Fishing Guide</Link>.
        </p>

        <nav className="ffr-toc" aria-label="Table of contents">
          <h2>Jump to a River</h2>
          <a href="#madison-river">Madison River</a>
          <a href="#bitterroot-river">Bitterroot River</a>
          <a href="#big-hole-river">Big Hole River</a>
          <a href="#gallatin-river">Gallatin River</a>
          <a href="#yellowstone-river">Yellowstone River</a>
          <a href="#flathead-river">Flathead River</a>
          <a href="#missouri-river">Missouri River</a>
          <a href="#alpine-lakes">Alpine Lakes</a>
          <a href="#westslope-cutthroat">Westslope Cutthroat Trout</a>
        </nav>

        <h2 id="madison-river" className="ffr-section-title">Madison River: A Foundational Trout River</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The Madison River begins at the confluence of the Firehole and Gibbon Rivers in Yellowstone National Park. From there it flows roughly 183 miles through Montana before joining the Jefferson and Gallatin Rivers at Three Forks to form the Missouri River.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The river&rsquo;s fishing reputation developed early. By the late nineteenth century, anglers traveling to Yellowstone were already noting the Madison&rsquo;s trout fishing. In 1896 the U.S. Fish Commission began stocking brown trout in parts of the watershed, supplementing the native cutthroat populations already present in the upper basin.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Today the Madison is divided into several distinct sections for anglers. The &ldquo;50-mile riffle&rdquo; between Hebgen Lake and Quake Lake is one of the best-known trout fisheries in the American West. Downstream sections near <Link href="/montana-towns/ennis/">Ennis</Link> support strong populations of rainbow and brown trout. The river joins the Jefferson and Gallatin at <Link href="/montana-towns/three-forks/">Three Forks</Link> to form the Missouri.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The Madison Valley&rsquo;s open landscape and steady flows have helped make the river one of Montana&rsquo;s most consistent trout fisheries for more than a century.
        </p>

        <h2 id="bitterroot-river" className="ffr-section-title">The Bitterroot River and the Valley It Shaped</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The Bitterroot River flows north through the <Link href="/guides/bitterroot-valley/">Bitterroot Valley</Link> of western Montana before joining the Clark Fork River near <Link href="/montana-towns/missoula/">Missoula</Link>. The river is formed by the confluence of the East Fork and West Fork near the town of Conner.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Lewis and Clark passed through the Bitterroot Valley in 1805 while traveling west toward the Pacific. Their journals describe the region&rsquo;s abundant wildlife and extensive river systems.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The Bitterroot River supports populations of rainbow trout, brown trout, mountain whitefish, and native westslope cutthroat trout. Spring runoff from the surrounding mountains creates high flows in May and June, followed by lower, clearer water during summer and early fall.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The river remains one of western Montana&rsquo;s most accessible trout fisheries and is a central feature of the Bitterroot Valley&rsquo;s outdoor recreation economy.
        </p>

        <h2 id="big-hole-river" className="ffr-section-title">The Big Hole River and Montana&rsquo;s Arctic Grayling</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The Big Hole River begins in the Beaverhead Mountains of southwestern Montana and flows north for about 150 miles before joining the Beaverhead River near <Link href="/montana-towns/twin-bridges/">Twin Bridges</Link>.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The river is notable for supporting one of the last remaining populations of fluvial Arctic grayling in the contiguous United States. Grayling once occurred widely across parts of Montana but declined in many rivers during the twentieth century.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The Big Hole&rsquo;s broad valleys, willow-lined banks, and cold water provide habitat for several fish species including brown trout, rainbow trout, and mountain whitefish.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The river is also historically significant. In 1877 the Battle of the Big Hole occurred along its banks during the Nez Perce War.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Today the Big Hole River remains both an important trout fishery and a focal point for conservation efforts aimed at preserving native Arctic grayling.
        </p>

        <h2 id="gallatin-river" className="ffr-section-title">Gallatin River: From Yellowstone to the Missouri</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The Gallatin River originates in Yellowstone National Park and flows north through Gallatin Canyon before entering the Gallatin Valley near <Link href="/montana-towns/bozeman/">Bozeman</Link>. It eventually joins the Jefferson and Madison Rivers at <Link href="/montana-towns/three-forks/">Three Forks</Link>.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Named for U.S. Treasury Secretary Albert Gallatin by the Lewis and Clark Expedition, the river drains a large portion of the northern Yellowstone ecosystem.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The Gallatin is known for its fast currents and rocky channel. These conditions create extensive riffle habitat that supports populations of rainbow trout, brown trout, and mountain whitefish.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The river gained wider public recognition after being featured in Norman Maclean&rsquo;s book <em>A River Runs Through It</em>, which described fly fishing traditions in Montana.
        </p>

        <h2 id="yellowstone-river" className="ffr-section-title">Yellowstone River: The Longest Undammed River in the Lower 48</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The Yellowstone River begins in Yellowstone National Park and flows roughly 692 miles before joining the Missouri River in North Dakota.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          It is widely recognized as the longest undammed river in the contiguous United States. This uninterrupted flow allows fish to move freely throughout large sections of the watershed.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The upper Yellowstone River supports one of the largest remaining populations of Yellowstone cutthroat trout. Downstream stretches in Montana—including <Link href="/planners/corridors/paradise_valley/">Paradise Valley</Link> from <Link href="/montana-towns/livingston/">Livingston</Link> to Gardiner—are also known for rainbow trout and brown trout.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Because of its size and diversity of habitats, the Yellowstone River supports a wide range of recreation including fishing, floating, and wildlife viewing.
        </p>

        <h2 id="flathead-river" className="ffr-section-title">The Flathead River System in Northwest Montana</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The Flathead River drains a large portion of northwest Montana and southern British Columbia. Its three main forks—the North Fork, Middle Fork, and South Fork—join near <Link href="/montana-towns/columbia-falls/">Columbia Falls</Link>.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The Middle Fork forms the southwestern boundary of Glacier National Park, while the North Fork runs along the park&rsquo;s western edge.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          These rivers are known for clear water and relatively intact ecosystems. Native westslope cutthroat trout remain an important species throughout much of the basin.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The Flathead watershed also supports bull trout, a federally listed threatened species that requires cold, connected river systems.
        </p>

        <h2 id="missouri-river" className="ffr-section-title">Missouri River Trout Fishing in Montana</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The Missouri River begins at the confluence of the Jefferson, Madison, and Gallatin Rivers at <Link href="/montana-towns/three-forks/">Three Forks</Link>, Montana.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Downstream from Holter Dam near Craig (see <Link href="/montana-towns/cascade/">Cascade</Link> and <Link href="/montana-towns/helena/">Helena</Link> for access), the river supports one of the most productive trout fisheries in the United States. Cold water releases from upstream reservoirs create stable temperatures and abundant insect life.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          This stretch of river is especially well known for large mayfly and caddis hatches that attract fly anglers from across the country.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          The Missouri River corridor also supports significant populations of bald eagles, pelicans, and other wildlife.
        </p>

        <h2 id="alpine-lakes" className="ffr-section-title">Montana&rsquo;s High-Elevation Fishing Lakes</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          Montana&rsquo;s mountain ranges contain thousands of small alpine lakes formed by glaciers during the last Ice Age. Many of these lakes were historically fishless due to natural barriers that prevented fish migration.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Beginning in the early twentieth century, state and federal agencies stocked trout in many of these waters to create recreational fisheries.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Species commonly found in alpine lakes include cutthroat trout, rainbow trout, brook trout, and golden trout (in some locations).
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Today many remote lakes remain accessible only by hiking or horseback travel, preserving a sense of wilderness for anglers willing to reach them.
        </p>

        <h2 id="westslope-cutthroat" className="ffr-section-title">Westslope Cutthroat Trout: Montana&rsquo;s Native Trout</h2>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444' }}>
          The westslope cutthroat trout is native to the Columbia River basin, including much of western Montana.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          These trout historically occupied thousands of miles of streams throughout the region. Over time their range declined due to habitat changes and competition with introduced species.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Conservation programs now focus on protecting remaining populations and restoring habitat where possible.
        </p>
        <p style={{ fontSize: '0.98rem', lineHeight: 1.7, color: '#444', marginTop: '1rem' }}>
          Westslope cutthroat trout are easily recognized by the red slash marks beneath the lower jaw that give the species its name.
        </p>

        <div style={{ marginTop: '2.5rem', padding: '1.25rem', background: '#f8faf8', borderRadius: '8px', border: '1px solid #e8ede8', textAlign: 'center' }}>
          <Link href="/guides/fly-fishing-guide" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
            ← Back to Fly Fishing Guide
          </Link>
          <span style={{ margin: '0 0.5rem', color: '#ccc' }}>|</span>
          <Link href="/best-of/best-fishing-towns" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
            10 Best Towns for Fly Fishing
          </Link>
          <span style={{ margin: '0 0.5rem', color: '#ccc' }}>|</span>
          <Link href="/guides/hot-springs-guide" style={{ color: '#3b6978', fontWeight: 600, textDecoration: 'none' }}>
            Hot Springs Guide
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
