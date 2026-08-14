# ReviewPortal Security Guidelines

## Security model

Treat every browser request and client-provided identifier as untrusted. Authentication identifies a user; authorization must separately prove that the user owns the requested portal/resource or has the platform-admin role. Enforce these rules inside every Convex query, mutation, and action.

## Identity and access

- Use verified email and Google OAuth through a managed authentication provider; require secure account recovery and provider-side abuse protection.
- Map external identities to one internal user record and prevent accidental duplicate accounts when emails match.
- Admin role assignment is never self-service and cannot be changed from normal owner settings.
- Require recent re-authentication for account deletion, identity changes, and sensitive admin operations where supported.
- End sessions after identity revocation and support a “sign out all devices” control.

## Authorization and tenancy

- Centralize `requireUser`, `requirePortalOwner`, and `requireAdmin` helpers and use them server-side.
- Query feedback/events through the authorized portal, not by accepting an arbitrary feedback ID alone.
- Prevent cross-tenant enumeration through IDs, slugs, exports, storage URLs, search, and error messages.
- Keep admin and owner APIs distinct; audit activation, suspension, role, stock, legal version, and deletion operations.

## Public portal abuse controls

- Use high-entropy internal IDs and unique human-readable slugs with reserved-word protection.
- Create a signed/hashed anonymous visit token; do not claim it uniquely identifies a person.
- Rate-limit portal loads, rating attempts, feedback submissions, and redirects by a combination of portal, visit token, and short-lived network signals.
- Apply duplicate-submission controls without permanently fingerprinting visitors.
- Validate rating as an integer 1–5 and enforce comment length, Unicode normalization, and plain-text rendering.
- Add bot protection adaptively when abuse is detected; avoid adding friction to every legitimate scan.

## URL and redirect security

- Accept only HTTPS destinations except explicitly allowed local development URLs.
- Normalize URLs server-side, reject credentials, control characters, unsupported schemes, localhost/private-network hosts, and malformed international domains.
- Store the validated canonical URL and perform redirects only through a server-owned endpoint that records an event safely.
- Do not place destination URLs directly into executable HTML or render untrusted HTML from business/customer input.
- Revalidate destinations when settings change and periodically before use; protect against open-redirect and SSRF patterns.

## Input, output, and uploads

- Define shared server-side validators for every mutation; TypeScript types alone are not validation.
- Escape all user content by default. Do not support Markdown/HTML feedback in v1.
- Restrict logos/product images by MIME signature, extension, byte size, pixel dimensions, and count. Re-encode images where practical.
- Public marketing assets can be public; owner uploads use access-controlled or unguessable delivery appropriate to their display context.
- Never log comments, authentication tokens, full destination query secrets, or unnecessary personal data.

## Secrets and infrastructure

- Separate development, preview, and production Convex deployments and Vercel environments.
- Store secrets only in managed environment variables; never expose server secrets through `NEXT_PUBLIC_*` variables.
- Use least-privilege credentials, rotate compromised credentials, and document owners for every external integration.
- Enable dependency update alerts, lockfile review, secret scanning, branch protection, and CI checks.
- Add security headers: strict CSP adapted to required providers, HSTS, frame restrictions, MIME sniffing protection, referrer policy, and permissions policy.

## Privacy, retention, and deletion

- Collect the minimum analytics needed; prefer truncated/coarse network information and short retention for raw abuse signals.
- Define retention separately for feedback, aggregate events, audit logs, trial accounts, and deleted accounts.
- Provide owner export and deletion workflows. Deletion removes or irreversibly anonymizes data according to the published schedule, including storage objects and backups when they expire.
- Do not promise immediate permanent deletion if backup architecture cannot deliver it; state the real timeframe.

## Monitoring and incident response

- Monitor authentication anomalies, rate-limit spikes, submission abuse, error rates, failed notifications, and unauthorized access attempts.
- Alerts must avoid including private feedback text or secrets.
- Maintain an incident runbook: contain, preserve evidence, rotate credentials, assess affected data, notify required parties, recover, and document corrective actions.
- Test backup restoration and account deletion rather than assuming they work.

## Verification checklist

- Cross-account and cross-portal access tests.
- Admin privilege escalation tests.
- Stored/reflected XSS, injection, malicious Unicode, and oversized payload tests.
- Open redirect, redirect-chain, DNS rebinding, private-host, and unsafe-scheme tests.
- Submission replay, counter manipulation, trial bypass, and analytics double-count tests.
- Upload polyglot, MIME mismatch, decompression/pixel bomb, and unauthorized object access tests.
- Dependency audit, secret scan, security headers scan, and production configuration review before release.

