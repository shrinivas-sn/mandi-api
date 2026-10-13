// Plain-data blog post manifest — mirrors routes.js on purpose (same rationale:
// scripts/prerender.js imports this under plain Node, so it must stay free of
// JSX/component imports). App.jsx/BlogIndexPage.jsx map slugs to their actual
// JSX bodies separately in pages/blog/posts/.
export const BLOG_INDEX_ROUTE = {
  path: '/blog',
  navLabel: 'Blog',
  title: 'Blog — Mandi & APMC Market Data Guides | Mandi Price API',
  description: 'Guides on Indian mandi/APMC price data, Agmarknet, and data.gov.in — for developers building with agricultural market data.',
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
  }
];
