# Brief — `/` (home)

Status: draft, awaiting owner approval. Plan row: `seo/plan.md`, approved 05/10/2026.

## Target search

mandi price api

Variants: mandi prices api, mandi market price api, live mandi price api, mandi api key,
crop price api india, agriculture market price api.

## Intent

Do. The searcher wants an API they can call. The results are a mix of live APIs, repos, and
how-to guides, so they want something usable today.

## What ranks now

Searched 05/10/2026 with the WebSearch tool, which is US-only. India-localised results may
differ. Opened the pages below.

| Result | Kind | Covers | Does not cover |
|---|---|---|---|
| https://github.com/shrinivas-sn/mandi-api | repo | This project's own repo | — |
| https://mandi-api.vercel.app/ | product page | This page, already in the results | — |
| https://dev.to/shariqmirza/i-built-a-real-time-indian-mandi-price-api-heres-how-50k9 | blog post | A hosted API, "free plan", data.gov.in source, "updates daily" | State and crop list, rate limits, docs link |
| https://github.com/kayalshri/commodityprice | repo | PHP wrapper for data.gov.in. Needs a data.gov.in key. Self-hosted | Coverage, refresh interval, setup |
| https://farmonaut.com/api-development/agmarknet-api-access-crop-prices-market-data-india | guide + product promo | 3,000+ mandis, 200+ commodities, Agmarknet | Endpoint URLs, pricing, whether a key is needed |
| https://tgkagro.com/api/ | API docs | Free, no key, two endpoints (live, history) | Which mandis and crops, rate limits, SLA |
| https://lynxbee.com/getting-real-time-indian-agricultural-commodity-market-rates-using-agmarknet-api/ | tutorial | Calling the data.gov.in API with curl and Python. Needs a key | Update frequency, typical reporting delay |

What the results show: the page type Google sees is "an API you can use", plus tutorials for
the data.gov.in route.

The opening: most pages are vague on the three things a developer checks first: whether a key
is needed, exactly which states and crops, and how fresh the data is. A page that states these
plainly, and proves them with a live call, is rare.

## What this page must add

- A live rate board that is real data fetched from the API on page load. This already exists.
- Plain, checkable facts: no key, 5 named states, rate limit (100 requests per 15 minutes per
  IP), update schedule, source (data.gov.in).
- A one-line request a reader can copy and run (`/v1/prices?state=Maharashtra&commodity=Onion`).
- The data's real date, shown on the page. See the blocker below.

## Questions to answer

Near the top, in plain text a crawler can read:

1. Is it free? Does it need an API key? (No key, no signup.)
2. Which states and crops? (5 states. Crop list: see blocker.)
3. How often is it updated? (Daily, not live. Say the time and what "latest" means.)
4. Where does the data come from? (data.gov.in, the Agmarknet dataset.)

## Blockers to settle before this page is written

These are facts I measured on 05/10/2026 from `https://mandi-api.onrender.com`. They change
what the page may claim.

1. **The data looks stale.** `/v1/prices?state=Maharashtra` returned 200 rows, all with
   `arrival_date` 2026-09-24, and `latest_fetched_at` 2026-09-24T18:43 UTC. That is 11 days
   before today. The page says "pulled daily". If the daily ingest has stopped, the copy is
   wrong today. Owner: is the ingest running, or was there an outage?
2. **The commodity count is unclear.** `/v1/commodities` returned 4 items with
   `meta.count` 4. `/v1/commodities?state=Maharashtra` returned 7. The page cannot say how many
   crops are covered until the real number is confirmed.

Neither is fixed here. I changed no code.

## Sources to check

- `frontend/src/pages/HomePage.jsx`, `frontend/src/routes.js` (current title and description)
- `DOCS/CONTEXT/FULL-API-APP.md` for the ingest schedule (8:30 PM IST, GitHub Actions, per search results; verify in the repo before quoting)
- Live API responses above, re-run before publishing
- Google structured-data docs for `SoftwareApplication` (current `offers` price is "0" in USD; check it is still valid)

## Internal links (in and out)

Out, with descriptive anchors:
- "read the API documentation" -> `/docs`
- "try it in the playground" -> `/playground`
- "check service status" -> `/status`
- "Agmarknet API alternative, and how it compares" -> `/blog/agmarknet-api-alternative`
- "how to get a data.gov.in API key" -> `/blog/data-gov-in-vs-mandi-api`

In: navbar and footer already link to `/`. The three blog posts should link back with
"mandi price API" as anchor text. Confirm when each brief is written.

## Fact-check (person, date)

Not yet. A person checks the title, description, structured data and all numbers before
publishing.
