# Independent verification 6

## Verdict

**PASS** — candidate `b3f33c9636f6798dac87dcca5c0b91af9fd58eb2` is releasable at
<https://abc-score-play.sociobot.in> (verified 2026-08-29 UTC).

No release-blocking defects were found. The live deployment matched the candidate
production build for all 17 publicly shipped files. `staticwebapp.config.json`
was intentionally excluded from that comparison because it is deployment
configuration and correctly returns 404 as a public URL.

## Required claims and local quality gates

- Started from this clean checkout at the requested candidate; `npm ci` passed
  with zero reported vulnerabilities.
- `.factory/claims.json` exists and contains 18 claims. Every listed exact
  `npm test -- --grep @claim:<id>` command was run serially from the demo entry
  point. All passed: `sample-score`, `free-use`, `local-score`,
  `demo-isolation`, `offline-reload`, `score-playback`, `bar-loop`,
  `tempo-range`, `live-render`, `abc-file-open`, `abc-file-download`,
  `score-link`, `print-card`, `error-lines`, `sample-load`, `clear-editor`,
  `staff-bar-selection`, and `keyboard-playback`.
- Fresh aggregate `npm test` passed: 8 Vitest unit/config tests and 26 Chromium
  tests. `test-results/.last-run.json` records `"status": "passed"` and no
  failed tests.
- `npm run typecheck`, `npm run lint`, and the exact production `npm run build`
  all passed. The build emitted `dist/`.
- Production compressed JS is 164.17 KB total (154.59 KB `abcjs`, 9.25 KB app,
  0.33 KB loader), below the 200 KB static-product budget. CSS is 3.98 KB gzip.
  The responsive hero is 40.8 KB AVIF / 51.8 KB WebP. Hashed assets send
  `Cache-Control: public, max-age=31536000, immutable`; `/sw.js` sends
  `Cache-Control: no-cache`.

## Cold live read and end-to-end exercise

Cold-opening the live home screen answers the three required questions in plain
words: it says it lets a visitor “Write, hear, and loop an ABC score,” identifies
“musicians and educators,” and presents **Try it with sample data** with the
immediate result (“It loads a complete score, ready to play”). The one-click
action opens the isolated eight-bar sample.

On the live desktop and 390×844 mobile views, I verified the loaded eight-bar
score, Play score → Playing score → Stop → “Playback stopped,” reset recovery,
and invalid ABC recovery. An unmatched quote on actual line 6 produced “Line 6:
Close the chord quote on this line”; Reset demo restored the sample. The required
browser tests separately covered selected-bar looping through two passes, tempo
boundaries (40–220), file open/download, fragment sharing, printing, namespace
isolation, and Space-key playback.

The live service worker was controlling the page (`/sw.js`, cache
`abc-score-play-v4`); `registration.update()` completed with no waiting or
installing worker. After a first visit, an offline reload retained the demo and
its “8 bars” render.

## Accessibility, privacy, and deployment checks

- `/opt/fleet/lib/verify-url.sh` passed on home and `?demo=1`: HTTP 200, title,
  `lang=en`, one H1, main landmark, image alt coverage, labeled buttons, and no
  console errors.
- Playwright + axe found **zero violations** at desktop and 390px mobile, hence
  zero serious or critical findings. Keyboard tabbing reached the skip link,
  navigation, demo controls, and editor with a visible solid coral focus ring.
  No rendered interactive target measured below 44×44 px. Reduced-motion media
  emulation was recognized and reduced durations to `0.00001s`.
- Home and demo request logs contained only the product origin. There were no
  request bodies, cross-origin requests, page errors, or console errors during
  the privacy/demo exercise. The live response CSP restricts `connect-src` to
  `'self'`; HSTS, `nosniff`, strict-origin referrer policy, permissions policy,
  and `frame-ancestors 'none'` were present.
- Live routes `/`, `/demo`, `/privacy`, `/terms`, `robots.txt`, and `sitemap.xml`
  returned 200; a missing route returned a styled 404. All live home links
  resolved successfully (or were in-page anchors).
- This is a static product with no server-side product API or sign-in, so rate
  allowance and Entra checks are not applicable.

## Defects by severity

None.

## Verification limitation

The installed Lighthouse CLI could not complete in this container: its automatic
Chrome launch reported `CHROME_PATH` absent, and two runs against the supplied
Playwright Chromium ended with a Chrome protocol/tab crash. This was a verifier
runtime issue, not a page error (Playwright browser checks above completed
normally). Bundle, cache, response-header, mobile, and functional performance
checks were completed independently; no product performance defect was observed.
