# 14/10/2026 — SEO blog expansion

## Scope and evidence

- The existing blog covered the general Agmarknet API-key question, but not Agmarknet 2.0. The owner approved adding that article and the four related posts shortlisted in the SEO research.
- Sources: official Agmarknet 2.0 announcement and project specification, data.gov.in mandi catalog, official e-NAM site and comparison dashboard, CEDA API docs, Sarvam's agri voice-agent guide, and this repository's API and ingestion code. Each external claim is linked from its article.
- Articles: Agmarknet 2.0 developer access; Python API example; Agmarknet versus e-NAM; price freshness using the 25/09–13/10 ingest incident; farmer voice-agent tool handler.
- All posts use the existing article layout and route metadata. Related older posts link to the new guides. Each new post has a canonical, article Open Graph type and BlogPosting structured data through the layout.

## Verification

- Production build prerendered 13 routes. `verify-seo --dist dist` reported 0 errors and 3 previously known warnings (5 sitemap URLs without lastmod, home title length, home description length).
- Five new routes passed browser checks at 320px and 390px: HTTP 200, H1, canonical, article Open Graph type, substantial body text and no document-width overflow.
- The published Python and JavaScript examples were extracted from rendered pages and syntax checked. The voice handler passed mocked failure, data-validation and live API cases. A live Python request returned dated rows.
- GitHub `main` and the deployed Vercel site were checked after push. The live SEO verifier found all 13 sitemap pages with 0 errors and the same 3 known warnings.

## Follow-up

- Submit or monitor indexing of the new posts in Search Console.
- Daily ingestion from GitHub-hosted runners remains unresolved; the network cause is unconfirmed. See `STATUS.md` for the next operational task.
