// Plain-data blog post manifest — mirrors routes.js on purpose (same rationale:
// scripts/prerender.js imports this under plain Node, so it must stay free of
// JSX/component imports). App.jsx/BlogIndexPage.jsx map slugs to their actual
// JSX bodies separately in pages/blog/posts/.
export const BLOG_INDEX_ROUTE = {
  path: '/blog',
  navLabel: 'Blog',
  title: 'Blog — Mandi & APMC Market Data Guides | Mandi Price API',
  description: 'Developer guides to Indian mandi price APIs, Agmarknet, e-NAM, data freshness, Python examples and farmer voice agents.',
  changefreq: 'weekly',
  priority: '0.7'
};

export const BLOG_POSTS = [
  {
    path: '/blog/agmarknet-api-alternative',
    title: 'Agmarknet API Key: How to Get Mandi Price Data in India',
    description: 'Agmarknet mandi prices reach developers through data.gov.in, which needs a free API key. How to get one, or use a keyless API for 5 states.',
    date: '2026-08-06',
    updated: '2026-10-13',
    keywords: ['agmarknet api key', 'agmarknet api', 'is agmarknet api free', 'mandi price api'],
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/apmc-mandi-price-data-guide',
    title: "APMC Mandi Price Data in India: A Developer's Guide (2026)",
    description: 'What APMC mandi price data actually is, which states and commodities are covered, and how to query it programmatically — a complete reference for developers.',
    date: '2026-08-06',
    keywords: ['apmc price data api', 'apmc mandi price api india', 'mandi price data'],
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/data-gov-in-vs-mandi-api',
    title: 'data.gov.in API Key for Mandi Prices vs. a Keyless API',
    description: 'How the data.gov.in mandi price API works: API key signup, resource ID, pagination and fields, compared side by side with a keyless alternative.',
    date: '2026-08-06',
    keywords: ['data.gov.in api key', 'data gov in agmarknet api', 'data.gov.in mandi price api key'],
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/agmarknet-2-api',
    title: 'Agmarknet 2.0 API: What Developers Can Use',
    description: 'What Agmarknet 2.0 changed, what public API documentation exists, and the supported ways to request Indian mandi prices.',
    date: '2026-10-14',
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/mandi-price-api-python',
    title: 'Mandi Price API with Python: A Working Example',
    description: 'Fetch Indian mandi prices with Python, check arrival dates, and handle timeouts, empty results, multiple markets and stale data.',
    date: '2026-10-14',
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/agmarknet-vs-enam',
    title: 'Agmarknet vs e-NAM: Mandi Price Data Explained',
    description: 'Understand the difference between Agmarknet price reporting and e-NAM trading, and which data source this API actually uses.',
    date: '2026-10-14',
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/mandi-price-data-freshness',
    title: 'Why Mandi Price API Data Can Be Out of Date',
    description: 'A real ingestion incident shows why API uptime is different from price freshness and how to check each market report date.',
    date: '2026-10-14',
    changefreq: 'monthly',
    priority: '0.6'
  },
  {
    path: '/blog/mandi-price-voice-agent',
    title: 'Mandi Price API for Farmer Voice Agents',
    description: 'Add a dated mandi-price lookup tool to a farmer voice agent, with checks for ambiguous markets, stale records and API failures.',
    date: '2026-10-14',
    changefreq: 'monthly',
    priority: '0.6'
  }
];
