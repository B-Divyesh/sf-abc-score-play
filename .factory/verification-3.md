# Independent verification 3 — PASS

**Candidate:** `a3f0b10a8b3d97efb241efe57f0c44895c9354c0` (`main`)

**Live URL:** <https://abc-score-play.sociobot.in> (including `/demo`)

**Date:** 2026-08-28 UTC

## Decision

**PASS.** The deployed static product matches the candidate and meets the researched brief: musicians and educators can write ABC, see a staff, play it locally, loop selected bars at practice tempos, print a score card, and share an URL-fragment score. No release-blocking defects were found. No product code was changed during this verification.

## First-read gate

A cold, clean Chromium visit to the live home at **390 × 844** passes.

- **What it does:** “Write, hear, and loop an ABC score.”
- **For whom:** “For musicians and teachers who need a short score ready to practise or share.”
- **What to click first:** **Try it with sample data**; adjacent copy says “It loads a complete score, ready to play.”

The headline, audience sentence, action, action result, and all three facts (free, browser-local, offline-after-first-visit) are visible in the first viewport. The action reaches `/demo` in one click. The demo immediately renders the original eight-bar *Evening Scale Study* and presents the persistent demo banner with **Reset demo** and **Start for real**.

## Required claims checks

From a clean candidate checkout, `npm ci` installed 73 packages with zero audit vulnerabilities. Before other product inspection, every exact command listed in `.factory/claims.json` was invoked against the production-preview demo entry point. An independent aggregate run, `npm test -- --grep @claim`, reported all 11 tagged Chromium tests passing.

| Claim ID | Exact declared command | Result |
| --- | --- | --- |
| `sample-score` | `npm test -- --grep @claim:sample-score` | PASS |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS |
| `local-score` | `npm test -- --grep @claim:local-score` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `score-playback` | `npm test -- --grep @claim:score-playback` | PASS |
| `bar-loop` | `npm test -- --grep @claim:bar-loop` | PASS |
| `tempo-range` | `npm test -- --grep @claim:tempo-range` | PASS |
| `score-link` | `npm test -- --grep @claim:score-link` | PASS |
| `print-card` | `npm test -- --grep @claim:print-card` | PASS |
| `error-lines` | `npm test -- --grep @claim:error-lines` | PASS |

The aggregate evidence included all observable outcomes: eight-bar render; no account/purchase UI; local-only demo edit; real/demo namespace separation; offline reload; active/stop playback; two loop passes; endpoint and out-of-range tempo handling; fragment restoration; print-media hiding of chrome while retaining notation; and error focus on line 2. The README and live copy were cross-checked against the catalog; no unlisted material product claim was found.

## Repository and build gates

- `npm ci`: PASS — 73 packages, 0 vulnerabilities.
- `npm test`: PASS — 4 Vitest checks and 16 Chromium checks completed successfully.
- `npm run typecheck`: PASS.
- `npm run lint`: PASS (the configured TypeScript static check).
- `npm run build`: PASS — TypeScript check plus Vite build; `dist/index.html` produced.
- `npm audit --omit=dev`: PASS — 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4280/demo <temp-dir>` against the Azure Static Web Apps emulator: PASS — HTTP 200, title, `lang=en`, exactly one H1, main landmark, no missing image alts, no unlabeled buttons, and no console/page errors.
- Static Web Apps emulator: known routes returned 200; `/missing-bar` returned a real 404.

This is a private static web app, not a library or CLI, so consumer package/CLI installation does not apply.

## Independent end-to-end evidence

Fresh live browser contexts (not repository assertions) established the following.

- The normal sample rendered as eight bars. **Play score** moved to “Score playing.” and **Stop** to “Playback stopped.”
- Tempo `39` clamped to `40`; `221` clamped to `220`.
- An unmatched quote produced a line-2 error, disabled playback, and the line action placed selection at offset 4. **Load sample score** recovered to “Valid score.”
- A copied score link used `#score=`; it restored after storage clearing and did not appear in requests.
- The captured print action ran; print media kept the notation SVG visible and hid header, demo banner, editor, transport, and footer.
- With distinct `REAL-MARKER` and `DEMO-MARKER` records seeded, **Start for real** deleted only `demo:abc-score-play:score` and loaded the real record unchanged.
- After an online visit and service-worker readiness, an offline live `/demo` reload retained the rendered score. `registration.update()` left a controlling `/sw.js` worker with no waiting or installing worker.

## Accessibility, responsive, and browser quality

- Live desktop 1440 × 900 and mobile 390 × 844 had no horizontal overflow, console errors, or page errors.
- Keyboard Tab reveals the skip link, which received focus in dark/reduced-motion mode. Space on the score paper plays and stops playback. No trap was encountered.
- Axe through `@axe-core/playwright`, including the focused dark skip link, reported **zero serious or critical findings**.
- Every visible link, button, input, textarea, and button-role control at 390 px measured at least 44 × 44 CSS px.
- In reduced-motion mode, the measured hero transition duration was `0.00001s`.
- All live internal links discovered across `/`, `/demo`, `/privacy`, and `/terms` resolve to a 200 response. Unknown paths return 404.

## Privacy, policies, performance, and deployment identity

- The live normal/demo/edit/play/share/print flow made **zero cross-origin requests**. Source and browser probes show only namespaced `localStorage` (`abc-score-play:score` and `demo:abc-score-play:score`), no analytics, remote font/script, account, payment, AI, or backend/API call.
- There are no server-side product endpoints or product-unlock calls, so a 429/rate-limit threshold is not applicable. There is no sign-in, so Entra tenant verification is not applicable.
- Live headers include CSP limited to self (with required inline styles), HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and restrictive Permissions-Policy. HTML is `max-age=30, must-revalidate`; hashed assets are `max-age=31536000, immutable`; `sw.js` is `no-cache`.
- Gzipped JS is 163,237 bytes total (352 + 8,625 + 154,260), CSS is 3,719 bytes, and the AVIF hero is 40,771 bytes: all within the stated static-product budgets.
- A fresh Lighthouse CLI attempt could not produce a score because the supplied browser tab crashed after `CHROME_PATH` was set; this is a verification-environment limitation, not a browser/page failure. The independent browser, axe, response, and size checks above completed successfully.
- Live/local SHA-256 pairs match for application JS `2182f2f2…011b5`, CSS `06c8f37c…61230`, abcjs `0976009a…cc87c`, AVIF hero `45e0e03b…16e2`, WebP hero `2c99056f…642c`, service worker `b14f1569…9867`, robots/sitemap, and the standalone 404 page. Production therefore serves this candidate’s bytes.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

