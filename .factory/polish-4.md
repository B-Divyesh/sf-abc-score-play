# Perfection loop polish 4

- **Base review:** `412608fa909048744409b6e5f18c2c83e97d1f73`
- **Repair implementation:** `69848de050bcecd7f095a3dea7d61d4a6bb2d342`
- **Production:** <https://abc-score-play.sociobot.in>
- **One-click demo:** <https://abc-score-play.sociobot.in/?demo=1>
- **Azure deployment:** `6a6127ce-f830-4327-8443-068cf936a63c`
- **Cold verification date:** 2026-08-29 UTC

All findings in reviews 1, 3, and 4 are closed. Review 2 had zero findings. The repair keeps the mid-century instrument-panel identity and static deployment class.

## Finding map

| Finding | Change made | Evidence: test, screenshot, and live check |
| --- | --- | --- |
| F-1-1 | The demo opens directly on the seeded workbench. Its score, bar count, and playback controls fit in the first phone viewport. | `@claim:sample-score`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); cold `/?demo=1` measured all four elements inside 390×844. |
| F-1-2 | Demo exit, direct editor links, and history navigation focus the visible editor heading. | `Start for real, direct editor links, and browser history focus the visible destination`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); live exit reached `/#workbench`, kept the real score, focused `#workbench-title`, and placed it at the top of the viewport. |
| F-1-3 | Playback verification observes Web Audio resume, oscillator creation, and oscillator start. | `@claim:score-playback`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); cold live playback recorded 1 resume and 54 oscillator starts with no page error. |
| F-1-4 | The declared live-render claim changes the source and requires a changed staff and title. | `@claim:live-render`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); live edit rendered **Live Round Four** with a changed SVG and valid state. |
| F-1-5 | Visitor copy makes only the observable browser-playback promise; the unsupported sound-font clause stays removed. | `@claim:score-playback`; [live home phone](./evidence/polish-4/live-home/screenshot-mobile.png); source and live copy contain no sound-font promise. |
| F-1-6 | Demo, Privacy, Terms, and 404 carry route-specific titles, descriptions, canonicals, and social metadata in raw and runtime HTML. | `route titles, social metadata, raw heads, and consistent navigation are complete`; [live 404 phone](./evidence/polish-4/live-404/screenshot-mobile.png); live `/`, `/demo`, `/privacy`, and `/terms` returned 200 and the missing route returned 404 with its own complete head. |
| F-1-7 | Demo, Editor, and Privacy remain visible in every 390 px header, including 404. | `regression: every visible mobile control has a 44 by 44 touch target`; [live 404 phone](./evidence/polish-4/live-404/screenshot-mobile.png); cold live route scan found identical main navigation on all six routes. |
| F-1-8 | Landing and README consistently use **educators**. | First-screen assertions and `.factory/copy-audit.md`; [live home phone](./evidence/polish-4/live-home/screenshot-mobile.png); live first screen says “musicians and educators.” |
| F-1-9 | Instructions name the title, meter, note length, key, and notes instead of “ABC headers.” | `landing sections use plain, task-specific names`; [live home desktop](./evidence/polish-4/live-home/screenshot-desktop.png); cold live copy check retained the direct instruction. |
| F-1-10 | README says the score plays through the listener's speakers. | `@claim:score-playback`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); live Web Audio proof passed. |
| F-1-11 | README uses plain open-source library attribution; MIT details remain in the license section. | Clean-clone README check and `npm test`; [live home desktop](./evidence/polish-4/live-home/screenshot-desktop.png); production still uses the pinned `abcjs` build. |
| F-1-12 | Unexplained sound-font wording remains absent from visitor copy. | README/copy audit plus `@claim:score-playback`; [live home phone](./evidence/polish-4/live-home/screenshot-mobile.png); live playback succeeded. |
| F-1-13 | Sharing copy uses **score link** and explains directly that browsers do not send the `#score=` part. | `@claim:score-link` and `@claim:local-score`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); live link restored the fragment and the complete flow made zero cross-origin requests. |
| F-1-14 | Deployment documentation describes route mapping, browser security rules, and versioned-file caching in plain words. | `npm run build` and the successful work-order deployment; [live home desktop](./evidence/polish-4/live-home/screenshot-desktop.png); live headers and all route statuses passed. |
| F-1-15 | Local Open ABC file and Download ABC file actions preserve exact text and demo isolation. | `@claim:abc-file-open` and `@claim:abc-file-download`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); live file rendered **Live File** and downloaded exact bytes as `live-file.abc`. |
| F-1-16 | Visitor copy describes the isolation result while exact namespace names stay in `.factory/demo.md`. | `@claim:demo-isolation`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); live edit/reset/exit left the real value unchanged and removed only demo storage. |
| F-1-17 | Product copy consistently uses the verb **practice**. | `.factory/copy-audit.md`; [live home phone](./evidence/polish-4/live-home/screenshot-mobile.png); live landing and footer use the same spelling. |
| F-1-18 | The designed 404 retains the complete footer, legal links, build ID, and artwork provenance. | Hosting configuration unit test and route metadata browser test; [live 404 phone](./evidence/polish-4/live-404/screenshot-mobile.png); live missing route returned HTTP 404 with Privacy, Terms, and `v1.0.0`. |
| F-3-1 | Workbench labels remain **Score editor** and **Sample score editor**. | `landing sections use plain, task-specific names`; [live demo phone](./evidence/polish-4/live-demo/screenshot-mobile.png); cold home/demo checks found no console or local-session lore. |
| F-3-2 | The decorative “Three moves” label remains removed. | `landing sections use plain, task-specific names`; [live home desktop](./evidence/polish-4/live-home/screenshot-desktop.png); **How to make a practice loop** stands alone live. |
| F-3-3 | The decorative “Kept focused” label remains removed. | `landing sections use plain, task-specific names`; [live home desktop](./evidence/polish-4/live-home/screenshot-desktop.png); **A practice tool, not a score library** stands alone live. |
| F-4-1 | Both the hosted 404 and the SPA fallback now say **Page not found** and use the requested direct explanation. | `legal and unknown routes have one clear heading`, hosting configuration test, and route metadata test; [live 404 phone](./evidence/polish-4/live-404/screenshot-mobile.png); `/missing-polish-4` returned 404, the direct H1 and paragraph, no overflow, and zero serious/critical axe findings. |
| F-4-2 | The lockfile now records the Node 20 requirement, README uses `npm ci`, and a unit test keeps manifest and lockfile roots aligned. | `pins the complete install used by the documented clean setup`; clean clone `/tmp/abc-score-play-polish-4.zFTrLU/repo` ran `npm ci`, all 14 claim commands, and the full suite; [live home desktop](./evidence/polish-4/live-home/screenshot-desktop.png); deployed payload matches that locked build. |

## Verification summary

- A fresh clone at `69848de050bcecd7f095a3dea7d61d4a6bb2d342` tracked `package-lock.json`; `npm ci` installed 73 packages with zero vulnerabilities.
- Every one of the 14 exact `.factory/claims.json` commands passed independently.
- Clean-clone `npm test` passed 6 Vitest unit/config tests and 23 Chromium tests. `npm run lint`, `npm run typecheck`, `npm run build`, and `npm audit --omit=dev` passed.
- The browser suite covers Web Audio, two loop passes, local file round trips, score links, print media, error-line selection, one H1, axe in both color modes, 44×44 targets, phone overflow, focus/history, raw/runtime metadata, privacy request logs, and offline reload.
- Live Lighthouse mobile: home **100/100/100/100**, LCP 1.2 s, TBT 70 ms, CLS 0; demo **97/100/100/100**, LCP 1.9 s, TBT 190 ms, CLS 0. Reports: [home](./evidence/polish-4/live-home/lighthouse.json) and [demo](./evidence/polish-4/live-demo/lighthouse.json).
- Production JavaScript totals 164.07 KB gzip; CSS is 3.98 KB gzip; the mobile hero AVIF is 40,771 bytes.
- All 17 served product payloads match `dist/` byte-for-byte. Cold live checks found zero cross-origin requests, page errors, console errors, serious/critical axe findings, or horizontal overflow.

No finding of any severity remains open.
