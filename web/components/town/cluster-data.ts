export type ClusterGuide = {
  topic: string;
  title: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  description: string;
  icon: string;
};

export type ClusterFAQ = {
  question: string;
  answer: string;
};

export type ClusterConfig = {
  hubIntro: string;
  guides: ClusterGuide[];
  faqs: ClusterFAQ[];
};

export const clusterConfigs: Record<string, ClusterConfig> = {
  missoula: {
    hubIntro: `Missoula sits at the confluence of five valleys in western Montana, home to 77,757 residents and the University of Montana. Whether you're weighing a move or planning a visit, this guide covers everything you need to know\u2009—\u2009from <a href="/montana-towns/missoula/cost-of-living/">housing costs</a> and <a href="/montana-towns/missoula/jobs/">job opportunities</a> to <a href="/montana-towns/missoula/hiking/">hiking trails</a> and a <a href="/montana-towns/missoula/weekend-itinerary/">weekend itinerary</a> for first-time visitors.\n\nKnown as The Garden City for its lush riverside setting, Missoula is western Montana's largest city and a regional center for healthcare, education, and outdoor recreation. The Clark Fork River runs through downtown, Snowbowl ski area is 12 miles away, and the Rattlesnake Wilderness begins just 5 miles from the city limits. With 383 recreation sites within 50 miles and a vibrant cultural scene anchored by the university, Missoula consistently ranks among Montana's most livable communities.\n\nBelow you'll find a complete profile including cost of living data, school information, climate details, and housing market trends. For deeper coverage, explore our dedicated guides.`,
    guides: [
      {
        topic: 'cost-of-living',
        title: 'Cost of Living',
        h1: 'Cost of Living in Missoula, Montana',
        metaTitle: 'Cost of Living in Missoula, Montana (2026) | Treasure State',
        metaDescription: 'What does it cost to live in Missoula? Median income, home values, rent, affordability ratios, and how Missoula compares to the rest of Montana.',
        description: 'A detailed breakdown of what it costs to live in Missoula\u2009—\u2009housing, income, affordability, and how it compares to the rest of Montana.',
        icon: '\uD83D\uDCB0',
      },
      {
        topic: 'housing',
        title: 'Housing Market',
        h1: 'Missoula, Montana Housing Market',
        metaTitle: 'Missoula, Montana Housing Market (2026) | Treasure State',
        metaDescription: 'Missoula housing market data: median home value $547K, 369 active listings, 15% inventory increase YoY. Zillow trends, rental rates, and market analysis.',
        description: 'Current housing market data for Missoula including home values, rental rates, inventory trends, and market analysis.',
        icon: '\uD83C\uDFE0',
      },
      {
        topic: 'jobs',
        title: 'Jobs & Economy',
        h1: 'Jobs & Economy in Missoula, Montana',
        metaTitle: 'Jobs & Economy in Missoula, Montana (2026) | Treasure State',
        metaDescription: 'Missoula job market: 4.7% unemployment, 13 industry sectors led by education & healthcare (26.2%). Major employers, workforce data, and economic outlook.',
        description: "Missoula's job market by the numbers\u2009—\u2009top industries, employment rates, major employers, and economic outlook.",
        icon: '\uD83D\uDCBC',
      },
      {
        topic: 'schools',
        title: 'Schools & Education',
        h1: 'Schools in Missoula, Montana',
        metaTitle: 'Schools in Missoula, Montana \u2014 K-12 & University Guide | Treasure State',
        metaDescription: 'Guide to Missoula schools: Missoula County Public Schools (9,000 students, 85% graduation rate), University of Montana, and per-pupil spending of $12,100.',
        description: 'Guide to Missoula schools from K-12 through the University of Montana, including enrollment, graduation rates, and spending.',
        icon: '\uD83C\uDF93',
      },
      {
        topic: 'hiking',
        title: 'Hiking & Trails',
        h1: 'Hiking Near Missoula, Montana',
        metaTitle: 'Best Hiking Near Missoula, Montana \u2014 Trails & Routes | Treasure State',
        metaDescription: '90 trailheads near Missoula from the iconic M Trail to Rattlesnake Wilderness. Trail distances, difficulty, and seasonal recommendations.',
        description: 'The best hiking trails near Missoula\u2009—\u2009from the iconic M Trail to backcountry wilderness routes, with distances and difficulty.',
        icon: '\uD83E\uDD7E',
      },
      {
        topic: 'fishing',
        title: 'Fishing',
        h1: 'Fishing Near Missoula, Montana',
        metaTitle: 'Fishing Near Missoula, Montana \u2014 Rivers, Access & Guide | Treasure State',
        metaDescription: 'Fly fishing near Missoula on the Clark Fork, Blackfoot, and Bitterroot rivers. 44 fishing access sites, species, seasons, and river guide.',
        description: 'World-class fly fishing near Missoula on the Clark Fork, Blackfoot, and Bitterroot rivers, plus 44 fishing access sites.',
        icon: '\uD83C\uDFA3',
      },
      {
        topic: 'weekend-itinerary',
        title: 'Weekend Itinerary',
        h1: 'A Weekend in Missoula, Montana',
        metaTitle: 'Weekend in Missoula, Montana \u2014 3-Day Itinerary | Treasure State',
        metaDescription: 'How to spend a weekend in Missoula: downtown exploration, river trails, hiking, local breweries, and where to stay. A 3-day Missoula itinerary.',
        description: 'How to spend a weekend in Missoula\u2009—\u2009a day-by-day guide covering downtown, outdoor adventures, and local culture.',
        icon: '\uD83D\uDCC5',
      },
    ],
    faqs: [
      {
        question: 'What is the cost of living in Missoula, Montana?',
        answer: "Missoula's median household income is $65,329 with a median home value of $547,072 (Zillow, January 2026). The affordability ratio of 8.4 means housing costs are high relative to income. Median rent is $1,526 per month. Missoula ranks in the 88th percentile for home values among Montana towns, making it one of the state's more expensive places to live.",
      },
      {
        question: 'What are winters like in Missoula?',
        answer: "Missoula winters are cold but moderate by Montana standards. January averages a high of 36\u00B0F and a low of 20\u00B0F. The city receives about 40 inches of snow annually, less than many mountain towns. The five-valleys location provides some wind protection but can trap cold air, creating temperature inversions during prolonged cold snaps.",
      },
      {
        question: 'Is Missoula a good place for families?',
        answer: 'Missoula offers strong schools through Missoula County Public Schools, serving about 9,000 students with an 85% graduation rate and $12,100 per-pupil spending. The University of Montana provides cultural and educational resources. With 457 recreation sites nearby and a walkable downtown, families find abundant activities year-round.',
      },
      {
        question: 'What outdoor recreation is near Missoula?',
        answer: 'Missoula has 383 recreation sites within 50 miles, including 90 trailheads, 44 fishing access sites, 8 wilderness areas, and 6 state parks. The Rattlesnake Wilderness begins just 5 miles from downtown. Snowbowl ski area is 12 miles away. The Clark Fork, Blackfoot, and Bitterroot rivers offer world-class fly fishing.',
      },
      {
        question: 'When is the best time to visit Missoula?',
        answer: "Summer (June\u2013August) offers the best weather with average highs of 74\u201387\u00B0F and minimal rain. Fall brings crisp air, fall colors, and smaller crowds. Winter visitors come for Snowbowl skiing and cross-country trails. Spring is cool and wet but wildflowers emerge by late May.",
      },
      {
        question: 'How far is Missoula from Glacier National Park?',
        answer: "Missoula is approximately 150 miles south of Glacier National Park's west entrance, about a 2.5-hour drive via US-93 North. The drive passes through the Flathead Valley and offers views of Flathead Lake, the largest natural freshwater lake west of the Mississippi.",
      },
      {
        question: 'What are the main industries in Missoula?',
        answer: "Education and healthcare is Missoula's largest employment sector at 26.2%, anchored by the University of Montana and several major hospitals. Professional services (14.1%) and tourism and hospitality (13.8%) round out the top three. The unemployment rate is 4.7% with labor force participation at 72.6%.",
      },
      {
        question: 'Is Missoula a good place to retire?',
        answer: "Missoula offers retirees access to quality healthcare, cultural amenities, and exceptional outdoor recreation. The moderate climate by Montana standards and walkable downtown are draws. However, housing costs rank in the 88th percentile for Montana, which may challenge fixed-income budgets. Montana has no state sales tax.",
      },
      {
        question: 'What is the housing market like in Missoula?',
        answer: "As of January 2026, Missoula's median home value is $547,072 (Zillow) with 369 homes for sale. Inventory has increased 15% year-over-year, giving buyers more options. The median list price is $598,333. The vacancy rate across 36,310 total housing units is 6.5%.",
      },
      {
        question: 'Can you fly into Missoula?',
        answer: 'Yes, Missoula Montana Airport (MSO) offers daily flights to major hubs including Denver, Seattle, Salt Lake City, Minneapolis, and Portland. The airport is about 5 miles northwest of downtown. Missoula is also accessible via I-90 and US-93.',
      },
    ],
  },
};

export function getClusterConfig(slug: string): ClusterConfig | null {
  return clusterConfigs[slug] || null;
}

export function hasCluster(slug: string): boolean {
  return slug in clusterConfigs;
}
