# ABC Score Play v1 repair handoff

## Release-blocking QA repair (2026-08-28 UTC): **PASS locally**

This repair addresses the sole P1 finding in independent report `f73122c358323865a3f068dbefb229ceec4dac4f`, against candidate `1dce633d64ef014e5a4d29baf3dd3801e3f72e63`: undersized touch targets at the required 390 px viewport.

The root cause was compact text links and transparent demo-strip buttons without a target-box minimum. The repair gives the wordmark, header links, demo actions, footer links, legal-page text links, error-line buttons, and range input a minimum 44 px target; the header and mobile navigation gaps retain at least 8 px separation. It keeps the existing instrument-panel visual system, routes, local storage, score editor, sample demo, and service worker behavior intact.

`tests/e2e/claims.spec.ts` now has exact regression coverage: at 390 × 844 it visits `/`, `/demo`, `/privacy`, and `/terms`, measures every visible semantic link/button/input/textarea/button-role target, and fails if either dimension is below 44 px. It also verifies skip-link keyboard reachability and Space playback/stop.

## What was built

- A Vite + vanilla TypeScript static app for writing and rendering ABC notation.
- Live staff rendering through MIT-licensed `abcjs`, loaded only when a score needs it.
- Local Web Audio playback derived from the renderer’s pitch and timing data. No sound-font request or runtime CDN is used.
- One-bar and multi-bar looping, 40–220 BPM practice tempo, stop control, playback highlight, staff-click bar selection, and Space-key play/stop.
- Line-numbered ABC errors, with links that select the line to fix.
- URL-fragment score sharing, print-only score cards, browser storage, and an offline service worker.
- A separate `/demo` storage namespace with an original eight-bar score, reset action, and exit to the real editor.
- SPA routes for `/`, `/demo`, `/privacy`, `/terms`, and a designed 404 state.
- Responsive light and dark treatments, reduced-motion behavior, keyboard focus, and 390 px phone layout.
- Original mid-century instrument-panel artwork in WebP and AVIF. Prompt and provenance are in `.factory/design.md`.

## How to run

```sh
npm install
npm run dev
npm test
npm run build
```

The exact deploy command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at the root.

## Verification completed

- Clean install: `npm ci` completed with 0 vulnerabilities. `npm audit --omit=dev` also returned 0 vulnerabilities.
- Full test/type/build path: `npm test` passed 3 Vitest unit tests and 13 Chromium integration/browser tests. Its build step runs `tsc --noEmit` and `vite build`.
- Every documented claim command passed independently: `@claim:sample-score`, `@claim:free-use`, `@claim:local-score`, `@claim:offline-reload`, `@claim:score-playback`, `@claim:bar-loop`, `@claim:score-link`, `@claim:print-card`, and `@claim:error-lines`.
- Production build: `npm run build` produced `dist/index.html`. Initial app JS is 8.63 KB gzip, CSS is 3.72 KB gzip, and lazy `abcjs` is 154.59 KB gzip (163.55 KB combined when notation is rendered), within the static-product budgets. There is no lint script or publishable package/consumer artifact for this static app.
- Browser checks: desktop 1440 × 900 and phone 390 × 844 rendered `/demo` with no page/console errors and no horizontal overflow. The mobile sweep found zero visible controls below 44 × 44 px across `/`, `/demo`, `/privacy`, and `/terms`.
- Accessibility: the Playwright axe integration found zero serious or critical violations in normal, dark, and reduced-motion modes. Keyboard test reached the skip link with Tab and played/stopped the score with Space. `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo /tmp/abc-score-play-evidence-20260828` passed: HTTP 200, title, `lang=en`, one H1, main landmark, no images without alt, no unlabeled buttons, and no console/page errors.
- Privacy/offline/update: the privacy claim intercepts the complete demo flow and rejects every cross-origin request. The offline claim reloads the demo after service-worker installation while offline. A separate update probe found an active controlling `/sw.js`, with no waiting or installing worker after `registration.update()`.
- Response policy: the built `staticwebapp.config.json` was checked for same-origin default/connect CSP, strict-origin referrer policy, and `no-cache` service-worker policy. The app remains account-free, payment-free, analytics-free, and has no live AI/API identity to verify.
- Lighthouse was attempted with the preinstalled Playwright Chromium, but Lighthouse could not attach to that binary in this container (`Unable to connect to Chrome`). Direct browser, axe, bundle, and response-policy checks above completed.

## Known gaps and next steps

- Playback uses a clean local triangle-wave voice instead of sampled instruments. This keeps scores private and removes sound-font downloads, but it is not a realistic piano sound.
- The v1 supports the ABC subset parsed by `abcjs`; advanced multi-voice scores may produce renderer warnings. Warnings remain visible beside the editor.
- Browser interaction latency still needs field data for INP. Lighthouse could not attach to the supplied Chromium in this repair container, though the direct browser checks passed.

These are v1 tradeoffs, not blockers for the brief’s short-score practice job. The independent report remains in `.factory/verification.md` as the original finding; this handoff records the repair evidence.
