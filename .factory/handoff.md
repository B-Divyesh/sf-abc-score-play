# ABC Score Play polish 4 handoff

## Outcome

**PASS — every cumulative finding is closed.** The static product at <https://abc-score-play.sociobot.in> was deployed from repair commit `69848de050bcecd7f095a3dea7d61d4a6bb2d342`. The one-click sandbox is <https://abc-score-play.sociobot.in/?demo=1>.

Round four replaces the metaphorical 404 heading with **Page not found** in both 404 render paths. It also makes the locked install explicit: Node 20 is recorded in the manifest and lockfile, README uses `npm ci`, and a unit test compares the root lock metadata with `package.json`. All earlier demo, claims, copy, routing, metadata, focus, mobile, accessibility, privacy, file, and offline repairs remain covered.

## Exact verification evidence

- Clean clone: `/tmp/abc-score-play-polish-4.zFTrLU/repo` at `69848de050bcecd7f095a3dea7d61d4a6bb2d342`.
- `npm ci`: passed; 73 packages installed, zero vulnerabilities.
- Every exact command in `.factory/claims.json`: all 14 passed independently.
- `npm test`: passed 6 Vitest unit/config tests and 23 Chromium browser tests.
- `npm run lint`, `npm run typecheck`, `npm run build`, and `npm audit --omit=dev`: passed; `dist/index.html` exists.
- Local `verify-url.sh`: home and `/?demo=1` passed with one H1, `lang=en`, main landmark, alt text, and zero console errors.
- Live route/axe audit at 390×844: `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200; `/missing-polish-4` returned 404. Each had one H1, the correct title/canonical, matching navigation and legal links, no overflow, and zero serious/critical axe findings.
- Live demo: score, **8 bars**, **Play score**, and **Play loop** were all in the first phone viewport. Audio recorded 1 resume and 54 oscillator starts; the loop completed two passes.
- Live isolation: demo edits changed only `demo:abc-score-play:score`; Reset demo restored the original sample; Start for real removed demo storage, restored the real score, and focused the visible editor heading.
- Live privacy/offline: the complete flow made zero cross-origin requests and no page errors. After one online reload, the rendered eight-bar demo reloaded offline.
- Live import/export/share/print/error checks: **Live File** rendered from exact fixture bytes, `live-file.abc` downloaded byte-for-byte, the score link updated and restored its fragment, print invoked the clean view, and the broken title selected line 2.
- Live Lighthouse 13.0.1 mobile: home 100 performance / 100 accessibility / 100 best practices / 100 SEO, LCP 1.2 s, TBT 70 ms, CLS 0; demo 97/100/100/100, LCP 1.9 s, TBT 190 ms, CLS 0.
- Payload proof: all 17 public files in `dist/` match the custom-domain responses byte-for-byte.
- Deployment: Azure Static Web Apps deployment `6a6127ce-f830-4327-8443-068cf936a63c` succeeded; the custom domain returned HTTPS 200.

Screenshots and machine reports are in `.factory/evidence/polish-4/`. The complete finding-to-evidence matrix is `.factory/polish-4.md`.

## Run and verify

```sh
npm ci
npm test
npm run lint
npm run typecheck
npm run build
npm run preview -- --port 4173
```

To rerun one public claim, use its exact command from `.factory/claims.json`. The deployment command for this work order is `npm ci && npm test && npm run build`, with `dist/` uploaded as the static site root.

## Known gaps and next steps

None in the researched scope or product contract. Re-run the claims, offline, privacy, and route checks after changing storage, playback, rendering, or service-worker behavior.
