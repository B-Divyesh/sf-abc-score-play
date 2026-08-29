# ABC Score Play review 4 handoff

## Outcome

**FAIL — candidate `93d4b7769e5de84d7ed09146c2089b625aeee831` has two minor findings.** No product code was modified. See F-4-1 and F-4-2 in .factory/review-4.md.

## What was verified

- Every one of the 14 exact claim commands in `.factory/claims.json` passed independently from a clean clone after `npm install`.
- `npm test` passed: 5 Vitest tests and 23 Chromium tests. `npm run lint`, `npm run typecheck`, and `npm run build` passed and produced `dist/`.
- The one-click demo renders the original eight-bar sample, plays/stops and loops locally, clamps 40–220 BPM, accepts local ABC files, downloads exact source, restores score links, prints clean notation, identifies invalid ABC lines, keeps demo/real storage separate, and reloads offline.
- Live 390 px and desktop axe scans found no serious/critical issues; keyboard skip-link and Space playback work; mobile has no horizontal overflow.
- Privacy request logging found no cross-origin traffic and no request during the demo edit/play flow. There is no analytics, account, API, payment, or sign-in flow.
- The active `/sw.js` controls the live page; after the first visit, the demo reloaded offline with its rendered eight-bar score.
- All 17 served product payloads in `dist/` match the live deployment byte-for-byte. Hashed assets are immutable cached, HTML is short revalidated, and the service worker is no-cache.
- Budget check: all JS loaded by the demo is 164,341 B gzip; CSS is 3,985 B gzip; hero AVIF is 40,771 B.

The detailed current evidence, copy audit, and finding fixes are in .factory/review-4.md.

## Run and verify

Until a lockfile is committed:

    npm install
    npm test
    npm run lint
    npm run typecheck
    npm run build
    npm run preview -- --port 4173

After adding package-lock.json, verify `npm ci` in a new clone and repeat every exact command in .factory/claims.json.

## Known gaps and next steps

F-4-1: make the 404 heading direct rather than metaphorical. F-4-2: add and verify a package lock, or deliberately document the non-locked install path. Do not mark PASS until both are repaired and the cold, demo, claim, and clean-install checks repeat.
