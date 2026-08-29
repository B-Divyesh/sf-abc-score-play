# Independent verification 4 — PASS

**Candidate:** `7912c9900b3368dbce56b74657961017fb4dd128` (`main`)

**Live URL:** <https://abc-score-play.sociobot.in> (checked 2026-08-29 UTC)

## Decision

**PASS — no release-blocking defects found.** The live static site is byte-for-byte the product payload built from this candidate. It satisfies the researched job: a musician or educator can write ABC text, see a staff, hear it, repeat selected bars at practice tempo, print it, and share a fragment link without an account or remote score storage. No product code was modified in this verification.

## Mandatory first-read gate

A clean live Chromium visit passed at desktop and 390 × 844.

- **What it does:** “Write, hear, and loop an ABC score.”
- **For whom:** “For musicians and educators who need a short score ready to practice or share.”
- **What to click first:** **Try it with sample data**; adjacent text says “It loads a complete score, ready to play.”

The primary action opens the isolated demo in one click. The demo immediately has a rendered, valid original eight-bar *Evening Scale Study*, playback and loop controls, and the persistent “Demo — sample data, nothing is saved to your real score” banner with **Reset demo** and **Start for real**.

## Claims gate — all required commands passed

From this clean checkout, `npm ci` installed 73 packages (0 audit vulnerabilities). After installation, every exact command declared in `.factory/claims.json` was run separately through the production-preview demo entry point. Each passed; the independent complete run below reran the same 14 tagged tests.

| Claim | Exact command | Result / observable assertion |
| --- | --- | --- |
| `sample-score` | `npm test -- --grep @claim:sample-score` | PASS — complete eight-bar sample renders in the phone viewport. |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS — free fact, no password, purchase, or sign-in action. |
| `local-score` | `npm test -- --grep @claim:local-score` | PASS — demo edit stored locally; no cross-origin request. |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS — leaving demo removes only demo storage and restores the real score. |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — rendered demo survives reload while offline after first visit. |
| `score-playback` | `npm test -- --grep @claim:score-playback` | PASS — Web Audio resume, oscillator creation/start, active and stop states. |
| `bar-loop` | `npm test -- --grep @claim:bar-loop` | PASS — selected bar completes two loop passes at 220 BPM. |
| `tempo-range` | `npm test -- --grep @claim:tempo-range` | PASS — 40/220 endpoints retained and 39/221 clamp. |
| `live-render` | `npm test -- --grep @claim:live-render` | PASS — changed valid tune changes SVG/title and remains valid. |
| `abc-file-open` | `npm test -- --grep @claim:abc-file-open` | PASS — fixture bytes/title render locally in demo storage. |
| `abc-file-download` | `npm test -- --grep @claim:abc-file-download` | PASS — exact source downloads as safely named `.abc`. |
| `score-link` | `npm test -- --grep @claim:score-link` | PASS — copied `#score=` link restores the source without sending it in requests. |
| `print-card` | `npm test -- --grep @claim:print-card` | PASS — print invocation keeps notation while hiding navigation/editor/transport. |
| `error-lines` | `npm test -- --grep @claim:error-lines` | PASS — unmatched quote identifies and selects line 2. |

Landing page, demo, README, privacy, and terms copy were cross-checked against the claim list. The product promises are listed and have observable tagged coverage; no material unlisted claim was found.

## Local quality gates

- `npm test`: **PASS** — 5 Vitest tests and 23 Chromium Playwright tests.
- `npm run lint`: **PASS** (`tsc --noEmit`).
- `npm run typecheck`: **PASS**.
- `npm run build`: **PASS** — Vite produced `dist/`.
- Exact build output: JS gzip sizes are 352 B loader + 9,148 B main + 154,841 B ABC renderer = **164,341 B**, below the 200 KB budget. CSS is **3,985 B gzip** (50 KB budget). The hero AVIF is 40,771 B (300 KB budget); no font payload is shipped.
- A Lighthouse CLI run was attempted with the supplied Playwright Chromium but could not connect to that browser in this container. This does not mask a quality failure: direct responsive, axe, console, header, service-worker, and size checks all completed.

## Independent live product QA

- **Normal use:** `/demo` renders the eight-bar sample as “Valid score.” Keyboard Space on the score-paper region changes status to “Score playing.” and then “Playback stopped.”
- **Input, boundaries, recovery:** the full independent browser tests cover a valid changed tune, empty/clear recovery, unmatched-quote line targeting, loop selection, and tempo 39 → 40 / 221 → 220. The deployed sample, playback, loop controls, and reset path were also exercised directly.
- **Files, sharing, print:** tests verify opening local ABC, exact safe download bytes, fragment-score restoration, and print media retaining notation while hiding chrome.
- **Demo isolation:** a live fresh context edited the sample namespace only; `demo:abc-score-play:score` held the edit while `abc-score-play:score` remained `null`. The dedicated claim seeds distinct real/demo values and confirms **Start for real** keeps the real one intact.
- **Offline/PWA:** live service worker is active at `/sw.js`, controls the page, and after an online visit an offline `/demo` reload retained title **Demo — ABC Score Play** and **8 bars**. The worker uses `skipWaiting()` and `clients.claim()`; `/sw.js` is `Cache-Control: no-cache`.

## Accessibility and browser quality

- Live axe scans at 390 × 844: `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the designed 404 route have **zero serious/critical findings**; dark and reduced-motion contexts were included. Desktop home and demo scans also have zero serious/critical findings.
- Each tested route has one H1 and a main landmark. Mobile `documentElement.scrollWidth` is exactly 390 px, with no horizontal overflow. The repository test measures every visible interactive control at ≥44 × 44 px.
- Live keyboard test: Tab visibly reveals and focuses the skip link; Space from score paper starts/stops playback; no trap observed. Focus styling is present and reduced motion is respected.
- Cold home and demo loaded with no page errors or console errors. The intentionally requested unknown URL correctly returns HTTP 404; Chromium records the expected HTTP “Failed to load resource” diagnostic for that document response, not an application exception.

## Privacy, headers, and deployment identity

- Fresh live cold load requested only four same-origin resources (document, JS, CSS, hero image). A fresh demo flow covering reset, playback/stop, and editing made **zero further requests** and **zero cross-origin requests**. It wrote only `demo:abc-score-play:score`; real storage was untouched.
- No analytics, third-party script/font, payment, account, AI, API, or server endpoint is present. This is static-only, so a rate-limit/429 allowance and Entra sign-in verification are not applicable.
- Live headers: CSP limits `default-src`, `script-src`, and `connect-src` to self; HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, and a restrictive Permissions-Policy are present. HTML is `public, must-revalidate, max-age=30`; hashed assets are `public, max-age=31536000, immutable`; service worker is `no-cache`.
- Every served product payload from the fresh `dist/` matches live SHA-256: 17/17 files, including all HTML routes, JS/CSS chunks, hero/social assets, favicon, service worker, robots, sitemap, and standalone 404. `staticwebapp.config.json` is deployment configuration consumed by the host and appropriately is not a public URL.

## Defects by severity

| Severity | Findings |
| --- | --- |
| P0 | None |
| P1 | None |
| P2 | None |
| P3 | None |

## Handoff

Ship candidate `7912c9900b3368dbce56b74657961017fb4dd128`. Continue to run the 14 declared claim commands, full suite, build, and offline/privacy checks after changes to score storage, playback, rendering, routing, or service-worker behavior.
