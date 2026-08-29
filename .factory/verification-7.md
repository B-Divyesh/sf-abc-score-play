# Independent verification 7

## Verdict

**PASS** — candidate `fa7e414ebdf6725a4c373a80279127e25afbff28` meets the
static-web acceptance contract at <https://abc-score-play.sociobot.in>.
Verified independently on 2026-08-29 UTC. No defects were found.

## Mandatory gates

- `.factory/claims.json` is present with 19 claims. From the clean checkout,
  `npm ci` completed with 0 reported vulnerabilities, then every exact command
  listed in that file was run serially against the local production demo entry
  point. All passed: `sample-score`, `free-use`, `local-score`,
  `demo-isolation`, `offline-reload`, `score-playback`, `bar-loop`,
  `tempo-range`, `live-render`, `abc-file-open`, `abc-file-download`,
  `score-link`, `print-card`, `error-lines`, `sample-load`, `clear-editor`,
  `browser-storage-clear`, `staff-bar-selection`, and `keyboard-playback`.
- A fresh aggregate `npm test` passed: 8 Vitest unit/config tests and all 28
  Chromium tests. This independently re-ran all 19 tagged claims, Axe checks,
  keyboard checks, routing, and responsive checks.
- `npm run typecheck`, `npm run lint`, and the exact production `npm run build`
  passed. The build emitted `dist/`.

## Cold first read and product exercise

The cold live home page passes the plain-words and one-click-demo gate. Its
first screen says **“Write, hear, and loop an ABC score”**, names **musicians
and educators**, and presents **“Try it with sample data”** next to **“It loads
a complete score, ready to play.”** The action enters the isolated eight-bar
sample with a persistent demo notice, Reset demo, and Start for real.

On the live site, the bundled demo rendered as a valid 8-bar score. I exercised
normal editing/rendering, playback/stop, selected-bar looping, downloaded a
safely named `.abc` file, invalid ABC recovery, and a valid replacement score.
The invalid unmatched quote reported **Line 2**, focused that source line, and
the replacement returned to **Valid score**. Boundary input clamped tempo
`39` to `40` and `221` to `220`. The local claim suite additionally verified
the 1,000,000-byte file boundary, 1,000,001-byte rejection, print view,
fragment sharing, both storage namespaces, all demo exits, and two loop passes.

## Accessibility and responsive behaviour

- Live Playwright + Axe scans found 0 serious/critical violations on `/`,
  `/demo`, `/privacy`, `/terms`, a styled 404, and dark/reduced-motion demo.
- Desktop and 390 x 844 mobile were checked. At 390 px, `scrollWidth` equalled
  `clientWidth` (390), the sample staff was in the first viewport, and no
  visible interactive target measured below 44 x 44 CSS px.
- Keyboard-only use reached the visible 3 px coral skip-link focus ring and
  all editor/transport controls. Space on the score paper started browser-audio
  playback and a second Space stopped it. No console or page errors occurred
  during valid live flows.

## Privacy, PWA, headers, and deployment identity

- The live whole-demo request log contained only
  `https://abc-score-play.sociobot.in` resources; it had no request bodies or
  cross-origin requests. Claim tests prove edits and local file selection add
  no request. There is no sign-in, payment, analytics, or server-side product
  endpoint, so Entra and rate-limit checks are not applicable.
- CSP limits connections to `'self'`; live responses also supplied HSTS,
  `X-Content-Type-Options: nosniff`, strict-origin referrer policy,
  restrictive Permissions-Policy, and `frame-ancestors 'none'`.
- After the first visit, `/demo` was service-worker controlled and reloaded
  successfully offline with the valid score visible. `registration.update()`
  completed with active `/sw.js`, no waiting worker, and no installing worker.
  `/sw.js` is served `Cache-Control: no-cache`; hashed assets are
  `public, max-age=31536000, immutable`.
- SHA-256 matched between this candidate's production build and live deployment
  for `index.html`, `demo.html`, `privacy.html`, `terms.html`, `sw.js`, the app
  JS/CSS, loader, and `abcjs` chunk. The live URL therefore matches the tested
  candidate, not an earlier deployment.

## Performance and routes

- Production gzip sizes: application JS 9.32 KB, loader 0.33 KB, lazy ABC
  renderer 154.59 KB (164.24 KB when the rendered score loads), and CSS
  3.98 KB. This is below the 200 KB JS and 50 KB CSS static-product budgets.
  The hero AVIF is 40,771 bytes.
- Live `/`, `/demo`, `/privacy`, `/terms`, `robots.txt`, `sitemap.xml`, social
  image, and icons returned 200. An unknown route returned the designed 404.
  Every normal public navigation link resolved successfully.

## Defects by severity

None.
