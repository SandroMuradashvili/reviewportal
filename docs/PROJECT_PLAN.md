# ReviewPortal Product and Implementation Plan

## 1. Product goal

ReviewPortal is a multilingual reputation-management and physical-product storefront for Georgian businesses. Business owners create customer-feedback portals, connect each portal to a QR code or NFC product, receive private ratings and comments, review analytics, and configure what happens after a customer selects a rating. ReviewPortal also markets and sells NFC cards, NFC stands, and QR/NFC combinations through direct WhatsApp conversations.

The first release supports Georgian, English, and Russian; one owner account may manage up to five portals. Accounts can test a portal with ten feedback submissions before manual subscription activation is required.

## 2. Success criteria

- A new owner can register, complete onboarding, publish a first portal, and download its QR code in under five minutes.
- A customer can open a portal from QR/NFC, select a rating, and complete the configured flow in a few taps on a mobile phone.
- Owners can distinguish scans, unique visitors, submitted feedback, and outbound redirect clicks.
- Owners can read, copy, filter, and manage timestamped private feedback.
- The platform owner can manage accounts, activation, packages, products, inventory, and portal status without editing the database manually.
- All public and authenticated experiences work in Georgian, English, and Russian and meet WCAG 2.2 AA basics.

## 3. Recommended architecture

- **Frontend:** Next.js App Router, TypeScript, Tailwind CSS, and a small accessible component system. Deploy on Vercel.
- **Backend:** Convex for application data, queries, mutations, actions, scheduled cleanup jobs, and real-time dashboard updates.
- **Authentication:** managed authentication with verified email/passwordless email and Google sign-in, integrated with Convex identity. Only authenticated owners and platform admins access management data.
- **Internationalization:** locale-prefixed routes (`/ka`, `/en`, `/ru`) and one translation namespace folder such as `messages/{locale}.json`. Georgian is the default locale; user preference is stored in a cookie/profile.
- **Media:** product and portal logos use private managed storage with controlled delivery. Public marketing assets may remain public. Upload types, sizes, and dimensions are validated server-side.
- **Email:** transactional provider for sign-in and immediate new-feedback notifications. Owners can disable notifications per portal.
- **Analytics:** first-party events written to Convex. Do not treat an outbound click as proof that a third-party review was posted.
- **Repository setup:** correct the repository identity from `starportal` to `reviewportal`, then initialize the application without deleting the existing logo, product images, or tips archive.

## 4. Information architecture and routes

### Public marketing

- `/[locale]`: hero, value proposition, how QR/NFC works, product preview, dashboard preview, FAQ, trust/legal statements, and calls to create an account or contact via WhatsApp.
- `/[locale]/products`: product catalog with stock state, images, descriptions, optional prices, and a direct WhatsApp action per item.
- `/[locale]/pricing`: subscription packages, included portal limits/features, trial explanation, and direct WhatsApp activation action.
- `/[locale]/how-it-works`, `/contact`, `/terms`, `/privacy`, `/acceptable-use`, and `/cookies`.
- Authentication pages for sign-up, sign-in, verification, and account recovery.

### Customer portal

- `/[locale]/r/[slug]`: fast mobile-first portal showing the business logo/name, a neutral feedback prompt, five empty accessible stars, and required disclosure/footer links.
- The selected rating is persisted as a draft event before the configured next action, so analytics remain reliable if the visitor leaves.
- For a private-feedback action, show an optional comment field; submission is anonymous and does not ask for name, email, or phone in v1.
- For a configured external action, execute a server-recorded redirect and count it once per visit.
- After private submission, show a concise confirmation such as “Thank you—your feedback has been received.”
- After the tenth trial submission, replace the rating interaction with a neutral unavailable/activation message and link to ReviewPortal packages/WhatsApp; owners also see activation prompts in the dashboard.
- Invalid, paused, deleted, expired, or unknown slugs receive distinct friendly states without leaking account details.

### Owner dashboard

- `/dashboard`: overview across all portals, onboarding checklist, trial usage, activation state, and recent feedback.
- `/dashboard/portals`: create, edit, pause, archive, and switch among up to five portals.
- Portal setup: business name, logo, slug, customer-facing prompt, language defaults, external destination, rating action configuration, and notification preference.
- Portal detail tabs: Overview, Feedback, Analytics, QR & Link, and Settings.
- Feedback inbox: rating/date/status filters; unread, read, resolved, and archived states; timestamp; comment modal; copy action; internal owner note.
- QR & Link: stable short URL, QR preview/download as SVG and PNG, copy-link action, and NFC programming instructions.
- Account: profile, language, authentication connections, subscription/activation status, and account/data deletion request.

### Platform administration

- Owner search and detail pages with activation state, trial count, portal count, suspension controls, and audit history.
- Manual subscription activation, renewal/expiry date, package assignment, internal notes, and reversible suspension.
- Product CRUD, localized descriptions, image management, display order, availability, and integer stock quantity.
- Package CRUD for localized name/copy, price display, duration, feature list, visibility, and WhatsApp message template.
- Global configuration for WhatsApp number (`+995 577 66 55 25`), support details, announcement banner, and legal-document versions.
- Admin access requires a separate role, enforced in every backend function, with audit logs for sensitive actions.

## 5. Core data model

- `users`: auth identity, display name, email, locale, role, state, created/updated timestamps.
- `subscriptions`: user, package, status (`trial`, `active`, `expired`, `suspended`), activation/expiry dates, trial limit, admin notes.
- `portals`: owner, name, slug, logo reference, status, localized prompt, destination URL, action configuration, notification setting, counters.
- `visits`: portal, anonymous visit token hash, first/last seen, source/UTM, coarse device data, scan count, submission/redirect flags.
- `feedback`: portal, visit, rating, optional comment, status, owner note, submitted timestamp.
- `events`: portal, visit, type (`page_view`, `star_selected`, `feedback_submitted`, `redirect_clicked`), rating where relevant, timestamp.
- `products`: localized content, price display, stock quantity, availability, images, WhatsApp template, sort order.
- `packages`: localized content, price/duration display, features, portal limit, visibility, WhatsApp template.
- `auditLogs`: actor, action, target type/id, safe metadata, timestamp.
- `legalAcceptances`: user, document type/version, locale, accepted timestamp.

Indexes must support owner/portal lookups, slug resolution, feedback by portal/date/rating/status, events by portal/date/type, trial counting, and admin account search. Counters should be updated transactionally or derived by bounded aggregations to avoid full-table scans.

## 6. Analytics definitions

- **Scans/page views:** valid portal loads; show total and time-series values.
- **Unique visitors:** approximate unique visit tokens, not unique people.
- **Total feedback:** successfully submitted ratings.
- **Average rating:** arithmetic mean of submitted private ratings for the selected period.
- **Happy percentage:** percentage of submitted ratings that are 4 or 5.
- **Rating distribution:** counts and percentages for ratings 1–5.
- **Redirects:** recorded outbound redirect clicks.
- **Conversion rate:** submitted feedback divided by eligible unique visitors.
- **Average daily feedback:** submissions divided by active days in the selected range.
- Support 7-day, 30-day, 90-day, and custom ranges; portal and all-portal views; clear empty states; timezone-aware day boundaries using Asia/Tbilisi by default.

## 7. Product and subscription sales

- Products use the supplied images initially, with an admin workflow for replacements and additional galleries.
- Each product card shows availability derived from stock: in stock, low stock, or unavailable. The customer cannot reserve or pay online in v1.
- “Ask on WhatsApp” opens `wa.me/995577665525` with a localized prefilled message containing product/package name and current page URL.
- Subscription activation is manual. The admin records the agreed package and dates; ReviewPortal never claims that a WhatsApp conversation or payment automatically activates service.
- Do not decrement product stock from a WhatsApp click. Admin changes stock only after confirming a sale.

## 8. UX and visual direction

- Use the existing ReviewPortal identity with a quiet premium palette, generous spacing, rounded but restrained surfaces, high-contrast typography, and subtle depth.
- The customer portal is intentionally sparse and fast, but clearly branded as ReviewPortal/the business rather than Google.
- Motion is limited to purposeful 150–250 ms transitions, star feedback, modal entry, and chart loading; honor reduced-motion settings.
- Apply the tips selectively: onboarding progress, a visible “responses remaining” trial meter, useful empty states, and meaningful business outcomes. Do not add points, streaks, leaderboards, or fake urgency.
- Never use fabricated testimonials, customer logos, scan counts, ratings, or scarcity. Launch with product proof, workflow demonstrations, and transparent placeholder-free sections.
- Detailed rules are in [DESIGN_GUIDELINES.md](./DESIGN_GUIDELINES.md) and [UX_GUIDELINES.md](./UX_GUIDELINES.md).

## 9. Security, privacy, and legal delivery

- Enforce ownership and admin authorization inside Convex functions, never only in the UI.
- Validate and normalize all URLs, slugs, localized input, uploaded files, and feedback length server-side.
- Add rate limits and abuse controls for portal views, rating submissions, redirects, authentication, and admin actions.
- Collect only the coarse analytics required for the dashboard; avoid raw IP retention where possible.
- Provide truthful consent, retention, export, correction, and deletion processes. Third-party processors must be disclosed accurately.
- Version Terms and Privacy Policy; record owner acceptance when versions materially change.
- Detailed requirements are in [SECURITY_GUIDELINES.md](./SECURITY_GUIDELINES.md) and [LEGAL_AND_POLICIES.md](./LEGAL_AND_POLICIES.md).

## 10. Testing and acceptance

- Unit-test validators, subscription/trial rules, analytics calculations, URL handling, permissions, stock states, and localization fallbacks.
- Integration-test sign-up, portal creation, ten-response trial boundary, manual activation, feedback lifecycle, QR generation, redirects, notifications, and admin audit logs.
- End-to-end test all customer and owner flows on mobile and desktop in Georgian, English, and Russian.
- Test keyboard-only operation, screen readers, 200% zoom, reduced motion, color contrast, RTL resilience even though v1 locales are LTR, and slow/offline failure states.
- Security-test cross-account access, ID enumeration, malicious links, replayed submissions, XSS payloads, oversized comments/uploads, brute force, and unauthorized admin calls.
- Verify analytics event deduplication and ensure page loads, feedback submissions, and redirects are reported as different metrics.
- Run production-like Vercel preview verification before merging each major flow.

## 11. Two-developer delivery plan

### Foundation (paired, short-lived)

- Agree on schema, route contracts, shared types, code style, environment names, branch strategy, and ownership boundaries.
- Developer A initializes Next.js, visual tokens, i18n shell, and public layouts.
- Developer B initializes Convex schema/functions, authentication integration, authorization helpers, and test fixtures.

### Parallel workstream A — customer and marketing experience

- Marketing home, products, pricing, FAQ, contact, and localized legal routes.
- Customer portal UI, star interaction, private comment/confirmation states, QR rendering, animations, accessibility, and responsive polish.
- Product image optimization and WhatsApp deep links.
- Primarily owns `app/[locale]`, public components, translation message files, and visual styles.

### Parallel workstream B — data, dashboard, and administration

- Convex schema, authorization, portal/feedback/event APIs, trial enforcement, aggregation, and audit logs.
- Owner dashboard, feedback inbox, analytics, portal configuration, subscription status, and admin console.
- Authentication, notification email, upload controls, rate limits, export/deletion workflows.
- Primarily owns `convex`, authenticated dashboard routes, and server-side integrations.

### Integration rules

- Define shared DTOs/event names before parallel feature work; avoid both developers editing the same translation or schema files in long-lived branches.
- Use small feature branches and daily rebases; merge foundation contracts before UI/backend implementations depend on them.
- Developer A mocks only against agreed typed interfaces; Developer B supplies stable fixtures and does not redesign UI components.
- Cross-review all permission, analytics, legal-copy, and customer-flow changes. Pair for final end-to-end testing and deployment configuration.

## 12. Release sequence

1. Foundation: repository correction, Next.js/Convex/auth/i18n, environments, CI, and shared UI primitives.
2. Owner MVP: onboarding, one portal, customer feedback, inbox, QR/link, and trial enforcement.
3. Business MVP: five portals, analytics, notifications, manual activation, and admin console.
4. Commerce/marketing: product catalog, packages, stock display, WhatsApp actions, and polished landing content.
5. Hardening: accessibility, security abuse tests, legal acceptance, data rights, localization review, monitoring, backups, and launch checklist.

## 13. Explicit assumptions

- Georgian law and Georgian consumers are the initial legal context; Georgian counsel reviews final legal copy before launch.
- Georgian is the default language and GEL is the default displayed currency; admin-entered display strings allow negotiated pricing.
- Private feedback is anonymous in v1; comment is optional and no customer contact details are collected.
- One activated owner may publish up to five portals. The trial applies account-wide and ends after ten submitted feedback entries.
- The public portal becomes unavailable at the trial limit until manual activation; owner configuration and existing trial feedback remain accessible.
- No online checkout, automatic recurring billing, SMS campaigns, AI-generated replies, Google Business Profile API connection, or team-member invitations are included in v1.

## 14. Redirect and platform-policy restriction

Threshold-based actions may route to ordinary first-party business destinations such as a thank-you, booking, support, loyalty, or private-resolution page. They must not selectively expose Google Reviews or another public review platform only to favorable ratings. If a public-review destination is offered, access must be materially equal for every rating. ReviewPortal must not impersonate Google, hide this limitation in legal text, or claim that redirect clicks prove published reviews. Google explicitly prohibits discouraging negative reviews or selectively soliciting positive reviews, and violations can result in Business Profile restrictions. Final implementation and legal copy must be checked against current platform rules before launch.

