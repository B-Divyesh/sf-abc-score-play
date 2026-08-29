# Polish 6 handoff — ABC Score Play

## Outcome

**PASS.** Round six closes every finding in `.factory/review-1.md` through `.factory/review-6.md` and every earlier polish report. The production repair was deployed from `c23f833` to <https://abc-score-play.sociobot.in>.

The repair explains all required ABC fields in the empty editor, removes the remaining “headers” jargon from errors, discloses the 1 MB ABC-file limit, and registers/tests browser-storage clearing. Privacy claim tests now start after initial assets and fail if a score edit or file selection causes any request, including a same-origin upload.

## Commits and deployment

- Base candidate: `b3f33c9636f6798dac87dcca5c0b91af9fd58eb2`
- Review record: `e35afc55b453658f8b5195f690badd1b2d3c81c5`
- Product repair: `c23f833 fix: close round six claim gaps`
- Production target: Azure Static Web App `sf-abc-score-play` in `sociobot`
- Deployment: `swa deploy ./dist --env production` completed successfully; Azure returned `https://polite-cliff-096e89410.7.azurestaticapps.net`
- Custom-domain confirmation: live home referenced `assets/main-PmRgl8xs.js`, the same app artifact produced by the deployed build.

## How to run and verify

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
npm audit --omit=dev
```

Run each exact command listed in [claims.json](claims.json); there are 19 declared claims, all using the isolated demo entry point where applicable. For example:

```sh
npm test -- --grep @claim:abc-file-open
npm test -- --grep @claim:browser-storage-clear
```

The demo is <https://abc-score-play.sociobot.in/?demo=1>. It uses `demo:abc-score-play:score`; real edits use `abc-score-play:score`. Demo storage is discarded on every exit.

## Exact evidence

- Fresh clone: `/tmp/abc-score-play-polish6-clean.GTqFfc/repo` at `c23f833`.
- Fresh-clone `npm ci` passed with zero vulnerabilities. All 19 exact claim commands passed serially, followed by `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev`.
- Aggregate test run: 8 Vitest checks and 28 Chromium checks passed. `test-results/.last-run.json` reports `passed`.
- The 1 MB boundary claim accepted a 1,000,000-byte valid ABC file, rejected 1,000,001 bytes with “That file is over 1 MB. Choose a smaller ABC file.”, and observed no request after either selection.
- The local-score claim and the production round-six check observed no request after score editing. Production also recorded zero cross-origin requests, request bodies, page errors, or console errors during the full demo audit.
- `/opt/fleet/lib/verify-url.sh` passed on the live home and `?demo=1`; reports and screenshots are in [evidence/polish-6](evidence/polish-6).
- Live Axe scans on `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and `/missing-polish-6` had zero serious or critical violations. The cold live audit in [live-audit.json](evidence/polish-6/live-audit.json) also confirms 200 routes, styled 404, metadata, mobile geometry, audio, selected-bar looping, two-pass multi-bar looping, all demo exits, local file round-trip, and offline reload.
- [live-round6.json](evidence/polish-6/live-round6.json) records the production checks for F-6-1 through F-6-4. The full finding-to-evidence map is [polish-6.md](polish-6.md).
- Production bundle sizes: 164,247 bytes gzip JavaScript and 3,976 bytes gzip CSS. The lazy abcjs chunk is 154,593 bytes gzip; the initial app chunk is 9,321 bytes gzip.

## Known gaps

None in product behavior, accessibility, privacy, routing, copy, or deployment.

Lighthouse 13.4.1 could not connect to the supplied Chromium (`Unable to connect to Chrome`), so no new Lighthouse score is claimed. Direct production browser checks, Axe, response metadata, offline reload, screenshots, and bundle budgets all passed.
