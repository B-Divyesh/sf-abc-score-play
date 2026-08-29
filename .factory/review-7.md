# Adversarial first-read review 7 — PASS

**Product:** ABC Score Play  
**Live site:** <https://abc-score-play.sociobot.in>  
**Candidate:** `d962c99a5533f9a481413bc45e81cca2fc8a39b7`  
**Date:** 2026-08-29 UTC

## Verdict

**PASS.** Zero findings. The live product is clear on first read, the sample path is immediately usable and isolated, all declared claims have passing clean-clone tests, and no earlier finding regressed.

## Cold first read

Fresh Chromium contexts opened the live home page before scrolling.

| Question | Answer visible on the first screen | Phone, 390 × 844 | Desktop, 1440 × 900 |
| --- | --- | --- | --- |
| What does this do? | “Write, hear, and loop an ABC score.” | H1 is visible at 143–293 px. | H1 is visible at 163–433 px. |
| For whom? | “For musicians and educators who need a short score ready to practice or share.” | Visible before scroll. | Visible before scroll. |
| What should I click first? | **Try it with sample data** — “It loads a complete score, ready to play.” | Action is visible at 422–471 px; all facts follow in the viewport. | Action is visible at 535–584 px; facts end at 684 px. |

In plain words: this is a browser tool for musicians and educators to type a short ABC score, hear it, and repeat selected bars for practice. The first action is to try the ready-to-play sample. The first-read gate passes at both widths.

## Copy audit

Counts use visible whitespace-separated words; ABC snippets, numbers, and hyphenated terms count as one word. No landing or README sentence exceeds 22 words. No banned marketing term, inconsistent product term, unexplained mood heading, or non-result-naming button was found. Therefore no copy rewrites are required.

### Landing page

| Words | Copy | Result |
| ---: | --- | --- |
| 4 | ABC notation practice tool | Clear section label |
| 7 | Write, hear, and loop an ABC score | Clear H1 |
| 14 | For musicians and educators who need a short score ready to practice or share. | Clear audience and outcome |
| 5 | Try it with sample data | Result-naming action |
| 8 | It loads a complete score, ready to play. | Names the result |
| 3 | Free to use | `free-use` |
| 6 | Your score stays in this browser | `local-score` |
| 6 | Works offline after the first visit | `offline-reload` |
| 10 | A music console turns typed notes into a paper score. | Purposeful image alt text |
| 2 | Score editor | Clear section label |
| 6 | Turn text into a practice loop | Clear job heading |
| 5 | Write ABC on the left. | Clear instruction |
| 6 | The staff updates as you type. | `live-render` |
| 15 | Start with X: tune number, T: title, M: meter, L: note length, and K: key. | Direct field guidance |
| 12 | Tip: write a bar with notes such as C2 D2 E2 F2. | Concrete example |
| 7 | Open ABC files up to 1 MB. | `abc-file-open` |
| 2 | ABC source | Clear editor heading |
| 3 | Waiting for notes | Clear empty status |
| 3 | ABC score text | Clear field label |
| 2 | Rendered score | Clear output heading |
| 5 | Your staff will appear here. | Clear empty state |
| 7 | Write ABC or load the sample score. | Clear next action |
| 2 | 0 bars | Clear count |
| 2 | Practice tempo | Clear label |
| 3 | Loop from bar | Clear label |
| 3 | Loop to bar | Clear label |
| 8 | Choose a valid score to set a loop. | Clear disabled-state help |
| 9 | Select a bar in the staff to loop it. | `staff-bar-selection` |
| 6 | Press Space to play or stop. | `keyboard-playback` |
| 7 | Write or load a score to begin. | Clear status |
| 6 | How to make a practice loop | Clear section heading |
| 3 | Write the tune | Clear step heading |
| 10 | Type the title, meter, note length, key, and notes. | Clear instruction |
| 5 | Errors point to a line. | `error-lines` |
| 3 | Choose the bars | Clear step heading |
| 6 | Set the first and last bar. | `bar-loop` |
| 5 | Change the tempo for practice. | `tempo-range` |
| 3 | Play or share | Clear step heading |
| 11 | Repeat the loop, copy its link, or print the clean score. | Covered actions |
| 7 | A practice tool, not a score library | Clear scope heading |
| 6 | No account or cloud score storage. | Scope/privacy fact |
| 5 | No copyrighted score catalogue. | Scope boundary |
| 6 | No composing bot or group editing. | Scope boundary |
| 7 | Your browser stores the current ABC text. | `local-score` |
| 11 | Write a short ABC score, hear it, and practice a loop. | Clear footer one-liner |
| 8 | Built by Param Factory · v1.0.0 · Original generated artwork | Attribution/build label |

Result-naming controls are **Try it with sample data**, **Load sample score**, **Open ABC file**, **Download ABC file**, **Copy score link**, **Print score card**, **Clear editor**, **Play score**, **Stop**, and **Play loop**. Navigation labels are links rather than buttons.

### README

| Words | Sentence | Result |
| ---: | --- | --- |
| 15 | Write a short ABC score, hear it, loop bars, share a link, and print it. | Clear product summary |
| 12 | ABC Score Play is for musicians and educators who prefer plain-text notation. | Clear audience |
| 12 | It turns standard ABC into sheet music and plays it through your speakers. | `live-render`, `score-playback` |
| 11 | Practice controls set a tempo and repeat one or more bars. | `tempo-range`, `bar-loop` |
| 6 | Try the isolated sample at `?demo=1`. | Clear demo entry |
| 14 | Demo edits stay separate from your real score and are discarded when you leave. | `demo-isolation` |
| 8 | Draws the score with the open-source `abcjs` library. | Accurate attribution |
| 6 | Plays valid scores through your browser. | `score-playback` |
| 10 | Repeats selected bars at 40–220 beats per minute. | `bar-loop`, `tempo-range` |
| 10 | Opens `.abc` files up to 1 MB without uploading them. | `abc-file-open` |
| 11 | Downloads the exact ABC source as a safely named `.abc` file. | `abc-file-download` |
| 11 | Copies a score link that restores the same score when opened. | `score-link` |
| 6 | Prints the notation without editor controls. | `print-card` |
| 7 | Saves the current score in browser storage. | `local-score` |
| 7 | Reloads offline after the first online visit. | `offline-reload` |
| 4 | No account is required. | `free-use` |
| 4 | The product is free. | `free-use` |
| 12 | It does not include a score catalogue, composing bot, or group editing. | Stated scope |
| 5 | Requires Node.js 20 or newer. | Accurate setup requirement |
| 4 | Open `http://localhost:5173` or `http://localhost:5173/?demo=1`. | Accurate local URLs |
| 15 | `npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. | Verified |
| 10 | The build output is `dist/`, with `dist/index.html` at its root. | Verified |
| 10 | To run one public claim, use its command from `.factory/claims.json`. | Accurate instruction |
| 8 | Deploy `dist/` as an Azure Static Web App. | Accurate deployment target |
| 15 | `public/staticwebapp.config.json` maps app routes to their HTML, sets browser security rules, and caches versioned files. | Accurate configuration summary |
| 6 | The factory owns DNS and deployment. | Accurate repository boundary |
| 9 | The app sends no score text to a service. | `local-score` request audit |
| 6 | Shared score text appears after `#score=`. | `score-link` |
| 8 | Browsers do not send that part to servers. | Request audit |
| 7 | See `/privacy` and `/terms` in the app. | Verified links |
| 5 | Application code is MIT licensed. | `LICENSE` present |
| 4 | `abcjs` is MIT licensed. | Dependency metadata |
| 15 | The hero artwork was generated for this product; its prompt and provenance are in `.factory/design.md`. | Provenance present |

README headings — **What it does**, **Run locally**, **Test and build**, **Deploy**, and **Privacy and licenses** — identify their sections without relying on surrounding copy. Terminology remains consistent: **ABC**, **score**, **bar**, **loop**, **tempo**, **practice**, **demo**, **score link**, **score card**, and **ABC file**.

## Demo, sandbox, and privacy

- One click from the landing action opens `/?demo=1`. The 390 × 844 initial viewport contains the rendered “Evening Scale Study” score (211–416 px), **8 bars**, **Play score**, and **Play loop**.
- The persistent banner reads “Demo — sample data, nothing is saved to your real score” and includes working **Reset demo** and **Start for real** controls.
- Editing the demo stored the changed source only in `demo:abc-score-play:score`; **Reset demo** restored the bundled score.
- With a seeded real score, a demo edit followed by the live main-navigation **Privacy** exit left the real value byte-for-byte intact, removed demo storage, and re-entered as “Evening Scale Study.” The clean-clone isolation claim separately covers Home, Editor, Privacy, Terms, Start for real, and history exits.
- The observed live demo load, edit, and reset made only same-origin, bodyless GET requests for first-party HTML, CSS, JavaScript, and the lazy renderer. There were no console errors or page errors.
- The demo implementation uses separate local-storage namespaces documented in `.factory/demo.md`; it does not read or write real storage while demo mode is shown.

## Claims and clean-clone results

A fresh clone at `/tmp/abc-score-play-review7.qxJmA9/repo` ran `npm ci`, then every exact command in `.factory/claims.json` independently. All 19 passed. A subsequent full `npm test` passed: 8 Vitest unit/config tests and all 28 Chromium tests (`test-results/.last-run.json` reports `passed`). `npm run typecheck` and `npm run build` also passed, producing `dist/`.

| Claim IDs with passing exact command `npm test -- --grep @claim:<id>` |
| --- |
| `sample-score`, `free-use`, `local-score`, `demo-isolation`, `offline-reload` |
| `score-playback`, `bar-loop`, `tempo-range`, `live-render`, `abc-file-open` |
| `abc-file-download`, `score-link`, `print-card`, `error-lines`, `sample-load` |
| `clear-editor`, `browser-storage-clear`, `staff-bar-selection`, `keyboard-playback` |

The tests directly cover the sample score/reset, browser-local storage and absence of requests after score/file interaction, demo namespace isolation, offline reload, Web Audio oscillator starts, selected multi-bar loop playback, the stated tempo bounds, live rendering, 1 MB ABC-file boundary, exact download bytes, fragment-link restore, clean print media, line-targeted errors, sample loading, clear behavior, browser-storage clearing, staff bar selection, and Space-key playback.

There is no unlisted visitor-reliance claim in landing or README copy. Dependency-license, artwork-provenance, and researched scope statements are supported by repository evidence rather than an operational product promise.

## Earlier-finding regression check

Every earlier review, polish report, and prior handoff was read. The following results were rechecked live and in current code/tests; none was accepted merely because a prior report marked it fixed.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Demo score, bar count, and both playback actions are in the first phone viewport; `sample-score` asserts this. |
| F-1-2 | Demo exit and editor/history routes focus a visible heading after route change. |
| F-1-3 | `score-playback` observes context resume, oscillator creation, and oscillator start. |
| F-1-4 | `live-render` changes source, title, and rendered SVG. |
| F-1-5 | No unsupported sound-font promise remains. |
| F-1-6 | Home, demo, legal, and 404 routes have route-specific raw/runtime metadata. |
| F-1-7 | Demo, Editor, and Privacy remain visible in mobile headers. |
| F-1-8 | Landing and README consistently use “educators.” |
| F-1-9 / F-6-1 | Empty-editor guidance names the ABC fields and contains no “header” jargon. |
| F-1-10 | README says playback comes through the listener’s speakers. |
| F-1-11 | README uses plain open-source-library attribution. |
| F-1-12 | Visitor-facing sound-font jargon is absent. |
| F-1-13 | Sharing uses “score link” and directly explains `#score=`. |
| F-1-14 | Deployment guidance describes concrete routing, security, and cache behavior. |
| F-1-15 | Local file open/download preserve source bytes and use a safe filename. |
| F-1-16 | Visitor copy describes demo isolation without storage-key jargon. |
| F-1-17 | Product copy consistently uses “practice.” |
| F-1-18 | The designed 404 has legal links, product line, Param Factory credit, build ID, and artwork note. |
| F-3-1 | Workbench labels are “Score editor” and “Sample score editor.” |
| F-3-2 | Decorative “Three moves” remains absent. |
| F-3-3 | Decorative “Kept focused” remains absent. |
| F-4-1 | Unknown routes return HTTP 404 with H1 “Page not found” and direct recovery copy. |
| F-4-2 | Tracked lockfile supports clean `npm ci`. |
| F-5-1 | Every documented demo exit clears demo data while preserving real data. |
| F-5-2 | `sample-load` declares and tests the real-editor control. |
| F-5-3 | `clear-editor` declares and tests active-namespace-only clearing. |
| F-5-4 | `staff-bar-selection` declares and tests a non-default staff bar. |
| F-5-5 | `keyboard-playback` declares and tests Space outside a form field. |
| F-5-6 | `bar-loop` observes bars 2–3 for two completed passes. |
| F-5-7 | Each public route labels `#main` as “Skip to page content.” |
| F-6-2 | Privacy/file claims fail on any request after score or file interaction, including same-origin uploads. |
| F-6-3 | The 1 MB file limit is disclosed and both exact boundary cases are tested. |
| F-6-4 | `browser-storage-clear` declares and tests the privacy-control statement. |

## Structure, links, accessibility, and identity

- Live `/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200. An unknown route returned the designed HTTP 404. `robots.txt` and `sitemap.xml` returned 200; the sitemap lists all four public routes.
- All rendered first-party links resolve correctly. The missing-route `#main` skip link remains intentionally on its 404 document; both email links are explicit `mailto:` links.
- Each checked route has `lang="en"`, one H1, a main landmark, a route-specific title/description/canonical/OG/Twitter metadata set, favicon, apple-touch icon, and product social image. Titles are: **ABC Score Play — write, hear, and loop music**, **Demo — ABC Score Play**, **Privacy — ABC Score Play**, **Terms — ABC Score Play**, and **Page not found — ABC Score Play**.
- Live navigation to Privacy and browser Back both moved focus to the route H1 after route rendering. The header/footer remain consistent with a skip link, legal links, Param Factory credit, and version.
- The clean browser suite's Axe checks report no serious or critical violations, including the dark/reduced-motion view. Live mobile checks had no overflow or console error.
- The cream enamel, walnut housing, teal/coral transport switches, ruled score paper, and original console art visibly implement the documented mid-century instrument-panel direction. The demonstrated layout is distinct from a generic SaaS template while retaining the required information order.

## Missed leverage

No additional feature is required by the brief. Local ABC import/export and score-link restore provide the expected text-native round trip. The brief explicitly excludes AI composition, so an AI feature would be decorative rather than a useful Sociobot-gateway step. No provider key or AI endpoint is present.

## What would make this perfect

Nothing remains in the researched scope or product contract. Preserve the current clean-clone claim run, demo-isolation checks, and route/accessibility checks whenever copy, storage, routing, or playback changes.
