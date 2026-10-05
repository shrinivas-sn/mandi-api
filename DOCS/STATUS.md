# Project status

Single running log — update in place each session, don't fork new files or append
without pruning stale lines. This is the primary source `/recap` reads for "where
things stand." Trimmed lines go to `DOCS/WORK/archive.md`.

Project: `E:\mandi-api` (repo `shrinivas-sn/mandi-api`, branch `main`). Last updated 05/10/2026.

## Current state
- Frontend `frontend/` (React + Vite, prerendered per route for SEO). Backend `backend/` on Render, data in Supabase (separate account, not connected to Claude).
- **Data is stale since 24/09/2026.** data.gov.in's data API returns 502/504 and timeouts for every request since 25/09; checked 05/10 from India: a wrong key gets 403 in 0.5s, the real key gets 504 after 60s, on two datasets. The key is valid.
- The ingest used to swallow errors and exit 0, so Actions showed green with 0 records saved. Since `e5e7891` it logs the network cause and exits 1, so runs stay red until data.gov.in recovers. It catches up on its own after that.
- Stale-data UI (frontend only, no backend change): home rate-board notice plus a navbar pill (`DataFreshness.jsx`) shown only when the newest `arrival_date` is more than 3 days old (`STALE_AFTER_DAYS` in `frontend/src/utils.js`). The pill checks one state (Maharashtra).
- Navbar (`ae88009`) has no width breakpoints: `useFitMode` in `Navbar.jsx` measures what fits and picks a mode (`wide`, `links`, `menu`, `tight`), which sets the pill label (full date, "Prices 24 Sept", date only) and the hamburger. "API Live" moves into the menu when collapsed. Owner checked mobile on the live site: looks good.
- Mobile: sideways overflow fixed on all 8 routes (probe: 32/32 pass at 320, 390, 768 and 844 landscape). Root cause: `.container` auto margins inside the flex column let `<main>` grow to its widest code line.
- SEO plan `seo/plan.md` is owner-approved (05/10/2026), including two new pages: an Agmarknet 2.0 API post and per-state "mandi price today" pages (each must show its own live data). The mandi prices dataset page is deferred until bulk export exists.
- Brief for `/` is drafted at `seo/briefs/home.md`, awaiting owner approval.
- Last `verify-seo --live`: 8 sitemap URLs, 0 errors, 9 warnings.

## Pending
- SEO warnings (none fail the build):
  - titles over 60 chars: `/` (65), `/docs` (70), two blog posts (75 each)
  - descriptions over 160 chars: `/` (182), `/playground` (196), `/docs` (175), `/blog/data-gov-in-vs-mandi-api` (162)
  - no `lastmod` on 5 of 8 sitemap URLs: `/`, `/playground`, `/docs`, `/status`, `/blog`
- Remaining SEO briefs, in order: `/blog/agmarknet-api-alternative`, `/blog/apmc-mandi-price-data-guide`, `/blog/data-gov-in-vs-mandi-api`, `/playground`.
- Show HN and r/developersIndia drafts exist but are not posted. Space them out, not the same day.
- Mobile probe findings not fixed (no layout break): footer text 12.8–13.6px, logo `<img>` has no width/height, animations ignore reduced motion, docs sidebar is 83% of the height in phone landscape.
- `DOCS/CONTEXT/FUTURE-PLAN.md`: 30-day retention cap counted from the newest `arrival_date` (not today), more states, bulk export, query caching.
- `/v1/commodities` returned only 4 items (7 for Maharashtra) on 05/10; real crop count unconfirmed.

## Next up (start here)
1. Run `gh run list --workflow=daily-ingest.yml --limit 3` and check whether data.gov.in is back (the latest run green with records saved). If it's still red, read the logged network cause.
2. Ask the owner to approve `seo/briefs/home.md`. Home copy must not promise "daily" until data flows again.
