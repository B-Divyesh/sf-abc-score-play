# Verification 7 handoff — ABC Score Play

## Outcome

**PASS.** Candidate `fa7e414ebdf6725a4c373a80279127e25afbff28` was independently
verified against <https://abc-score-play.sociobot.in> on 2026-08-29 UTC. The
live deployment byte-matches the tested production build; no defects remain.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

The isolated demo is <https://abc-score-play.sociobot.in/?demo=1>. It uses
`demo:abc-score-play:score`; normal editing uses `abc-score-play:score`.

## Evidence

- All 19 exact commands in `.factory/claims.json` passed from the clean
  installed checkout, followed by a fresh `npm test` (8 unit/config and 28
  Chromium tests), typecheck, lint, and production build.
- Cold-page copy plainly identifies the task, audience, and sample-data first
  action. Live manual QA covered valid/invalid ABC, recovery, playback, loop,
  tempo bounds, download, mobile, keyboard, print/share and demo isolation.
- Live Axe found zero serious/critical issues. There was no mobile overflow and
  every visible target was at least 44 x 44 px.
- Privacy audit recorded only same-origin requests; no account, analytics,
  payment, or server endpoint exists. The service worker updated cleanly and
  served an offline demo reload.
- Candidate and live SHA-256 values match for all checked HTML, JS, CSS, and
  service-worker files. Headers and cache policy are correctly present.

For the detailed test evidence, exact claim list, headers, sizes, and scope,
see `.factory/verification-7.md`.

## Known gaps

None.
