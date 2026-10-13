// Plain-data route manifest — single source of truth for App.jsx (routing),
// Navbar.jsx (nav links), scripts/prerender.js (which routes to prerender),
// and sitemap.xml (generated from this list at build time). Keep this file
// free of JSX/component imports so plain Node can import it directly.
export const ROUTES = [
  {
    path: '/',
    navLabel: 'Overview',
    navEnd: true,
    title: 'Mandi Price API — Free Daily Agricultural Market Prices for India',
    description: 'Free, open, keyless REST API for daily Indian mandi (wholesale market) crop prices across Maharashtra, Uttar Pradesh, Punjab, Madhya Pradesh, and Karnataka. Sourced from data.gov.in.',
    changefreq: 'daily',
    priority: '1.0'
  },
  {
    path: '/playground',
    navLabel: 'Playground',
    title: 'Interactive API Playground | Mandi Price API',
    description: 'Test live Mandi Price API requests in your browser: pick a state, market and crop, see the JSON, chart the price trend, and copy curl, JS, Python or Go.',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    path: '/docs',
    navLabel: 'Docs',
    title: 'API Docs: Endpoints, Parameters, Examples | Mandi Price API',
    description: 'Mandi Price API reference: /v1/states, /v1/commodities, /v1/markets, /v1/prices and /v1/prices/history, with parameters, responses and error codes.',
    changefreq: 'weekly',
    priority: '0.8'
  },
  {
    path: '/status',
    navLabel: 'Status',
    title: 'Service Status & Uptime | Mandi Price API',
    description: 'Live status for the Mandi Price API — response latency, rate limit thresholds, daily ingestion pipeline health, and infrastructure specs.',
    changefreq: 'daily',
    priority: '0.5'
  }
];
