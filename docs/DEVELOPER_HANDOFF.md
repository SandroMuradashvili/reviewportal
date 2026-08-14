# Developer handoff and second-look plan

## Access to grant

Invite the developer to `SandroMuradashvili/reviewportal` with **Write** access. Add them to the Vercel and Convex projects as a developer; do not share personal tokens or Google client secrets. Give production access only if they own releases.

They should work in small feature branches. Every PR needs a Vercel preview, passing checks, UI screenshots where relevant, and cross-review for schema, authorization, analytics, or legal behavior.

## Immediate second-look queue

| Priority | Area | Assignment | Acceptance evidence |
|---|---|---|---|
| P0 | Google OAuth | Configure dev/prod clients; test first sign-in, logout, revocation, and duplicate-email behavior | Incognito recording, Convex user row, no secrets in Git |
| P0 | Real dashboard data | Replace sample metrics with Convex queries and portal onboarding | Owner → portal → QR → feedback → inbox works end to end |
| P0 | Public portal states | Resolve name/prompt/status by slug; add paused, trial-ended, and not-found states | Tests for each state and trial response 9→10→blocked |
| P0 | Authorization | Test cross-owner portal, feedback, storage, admin, and export access | Automated negative tests return generic denied results |
| P1 | QR and NFC | Add downloadable SVG/PNG and stable-link programming guidance | QR tested on iOS and Android |
| P1 | Analytics | Add visit deduplication, date ranges, timezone boundaries, and chart summaries | Seeded 7/30/90-day calculations match fixtures |
| P1 | Admin console | Build activation, suspension, product/package CRUD, and audit history | Admin-only tests and audit rows |
| P1 | Localization | Translate remaining fallback copy; native-review Georgian/Russian | Route crawl finds no unintended English |
| P1 | Accessibility | Check keyboard, screen readers, zoom, motion, and contrast | WCAG 2.2 AA checklist and axe report |
| P1 | Legal | Insert operator details and counsel-approved Georgian text | Versioned copy and legal sign-off |
| P2 | Notifications/uploads | Add privacy-safe email and hardened image handling | Retry plus MIME/size/security tests |
| P2 | Operations | Add monitoring, rate-limit alerts, restore, deletion, and export runbooks | Staging exercises documented |

## Suggested ownership

- Developer A: public UI, customer flow, product imagery, translations, accessibility, and QR assets.
- Developer B: Convex, dashboard, admin, OAuth, analytics, abuse controls, and operations.
- Cross-review permissions, trial counters, redirects, legal promises, and production environment changes.

## Definition of done

A task is complete when success and failure paths are tested, the Vercel preview is checked on mobile and desktop, no sensitive values enter Git, docs are updated, and another developer can reproduce the evidence.
