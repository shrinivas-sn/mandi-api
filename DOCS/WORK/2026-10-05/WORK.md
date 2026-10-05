# 05/10/2026 — merge SEO branch work into main

<!-- Title date is DD/MM/YYYY (display). The folder name this file lives in stays
YYYY-MM-DD for correct sorting — don't rename the folder to match the title. -->
<!-- Add a matching row to DOCS/README.md the same session this file is created. -->

## Plan
Fetch origin, compare with local `main`, merge, push, and delete the finished SEO branch.

## Execution
- `main` had diverged: local `6d66aee` (DOCS restructure) vs origin `413043a` (SEO: one description per page, real 404, `verify-seo.mjs` build check). Different files, clean merge.
- Merged `origin/main` into local `main` (`4107482`) and pushed.
- `redesign-seo-mobile` was local-only and already contained in `origin/main`; deleted with `git branch -d`.
- `gh pr list --state all` returned no PRs for this repo. The PR may have been under the old `shrinusn-2` account.
- Added `DOCS/STATUS.md`, this entry, and `CONTEXT/DECISIONS.md` to complete the docs structure.
- Updated `CONTEXT/FRONTEND.md` for the 404 page, `verify-seo.mjs` and the removed `vercel.json`.

## Notes
- The merge left a merge commit rather than linear history. Rewriting it would need a force-push.
- No build was run locally. Checked afterwards via GitHub: the Vercel deploy of `4107482` succeeded.

# 05/10/2026 — stale data diagnosis, stale-data UI, mobile overflow

## Execution
- SEO plan `seo/plan.md` approved by the owner. Brief `seo/briefs/home.md` drafted.
- Found prices stuck at 24/09/2026. Actions logs: every run since 25/09 had all 5 states fail (502/504, then `fetch failed`), yet showed green.
- Fixed in `e5e7891`: `ingest.js` logs `err.cause` and exits 1 when any state saves nothing (tested with a bad key: exit 1). Home rate board shows a notice when data is more than 3 days old. FUTURE-PLAN now has a 30-day cap anchored to the newest `arrival_date`.
- Added `DataFreshness.jsx` navbar pill, hidden unless data is more than 3 days old.
- Mobile probe (`E:\dev-recipes\mobile-responsiveness\templates\probe.js`, 8 routes x 4 viewports): sideways overflow went from 10 failing to 32/32 pass. Fixes in `index.css` and `Navbar.jsx`: `.container` width 100%, code-header and inline code wrap, grid columns `minmax(0, 1fr)`, status pills as dots at 721–960px, `.logo-subtitle` display moved out of inline style, 32px minimum on the pill.

- Navbar follow-up (`ae88009`): replaced width breakpoints (960px, 360px) with a measured fit check (`useFitMode`). Hamburger at the right edge, readable date pill instead of a bare dot, "API Live" in the menu when collapsed. Probe: overflow-x 32/32, no tap-target floor failures; narrow-to-wide resize switches back.

## Notes
- Lesson: layout tied to text width must not use a screen-width number; measure fit instead. Ask before header redesigns, then run the mobile check once at the end.
- Git Bash rewrites a `/` route arg into a Windows path. Run the probe with `MSYS_NO_PATHCONV=1` and `NODE_PATH=<frontend>/node_modules`.
- The mandi Supabase project is on another account; the DB was not queried directly. The owner saw 23/09 as the last date there.
