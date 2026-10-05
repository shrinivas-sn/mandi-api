# STATUS archive

Lines moved verbatim out of `DOCS/STATUS.md` when they were resolved or trimmed.

## 05/10/2026

From "Current state":
- Latest SEO commit `413043a`:
  - one meta description per page
  - real `dist/404.html`; catch-all rewrite removed from `vercel.json`
  - og:image / twitter:image on every page
  - Playground, Docs, Status page titles are `<h1>`
  - `postbuild` runs `scripts/verify-seo.mjs` (9 errors before, 0 after)
- Checked 05/10/2026 — Vercel deploy of `4107482` succeeded (commit status `success`), so the `postbuild` SEO check passed.
- Checked 05/10/2026 — `public-apis/public-apis` PR #6789 is merged. Other open PRs there (#7589, #7590) belong to other projects.

From "Pending":
- Unrelated to SEO (`DOCS/CONTEXT/FUTURE-PLAN.md`): 1-year data retention purge in `ingest.js`, more states, bulk CSV/JSON export, in-memory query caching.

From "Next steps":
None planned for the SEO work. The unrelated items under Pending are the only open work.
