# ABC Score Play adversarial review 5 handoff

## Outcome

**FAIL** — review 5 found seven issues in candidate `00172b90a44a0fa4174e1a0abb8199ccc4676829`: six major and one minor. No product code was changed. The complete evidence and concrete fixes are in [`.factory/review-5.md`](review-5.md).

The cold first screen, one-click sample, real-data isolation, offline reload, routing, metadata, accessibility baseline, visual identity, and every declared claim passed. The failures are demo cleanup on ordinary navigation, four unregistered action/interaction claims, incomplete multi-bar claim coverage, and an inaccurate skip-link label.

## Verification performed

- Cloned the candidate to `/tmp/abc-score-play-review5.cJa6s1/repo` and ran `npm ci` successfully.
- Ran all 14 commands from `.factory/claims.json` independently; all passed.
- Ran `npm test`, `npm run typecheck`, `npm run lint`, and `npm run build`; 6 unit/config tests and 23 Chromium tests passed, and `dist/` was produced.
- Audited the live site cold at 390 × 844 and 1440 × 900, including demo edit/reset/exit, storage namespaces, offline reload, request logs, route focus/history, metadata, headers, links, 404, mobile overflow, and axe.
- Ran `/opt/fleet/lib/verify-url.sh` against live home and demo; both passed with no normal-route console errors.
- Compared the candidate build to production; all 16 publicly served deployable files matched byte-for-byte.
- Read reviews 1–4, polish reports 1, 3, and 4, and the prior handoff. All 23 earlier finding IDs remain fixed live and in code.

## Reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Use <https://abc-score-play.sociobot.in/?demo=1> for the sandbox. To reproduce F-5-1, edit the demo, leave through the wordmark, Editor, or Privacy, and inspect `demo:abc-score-play:score`; it remains present. F-5-2 through F-5-6 are visible by comparing landing/README promises with `.factory/claims.json` and their tagged tests. To reproduce F-5-7, focus the first link on `/privacy`; it says **Skip to score editor** but targets the legal page’s `#main`.

## Next steps

Implement the seven fixes in review order, add the specified regression/claim tests, then repeat every claim command and the full live review. No infrastructure, DNS, billing, or deployment work is needed for the review itself.
