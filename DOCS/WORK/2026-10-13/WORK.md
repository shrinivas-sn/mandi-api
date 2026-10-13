# 13/10/2026 — SEO pass from Search Console data, catch-up ingest

<!-- Title date is DD/MM/YYYY (display). The folder name this file lives in stays
YYYY-MM-DD for correct sorting — don't rename the folder to match the title. -->

## Plan
Read the owner's Search Console exports, check the reported shrinivasn.com "conflict", and make
data-backed SEO fixes. Evidence and decisions live in `seo/` (git-ignored, owner's machine only).

## Execution
- Search Console, last 3 months: 193 clicks, 1,210 impressions (Aug 23/151, Sep 84/617, Oct 1–13 86/442). Home has 176 clicks at 17.6% CTR.
- Indexing: 3 pages indexed. 5 pages "Discovered - currently not indexed", never crawled since 08/08: `/docs`, `/playground`, `/status`, `/blog`, `/blog/data-gov-in-vs-mandi-api`.
- No conflict with shrinivasn.com: every page on both sites canonicals to itself. The "Alternate page with proper canonical tag" email came from trailing-slash URLs (`/blog/`), which Google says need no action. The 404 is `/ENDPOINT`, which nothing on this site links to.
- Ingest: data.gov.in answers from India (200 in 0.7s) but GitHub runners get `UND_ERR_CONNECT_TIMEOUT`. Ran `npm run ingest` locally: 6,435 rows, all 5 states, data now dated 13/10.
- Agmarknet post retitled for "agmarknet api key" (biggest query: 44 impr, pos 8.7), same URL. Added a "Do you need an Agmarknet API key?" section and links to the other two posts. New `updated` field drives `dateModified` and sitemap `lastmod`.
- Home page: "Guides" list linking all 3 posts. Data.gov.in post retitled. `/docs` and `/playground` titles and descriptions trimmed. `verify-seo --dist`: 9 warnings down to 3 (home title and description left alone on purpose).
- `.gitignore` now has `seo/`. `seo/plan.md` and `seo/briefs/home.md` stay tracked in this public repo until the owner untracks them.

## Notes
- The owner approved publishing without reading the new text (13/10).
