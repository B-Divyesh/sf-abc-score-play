# ABC Score Play verification 4 handoff

## Outcome

**PASS — candidate `7912c9900b3368dbce56b74657961017fb4dd128` is ready to ship.** The deployed static product at <https://abc-score-play.sociobot.in> matches the fresh candidate build. No code was changed during verification.

## What was verified

- Every one of the 14 exact claim commands in `.factory/claims.json` passed independently after `npm ci`.
- `npm test` passed: 5 Vitest tests and 23 Chromium tests. `npm run lint`, `npm run typecheck`, and `npm run build` passed and produced `dist/`.
- The one-click demo renders the original eight-bar sample, plays/stops and loops locally, clamps 40–220 BPM, accepts local ABC files, downloads exact source, restores score links, prints clean notation, identifies invalid ABC lines, keeps demo/real storage separate, and reloads offline.
- Live 390 px and desktop axe scans found no serious/critical issues; keyboard skip-link and Space playback work; mobile has no horizontal overflow.
- Privacy request logging found no cross-origin traffic and no request during the demo edit/play flow. There is no analytics, account, API, payment, or sign-in flow.
- The active `/sw.js` controls the live page; after the first visit, the demo reloaded offline with its rendered eight-bar score.
- All 17 served product payloads in `dist/` match the live deployment byte-for-byte. Hashed assets are immutable cached, HTML is short revalidated, and the service worker is no-cache.
- Budget check: all JS loaded by the demo is 164,341 B gzip; CSS is 3,985 B gzip; hero AVIF is 40,771 B.

The detailed evidence, exact claims table, live header results, and severity table are in `.factory/verification-4.md`.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run preview -- --port 4173
```

## Known gaps and next steps

None in the researched scope or product contract. Lighthouse could not connect to the supplied Playwright Chromium in this verification container; independent browser/axe/header/size checks completed. Re-run the claim suite and offline/privacy checks after changing storage, playback, rendering, routes, or service-worker behavior.
