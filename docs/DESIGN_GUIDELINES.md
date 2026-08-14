# ReviewPortal Design Guidelines

## Brand character

ReviewPortal should feel calm, credible, modern, and premium without looking like a bank dashboard or a Google product. The visual system should support two contexts: persuasive marketing for business owners and an extremely focused mobile feedback experience for their customers.

## Visual foundation

- Build the palette from the existing primary and secondary logos. Define semantic tokens for canvas, surface, elevated surface, text, muted text, border, brand, success, warning, and danger.
- Use one modern sans-serif family with Georgian, Latin, and Cyrillic coverage. Keep a compatible system fallback stack to avoid missing glyphs and layout shifts.
- Use an 8-point spacing rhythm, a restrained radius scale, consistent focus rings, and shadows only where elevation communicates interaction.
- Prefer light neutral backgrounds with one strong brand accent. Dark mode can follow after v1 unless it can be delivered without compromising the three-language launch.
- Icons must share one stroke style. Do not mix icon libraries or use decorative icons where text is clearer.

## Page composition

- Marketing pages: focused hero, concrete three-step explanation, product photography, dashboard proof, package summary, FAQ, and repeated but non-aggressive calls to action.
- Customer portal: business identity, one prompt, five stars, one next action, and minimal footer. Avoid navigation menus, carousels, popups, or competing promotions.
- Dashboard: stable left navigation on desktop, compact mobile navigation, portal switcher, primary metric row, one dominant trend chart, and a recent-feedback list.
- Admin: denser information is acceptable, but destructive controls remain visually separated and require confirmation.

## Typography and content density

- Use a compact type scale with clear roles rather than many near-identical sizes.
- Keep marketing headings short and benefit-led. Dashboard labels should be literal and unambiguous.
- Do not truncate feedback text without an obvious open/read action.
- Format dates and numbers through locale-aware utilities; Georgian, English, and Russian strings must be tested at realistic maximum lengths.

## Product imagery

- Use the supplied NFC and QR product photography for v1; crop consistently and preserve the complete physical object in primary shots.
- Product cards use the same aspect ratio and neutral backdrop. Avoid generated fake products or misleading mockups.
- Require meaningful localized alt text. Decorative images use empty alt text.
- Optimize responsive sources and prevent layout shift with fixed dimensions/aspect ratios.

## Motion

- Use 150–250 ms transitions with standard easing for hover, focus, modal, accordion, and navigation feedback.
- Star selection may use a short fill/scale response; never delay navigation for decorative animation.
- Charts may animate once on entry but must show values without animation and respect `prefers-reduced-motion`.
- Avoid autoplay video, parallax, scroll hijacking, excessive gradients, cursor effects, and animation on every section.

## Accessibility

- Target WCAG 2.2 AA: sufficient contrast, visible keyboard focus, semantic landmarks, correct labels, skip links, accessible dialogs, and 44px touch targets.
- Stars behave as a labeled radio group with keyboard arrows and clear selected state; color is not the only cue.
- Charts include textual summaries/table alternatives.
- Error messages identify the field and resolution; success is announced to assistive technology.

## Integrity rules

- Never fabricate testimonials, client logos, ratings, review totals, purchase activity, discounts, or limited-stock urgency.
- Clearly distinguish private feedback analytics from public reviews and redirect clicks.
- Use Google branding only where permitted and necessary to identify a destination; never mimic Google’s interface or imply affiliation.
- Empty states should teach the next useful action rather than display meaningless zero-heavy dashboards.

