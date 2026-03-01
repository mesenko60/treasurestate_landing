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
        answer: 'Missoula offers strong schools through Missoula County Public Schools, serving about 9,000 students with an 85% graduation rate and $12,100 per-pupil spending. The University of Montana provides cultural and educational resources. With 383 recreation sites within 50 miles and a walkable downtown, families find abundant activities year-round.',
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
  bozeman: {
    hubIntro: `Bozeman sits in the Gallatin Valley of southwestern Montana, home to 58,000 residents and Montana State University. Whether you're considering a move or planning a visit, this guide covers everything you need to know — from <a href="/montana-towns/bozeman/cost-of-living/">housing costs</a> and <a href="/montana-towns/bozeman/jobs/">job opportunities</a> to <a href="/montana-towns/bozeman/hiking/">hiking trails</a> and a <a href="/montana-towns/bozeman/weekend-itinerary/">weekend itinerary</a> for first-time visitors.\n\nBozeman is one of the fastest-growing cities in Montana, driven by its proximity to Yellowstone National Park (48 miles), two ski areas — Bridger Bowl and Big Sky Resort — and a booming tech and professional services sector. The city combines a walkable downtown centered on Main Street with immediate access to the Bridger Mountains, Gallatin River, and Hyalite Canyon. With 233 recreation sites within 50 miles and a nationally recognized university, Bozeman draws outdoor enthusiasts, entrepreneurs, and families seeking Montana's quality of life.\n\nBelow you'll find a complete profile including cost of living data, school information, climate details, and housing market trends. For deeper coverage, explore our dedicated guides.`,
    guides: [
      {
        topic: 'cost-of-living',
        title: 'Cost of Living',
        h1: 'Cost of Living in Bozeman, Montana',
        metaTitle: 'Cost of Living in Bozeman, Montana (2026) | Treasure State',
        metaDescription: 'What does it cost to live in Bozeman? Median home value $703K, rent $2,114/mo, income $79,903. Affordability ratios and how Bozeman compares statewide.',
        description: 'A detailed breakdown of what it costs to live in Bozeman — housing, income, affordability, and how it compares to the rest of Montana.',
        icon: '💰',
      },
      {
        topic: 'housing',
        title: 'Housing Market',
        h1: 'Bozeman, Montana Housing Market',
        metaTitle: 'Bozeman, Montana Housing Market (2026) | Treasure State',
        metaDescription: 'Bozeman housing market data: median home value $703K, 339 active listings, 6.3% inventory increase YoY. Zillow trends, rental rates, and market analysis.',
        description: 'Current housing market data for Bozeman including home values, rental rates, inventory trends, and market analysis.',
        icon: '🏠',
      },
      {
        topic: 'jobs',
        title: 'Jobs & Economy',
        h1: 'Jobs & Economy in Bozeman, Montana',
        metaTitle: 'Jobs & Economy in Bozeman, Montana (2026) | Treasure State',
        metaDescription: 'Bozeman job market: 3.1% unemployment, job score 9.2/10, led by education & healthcare (26.5%). Major employers, tech growth, and workforce data.',
        description: "Bozeman's job market by the numbers — top industries, a 3.1% unemployment rate, major employers, and economic outlook.",
        icon: '💼',
      },
      {
        topic: 'schools',
        title: 'Schools & Education',
        h1: 'Schools in Bozeman, Montana',
        metaTitle: 'Schools in Bozeman, Montana — K-12 & University Guide | Treasure State',
        metaDescription: 'Guide to Bozeman schools: Bozeman Public Schools (8,500 students, 93% graduation rate), Montana State University, and per-pupil spending of $11,800.',
        description: 'Guide to Bozeman schools from K-12 through Montana State University, including enrollment, graduation rates, and spending.',
        icon: '🎓',
      },
      {
        topic: 'hiking',
        title: 'Hiking & Trails',
        h1: 'Hiking Near Bozeman, Montana',
        metaTitle: 'Best Hiking Near Bozeman, Montana — Trails & Routes | Treasure State',
        metaDescription: '42 trailheads near Bozeman from Hyalite Canyon to the Bridger Ridge. Trail distances, difficulty, and seasonal recommendations.',
        description: 'The best hiking trails near Bozeman — from Hyalite Canyon and the Bridger Ridge to backcountry wilderness routes.',
        icon: '🥾',
      },
      {
        topic: 'fishing',
        title: 'Fishing',
        h1: 'Fishing Near Bozeman, Montana',
        metaTitle: 'Fishing Near Bozeman, Montana — Rivers, Access & Guide | Treasure State',
        metaDescription: 'Fly fishing near Bozeman on the Gallatin, Madison, and Yellowstone rivers. Blue-ribbon trout water, access sites, and seasonal guide.',
        description: 'World-class fly fishing near Bozeman on the Gallatin, Madison, and Yellowstone rivers — three of Montana\'s finest trout streams.',
        icon: '🎣',
      },
      {
        topic: 'weekend-itinerary',
        title: 'Weekend Itinerary',
        h1: 'A Weekend in Bozeman, Montana',
        metaTitle: 'Weekend in Bozeman, Montana — 3-Day Itinerary | Treasure State',
        metaDescription: 'How to spend a weekend in Bozeman: Main Street, Museum of the Rockies, Hyalite Canyon, Bridger Bowl, and local breweries. A 3-day itinerary.',
        description: 'How to spend a weekend in Bozeman — a day-by-day guide covering downtown, outdoor adventures, and local culture.',
        icon: '📅',
      },
    ],
    faqs: [
      {
        question: 'What is the cost of living in Bozeman, Montana?',
        answer: "Bozeman's median household income is $79,903 with a median home value of $703,092 (Zillow, January 2026). The affordability ratio of 8.8 makes Bozeman one of Montana's most expensive cities. Median rent is $2,114 per month. Home values rank in the 93rd percentile among Montana towns. Montana has no state sales tax, which provides some offset on daily expenses.",
      },
      {
        question: 'What are winters like in Bozeman?',
        answer: "Bozeman winters are cold and snowy, typical of a mountain valley at 4,826 feet. January averages a high of 35\u00B0F and a low of 17\u00B0F. The Gallatin Valley receives significant snowfall, making it ideal for skiing at Bridger Bowl (12 miles) or Big Sky Resort (32 miles). Temperature inversions can settle into the valley during prolonged cold spells.",
      },
      {
        question: 'Is Bozeman a good place for families?',
        answer: "Bozeman offers excellent schools through Bozeman Public Schools, serving 8,500 students with a 93% graduation rate and $11,800 per-pupil spending. Montana State University provides cultural and educational enrichment. With 233 recreation sites within 50 miles, two ski areas, and a safe walkable downtown, families find Bozeman highly livable.",
      },
      {
        question: 'What outdoor recreation is near Bozeman?',
        answer: "Bozeman has 233 recreation sites within 50 miles, including 42 trailheads, 69 lakes, 4 wilderness areas, and 2 ski areas (Bridger Bowl and Big Sky). Hyalite Canyon offers hiking, ice climbing, and reservoir fishing 10 miles south. Yellowstone National Park's north entrance is 48 miles away. The Gallatin River provides world-class fly fishing.",
      },
      {
        question: 'How far is Bozeman from Yellowstone National Park?',
        answer: "Bozeman is 48 miles from Yellowstone's north entrance at Gardiner (about 1 hour via US-89 South) and 71 miles from the west entrance at West Yellowstone (about 1.5 hours via US-191). The drive south through the Gallatin Canyon is one of Montana's most scenic routes, following the Gallatin River through a narrow mountain canyon.",
      },
      {
        question: 'When is the best time to visit Bozeman?',
        answer: "Summer (June\u2013August) is peak season with highs of 71\u201382\u00B0F, long days, and access to Yellowstone. Winter (December\u2013March) draws skiers to Bridger Bowl and Big Sky. Fall (September\u2013October) offers warm days, fewer crowds, and fall colors. Spring is cool and muddy but brings early hiking on lower trails.",
      },
      {
        question: 'What are the main industries in Bozeman?',
        answer: "Education and healthcare is Bozeman's largest employment sector at 26.5%, anchored by Montana State University and Bozeman Health Deaconess Hospital. Professional services (14.6%) and retail (12.9%) round out the top three. The unemployment rate is 3.1% — well below the national average — with a job score of 9.2 out of 10.",
      },
      {
        question: 'Is Bozeman a good place to retire?',
        answer: "Bozeman offers retirees access to excellent healthcare through Bozeman Health, cultural amenities via MSU, and year-round outdoor recreation. However, home values rank in the 93rd percentile for Montana, making it one of the state's most expensive markets. Montana's lack of a state sales tax and moderate property taxes provide some financial relief.",
      },
      {
        question: 'What is the housing market like in Bozeman?',
        answer: "As of January 2026, Bozeman's median home value is $703,092 (Zillow) with 339 homes for sale. Inventory has increased 6.3% year-over-year. The median list price is $744,100. Median rent is $2,114 per month, ranking in the 94th percentile among Montana towns. The vacancy rate across 24,846 total housing units is 6.9%.",
      },
      {
        question: 'Can you fly into Bozeman?',
        answer: "Yes, Bozeman Yellowstone International Airport (BZN) is Montana's busiest airport, offering daily flights to major hubs including Denver, Seattle, Salt Lake City, Minneapolis, Dallas, and Los Angeles. The airport is about 8 miles northwest of downtown. Bozeman is also accessible via I-90 and US-191.",
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
