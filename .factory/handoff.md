# Adversarial review 6 handoff

## Outcome

**FAIL.** Review 6 found four issues: one blocking reopened copy finding and three major claim-governance findings. No product code was modified.

- F-6-1 / reopened F-1-9: the blank editor placeholder still uses unexplained “headers” jargon.
- F-6-2: privacy/no-upload tests ignore same-origin request bodies and could pass after an upload regression.
- F-6-3: the README and claim omit the actual 1 MB ABC-file limit.
- F-6-4: “Clearing browser storage also removes it” is not registered or tested.

The complete evidence, rewrites, claim results, and 30-item historical regression map are in [review-6.md](review-6.md).

## Verification completed

- Cold live Chromium at 390×844 and 1440×900; first screen, one-click demo, Reset, Start for real, all demo exits, storage isolation, request log, service worker, and offline reload.
- Every one of the 18 exact `.factory/claims.json` commands from clean clone `/tmp/abc-score-play-review6-clean.BorGxv/repo` at `be9425b6481b30621f7b441e520ba5a5cb981817`.
- Aggregate `npm test`: 8 Vitest tests and 26 Chromium tests passed.
- `npm run typecheck`, `npm run lint`, and `npm run build` passed; `dist/` was produced.
- Live route/link crawl, raw/runtime metadata, focus/back/forward, security headers, six-route Axe scan, and `/opt/fleet/lib/verify-url.sh` on home and demo.
- All 17 publicly served files matched the clean `dist/` build byte-for-byte. JavaScript totals 164,433 bytes gzip.

## How to reproduce

```sh
npm ci
npm test
npm run typecheck
npm run lint
npm run build
```

Run each claim with its exact command from `.factory/claims.json`, for example:

```sh
npm test -- --grep @claim:abc-file-open
```

## Next steps

Repair only the four findings above, add the specified regression checks, deploy through the factory workflow, and repeat the live review. Infrastructure, DNS, billing, accounts, analytics, and AI are out of scope.
