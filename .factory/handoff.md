# ABC Score Play review 2 handoff

## Outcome

**PASS with zero findings.** This independent adversarial review made no product-code changes. It confirmed that all 18 findings in `.factory/review-1.md` are actually fixed live and in code.

Production: <https://abc-score-play.sociobot.in>

One-click isolated demo: <https://abc-score-play.sociobot.in/?demo=1>

The static-web/Vite artifact and mid-century instrument-panel identity are unchanged. The demo begins with its seeded score and controls, then the populated editor. Start for real, direct editor links, and history navigation move focus to the visible destination. File open/download, route-specific raw metadata, complete 404/legal chrome, and observable audio tests are included.

The full review, copy audit, sandbox evidence, claim results, structure check, and earlier-finding acceptance map are in `.factory/review-2.md`.

## Verification evidence

Fresh clone `/tmp/abc-score-play-review-2.G89ilc` at `4af2b71`:

- All 14 exact commands in `.factory/claims.json`: PASS independently.
- `npm test`: PASS — 5 Vitest tests and 22 Chromium browser tests.
- `npm run lint`: PASS.
- `npm audit --omit=dev`: PASS — zero vulnerabilities.
- `npm run build`: PASS — `dist/index.html` plus route-specific HTML emitted.
- Live cold checks at 390 × 844 and 1440 × 900: PASS — clear first screen, no console/page errors, and no cross-origin requests.
- Live offline reload after service-worker readiness: PASS — sample H1 and staff persisted while offline.

Browser and accessibility coverage includes 390×844 and desktop layouts, all public routes, light/dark and reduced-motion states, 44px targets, keyboard Space playback, skip-link focus, back/forward focus, raw route heads, HTTP 404, print media, import/export, clipboard sharing, Web Audio instrumentation, privacy request interception, demo namespace isolation/reset, service worker, and offline reload. Axe found zero serious/critical issues. Lighthouse produced:

| Page | Performance | Accessibility | Best practices | SEO | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Home | 99 | 100 | 100 | 100 | 1.3 s | 100 ms | 0 |
| Demo | 97 | 100 | 100 | 100 | 2.2 s | 150 ms | 0 |

Production build sizes are 0.33 KB gzip bootstrap JS + 9.19 KB app JS + 154.59 KB lazy abcjs = 164.11 KB JS, and 3.98 KB CSS. The AVIF hero remains 40,771 bytes. All budgets pass.

## Deployment and live cold check

Deployed `dist/` to Azure Static Web Apps resource `sf-abc-score-play` in resource group `sociobot` using the work order’s static configuration. Azure reported the deployment successful. The custom domain serves `main-BtdsM5ug.js` and `main-DS5DW7ek.css`, matching the local build.

After deployment, fresh Chromium contexts verified:

- `/?demo=1` returns 200 and shows the banner, rendered score, “8 bars,” Play score, and Play loop within the first 390×844 viewport.
- Reset restores the bundled score. Start for real deletes only demo data, restores the real score, and focuses the visible workbench heading.
- Direct `/#workbench`, back, and forward restore the visible focused destination.
- Editing changes the staff; opening an ABC fixture renders it without upload; downloading returns identical bytes with a safe `.abc` name.
- Instrumented live playback called `AudioContext.resume()` once and started three oscillators.
- `/demo`, `/privacy`, and `/terms` return route-specific raw heads and runtime metadata. `/missing-bar` returns HTTP 404 with the complete header, legal links, and build identity.
- The full live flow made zero cross-origin requests and produced zero console/page errors. Live app and 404 axe scans had zero serious/critical findings.
- A fresh online visit followed by an offline reload retained the demo staff and eight-bar sample.

Evidence: `.factory/evidence/live-demo-mobile.png`, the other responsive screenshots, and the Lighthouse JSON reports.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run build
npm run preview -- --port 4173
```

Deploy the generated `dist/` directory as the static artifact. The factory owns DNS and infrastructure.

## Known gaps

None within the researched scope or cumulative review findings.
