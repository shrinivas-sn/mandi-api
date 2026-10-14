# Project status

Single running log — update in place each session, don't fork new files or append
without pruning stale lines. This is the primary source `/recap` reads for "where
things stand." Trimmed lines go to `DOCS/WORK/archive.md`.

Project/worktree: `E:\mandi-api` (repo `shrinivas-sn/mandi-api`, branch `main`). Last updated 14/10/2026.

## Current state
- Frontend `frontend/` (React + Vite, prerendered per route for SEO). Backend `backend/` on Render, data in Supabase (separate account, not connected to Claude).
- **Daily ingest fails from GitHub Actions.** Since about 09/10 runners get `UND_ERR_CONNECT_TIMEOUT` to data.gov.in, while a request from India worked on 13/10; the network cause is unconfirmed. A manual `npm run ingest` from the owner's PC on 13/10 saved 6,435 rows (data now 13/10). The 25/09–12/10 gap stays.
- The ingest used to swallow errors and exit 0, so Actions showed green with 0 records saved. Since `e5e7891` it logs the network cause and exits 1, so runs stay red until data.gov.in recovers. It catches up on its own after that.
- Stale-data UI (frontend only, no backend change): home rate-board notice plus a navbar pill (`DataFreshness.jsx`) shown only when the newest `arrival_date` is more than 3 days old (`STALE_AFTER_DAYS` in `frontend/src/utils.js`). The pill checks one state (Maharashtra).
- Navbar (`ae88009`) has no width breakpoints: `useFitMode` in `Navbar.jsx` measures what fits and picks a mode (`wide`, `links`, `menu`, `tight`), which sets the pill label (full date, "Prices 24 Sept", date only) and the hamburger. "API Live" moves into the menu when collapsed. Owner checked mobile on the live site: looks good.
- Mobile: sideways overflow fixed on all 8 routes (probe: 32/32 pass at 320, 390, 768 and 844 landscape). Root cause: `.container` auto margins inside the flex column let `<main>` grow to its widest code line.
- SEO plan `seo/plan.md` is owner-approved (05/10/2026). The Agmarknet 2.0 API post is built; per-state "mandi price today" pages remain planned (each must show its own live data). The mandi prices dataset page is deferred until bulk export exists.
- Brief for `/` is drafted at `seo/briefs/home.md`, awaiting owner approval.
- SEO pass 13/10 (see `WORK/2026-10-13`): Agmarknet post retitled for "agmarknet api key", home "Guides" links, meta trimmed. `verify-seo --dist`: 0 errors, 3 warnings (home title/description kept on purpose: best CTR).
- SEO content 14/10 (see `WORK/2026-10-14`): five new posts cover Agmarknet 2.0, Python, Agmarknet versus e-NAM, data freshness and voice agents. Eight posts total; internal links and article Open Graph metadata added. Production build prerenders 13 routes; five new routes passed 320/390px checks. Extracted examples passed syntax and live API checks; voice handler passed 16 edge cases.
- Search Console (13/10): 3 of 8 pages indexed; 5 "Discovered - currently not indexed". No conflict with shrinivasn.com (all canonicals self-referencing).

## Pending
- Move the daily ingest to an Indian IP (e.g. self-hosted GitHub runner on the owner's PC); GitHub-hosted runners can't reach data.gov.in.
- Owner: Request indexing in Search Console for the 5 previously uncrawled pages and the new posts after deployment.
- Owner: link shrinivasn.com/blog/mandi-api to `/docs` and `/playground`; its "365-day purge" claim is not built.
- `seo/plan.md` and `seo/briefs/home.md` are tracked in this public repo; owner to untrack.
- Remaining SEO work: owner approval for `seo/briefs/home.md`; per-state live-data pages; older-page and playground briefs.
- Show HN and r/developersIndia drafts exist but are not posted. Space them out, not the same day.
- Mobile probe findings not fixed (no layout break): footer text 12.8–13.6px, logo `<img>` has no width/height, animations ignore reduced motion, docs sidebar is 83% of the height in phone landscape.
- `DOCS/CONTEXT/FUTURE-PLAN.md`: 30-day retention cap counted from the newest `arrival_date` (not today), more states, bulk export, query caching.
- `/v1/commodities` returned only 4 items (7 for Maharashtra) on 05/10; real crop count unconfirmed.

## Next up (start here)
1. Decide how the daily ingest runs from India (self-hosted runner or other); until then run `npm run ingest` in `backend/` by hand.
2. Re-export Search Console Performance ~27/10 into `seo/data/` and compare with `seo/data/perf-2026-10-13/`.
3. Confirm the five new posts on the deployed site, then monitor indexing; prepare the planned per-state live-data pages after the home brief decision.
