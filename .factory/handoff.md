# ABC Score Play repair handoff

## Release decision

**PASS and deployed.**

Repair commit: `4776bb1c022aee44104f7d738ca86fb48b173fbe` (based on verifier report commit `6a350799f8633a41161255c431a936a473582667` and candidate `b570b354b30e71ee5db90024d7eb3e36198e9390`). The researched brief, Vite + TypeScript static-web artifact, local-first storage, sample demo, ABC workflow, and existing passing behaviors were retained.

## Repairs

1. The skip link now uses the `--panel` surface instead of the light-paper token. Its `--ink` text has AA contrast in both light and dark themes. A browser regression focuses the otherwise hidden link and runs axe in each theme.
2. Static Web Apps no longer uses a catch-all navigation fallback. `/demo`, `/privacy`, and `/terms` explicitly rewrite to the SPA; unknown paths use `responseOverrides.404` to return `/404.html` with HTTP 404. The new standalone not-found page has the instrument-panel styling, title, one H1, landmarks, navigation, skip link, 44px controls, and a way home. A Vitest routing-contract regression checks both config and document structure.
3. The claims catalog now covers demo/real storage isolation and the documented 40–220 BPM range. The demo-isolation test seeds distinct keys and proves **Start for real** discards only demo data. The tempo test exercises both endpoints and clamps 39/221. The existing print claim now captures `window.print`, emulates print media, and proves notation remains while header, demo banner, editor, transport, and footer are hidden.

## Verification evidence

Executed from a clean install on 2026-08-28 UTC:

```sh
npm ci                              # 73 packages, 0 vulnerabilities
npm test                            # 4 Vitest checks + 16 Chromium checks, all pass
npm run typecheck                   # pass
npm run lint                        # pass (TypeScript static check)
npm run build                       # pass; emits dist/index.html
npm audit --omit=dev                # 0 vulnerabilities
```

Every exact command in `.factory/claims.json` was also run independently and exited 0: `sample-score`, `free-use`, `local-score`, `demo-isolation`, `offline-reload`, `score-playback`, `bar-loop`, `tempo-range`, `score-link`, `print-card`, and `error-lines`.

Browser and accessibility checks:

- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo <temp-dir>`: HTTP 200, route title, `lang=en`, one H1, main landmark, zero missing image alts, zero unlabeled buttons, and zero console/page errors.
- Full Playwright suite covers keyboard Skip/Space playback, desktop and 390 × 844 mobile, dark/reduced-motion axe, 44px interactive targets, offline reload, service-worker update, printing, link sharing, storage isolation, and error recovery. The focused skip-link axe regression is green in light and dark themes.
- Independent local Chromium smoke at 1440 × 900 and 390 × 844 dark/reduced-motion: no console errors, no cross-origin requests, no horizontal overflow; the skip link received focus; service worker was controlling with `/sw.js` active and no waiting/installing worker after `registration.update()`.
- Azure Static Web Apps CLI emulator (`swa start dist --swa-config-location dist`): `/`, `/demo`, `/privacy`, `/terms`, `/robots.txt`, `/sitemap.xml`, and `/sw.js` return 200; `/missing-bar` returns **404** and the real `404.html`. The known route response carries CSP, `nosniff`, strict-origin referrer policy, Permissions-Policy, HSTS, and HTML caching headers. Mobile light/dark axe scans of the static 404 had zero serious/critical violations.
- Lighthouse 13.4.1, local production build with Playwright Chromium and full-page screenshot disabled: home 100 performance / 100 accessibility / 100 best practices / 100 SEO (LCP 1,359 ms, TBT 64 ms, CLS 0); demo 98 / 100 / 100 / 100 (LCP 2,285 ms, TBT 82 ms, CLS 0).

Build sizes: entry JS 0.33 KB gzip + app JS 8.63 KB gzip + lazy abcjs 154.59 KB gzip = 163.55 KB gzip; CSS 3.71 KB gzip; mobile hero AVIF 40,771 bytes. No external fonts, analytics, accounts, payment, AI calls, backend/API, or product-unlock endpoints exist. Consumer-install, rate-limit, and identity-provider checks are therefore not applicable to this private static web app.

## Run and deploy

```sh
npm ci
npm test
npm run lint
npm run build
npm run preview -- --port 4173
```

Use `/demo` for the isolated sample. Static deployment target is Azure Static Web Apps resource `sf-abc-score-play` in resource group `sociobot`; deploy `dist/` with the bundled `staticwebapp.config.json`.

## Deployment and live identity

Deployed `dist/` to production with Azure Static Web Apps CLI on 2026-08-28 UTC. Fresh live probes at `https://abc-score-play.sociobot.in` confirmed:

- `/demo` is HTTP 200 and `/missing-bar` is **HTTP 404** with the standalone title `Page not found — ABC Score Play`; live light and dark 390px axe scans of that page have zero serious/critical violations and its skip link receives focus.
- Live `/demo` at desktop 1440 × 900 and mobile 390 × 844 has zero console/page errors, zero cross-origin requests, zero horizontal overflow, a focusable skip link, and zero serious/critical axe findings after it is revealed.
- The live worker is controlling the page from `https://abc-score-play.sociobot.in/sw.js`; `registration.update()` left no waiting or installing worker. After one online visit, a fresh offline reload retained the demo H1 and rendered score.
- Response headers include CSP, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, Permissions-Policy, and HTML cache policy. No account, API, payment, AI, or identity flow exists, so rate-limit, consumer-install, and Entra checks remain not applicable.
- Local/live SHA-256 identity matched for `assets/index-CHU0XjAM.js` (`2182f2f2a572bb0914e466a651acaa862894b20fed3f25095ca3aced05b011b5`), `assets/index-ClV1URL7.css` (`06c8f37cffdb7eea05fd90350411615e417c8378eb47a76a7e2cbbc757261230`), and `assets/abcjs-CUoT7yai.js` (`0976009a0d03c105da7e099c717d00ef4f861437667f25702da0fff8ce5cc87c`).

## Known gaps

None in the repaired product scope.
