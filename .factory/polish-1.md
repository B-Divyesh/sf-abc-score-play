# Perfection loop polish 1

**Base review:** `238a1780f463df995bf255d450d24dbc122e7f70`

**Repair implementation:** `5c7534f`

**Production:** <https://abc-score-play.sociobot.in>

**Cold verification date:** 2026-08-28 UTC

Every finding in `.factory/review-1.md` is closed. No earlier `.factory/polish-*.md` exists. Earlier verification regressions for touch targets, focused dark-mode contrast, claims, and real 404 responses remain covered by tests.

| Finding | Change made | Automated evidence | Screenshot and live evidence |
| --- | --- | --- | --- |
| F-1-1 | Removed the second demo hero. The seeded workbench now starts below the banner; phone layout puts the score and compact transport before the populated editor. | `@claim:sample-score` asserts the score, “8 bars,” Play score, and Play loop intersect 390×844. | [Live phone demo](./evidence/live-demo-mobile.png); cold `/?demo=1` measured all four elements inside the first viewport. |
| F-1-2 | Route focus now targets the new H1, or `#workbench-title` for editor links, after scrolling. Start for real clears only demo data. | `Start for real, direct editor links, and browser history focus the visible destination`; `@claim:demo-isolation`. | [Live phone demo](./evidence/live-demo-mobile.png); live Start for real, direct `/#workbench`, back, and forward checks passed with visible focused headings. |
| F-1-3 | Playback claim now replaces Web Audio with an observable test graph and requires `resume()`, oscillator creation, and oscillator `start()`, with `pageerror` failure. | `@claim:score-playback`. | Live `/?demo=1` recorded 1 resume, 3 oscillators, 3 starts, and zero browser errors. |
| F-1-4 | Added the `live-render` claim and a distinct tune edit that must change the SVG, show its title, and stay valid. | `@claim:live-render`. | Live `/?demo=1` rendered “Live Render” after editing. |
| F-1-5 | Rewrote the README promise to “Plays valid scores through your browser.” | Claims cross-check plus `@claim:score-playback` and `@claim:local-score`. | Repository-only copy fix; live playback and zero cross-origin request checks passed. |
| F-1-6 | Added route-specific source HTML for Demo, Privacy, and Terms; runtime metadata updates description, canonical, Open Graph, and Twitter fields. The 404 now has canonical, social, favicon, apple-touch, and noindex metadata. | `route titles, social metadata, raw heads, and consistent navigation are complete`; `ships route-specific raw metadata documents`. | Live raw `/demo`, `/privacy`, `/terms` returned their own titles; `/missing-bar` returned the complete 404 head. |
| F-1-7 | Kept Privacy visible at 390px and aligned the SPA and standalone 404 compact headers. | `regression: every visible mobile control has a 44 by 44 touch target`; route navigation assertions. | [Live 404 phone](./evidence/not-found-mobile.png) and [live demo phone](./evidence/live-demo-mobile.png); all live headers exposed Demo, Editor, Privacy. |
| F-1-8 | Standardized the audience term to “educators.” | First-screen assertion in live cold-copy check; `.factory/copy-audit.md`. | [Home desktop](./evidence/home-desktop.png); live `/` contained “musicians and educators.” |
| F-1-9 | Replaced “ABC headers” guidance with “title, meter, note length, key, and notes.” | Live cold-copy check; `.factory/copy-audit.md`. | Live `/` three-step section contained the rewritten guidance. |
| F-1-10 | Replaced “local synthesized audio” with “plays it through your speakers.” | README copy audit and clean-clone source check. | Repository-only README fix; live browser playback passed. |
| F-1-11 | Rewrote the capability as “Draws the score with the open-source abcjs library”; MIT detail remains in licenses. | README copy audit and clean-clone source check. | Repository-only README fix. |
| F-1-12 | Removed “sound-font” from visitor-facing copy. | README copy audit and clean-clone source check. | Repository-only README fix; live playback passed without cross-origin requests. |
| F-1-13 | Rewrote sharing and privacy in direct words: score links restore the score; browsers do not send the part after `#score=`. | `@claim:score-link`; `@claim:local-score`. | Live full demo flow made zero cross-origin requests. |
| F-1-14 | Rewrote deploy documentation to say routes map to HTML, browser security rules are set, and versioned files are cached. | README copy audit and successful production deployment. | Repository-only README fix; live headers and route status checks passed. |
| F-1-15 | Added browser-only Open ABC file and Download ABC file actions. Import writes only the active namespace; export preserves exact bytes and makes a safe title-based filename. | `@claim:abc-file-open`; `@claim:abc-file-download`. | [Live demo phone](./evidence/live-demo-mobile.png); live open rendered “Live File,” download returned exact bytes as `live-file.abc`. |
| F-1-16 | Replaced README’s “storage key” wording with “Demo edits stay separate.” Exact namespaces remain only in `.factory/demo.md`. | `@claim:demo-isolation`; README copy audit. | Live Start for real removed demo data and restored the distinct real score. |
| F-1-17 | Standardized the product verb to US English “practice.” | `.factory/copy-audit.md`; live cold-copy check. | [Home desktop](./evidence/home-desktop.png); live first screen and footer use “practice.” |
| F-1-18 | Made the 404 footer match the application: one-line description, Privacy, Terms, Param Factory, `v1.0.0`, and artwork provenance. | Hosting config unit test and route metadata browser test. | [Live 404 phone](./evidence/not-found-mobile.png); live `/missing-bar` returned 404 and included the build ID and both legal links. |

## Verification summary

- Clean clone: `/tmp/abc-polish-clean.NoUYJA`.
- All 14 exact `.factory/claims.json` commands passed independently.
- Clean-clone `npm test`: 5 Vitest tests and 22 Chromium tests passed.
- Clean-clone `npm run lint`, `npm audit --omit=dev`, and `npm run build`: passed; `dist/index.html` exists.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/?demo=1`: passed with no console errors.
- Lighthouse evidence: [home JSON](./evidence/lighthouse-home.json) 99/100/100/100; [demo JSON](./evidence/lighthouse-demo.json) 97/100/100/100. Demo LCP 2.2 s, TBT 150 ms, CLS 0.
- Live cold browser: zero cross-origin requests, zero console/page errors, zero serious/critical axe findings, no horizontal overflow, and successful offline reload.
