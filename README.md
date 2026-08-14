# ReviewPortal

Multilingual private-feedback portals, analytics, and NFC/QR products for Georgian businesses.

## Local setup

1. Install dependencies with `npm install`.
2. Run `npx convex dev` to select the shared Convex development project and create `.env.local`.
3. Configure Google OAuth using [`docs/GOOGLE_OAUTH_SETUP.md`](docs/GOOGLE_OAUTH_SETUP.md).
4. Start the app with `npm run dev`.

Quality checks: `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.

The `/en/r/demo` portal is explicitly a no-save preview. Published portal slugs write real submissions to Convex.

See [`docs/DEVELOPER_HANDOFF.md`](docs/DEVELOPER_HANDOFF.md) for the second-developer workflow and prioritized review queue.
