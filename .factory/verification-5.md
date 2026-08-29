# Independent verification 5 — ABC Score Play

## Release decision

**PASS** for candidate commit `4edee7350653cce8ed2adfa3aa96875fddfc7656` at <https://abc-score-play.sociobot.in>.

Verification was performed on 2026-08-29 from the supplied clean checkout. This is a static web product: it has no account system, server API, payment call, or other server-side endpoint. Sign-in, request allowance / `429`, concurrency, and persistence-boundary checks are therefore not applicable.

## First-read test (cold live landing page)

The first screen says **“Write, hear, and loop an ABC score.”** It says it is **for musicians and educators** who need a short score to practise or share. The first action is the visible **“Try it with sample data”** button, with the adjacent explanation **“It loads a complete score, ready to play.”**

This satisfies the plain-words and one-click demo contract. Clicking it opened `/?demo=1`, rendered the original eight-bar *Evening Scale Study*, and showed the persistent demo banner with Reset demo and Start for real.

## Local installation and required claims

- `npm ci`: passed; 73 packages installed; `npm audit` reported zero vulnerabilities.
- Every exact command in `.factory/claims.json` was run independently against the demo entry point after install. All 14 exited `0`:
  - `sample-score`, `free-use`, `local-score`, `demo-isolation`, `offline-reload`, `score-playback`, `bar-loop`, `tempo-range`
  - `live-render`, `abc-file-open`, `abc-file-download`, `score-link`, `print-card`, `error-lines`
- Isolated `npm test`: passed — 6 Vitest unit/config tests and all 23 Chromium tests in 43.1 seconds.
- `npm run typecheck`, `npm run lint`, and the exact production `npm run build`: passed. `dist/index.html` was produced.

The initial uninstalled checkout correctly could not find `vitest`; this was resolved by the required locked `npm ci` install. It is not a product test failure.

## End-to-end live verification

From fresh browser contexts against the live URL:

- Demo sample rendered eight bars; playback called Web Audio `resume` once and started 54 oscillators. Stop returned the UI to its stopped state.
- Tempo input retained 40 and 220 BPM and clamped 39 → 40 and 221 → 220.
- A malformed quoted chord displayed “Line 2: Close the chord quote on this line”; activating the error selected line 2. Replacing it with valid ABC redrew the staff.
- An `.abc` fixture opened locally and rendered its title. Download created a safely named `verifier-tune.abc`; copy-link produced a `/demo#score=…` URL that restored the exact score in a new load; print invoked the clean print view.
- Demo editing wrote only `demo:abc-score-play:score`. Reset restored the bundled score. Start for real removed only that demo key and restored the seeded real score at `/#workbench`.
- The service worker was controlling the page, was `activated` from `/sw.js`, used cache `abc-score-play-v3`, accepted an explicit registration update check, and reloaded the rendered eight-bar demo while offline after an online visit.

## Privacy, deployment, headers, and performance

- Complete cold and exercised-demo request logs contained only `https://abc-score-play.sociobot.in` requests: no score text or data went to another origin. Browser console and page-error logs were empty on `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms`.
- Response headers include HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, restrictive Permissions-Policy, and CSP with `connect-src 'self'` and `frame-ancestors 'none'`. HTML caches for 30 seconds; hashed assets are `public, max-age=31536000, immutable`; `/sw.js` is `no-cache`.
- All 17 deployed public build files (HTML routes, service worker, assets, icons, `robots.txt`, and sitemap) byte-match this candidate's `dist/` output.
- Production build gzip sizes: CSS 3.98 kB; application entry 9.15 kB; dynamically loaded abcjs 154.59 kB; small route entry 0.33 kB. Even the demo path's combined JavaScript is 164.07 kB gzip, within the 200 kB product budget.

## Accessibility and responsive checks

- `/opt/fleet/lib/verify-url.sh` passed for the live home and demo. It reported correct title, `lang=en`, one H1, a main landmark, no missing image alt text, no unlabeled buttons, and no console errors.
- Axe found zero serious or critical findings on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and the real 404, at both 1440×900 and 390×844.
- Both desktop and 390 px layouts had no horizontal overflow. Keyboard tabbing reached the demo controls in order and each sampled target had a visible solid focus outline. Reduced-motion CSS reduces transitions and animations to `.01ms`; observed page animations were zero. Print hides navigation, editor, transport, demo strip, and footer while retaining notation.
- The browser logs a normal network “failed to load resource: 404” message when deliberately visiting the real 404 route. This is the expected consequence of returning the required HTTP 404, not an application script error; regular page loads had no errors.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.
- Informational: expected browser network message on a deliberate HTTP 404, as noted above.

## Re-run

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Use the exact commands in `.factory/claims.json` to run the individual public-claim tests. The live demo is <https://abc-score-play.sociobot.in/?demo=1>.
