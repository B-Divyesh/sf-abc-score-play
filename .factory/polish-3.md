# Perfection loop polish 3

- **Base review:** `2d30be798e6ef3a1d966fcd7f875182830305435`
- **Repair implementation:** `322ba5c8bdda41b2aa1a4ab5bed07e635e7126aa`
- **Production:** <https://abc-score-play.sociobot.in>
- **One-click demo:** <https://abc-score-play.sociobot.in/?demo=1>
- **Cold verification date:** 2026-08-29 UTC

Every finding from `.factory/review-1.md` and `.factory/review-3.md` is closed. `.factory/review-2.md` reported zero findings. The round-three repair changes only wording and its regression coverage; it preserves the mid-century instrument-panel visual system and all earlier functional repairs.

## Finding map

| Finding | Change made | Automated evidence | Screenshot and live evidence |
| --- | --- | --- | --- |
| F-1-1 | The demo starts at the seeded workbench; the rendered score and compact transport precede the editor on phones. | `@claim:sample-score` checks the staff, **8 bars**, **Play score**, and **Play loop** in the first 390×844 viewport. | [Live demo, phone](./evidence/polish-3/live-demo/screenshot-mobile.png); cold <https://abc-score-play.sociobot.in/?demo=1> check passed. |
| F-1-2 | **Start for real**, direct editor links, and history navigation scroll to and focus the visible editor heading. | `Start for real, direct editor links, and browser history focus the visible destination`; `@claim:demo-isolation`. | [Live demo, phone](./evidence/polish-3/live-demo/screenshot-mobile.png); cold demo exit restored the real score at `/#workbench` with `#workbench-title` focused and visible. |
| F-1-3 | Playback verification instruments Web Audio and requires context resume, oscillator creation, and oscillator start. | `@claim:score-playback`. | Live demo recorded 1 resume, 54 oscillators, 54 starts, and no browser errors. |
| F-1-4 | The declared `live-render` claim edits to a distinct valid tune and verifies changed notation and title. | `@claim:live-render`. | Cold live demo rendered **Live Round Three** and changed the staff SVG. |
| F-1-5 | Removed the unsupported sound-font promise; playback copy now states only the observable browser result. | `@claim:score-playback`; README/copy cross-check. | Repository copy contains no visitor-facing sound-font claim; live playback passed. |
| F-1-6 | Demo, Privacy, Terms, and 404 retain route-specific raw/runtime titles, descriptions, canonical URLs, and social metadata. | `route titles, social metadata, raw heads, and consistent navigation are complete`; `ships route-specific raw metadata documents`. | Cold live checks returned 200 for `/`, `/demo`, `/privacy`, `/terms` and a designed 404 for `/missing-polish-3`, all with the expected title. |
| F-1-7 | Privacy remains in the compact header on every route, including 404. | `regression: every visible mobile control has a 44 by 44 touch target`; route navigation test. | [Live home, phone](./evidence/polish-3/live-home/screenshot-mobile.png) and [live demo, phone](./evidence/polish-3/live-demo/screenshot-mobile.png); all cold routes exposed Demo, Editor, Privacy. |
| F-1-8 | Standardized the audience name to **educators**. | First-screen assertions; `.factory/copy-audit.md`. | [Live home, phone](./evidence/polish-3/live-home/screenshot-mobile.png) shows “musicians and educators.” |
| F-1-9 | Guidance names the title, meter, note length, key, and notes instead of unexplained “headers.” | Landing copy audit and clean-clone browser suite. | [Live home, desktop](./evidence/polish-3/live-home/screenshot-desktop.png); cold live heading/step check passed. |
| F-1-10 | README explains that the score plays through the listener's speakers. | `@claim:score-playback`; README copy audit. | Live Web Audio proof passed with no errors. |
| F-1-11 | README uses plain library attribution; MIT details remain in the license section. | README/source cross-check; clean-clone `npm test`. | `README.md` and `LICENSE` checked at repair commit. |
| F-1-12 | Removed unexplained sound-font jargon from visitor copy. | README/copy cross-check; `@claim:score-playback`. | Live playback passed; the phrase remains only in historical review records. |
| F-1-13 | Sharing copy says **score link** and explains directly that browsers do not send the part after `#score=`. | `@claim:score-link`; `@claim:local-score`. | Live cold flow made zero cross-origin requests. |
| F-1-14 | Deployment docs say what routes, security rules, and caching do in plain words. | Clean-clone README audit; `npm run build`; production deployment. | Azure deployment `c4396748-2ef8-43b8-b7e3-8eeea725db3a` succeeded and the custom domain returned 200. |
| F-1-15 | Local **Open ABC file** and **Download ABC file** actions preserve the active namespace, exact bytes, and a safe filename. | `@claim:abc-file-open`; `@claim:abc-file-download`. | Cold live demo rendered **Live File** and downloaded exact bytes as `live-file.abc`. |
| F-1-16 | Visitor copy describes the isolation result; key names remain only in verifier documentation. | `@claim:demo-isolation`; README copy audit. | Live reset kept the seeded real score; exit removed only demo data and restored the real score. |
| F-1-17 | Standardized the product verb to US English **practice**. | `.factory/copy-audit.md`; clean-clone browser suite. | [Live home, desktop](./evidence/polish-3/live-home/screenshot-desktop.png) uses “practice” consistently. |
| F-1-18 | The standalone 404 includes the product line, Privacy, Terms, Param Factory credit, `v1.0.0`, and artwork provenance. | Hosting config unit test; route metadata browser test. | Cold <https://abc-score-play.sociobot.in/missing-polish-3> returned HTTP 404 with the complete footer and zero serious/critical axe findings. |
| F-3-1 | Replaced “Practice console · local session” with **Score editor** and “Demo practice console” with **Sample score editor**. | `landing sections use plain, task-specific names`. | [Live home, phone](./evidence/polish-3/live-home/screenshot-mobile.png) and [live demo, phone](./evidence/polish-3/live-demo/screenshot-mobile.png); both exact labels passed cold checks. |
| F-3-2 | Removed the decorative “Three moves” eyebrow. **How to make a practice loop** now stands alone. | `landing sections use plain, task-specific names`. | [Live home, desktop](./evidence/polish-3/live-home/screenshot-desktop.png); cold home contained no “Three moves.” |
| F-3-3 | Removed the decorative “Kept focused” eyebrow. **A practice tool, not a score library** now stands alone. | `landing sections use plain, task-specific names`. | [Live home, desktop](./evidence/polish-3/live-home/screenshot-desktop.png); cold home contained no “Kept focused.” |

## Verification summary

- Fresh clone: `/tmp/abc-score-play-polish-3.sCEX4s` at `322ba5c8bdda41b2aa1a4ab5bed07e635e7126aa`.
- All 14 exact commands in `.factory/claims.json` passed independently.
- Clean-clone `npm test`: 5 Vitest unit/config checks and 23 Chromium checks passed.
- Clean-clone `npm run lint`, `npm audit --omit=dev`, and `npm run build`: passed; zero vulnerabilities; `dist/index.html` exists.
- The browser suite covers axe in light/dark modes, keyboard operation, 44×44 targets, mobile overflow, focus/history, metadata, real 404 behavior, privacy request logs, and offline reload.
- `/opt/fleet/lib/verify-url.sh` passed on the live home and demo with zero console errors. Reports: [home](./evidence/polish-3/live-home/verify.json), [demo](./evidence/polish-3/live-demo/verify.json).
- Lighthouse 13.0.1 mobile: home **100/100/100/100**, LCP 1.2 s, TBT 70 ms, CLS 0; demo **99/100/100/100**, LCP 1.8 s, TBT 100 ms, CLS 0. Evidence: [home](./evidence/polish-3/live-home/lighthouse.json), [demo](./evidence/polish-3/live-demo/lighthouse.json).
- Production JavaScript is 164.07 KB gzip in total; CSS is 3.98 KB gzip. Both are within the static-product budgets.

No finding of any severity remains open.
