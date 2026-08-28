# Independent verification 2 — FAIL

**Candidate:** `b570b354b30e71ee5db90024d7eb3e36198e9390` (`main`)

**Production checked:** <https://abc-score-play.sociobot.in> and `/demo`

**Date:** 2026-08-28 UTC

## Decision

**FAIL — release blocked by a serious dark-mode accessibility defect, incorrect 404 response behavior, and incomplete claim coverage.** The core score-writing, rendering, playback, looping, sharing, printing, local storage, demo isolation, and offline workflows worked in fresh independent tests. The prior deployment-only concern is not present: production asset bytes match this candidate.

No product code was changed during verification.

## First-read gate

The cold live home page passes the mandatory first-read test:

- **What it does:** “Write, hear, and loop an ABC score.”
- **For whom:** “For musicians and teachers who need a short score ready to practise or share.”
- **What to click first:** **Try it with sample data**, with the adjacent explanation “It loads a complete score, ready to play.”

At 390 × 844, the headline, audience sentence, action, explanation, and all three facts are visible before the bottom of the first viewport. The action opens `/demo` in one click. The demo immediately displays an original eight-bar score and the persistent “Demo — sample data, nothing is saved to your real score” banner with **Reset demo** and **Start for real**.

## Release-blocking findings

| Severity | Finding | Fresh evidence |
| --- | --- | --- |
| P1 / accessibility | The keyboard-revealed **Skip to score editor** link is unreadable in dark mode. It resolves to foreground `#f7eed9` on background `#f8f1df`, only **1.02:1** contrast versus the required 4.5:1. | Fresh Chromium context at 390 × 844 with dark color scheme and reduced motion: open `/demo`, press Tab, then run axe. Axe reports one serious `color-contrast` violation on `.skip-link`. The focused link is visible at 12,8 with a 220 × 44.8 px box and a 3 px focus outline. Screenshot: `/tmp/abc-dark-skip-focus.png`. The repository axe test misses this because it scans before revealing the skip link. The conflicting tokens are in `src/style.css` lines 45–55 and the dark token override later in that file. |
| P1 / routing contract | Unknown URLs render the designed not-found content but return **HTTP 200**, so this is not a real 404 response. | `curl https://abc-score-play.sociobot.in/missing-bar` returned `200 text/html`; `/404.html` also returned 200 and is only the SPA shell. `public/staticwebapp.config.json` line 17 explicitly rewrites platform 404s to `/index.html` with `"statusCode": 200`. This contradicts the required real 404 route/response override. |
| P1 / claims contract | Public promises are missing or inadequately proved in `.factory/claims.json`. | The live demo and README promise that demo edits never replace the real score, but no listed claim seeds both namespaces and asserts the real key is untouched. README promises the quantitative **40–220 BPM** range, but `bar-loop` neither claims nor tests both limits. `print-card` promises a clean print view, but its test only stubs `window.print()` and checks a status string; it never switches to print media or checks that controls are hidden and notation remains visible. This violates the attached rule that every public claim be listed and that its test prove the outcome. The behaviors themselves passed independent probes; the release blocker is the mandatory claims coverage. |

## Claims — exact commands run first

From the clean candidate checkout, `npm ci` completed with zero vulnerabilities. Before other product inspection, every command listed in `.factory/claims.json` was run separately against the production-preview demo entry point. All commands exited 0:

| Claim command | Result | Observable evidence |
| --- | --- | --- |
| `npm test -- --grep @claim:sample-score` | PASS | Eight-bar sample rendered and bar selection updated. |
| `npm test -- --grep @claim:free-use` | PASS | Free fact present; no password, purchase, or sign-in action. |
| `npm test -- --grep @claim:local-score` | PASS | Edited demo score stored locally; no cross-origin request. |
| `npm test -- --grep @claim:offline-reload` | PASS | Demo score rendered after an offline reload. |
| `npm test -- --grep @claim:score-playback` | PASS | Playback entered active state and stopped. |
| `npm test -- --grep @claim:bar-loop` | PASS | One-bar loop completed two passes at 220 BPM. |
| `npm test -- --grep @claim:score-link` | PASS | URL-fragment score survived storage clearing and reload. |
| `npm test -- --grep @claim:print-card` | PASS | Print invocation/status assertion passed; see coverage defect above. |
| `npm test -- --grep @claim:error-lines` | PASS | Line 2 error action selected and focused the broken line. |

Each invocation also reran 3 Vitest unit tests and the exact TypeScript/Vite production build. The claim file exists, parses, and each listed ID has one tagged test.

## Repository gates

- `npm ci`: PASS; 73 packages installed, zero audit vulnerabilities.
- `npm test`: PASS; 3 Vitest tests and 13 Chromium integration/browser tests.
- `npm run build`: PASS; runs `tsc --noEmit && vite build` and produces `dist/index.html`.
- `npm audit --omit=dev`: PASS; zero vulnerabilities.
- Lint: not available; `package.json` defines no lint script.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo <temp-dir>`: PASS; HTTP 200, title, `lang=en`, one H1, main landmark, no missing image alt text, no unlabeled buttons, and no console/page errors. Evidence directory: `/tmp/abc-verify-2.7clQoT`.
- Package/CLI consumer install: not applicable; this is a private static web app, not a published library or CLI.

## Independent end-to-end behavior

Fresh live Chromium contexts were used rather than relying on repository assertions.

- Normal case: the demo rendered “Evening Scale Study” as a valid eight-bar score. **Play score** entered “Score playing”; **Stop** returned “Playback stopped.” A one-bar loop reached “Loop played 2 times and is repeating.”
- Boundary values: tempo `39` clamped to `40`; `221` clamped to `220`. Loop start `0` clamped to bar 1; loop end `999` clamped to bar 8.
- Invalid input: an unmatched quote produced “1 issue,” identified line 2, disabled playback, and the line action focused and selected characters 4–19. Replacing the source with valid one-bar ABC restored “Valid score” and playback availability.
- Empty/recovery: **Clear editor** removed demo storage, returned “Waiting for notes,” and focused the editor. **Load sample score** restored the staff.
- Sharing: **Copy score link** placed the score after `#score=`. After deleting demo storage and reloading, the fragment restored exactly the same source; the fragment did not appear in any HTTP request.
- Printing: independent print-media emulation showed `#paper` while hiding the header, demo strip, hero, editor panel, transport, and footer.
- Demo isolation: with separate `REAL-MARKER` and `DEMO-MARKER` values seeded, **Start for real** removed only `demo:abc-score-play:score` and preserved `abc-score-play:score` exactly.
- Keyboard: Tab revealed the skip link; the range accepted ArrowRight (`104` → `105`); Space on the score region played and stopped audio; there was no keyboard trap. Visible controls were semantic links, buttons, or labeled inputs.
- Routing: `/`, `/demo`, `/privacy`, `/terms`, and an unknown route each rendered one H1 and a route-specific title. SPA navigation moved focus to main content. The incorrect HTTP status for the unknown route is reported above.

## Accessibility and responsive behavior

- Desktop 1440 × 900 and mobile 390 × 844 rendered without horizontal document overflow or browser/page errors.
- At 390 px, every visible link, button, input, textarea, and button-role element measured at least 44 × 44 CSS px.
- Fresh-state axe scans found zero serious/critical findings in light and dark/reduced-motion modes. The required focus-state scan found the serious dark skip-link contrast failure above.
- Reduced-motion mode shortened transition and animation durations to `0.00001s`; no looping decorative animation was found.
- The page has `lang=en`, one H1, ordered headings, header/main/footer landmarks, labels, alt text, polite status regions, and a visible keyboard skip link.

## Privacy, network, and browser policy

- A fresh live session covering home, demo, edits, playback, looping, sharing, reload, and route changes made **zero cross-origin requests**, with zero console errors, page errors, or HTTP error responses.
- Scores used namespaced localStorage. No analytics, tracking, third-party fonts/scripts, payment, account, AI endpoint, or sign-in flow was present.
- The CSP restricts default/script/connect/media/font sources to self as appropriate; headers also include HSTS, `nosniff`, strict-origin referrer policy, and restrictive camera/microphone/geolocation/payment permissions.
- Hashed assets return `Cache-Control: public, max-age=31536000, immutable`; `/sw.js` returns `Cache-Control: no-cache`; HTML uses `max-age=30, must-revalidate`.
- There are no product API/server endpoints, including product-unlock calls, so burst rate-limit and `Retry-After` checks are not applicable. There is no sign-in, so Entra authority verification is not applicable.

## PWA/offline behavior

- After an online visit, the live demo reloaded offline with its title, H1, rendered eight-bar score, and active service-worker controller intact.
- `registration.update()` completed with active `https://abc-score-play.sociobot.in/sw.js` and no waiting or installing worker.
- The service worker is network-first, uses cache `abc-score-play-v2`, deletes obsolete named caches on activation, and falls back to the cached shell for navigation.

## Deployment identity and performance

The live hashed assets match the fresh local production build byte for byte:

| Asset | Local/live SHA-256 |
| --- | --- |
| `assets/index-8WdMIQoD.js` | `2182f2f2a572bb0914e466a651acaa862894b20fed3f25095ca3aced05b011b5` |
| `assets/index-mfBdgImH.css` | `9fe0ac095d70ae180599d1e1a7a98418ef43339ef09fed5b54e17ff05064cf64` |
| `assets/abcjs-CUoT7yai.js` | `0976009a0d03c105da7e099c717d00ef4f861437667f25702da0fff8ce5cc87c` |

This confirms production serves the candidate product bytes. The candidate commit itself also adds a deployment ZIP that is not part of `dist/`; it does not alter the matched app bytes.

- JS: 0.35 KB + 8.63 KB + 154.84 KB gzip = **163.82 KB**, within 200 KB.
- CSS: **3.73 KB gzip**, within 50 KB.
- Hero AVIF: **40,771 bytes**, within 300 KB. No web-font payload.
- Lighthouse 13.4.1 mobile, live home: performance 96, accessibility 100, best practices 100, SEO 100; LCP 1.1 s, TBT 220 ms, CLS 0.
- Lighthouse 13.4.1 mobile, live demo: performance 97, accessibility 100, best practices 100, SEO 100; LCP 1.8 s, TBT 180 ms, CLS 0.

Lighthouse does not reveal keyboard-only conditional content, which is why its accessibility score does not contradict the focused skip-link axe failure.

## Required next steps

1. Give the dark-mode skip link text at least 4.5:1 contrast against its background, and add an automated test that focuses it before running axe in both themes.
2. Return an actual 404 status for unknown paths using a valid static-host response override and a real not-found document while retaining usable styled content.
3. Add claim entries/tests for demo-to-real storage isolation and the 40–220 BPM range. Strengthen `print-card` to emulate print media and assert that notation is visible while editor/navigation controls are absent.
4. Rerun every claim command, the full suite/build, focused-state axe, live status/header probes, offline/update checks, and deployment byte comparison.
