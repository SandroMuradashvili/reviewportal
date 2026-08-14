# ReviewPortal UX Guidelines

## Core principles

1. Make the next action obvious.
2. Minimize customer effort on QR/NFC flows.
3. Explain owner-facing metrics and limitations honestly.
4. Preserve work and provide recovery from errors.
5. Design all flows for mobile, keyboard, translation expansion, and slow networks.

## Owner onboarding

- After registration, present a four-step checklist: create portal, add business details, configure destination/actions, and download/test QR.
- Start with a useful welcome state, not an empty analytics wall. Show a live portal preview beside setup where screen size permits.
- Display the ten-response trial meter in onboarding and dashboard. Explain what happens at the limit before the first response and again at eight and ten.
- Validate the external destination immediately and offer a safe preview/test action that does not pollute production analytics.
- Make portal publishing an explicit status with clear Draft, Live, Paused, Trial ended, and Archived badges.

## Customer feedback flow

- Load quickly and avoid authentication, cookie walls for essential operation, or unnecessary fields.
- Initially show five empty stars with a short localized prompt and accessible labels such as “1 out of 5.”
- Record one selected rating per visit and prevent accidental duplicate submissions while allowing the visitor to correct a selection before final submission where applicable.
- Private feedback asks only for an optional comment. Preserve typed text through retryable network errors.
- Confirmation copy should be warm, brief, and truthful. Never imply that private feedback was published publicly.
- Provide clear unavailable, paused, and trial-ended pages without technical details or blame directed at the business.

## Dashboard and feedback inbox

- Default to the selected portal and last 30 days; remember the owner’s last portal/filter selection.
- Lead with total feedback, average rating, happy percentage, unique visitors, conversion, and redirects. Put definitions in tooltips/help text.
- Use a rating-over-time line chart and a five-bar distribution chart; show comparison to the previous equivalent period only when enough data exists.
- Feedback rows show rating, comment preview, timestamp, and status. Opening a row uses an accessible modal/drawer with full comment, copy, note, and status actions.
- Copy confirms success without changing feedback status. Marking resolved is deliberate and reversible.
- Empty states give one relevant action: test portal, copy link, download QR, or change date range.

## Products, packages, and WhatsApp

- Product cards show clear photos, name, concise benefit, stock state, and one “Ask on WhatsApp” action.
- Prefill WhatsApp with localized product/package name and page link; the user can edit before sending.
- Do not represent a WhatsApp click as an order, reservation, payment, or activation.
- Unavailable products remain viewable only if useful, with a disabled state and alternative contact action.
- Pricing/package copy distinguishes one-time physical products from recurring service access.

## Forms and errors

- Validate on blur and submit without erasing user input. Put errors next to fields and focus the first invalid field on submit.
- Confirm destructive operations with the exact portal/product name. Prefer archive/pause over permanent deletion.
- Use optimistic updates only for reversible low-risk actions; subscription/admin/security changes wait for server confirmation.
- Every loading state has a timeout/error path and retry. Skeletons match final geometry and do not flash unnecessarily.

## Localization

- Keep every user-visible string in translation resources; do not concatenate fragments that translators cannot reorder.
- Use locale-aware dates, plurals, numbers, and currency display. Store canonical values, not translated enum labels.
- Provide a persistent language switcher on public pages and account settings; preserve the current route when switching.
- Have native speakers review Georgian and Russian customer-facing and legal copy before launch.

## Applying the supplied UX tips

- Use onboarding completion and trial usage as visible progress because they represent real setup work.
- Make early success achievable: a portal preview and test scan should work before activation.
- Measure meaningful outcomes—feedback received and response resolution—not points or arbitrary engagement.
- Do not add leaderboards, social streaks, comeback bonuses, artificial unfinished tasks, or share cards in v1; they do not support this business workflow.

