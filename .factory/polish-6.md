# Perfection loop polish 6

- **Base candidate:** `b3f33c9636f6798dac87dcca5c0b91af9fd58eb2`
- **Adversarial review:** `e35afc55b453658f8b5195f690badd1b2d3c81c5`
- **Repair commit:** `c23f833`
- **Production:** <https://abc-score-play.sociobot.in>
- **One-click demo:** <https://abc-score-play.sociobot.in/?demo=1>
- **Static Web App:** `sf-abc-score-play` (`polite-cliff-096e89410.7.azurestaticapps.net`)
- **Cold production verification:** 2026-08-29 UTC

All findings in reviews 1 through 6 are closed. The mid-century instrument-panel identity, static deployment class, and local-first design remain unchanged.

## Finding map

| Finding | Change made | Evidence: test, screenshot, and live check |
| --- | --- | --- |
| F-1-1 | Demo starts at the populated score and transport, before the editor on phones. | `@claim:sample-score`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); cold `?demo=1` in [live audit](./evidence/polish-6/live-audit.json). |
| F-1-2 | Demo exit, direct editor links, and history focus the visible editor heading. | route-focus test; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live audit confirms `/#workbench` focus. |
| F-1-3 | Playback tests require AudioContext resume, oscillator creation, and oscillator start. | `@claim:score-playback`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live audit recorded playback with no errors. |
| F-1-4 | A declared live-render test changes the source, title, and SVG staff. | `@claim:live-render`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live URL check passed. |
| F-1-5 | The untestable sound-font promise remains removed. | README/copy audit and `@claim:score-playback`; [home phone](./evidence/polish-6/live-home/screenshot-mobile.png). |
| F-1-6 | Home, demo, legal, and 404 heads keep route-specific titles, canonical URLs, and social metadata. | route metadata test; [404 phone](./evidence/polish-6/live-404/screenshot-mobile.png); live audit raw/runtime route checks passed. |
| F-1-7 | The compact header keeps Demo, Editor, and Privacy on every route. | mobile-target/navigation test; [home phone](./evidence/polish-6/live-home/screenshot-mobile.png); live audit route check passed. |
| F-1-8 | Visitor copy uses **educators** consistently. | first-screen test and copy audit; [home phone](./evidence/polish-6/live-home/screenshot-mobile.png); live first screen passed. |
| F-1-9 | All editor guidance now names the ABC fields rather than using “headers.” | `editor guidance explains ABC fields without header jargon`; [home phone](./evidence/polish-6/live-home/screenshot-mobile.png); live round-six check passed. |
| F-1-10 | README says playback comes through the listener’s speakers. | README audit and `@claim:score-playback`; live demo check passed. |
| F-1-11 | README uses plain open-source abcjs attribution; license detail stays with licenses. | README audit and `npm test`; [home desktop](./evidence/polish-6/live-home/screenshot-desktop.png). |
| F-1-12 | Visitor-facing sound-font jargon remains absent. | README/copy audit and `@claim:score-playback`; live demo check passed. |
| F-1-13 | Sharing is called a score link and its `#score=` privacy consequence is direct. | `@claim:score-link` and `@claim:local-score`; live audit reports no body or cross-origin request. |
| F-1-14 | Deploy documentation describes routing, browser rules, and caching in plain language. | README audit, `npm run build`, and this production deployment. |
| F-1-15 | Local open/download preserve exact ABC source and safe filenames. | `@claim:abc-file-open`, `@claim:abc-file-download`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live audit round trip passed. |
| F-1-16 | Visitor copy describes demo isolation without browser-key jargon. | `@claim:demo-isolation`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live exits preserved the real score. |
| F-1-17 | Product copy consistently uses **practice**. | copy audit; [home phone](./evidence/polish-6/live-home/screenshot-mobile.png); live first screen passed. |
| F-1-18 | The designed 404 keeps legal links, build identity, and artwork provenance. | hosting-config test; [404 phone](./evidence/polish-6/live-404/screenshot-mobile.png); live 404 route check passed. |
| F-3-1 | Workbench labels are **Score editor** and **Sample score editor**. | `landing sections use plain, task-specific names`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png). |
| F-3-2 | The decorative “Three moves” label remains removed. | `landing sections use plain, task-specific names`; [home desktop](./evidence/polish-6/live-home/screenshot-desktop.png). |
| F-3-3 | The decorative “Kept focused” label remains removed. | `landing sections use plain, task-specific names`; [home desktop](./evidence/polish-6/live-home/screenshot-desktop.png). |
| F-4-1 | Both 404 implementations use **Page not found** and the direct recovery sentence. | `legal and unknown routes have one clear heading`; [404 phone](./evidence/polish-6/live-404/screenshot-mobile.png); live 404 returned HTTP 404. |
| F-4-2 | The tracked lockfile supports the documented `npm ci` clean install. | hosting-config lockfile test; fresh-clone `npm ci` and full suite passed. |
| F-5-1 | Every demo exit clears demo data and leaves real data unchanged. | `@claim:demo-isolation`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live audit covered Home, Editor, Privacy, Terms, and Start for real. |
| F-5-2 | Load sample score is declared and proves source, eight bars, enabled playback, and real storage. | `@claim:sample-load`; live audit passed. |
| F-5-3 | Clear editor is declared for both namespaces and preserves the inactive one. | `@claim:clear-editor`; live audit passed. |
| F-5-4 | Selecting staff bar three sets both loop endpoints and the summary. | `@claim:staff-bar-selection`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live audit passed. |
| F-5-5 | Space starts and stops real Web Audio outside text fields. | `@claim:keyboard-playback`; live audit passed with an instrumented audio graph. |
| F-5-6 | The loop test selects bars 2–3 and observes two complete passes. | `@claim:bar-loop`; live audit observed both measures and 24 oscillator starts. |
| F-5-7 | Every skip link says **Skip to page content** and targets `#main`. | public-page accessibility test; live audit route checks passed. |
| F-6-1 | Rewrote the blank-editor placeholder and all related errors to name tune number, title, meter, note length, and key. | `editor guidance explains ABC fields without header jargon`; [home phone](./evidence/polish-6/live-home/screenshot-mobile.png); [live round-six check](./evidence/polish-6/live-round6.json). |
| F-6-2 | Privacy claim tests now start after initial assets and fail if an edit or file selection starts any request. | `@claim:local-score` and `@claim:abc-file-open`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); live round-six edit/file checks recorded zero subsequent requests. |
| F-6-3 | The product, README, and claim disclose the 1 MB limit; the claim covers 1,000,000-byte acceptance and 1,000,001-byte rejection. | `@claim:abc-file-open`; [demo phone](./evidence/polish-6/live-demo/screenshot-mobile.png); [live round-six check](./evidence/polish-6/live-round6.json). |
| F-6-4 | Added the browser-storage-clear claim and verified the privacy control. | `@claim:browser-storage-clear`; [home phone](./evidence/polish-6/live-home/screenshot-mobile.png); [live round-six check](./evidence/polish-6/live-round6.json). |

## Verification summary

- Fresh clone: `/tmp/abc-score-play-polish6-clean.GTqFfc/repo` at `c23f833`; `npm ci`, all 19 exact claim commands, `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev` passed.
- Aggregate suite: 8 Vitest checks and 28 Chromium checks passed. The new privacy tests reject any request after score entry or file selection, including same-origin uploads.
- Production deployment succeeded through `swa deploy ./dist --env production` to `sf-abc-score-play`. The live HTML referenced `main-PmRgl8xs.js`, matching the deployed local build.
- Cold live `verify-url.sh` checks passed for home and `?demo=1`; each had a title, `lang=en`, one H1, main landmark, complete image alt text, labeled controls, and no console error. Screenshots and reports are in `evidence/polish-6/`.
- Live Axe scans on home, both demo URLs, Privacy, Terms, and 404 found zero serious or critical violations. The full live audit rechecked routing, 404, metadata, first screen, mobile demo geometry, audio, multi-bar playback, file round-trip, every demo exit, privacy requests, and offline reload.
- Built JavaScript is 164,247 bytes gzip and CSS is 3,976 bytes gzip. The initial app chunk is 9,321 bytes gzip; abcjs stays lazy-loaded. Lighthouse 13.4.1 was attempted with the supplied Chromium, but its launcher could not connect to Chrome; direct production browser, Axe, bundle, response, and viewport checks passed.
