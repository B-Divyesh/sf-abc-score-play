# ABC Score Play v1 handoff

## What was built

- A Vite + vanilla TypeScript static app for writing and rendering ABC notation.
- Live staff rendering through MIT-licensed `abcjs`, loaded only when a score needs it.
- Local Web Audio playback derived from the renderer’s pitch and timing data. No sound-font request or runtime CDN is used.
- One-bar and multi-bar looping, 40–220 BPM practice tempo, stop control, playback highlight, staff-click bar selection, and Space-key play/stop.
- Line-numbered ABC errors, with links that select the line to fix.
- URL-fragment score sharing, print-only score cards, browser storage, and an offline service worker.
- A separate `/demo` storage namespace with an original eight-bar score, reset action, and exit to the real editor.
- SPA routes for `/`, `/demo`, `/privacy`, `/terms`, and a designed 404 state.
- Responsive light and dark treatments, reduced-motion behavior, keyboard focus, and 390 px phone layout.
- Original mid-century instrument-panel artwork in WebP and AVIF. Prompt and provenance are in `.factory/design.md`.

## How to run

```sh
npm install
npm run dev
npm test
npm run build
```

The exact deploy command is `npm run build`. Output lands in `dist/`, with `dist/index.html` at the root.

## Verification completed

- `npm test`: passed 3 unit tests and 11 Chromium tests.
- `npm test -- --grep @claim:bar-loop`: passed as an individual claim command.
- `npm run build`: passed with TypeScript checking; initial app JavaScript is 8.63 KB gzip, CSS is 3.67 KB gzip, and the lazy ABC renderer is 154.59 KB gzip.
- `npm audit`: 0 vulnerabilities.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo …`: passed with no console errors, one H1, one main landmark, `lang=en`, and no missing alt text.
- Playwright axe scan: no serious or critical issues in light mode, dark mode, or reduced-motion mode.
- Phone check: 390 × 844, no horizontal document overflow.
- Offline claim: loaded `/demo`, waited for the service worker, reloaded online, switched the context offline, and reloaded the rendered score.
- Privacy claim: the full demo edit flow made no cross-origin requests.

## Lighthouse-class measurement

Lighthouse 12.8.2, mobile defaults, local production preview, 2026-08-28:

| Category or metric | Result |
| --- | ---: |
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |
| Largest Contentful Paint | 1.4 s |
| Total Blocking Time | 50 ms |
| Cumulative Layout Shift | 0 |
| First-load transfer | 54 KiB |

## Known gaps and next steps

- Playback uses a clean local triangle-wave voice instead of sampled instruments. This keeps scores private and removes sound-font downloads, but it is not a realistic piano sound.
- The v1 supports the ABC subset parsed by `abcjs`; advanced multi-voice scores may produce renderer warnings. Warnings remain visible beside the editor.
- Browser interaction latency needs field data for INP. The lab run recorded no user interaction sample; total blocking time was 50 ms.

These are v1 tradeoffs, not blockers for the brief’s short-score practice job.
