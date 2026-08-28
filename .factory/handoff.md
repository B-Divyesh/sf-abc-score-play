# ABC Score Play independent QA handoff

## Release decision: **FAIL**

Candidate `b570b354b30e71ee5db90024d7eb3e36198e9390` was independently tested on 2026-08-28 against <https://abc-score-play.sociobot.in>. Production serves byte-identical app assets for the candidate, so the result is based on the current deployment rather than the earlier reported deployment-only condition.

The full report is in `.factory/verification-2.md`. No product code was changed.

## Release blockers

1. In dark mode, Tab reveals a skip link with `#f7eed9` text on `#f8f1df`: **1.02:1** contrast. A focused-state axe scan reports a serious `color-contrast` violation. The existing axe test scans while the link is hidden and misses it.
2. Unknown URLs return HTTP 200. `public/staticwebapp.config.json` rewrites 404 responses to `/index.html` with status 200, contrary to the required real 404 response.
3. Claims coverage is incomplete: demo/real storage isolation and the public 40–220 BPM range are not fully listed and tested; the print claim test checks only `window.print()` invocation/status, not the promised clean print output.

## What passed

- Mandatory first read and one-click sample demo.
- All nine exact `.factory/claims.json` commands.
- `npm ci`, `npm test` (3 unit + 13 browser tests), `npm run build`, TypeScript, and `npm audit --omit=dev`.
- Valid-score rendering, playback/stop, two loop passes, 40/220 BPM clamping, 1/8 bar clamping, invalid-line selection and recovery, clearing/loading, fragment sharing, print CSS behavior, and demo namespace isolation.
- Desktop and 390 px mobile layout, 44 px touch targets, keyboard operation, reduced motion, no horizontal overflow, and zero console/page errors.
- Local-only traffic, restrictive response policies, offline reload, service-worker update, immutable hashed-asset caching, privacy/terms pages, and no account/payment/AI dependencies.
- Live/local SHA-256 identity for the app JS, CSS, and lazy `abcjs` bundle.
- Lighthouse mobile: home 96 performance/100 accessibility/100 best practices/100 SEO; demo 97/100/100/100. LCP was 1.1 s home and 1.8 s demo; CLS was 0 for both.
- Bundles: 163.82 KB total JS gzip, 3.73 KB CSS gzip, 40,771-byte hero AVIF.

There is no lint command, publishable library/CLI, backend/API, product-unlock endpoint, or sign-in flow; lint, consumer-install, rate-limit, backend concurrency/persistence, and Entra checks are therefore not applicable.

## How to reproduce

```sh
npm ci
npm test
npm run build
npm audit --omit=dev
npm run preview -- --port 4173
```

Then open `/demo` in a 390 × 844 Chromium context with dark color scheme and reduced motion, press Tab once, and run axe. Probe `https://abc-score-play.sociobot.in/missing-bar` with `curl` to observe HTTP 200. See `.factory/verification-2.md` for claim commands, hashes, routes, metrics, and exact functional evidence.

## Next steps

Fix all three blockers, add regression coverage for the focus-revealed dark skip link and true 404 status, complete the claim catalog/tests, deploy the repaired commit, and repeat independent verification.
