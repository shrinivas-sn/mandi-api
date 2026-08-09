# Contributing to Mandi Price API

Thanks for your interest in improving this project. Small, focused PRs are easiest to review and merge.

## Before you start

- Check existing [issues](../../issues) and open PRs to avoid duplicate work.
- For a non-trivial change (new endpoint, new state, schema change), open an issue first to discuss the approach.
- Read the relevant doc in [`DOCS/`](DOCS/) — `BACKEND.md`, `FRONTEND.md`, or `FULL-API-APP.md` — before touching that layer.

## Local setup

```bash
# Backend
cd backend
cp .env.example .env   # fill in your own Supabase + data.gov.in credentials
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

Never commit your `.env` file — it's gitignored for a reason.

## Making changes

- **Backend:** keep controllers thin; validation lives in `validators.js`, response shape follows the existing `{ success, data, meta }` envelope.
- **Frontend:** match the existing earthy/harvest design system (`frontend/src/index.css`) — avoid introducing a different visual style.
- **Adding a new state:** update `backend/scripts/states.config.js` and confirm the ingestion script (`npm run ingest`) pulls real, non-zero data before opening a PR.
- Keep PRs scoped to one change — separate unrelated fixes into separate PRs.

## Submitting a PR

1. Fork the repo and create a branch off `main`.
2. Make your change, test it locally (see above).
3. Open a PR with a clear description of what changed and why.
4. Be responsive to review feedback — small follow-up commits are fine.

## License note

This project is licensed under CC BY-NC-SA 4.0 (see [LICENSE](LICENSE)). By contributing, you agree your contribution is licensed under the same terms.
