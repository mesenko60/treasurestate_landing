import Head from 'next/head';
import Header from '../../components/Header';
import Hero from '../../components/Hero';
import AffiliateBanner from '../../components/AffiliateBanner';
import ComingSoon from '../../components/ComingSoon';
import Footer from '../../components/Footer';
import TableOfContents from '../../components/TableOfContents';

export default function GeologyOfWesternMontana() {
  return (
    <>
      <Head>
        <title>Geology of Western Montana - Treasure State</title>
        <meta name="description" content="Explore the fascinating geological history of Western Montana, from ancient seas to glacial landscapes and tectonic forces that shaped the region." />
        <meta name="keywords" content="Montana geology, Western Montana, glacial Lake Missoula, Rocky Mountains, geology of Montana, tectonic plates, glaciers, geological history" />
      </Head>
      <Header />
      <Hero
        title="Geology of Western Montana"
        subtitle="The Bones of the Earth"
        image="/images/hero-image.jpg"
        alt="Scenic view of Western Montana's landscape"
        small
      />
      <main style={{ display: 'flex', gap: '40px', maxWidth: '1200px', margin: '0 auto', padding: '0 20px', position: 'relative' }}>
        <div style={{ display: 'none' }} className="toc-desktop">
          <TableOfContents contentSelector=".content-section" />
        </div>
        <style dangerouslySetInnerHTML={{__html: `
          @media (min-width: 1024px) {
            .toc-desktop {
              display: block !important;
              width: 300px;
              flex-shrink: 0;
            }
          }
        `}} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <section className="content-section">
            <h2>Western Montana's Geological Story</h2>
          <p>There is something about this country that gets into a person's bones, literally, as it turns out, for the bones of the earth itself tell the most remarkable story you could imagine, if you know how to read the stone scripture written across western Montana's face. I have spent the better part of my life trying to decipher the handwriting of this landscape, and what I have learned is that every ridge and gulch, every towering peak and gentle valley, speaks to us of time beyond human reckoning and forces that dwarf our prairie-bound imaginations.</p>
          
          <h3>Ancient Seas and Mountain Building</h3>
          <p>Stand anywhere in western Montana, say, on the bench above the Bitterroot Valley with your back to the Sapphire Mountains and your face turned toward the jagged teeth of the Bitterroots themselves, and you are looking at a geological autobiography written in stone, a tale that begins not thousands but millions upon millions of years ago, when this entire region lay beneath ancient seas and the very notion of Montana was nothing but cosmic dust waiting to be gathered. The Bitterroot Valley itself is a prime example of how these ancient forces shaped the land we see today.</p>
          
          <p>The story begins, as all good Montana stories should, with water. Not the water we know today, rushing down from snowfields and pooling in beaver ponds, but primordial seas that covered this entire region some 600 million years ago. The Belt Supergroup, as the geologists have dubbed it with their penchant for grandiose names, represents the accumulation of sediments in those ancient waters--layer upon layer of sand and mud and organic matter settling to the bottom like the slowest snowfall imaginable, building up over millions of years into rock formations that now stand thousands of feet thick.</p>
          
          <h3>Tectonic Forces at Work</h3>
          <p>But oceans, like everything else in Montana, don't stay put forever. The great tectonic forces that govern this planet had other plans for our corner of creation. Beginning around 170 million years ago, the western edge of North America began to collide with oceanic plates moving in from what we now call the Pacific. Picture, if you will, two massive sheets of ice grinding against each other on a spring river, except these "sheets" were portions of the earth's crust hundreds of miles across and dozens of miles thick, moving at the stately pace of inches per year but carrying the accumulated momentum of geological ages.</p>
          
          <p>The result of this collision was mountain-building on a scale that humbles the human imagination. The overthrust belt that runs through western Montana is the scar tissue of this ancient collision, where older rocks were literally shoved up and over younger ones, creating the peculiar geological situation where you can climb a mountain and find yourself walking on rocks that are older at the top than at the bottom, a reversal of the natural order that would confuse anyone trying to read the landscape without understanding the tremendous forces at work.</p>
          
          <h3>The Ice Age Legacy</h3>
          <p>The most dramatic example of erosive processes came during the Ice Ages, when massive glaciers repeatedly advanced and retreated across the northern Rocky Mountains. The last great ice sheet reached its maximum extent only about 20,000 years ago, practically yesterday in geological terms, and its effects are written clearly across the landscape for anyone willing to read the evidence.</p>
          
          <p>Glacier National Park, despite its name, shows us not so much the work of present-day glaciers as the monumental sculpture left behind by their predecessors. Those perfect U-shaped valleys, like the one that holds Lake McDonald, were carved by rivers of ice hundreds of feet thick, grinding their way through solid rock with the patient persistence that only geological time allows. The knife-edge ridges, the hanging valleys with their spectacular waterfalls, the countless alpine lakes scattered like jewels across the high country, all of these are the signature of glacial erosion on a landscape originally built by tectonic collision. Similar features can be seen throughout the Mission Mountains and Bitterroot Mountains.</p>
          
          <h3>Glacial Lake Missoula</h3>
          <p>Perhaps no single geological event has left a more dramatic signature on western Montana's landscape than the story of glacial Lake Missoula and the catastrophic floods that repeatedly drained it. This tale, which reads like something from the realm of mythology but is written clearly in the geological record, helps explain some of the most puzzling features of our regional landscape, particularly in the Bitterroot Valley and surrounding areas.</p>
          
          <p>During the last Ice Age, a lobe of the massive Cordilleran ice sheet advanced southward from Canada, creating a natural dam across the Clark Fork River near the present-day town of Sandpoint, Idaho. Behind this ice dam, water began to accumulate, forming a lake that eventually covered much of western Montana, including the areas that are now Missoula, Hamilton, and St. Ignatius. This body of water would have made our present-day Flathead Lake look like a farm pond by comparison.</p>
          
          <h3>Reading the Landscape</h3>
          <p>Understanding this deep history changes the way a person sees the landscape. That innocent-looking meadow might be the site of an ancient lakebed, filled with sediments from some long-vanished glacier. Those seemingly random boulders scattered across a hillside could be glacial erratics, carried there by ice sheets from quarries dozens of miles away. The very soil beneath our feet represents millions of years of patient weathering, the slow transformation of solid rock into the medium that supports all terrestrial life.</p>
          
          <p>There is something both humbling and liberating about this geological perspective. Humbling because it places human concerns in the context of almost unimaginable spans of time, liberating because it reveals the landscape around us to be not a static backdrop but an ongoing story of which we are a part. The rocks beneath our feet have traveled farther and seen more than any human explorer, and they carry within themselves the history not just of Montana but of the planet itself.</p>
          
          <p>This is the true wealth of western Montana, not the gold and copper that drew the first prospectors, not even the scenic beauty that draws tourists today, but this deeper story of planetary process and geological time that makes us part of something infinitely larger and older and more wonderful than our brief human concerns. It is a story written in stone, but it speaks to the heart as much as to the mind, reminding us that we belong to this place in ways we are only beginning to understand.</p>
        </section>
        <AffiliateBanner />
        <ComingSoon />
        </div>
      </main>
      <Footer />
    </>
  );
}
