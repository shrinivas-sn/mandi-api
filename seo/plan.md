# SEO plan — Mandi Price API (mandi-api.vercel.app)

Evidence: Google autocomplete (`suggestqueries.google.com`, `hl=en`, `gl=in`), 05/10/2026.
"People also ask" not gathered: Google returns no results page to a plain fetch. No Search
Console or Bing CSV in `seo/data/` yet, so no row has a number.

| Page | Target search | Intent | Questions to answer | Evidence (source, date) | Status |
|---|---|---|---|---|---|
| `/` | mandi price api (variants: mandi prices api, mandi market price api, live mandi price api, mandi api key, crop price api india, agriculture market price api) | do | Is it free? Does it need an API key? Which states and crops? How often is it updated (daily, not live)? Where does the data come from? | autocomplete, 05/10/2026: "mandi price api", "live mandi price api", "mandi market price api", "mandi api key", "mandi prices api", "crop price api india", "agriculture market price api" | approved 05/10/2026 |
| `/playground` | mandi price chart | do | Can I see a price trend for one crop in one market? How far back does history go? | autocomplete, 05/10/2026: "mandi price chart" (under "mandi price data") | approved 05/10/2026 |
| `/docs` | none (branded, navigational) | find | Which endpoints exist? What parameters and errors? | — | approved 05/10/2026 |
| `/status` | none | find | Is the API up? What are the rate limits? | — | approved 05/10/2026 |
| `/blog` | none (hub that links the posts) | find | — | — | approved 05/10/2026 |
| `/blog/agmarknet-api-alternative` | agmarknet api (variants: agmarknet api key, is agmarknet api free, agmarknet data api, agmarknet gov in api, agmarknet portal api) | compare | Does Agmarknet have an API? Is it free? Does it need a key? What is the keyless alternative? | autocomplete, 05/10/2026: "agmarknet api", "agmarknet api key", "is agmarknet api free", "agmarknet data api", "agmarknet gov in api", "agmarknet portal api" | approved 05/10/2026 (retarget from "agmarknet api alternative", which autocomplete does not show) |
| `/blog/apmc-mandi-price-data-guide` | mandi price data (variants: mandi prices dataset, agmarknet mandi price data, what is mandi price) | learn | What is mandi price data? Where is the dataset? What fields does it have? | autocomplete, 05/10/2026: "mandi price data", "mandi prices dataset", "agmarknet mandi price data", "what is mandi price" | approved 05/10/2026 |
| `/blog/data-gov-in-vs-mandi-api` | data.gov.in api key (variants: data gov in agmarknet api, data gov api rate limit, data gov in api documentation) | do | How do I get a data.gov.in API key? What is its rate limit? Which dataset holds Agmarknet prices? | autocomplete, 05/10/2026: "data.gov.in api key", "data gov api key india", "data gov in agmarknet api", "data gov api rate limit", "data gov in api documentation" | approved 05/10/2026 |

## Gaps (proposed pages, owner decisions below)

| Search | Evidence | Owner decision |
|---|---|---|
| agmarknet 2.0 api — a post on what the Agmarknet 2.0 portal changed for anyone pulling its data, and whether it has an API | autocomplete, 05/10/2026: "agmarknet 2.0 api", "agmarknet 2.0 portal", "agmarknet 2.0 go-live date" | Approved 05/10/2026 |
| mandi prices dataset — a download page for bulk CSV/JSON. Depends on the bulk export endpoint in `DOCS/CONTEXT/FUTURE-PLAN.md`, which is not built | autocomplete, 05/10/2026: "mandi prices dataset", "mandi price data" | Not approved: deferred until the bulk export endpoint is built |
| mandi price today `<state>` / apmc price list today karnataka — consumer pages with today's prices per covered state. Allowed only if each page shows its own state's live data; head terms with heavy competition, and the site has no custom domain | autocomplete, 05/10/2026: "mandi prices today", "mandi price karnataka", "apmc price list today karnataka", "mandi bhav today" | Approved 05/10/2026. Condition: each page shows its own state's live data |

Approved by: owner, 05/10/2026
