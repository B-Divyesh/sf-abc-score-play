# Independent verification — FAIL

**Candidate:** `1dce633d64ef014e5a4d29baf3dd3801e3f72e63` (`main`)

**Production checked:** <https://abc-score-play.sociobot.in> and `/demo`

**Date:** 2026-08-28 UTC

## Decision

**FAIL — release blocked by mobile touch-target accessibility failures.** The product otherwise meets the core ABC editing, rendering, playback, loop, print, sharing, offline, local-storage, and one-click demo job.

## First-read result

Cold-opening the live home page answered all three required questions in plain words:

- **What it does:** “Write, hear, and loop an ABC score.”
- **For whom:** “For musicians and teachers who need a short score ready to practise or share.”
- **What to click first:** the visible **Try it with sample data** action; its adjacent sentence says it loads a complete score ready to play.

The action opens `/demo` in one click. The demo has the persistent “Demo — sample data, nothing is saved to your real score” strip with Reset demo and Start for real. This gate passes.

## Release-blocking defect

| Severity | Finding | Fresh evidence |
| --- | --- | --- |
| P1 / accessibility | At the required 390 px mobile viewport, multiple interactive targets are below the mandatory 44 × 44 CSS-pixel minimum. This includes header links **Demo** (34 × 22) and **Editor** (50 × 22), demo-strip **Reset demo** (95 × 36) and **Start for real** (128 × 36), and footer **Privacy** (52 × 19) and **Terms** (37 × 19). | Live Playwright measurement at `390 × 844` on `/demo`. This violates the attached non-negotiable accessibility baseline and the repository definition of done. |

No code was changed by verification.

## Claims: exact commands from `.factory/claims.json`

Fresh `npm ci` completed with 0 vulnerabilities. Each command below was run independently and passed against the local production preview/demo entry point.

| Claim | Result |
| --- | --- |
| `npm test -- --grep @claim:sample-score` | PASS |
| `npm test -- --grep @claim:free-use` | PASS |
| `npm test -- --grep @claim:local-score` | PASS |
| `npm test -- --grep @claim:offline-reload` | PASS |
| `npm test -- --grep @claim:score-playback` | PASS |
| `npm test -- --grep @claim:bar-loop` | PASS |
| `npm test -- --grep @claim:score-link` | PASS |
| `npm test -- --grep @claim:print-card` | PASS |
| `npm test -- --grep @claim:error-lines` | PASS |

`npm test` also passed: 3 Vitest unit tests and 11 Chromium Playwright tests. `npm run build` passed TypeScript checking and created `dist/`. No lint script is defined. The supplied `/opt/fleet/lib/verify-url.sh` passed against the local production `/demo`: HTTP 200, `lang=en`, one H1, main landmark, no images missing `alt`, no unlabeled buttons, and no console/page errors.

## Functional, privacy, PWA, and deployment evidence

- Live `/demo` rendered the bundled original eight-bar sample as **Valid score**. Play/stop, a looping range, printing, sharing, error-line selection, and recovery from an unmatched quote were exercised.
- Boundary checks on the live site clamped tempo input `39` → `40`, `221` → `220`, and loop values `0`/`999` → bars `1`/`8`.
- The line-2 error control selected and focused the invalid source; replacing it with valid ABC re-enabled playback.
- Demo isolation held: Start for real removed `demo:abc-score-play:score`, preserved `abc-score-play:score`, and loaded the real editor value.
- The complete live demo flow made no cross-origin requests and logged no console errors or page errors. CSP permits only same-origin connections; no account, payment, analytics, API endpoint, or sign-in flow exists. Rate-limit and Entra checks are therefore not applicable.
- The service worker controlled the page after first visit; `registration.update()` completed with one active `/sw.js` worker and no waiting/installation worker. The independent offline-reload claim passed.
- Live `/`, `/demo`, `/privacy`, `/terms`, `/missing-bar`, `/robots.txt`, and `/sitemap.xml` each returned HTTP 200. Response headers include HSTS, CSP, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive Permissions-Policy. Hashed assets are `Cache-Control: public, max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Candidate/deployment identity is confirmed: live and locally built SHA-256 values matched for `index-BocJQpqD.js`, `index-4i4rpucd.css`, and `abcjs-CUoT7yai.js`.

## Accessibility, responsive, and performance evidence

- Live axe scans on desktop and 390 px mobile, including dark/reduced-motion mode, returned **zero serious or critical violations**. The single H1, main landmark, language, headings, labels, visible keyboard focus, skip link, and keyboard Space play/stop behavior were checked.
- At 390 px the document width equalled the viewport width (390 px), with no horizontal overflow. The visual layout remained legible, but the undersized touch targets above block release.
- Production build sizes: entry JS 8.63 KB gzip plus lazy `abcjs` 154.59 KB gzip (163.55 KB when the demo loads its score), CSS 3.67 KB gzip; within the 200 KB JS and 50 KB CSS budgets. The AVIF hero is 40,771 bytes (under 300 KB).
- An independent Lighthouse CLI run could not complete in this container: Lighthouse could not use the Playwright Chromium binary and then reported a browser-tab crash. This is an environment limitation, not used to assess the product; the direct axe, viewport, response, and bundle checks above completed.

## Required next step

Make every mobile interactive link/control at least 44 × 44 CSS px (including header navigation, demo strip, and footer), retain spacing between adjacent targets, then rerun this verification. No other release-blocking issue was found in this pass.
