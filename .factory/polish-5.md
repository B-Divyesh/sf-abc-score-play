# Perfection loop polish 5

- **Base review:** `9ec18bfcb26455737a8fadf63c3a564d78a4220d`
- **Repair implementation:** `49b2216b` and `53390f4b`
- **Production:** <https://abc-score-play.sociobot.in>
- **One-click demo:** <https://abc-score-play.sociobot.in/?demo=1>
- **Final Azure deployment:** `e85e106f-57f5-443c-9cb9-bde6505cec76`
- **Cold verification:** 2026-08-29 UTC

Every finding in reviews 1–5 is closed. Review 2 had zero findings. The mid-century instrument-panel identity and static-web deployment class are unchanged.

## Finding map

| Finding | Change made | Evidence: test, screenshot, and live check |
| --- | --- | --- |
| F-1-1 | The demo still opens on the seeded score and compact transport before the editor. | Test: `@claim:sample-score`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); cold [`?demo=1`](https://abc-score-play.sociobot.in/?demo=1) placed the staff, 8 bars, Play score, and Play loop inside 390×844. |
| F-1-2 | Start for real, direct editor links, and history focus the visible editor heading. | Test: `Start for real, direct editor links, and browser history focus the visible destination`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); live exit reached `/#workbench`, restored the real score, and focused `#workbench-title`. |
| F-1-3 | Web Audio proof still requires resume, oscillator creation, and oscillator start. | Test: `@claim:score-playback`; [demo desktop](./evidence/polish-5/live-demo/screenshot-desktop.png); live Space playback started oscillators with no page error. |
| F-1-4 | A distinct valid edit must change the rendered SVG and title. | Test: `@claim:live-render`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); live demo rendered a changed score. |
| F-1-5 | The unsupported sound-font promise remains absent. | Test: clean-clone copy/source audit plus `@claim:score-playback`; [home phone](./evidence/polish-5/live-home/screenshot-mobile.png); live visitor copy promises only browser playback. |
| F-1-6 | Route-specific raw and runtime titles, descriptions, canonicals, and social metadata remain complete. | Test: `route titles, social metadata, raw heads, and consistent navigation are complete`; [404 phone](./evidence/polish-5/live-404/screenshot-mobile.png); live `/`, `/demo`, `/privacy`, `/terms`, and 404 heads passed. |
| F-1-7 | Demo, Editor, and Privacy remain visible in every phone header. | Test: route metadata/navigation test and 44×44 regression; [home phone](./evidence/polish-5/live-home/screenshot-mobile.png); all live 390 px headers matched. |
| F-1-8 | Landing and README consistently use **educators**. | Test: first-screen browser assertions and `.factory/copy-audit.md`; [home phone](./evidence/polish-5/live-home/screenshot-mobile.png); live first screen says “musicians and educators.” |
| F-1-9 | Guidance names title, meter, note length, key, and notes. | Test: `landing sections use plain, task-specific names`; [home desktop](./evidence/polish-5/live-home/screenshot-desktop.png); live How it works copy remains direct. |
| F-1-10 | README says the score plays through the listener’s speakers. | Test: README source audit and `@claim:score-playback`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); live playback passed. |
| F-1-11 | README retains plain open-source abcjs attribution; license detail stays in the license section. | Test: clean-clone README/license audit and `npm test`; [home desktop](./evidence/polish-5/live-home/screenshot-desktop.png); live renderer loaded from the deployed first-party bundle. |
| F-1-12 | Sound-font jargon remains absent from visitor copy. | Test: copy audit and `@claim:score-playback`; [home phone](./evidence/polish-5/live-home/screenshot-mobile.png); live copy check passed. |
| F-1-13 | Sharing uses **score link** and explains the `#score=` privacy result directly. | Test: `@claim:score-link` and `@claim:local-score`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); the live link restored exact text with no request body. |
| F-1-14 | Deployment docs describe route mapping, browser rules, and versioned caching in plain words. | Test: `npm run build` and hosting-config unit tests; [home desktop](./evidence/polish-5/live-home/screenshot-desktop.png); final work-order deployment succeeded at the live URL. |
| F-1-15 | Local ABC open/download still preserve exact source and safe filenames. | Test: `@claim:abc-file-open` and `@claim:abc-file-download`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); live audit opened and downloaded `live-file-five.abc` byte-for-byte. |
| F-1-16 | Visitor copy describes isolation without exposing namespace names. | Test: `@claim:demo-isolation`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); live storage names appear only in verifier evidence. |
| F-1-17 | The product consistently uses **practice**. | Test: `.factory/copy-audit.md` and clean-clone browser suite; [home phone](./evidence/polish-5/live-home/screenshot-mobile.png); live landing and footer match. |
| F-1-18 | The 404 retains the complete footer, legal links, build ID, and artwork provenance. | Test: hosting-config and route metadata tests; [404 phone](./evidence/polish-5/live-404/screenshot-mobile.png); live missing route returned HTTP 404 with Privacy, Terms, and `v1.0.0`. |
| F-3-1 | Workbench labels remain **Score editor** and **Sample score editor**. | Test: `landing sections use plain, task-specific names`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); cold home/demo checks found no console lore. |
| F-3-2 | “Three moves” remains removed. | Test: `landing sections use plain, task-specific names`; [home desktop](./evidence/polish-5/live-home/screenshot-desktop.png); live heading is **How to make a practice loop**. |
| F-3-3 | “Kept focused” remains removed. | Test: `landing sections use plain, task-specific names`; [home desktop](./evidence/polish-5/live-home/screenshot-desktop.png); live boundary heading names the product limit. |
| F-4-1 | Both 404 implementations retain the direct **Page not found** heading. | Test: `legal and unknown routes have one clear heading`; [404 phone](./evidence/polish-5/live-404/screenshot-mobile.png); `/missing-polish-5` returned the designed HTTP 404. |
| F-4-2 | The lockfile remains tracked and aligned with the manifest. | Test: `pins the complete install used by the documented clean setup`; [home desktop](./evidence/polish-5/live-home/screenshot-desktop.png); final clean clone ran `npm ci` before all checks. |
| F-5-1 | A session marker now discards demo storage on Home, Editor, Privacy, Terms, Start for real, back/forward, and full same-tab route changes. Re-entry starts from the bundled sample; real storage is untouched. | Test: `@claim:demo-isolation`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); [live audit](./evidence/polish-5/live-audit.json) passed every exit at `?demo=1`. |
| F-5-2 | Added the `sample-load` claim. The real-editor action now has exact source, eight-bar render, playback, and real-storage proof. | Test: `@claim:sample-load`; [home desktop](./evidence/polish-5/live-home/screenshot-desktop.png); live action replaced a distinct draft with the exact bundled score. |
| F-5-3 | Added the `clear-editor` claim for both namespaces and the visible empty state. | Test: `@claim:clear-editor`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); live real/demo clears removed only the active value. |
| F-5-4 | Added the `staff-bar-selection` claim for a non-default bar, both endpoints, summary, and status. | Test: `@claim:staff-bar-selection` now also rejects page errors; [demo desktop](./evidence/polish-5/live-demo/screenshot-desktop.png); live bar 3 selection passed with zero console errors. |
| F-5-5 | Registered the Space shortcut and instrumented its Web Audio path. | Test: `@claim:keyboard-playback`; [demo phone](./evidence/polish-5/live-demo/screenshot-mobile.png); live Space started audio and stopped it on the second press. |
| F-5-6 | The loop test now selects bars 2–3, observes both highlights, requires two passes and audio starts, then stops. Repair also removed a blank line that had made extracted loop ABC silent. | Test: `@claim:bar-loop`; [demo desktop](./evidence/polish-5/live-demo/screenshot-desktop.png); live audit observed measures 2 and 3 with 24 oscillator starts. |
| F-5-7 | Every route now labels the `#main` skip link **Skip to page content**. | Test: `every public page has one H1 and no serious accessibility violations`; [404 phone](./evidence/polish-5/live-404/screenshot-mobile.png); home, both demo URLs, legal routes, and 404 matched live. |

## Additional defect closed during live verification

The first deployment exposed an abcjs click-listener shape mismatch after staff selection. The selection worked through the pointer fallback, but the listener logged a `TypeError`. `53390f4b` now accepts string or array class fields, and `@claim:staff-bar-selection` fails on any page error. The final deployment and cold audit report zero console errors.

## Verification summary

- Final clean clone: `/tmp/abc-score-play-polish5-final.qC82pF/repo` at `53390f4b`.
- All 18 exact commands in `.factory/claims.json` passed independently.
- Clean-clone `npm test`: 8 Vitest tests and 26 Chromium tests passed in 31.8 seconds.
- `npm run typecheck`, `npm run lint`, `npm run build`, and `npm audit --omit=dev` passed; audit found zero vulnerabilities.
- Live Lighthouse mobile: home **100/100/100/100**, LCP 1.13 s, TBT 28 ms, CLS 0; demo **99/100/100/100**, LCP 1.82 s, TBT 70 ms, CLS 0.00035.
- Production JavaScript is 164.17 KB gzip total; CSS is 3.99 KB gzip; the mobile hero AVIF is 40,771 bytes.
- All 17 served product files match `dist/` byte-for-byte. Cold live checks found zero cross-origin requests, request bodies, normal-route console errors, serious/critical axe findings, or phone overflow.

No finding of any severity remains open.
