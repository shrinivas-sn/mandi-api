# Project status

Single running log — update in place each session, don't fork new files or append
without pruning stale lines. This is the primary source `/recap` reads for "where
things stand."

Project: `E:\mandi-api` (repo `shrinivas-sn/mandi-api`, branch `main`). Last updated 05/10/2026.

## Current state
- Frontend `frontend/` (React + Vite, prerendered per route for SEO). Backend `backend/`.
- SEO work is merged to `main`; `redesign-seo-mobile` is deleted (local and remote).
- Latest SEO commit `413043a`:
  - one meta description per page
  - real `dist/404.html`; catch-all rewrite removed from `vercel.json`
  - og:image / twitter:image on every page
  - Playground, Docs, Status page titles are `<h1>`
  - `postbuild` runs `scripts/verify-seo.mjs` (9 errors before, 0 after)
- Earlier SEO work is in `git log`: robots/sitemap/JSON-LD, SITE_URL fix, `og:site_name`, Organization JSON-LD, `/blog` (3 articles), GSC verification file, mobile layout fixes.
- Architecture and build docs are in `DOCS/CONTEXT/`. `FRONTEND.md` is current with the 404 page, `verify-seo.mjs`, and the removed `vercel.json`.
- Checked 05/10/2026 — Vercel deploy of `4107482` succeeded (commit status `success`), so the `postbuild` SEO check passed.
- Checked 05/10/2026 — `public-apis/public-apis` PR #6789 is merged. Other open PRs there (#7589, #7590) belong to other projects.

## Pending
- Show HN and r/developersIndia drafts exist but are not posted. Space them out, not the same day.
- Unrelated to SEO (`DOCS/CONTEXT/FUTURE-PLAN.md`): 1-year data retention purge in `ingest.js`, more states, bulk CSV/JSON export, in-memory query caching.

## Next steps
None planned for the SEO work. The unrelated items under Pending are the only open work.
