# Adversarial first-read review 6 — FAIL

**Product:** ABC Score Play  
**Live site:** <https://abc-score-play.sociobot.in>  
**Candidate reviewed:** `be9425b6481b30621f7b441e520ba5a5cb981817`  
**Date:** 2026-08-29 UTC

## Verdict

**FAIL.** Four findings remain: one blocking and three major. The first screen is clear, the demo is immediately usable and isolated, every declared command passes, and the deployed files match the candidate. PASS still requires zero findings and no untested claim.

## Findings

### Blocking

#### F-6-1 / reopened F-1-9 — The empty editor still uses the unexplained “headers” jargon

- **Exact quote/location:** Home page, blank **ABC source** field placeholder: “Start with X:, T:, M:, L:, and K: headers.” Source: `src/main.ts:73`.
- **History:** F-1-9 required replacing “ABC headers” because a new user may not know which fields count as headers. The How it works sentence was repaired, but the same term remains in the first empty editor. This is a half-fixed earlier finding, so it is blocking under the round-six history rule.
- **Why a first-time visitor is lost:** The placeholder presents five unexplained letter codes and calls them “headers.” It does not tell the visitor what any field means at the moment they need to start typing.
- **Concrete fix:** Replace it with “Start with X: tune number, T: title, M: meter, L: note length, and K: key.” Add the placeholder to the plain-copy regression test and reject unexplained “header/headers” wording in visitor-facing editor guidance.

### Major

#### F-6-2 — The privacy and no-upload claim tests permit same-origin score uploads

- **Exact claims/locations:** “Your score stays in this browser” (`local-score`) and “Opens an ABC file without uploading it” (`abc-file-open`). In `tests/e2e/claims.spec.ts:73-83` and `:265-276`, each test stores request URLs but rejects only requests whose origin differs from the local site.
- **Why this is not sufficient:** A regression that posts the entered score or opened file to `/upload` on the product’s own origin would leave both tests green. The tests do not inspect same-origin request methods, bodies, or whether any request starts after the score text is introduced.
- **Observed product behavior:** The live home/demo/edit/reset/exit/offline flow made same-origin GET requests only, with no request body and no score text in a URL. The implementation is currently private; the declared tests do not protect that result.
- **Concrete fix:** In both tagged tests, mark the request log after initial assets finish loading. After editing or opening the fixture, assert that no new network request occurs, or at minimum assert every subsequent request is a bodyless GET whose URL and post data exclude the exact score fixture. Keep the cross-origin assertion as a separate check.

#### F-6-3 — “Opens `.abc` files” omits the product’s 1 MB limit

- **Exact quote/location:** README: “Opens `.abc` files without uploading them.” The live file control rejects files over 1 MB with “That file is over 1 MB. Choose a smaller ABC file.” (`src/main.ts:361-365`).
- **Why this is misleading:** The capability list and `abc-file-open` claim are unconditional, but a valid `.abc` file can be refused solely because of an undocumented size limit. The current claim test uses only a tiny fixture.
- **Concrete fix:** Rewrite the README and claim as “Opens `.abc` files up to 1 MB without uploading them.” Extend `@claim:abc-file-open` with boundary fixtures that accept 1,000,000 bytes, reject 1,000,001 bytes with the stated recovery message, and perform the request-body assertions from F-6-2.

#### F-6-4 — The browser-storage clearing promise is an unlisted claim

- **Exact quote/location:** Live `/privacy`, **Control your score**: “Clearing browser storage also removes it.” Source: `src/main.ts:164`.
- **Why this remains untested:** `clear-editor` proves the product button removes only the active key. No `claims.json` entry or tagged test clears browser storage and verifies that the editor reloads empty. A visitor can rely on this sentence as a privacy control, so it is a claim rather than incidental prose.
- **Concrete fix:** Add a `browser-storage-clear` claim and tagged test that saves a real score, clears origin storage, reloads, and verifies an empty editor and absent real/demo keys. Alternatively, remove the sentence and keep only the tested **Clear editor** instruction.

## Cold first read

Fresh Chromium contexts with service workers blocked opened `/` at 390×844 and 1440×900. No prior storage was present and `scrollY` was 0.

| Question | Answer visible before scrolling | Phone geometry | Desktop geometry | Result |
| --- | --- | ---: | ---: | --- |
| What does this do? | “Write, hear, and loop an ABC score.” | H1 bottom 293 px | H1 bottom 433 px | Pass |
| For whom? | “For musicians and educators who need a short score ready to practice or share.” | Bottom 398 px | Bottom 511 px | Pass |
| What should I click first? | **Try it with sample data**; “It loads a complete score, ready to play.” | Note bottom 531 px | Note bottom 581 px | Pass |
| Three plain facts | Free; browser-local score; offline after first visit | Bottom 631 px | Bottom 684 px | Pass |

In my own words: this is a browser tool for musicians and educators to type a short ABC score, hear it, and repeat bars. The first action is the sample-data button. Both viewports had one H1, no horizontal overflow, no console/page error, and no cross-origin request.

## Copy audit

Counts below use visible whitespace-separated tokens; punctuation stays attached to its word. No landing or README sentence exceeds 22 words, and no banned marketing adjective appears. F-6-1 is the only clarity flag in these two copy sets.

### Landing-page sentences and sentence-like copy

| Words | Exact copy | Result |
| ---: | --- | --- |
| 7 | Write, hear, and loop an ABC score | Pass |
| 14 | For musicians and educators who need a short score ready to practice or share. | Pass |
| 8 | It loads a complete score, ready to play. | Pass |
| 3 | Free to use | Pass |
| 6 | Your score stays in this browser | Pass; `local-score` |
| 6 | Works offline after the first visit | Pass; `offline-reload` |
| 10 | A music console turns typed notes into a paper score. | Pass; purpose-based image alt text |
| 5 | Write ABC on the left. | Pass |
| 6 | The staff updates as you type. | Pass; `live-render` |
| 9 | Start with X:, T:, M:, L:, and K: headers. | **F-6-1 / F-1-9** |
| 14 | Tip: write a bar with notes such as `\| C2 D2 E2 F2 \|`. | Pass |
| 5 | Your staff will appear here. | Pass |
| 7 | Write ABC or load the sample score. | Pass |
| 8 | Choose a valid score to set a loop. | Pass |
| 9 | Select a bar in the staff to loop it. | Pass; `staff-bar-selection` |
| 6 | Press Space to play or stop. | Pass; `keyboard-playback` |
| 7 | Write or load a score to begin. | Pass |
| 9 | Type the title, meter, note length, key, and notes. | Pass |
| 5 | Errors point to a line. | Pass; `error-lines` |
| 6 | Set the first and last bar. | Pass; `bar-loop` |
| 5 | Change the tempo for practice. | Pass; `tempo-range` |
| 11 | Repeat the loop, copy its link, or print the clean score. | Pass; declared actions |
| 6 | No account or cloud score storage. | Pass; `free-use`, `local-score` |
| 4 | No copyrighted score catalogue. | Pass; scope boundary |
| 6 | No composing bot or group editing. | Pass; researched non-goals |
| 7 | Your browser stores the current ABC text. | Pass; `local-score` |
| 11 | Write a short ABC score, hear it, and practice a loop. | Pass |

### Landing headings, labels, links, and actions

| Words | Exact copy | Type/result |
| ---: | --- | --- |
| 4 | Skip to page content | Skip link; clear |
| 3 | ABC Score Play | Wordmark; clear |
| 1 each | Demo · Editor · Privacy · Terms | Navigation links; clear nouns |
| 4 | ABC notation practice tool | Section label; identifies format and task |
| 2 | Score editor | Section label; clear |
| 6 | Turn text into a practice loop | Heading; clear |
| 2 | ABC source | Heading; clear in this notation tool |
| 3 | Waiting for notes | Empty status; clear |
| 3 | ABC score text | Field label; clear |
| 2 | Rendered score | Heading; clear |
| 2 | Practice tempo | Label; clear |
| 3 each | Loop from bar · Loop to bar | Labels; clear |
| 6 | How to make a practice loop | Heading; clear |
| 3 each | Write the tune · Choose the bars · Play or share | Headings; clear |
| 7 | A practice tool, not a score library | Heading; clear |
| 5 | Try it with sample data | Result-naming action; pass |
| 3 each | Load sample score · Open ABC file · Download ABC file · Copy score link · Print score card | Result-naming actions; pass, subject to F-6-3 |
| 2 each | Clear editor · Play score · Play loop | Result-naming actions; pass |
| 1 | Stop | Standard transport action; pass |

### README headings

| Words | Heading | Result |
| ---: | --- | --- |
| 3 | ABC Score Play | Pass |
| 3 | What it does | Pass |
| 2 | Run locally | Pass |
| 3 | Test and build | Pass |
| 1 | Deploy | Pass |
| 3 | Privacy and licenses | Pass |

### README sentences

| Words | Exact sentence | Result |
| ---: | --- | --- |
| 15 | Write a short ABC score, hear it, loop bars, share a link, and print it. | Pass |
| 12 | ABC Score Play is for musicians and educators who prefer plain-text notation. | Pass |
| 13 | It turns standard ABC into sheet music and plays it through your speakers. | Pass |
| 11 | Practice controls set a tempo and repeat one or more bars. | Pass |
| 6 | Try the isolated sample at `?demo=1`. | Pass |
| 14 | Demo edits stay separate from your real score and are discarded when you leave. | Pass |
| 8 | Draws the score with the open-source `abcjs` library. | Pass |
| 6 | Plays valid scores through your browser. | Pass |
| 8 | Repeats selected bars at 40–220 beats per minute. | Pass |
| 6 | Opens `.abc` files without uploading them. | **F-6-2, F-6-3** |
| 9 | Downloads the exact ABC text as an `.abc` file. | Pass |
| 11 | Copies a score link that restores the same score when opened. | Pass |
| 6 | Prints the notation without editor controls. | Pass |
| 7 | Saves the current score in browser storage. | Pass, subject to F-6-2 test coverage |
| 7 | Reloads offline after the first online visit. | Pass |
| 4 | No account is required. | Pass |
| 4 | The product is free. | Pass |
| 12 | It does not include a score catalogue, composing bot, or group editing. | Pass; scope boundary |
| 5 | Requires Node.js 20 or newer. | Pass |
| 4 | Open `http://localhost:5173` or `http://localhost:5173/?demo=1`. | Pass |
| 15 | `npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. | Pass |
| 10 | The build output is `dist/`, with `dist/index.html` at its root. | Pass |
| 10 | To run one public claim, use its command from `.factory/claims.json`. | Pass |
| 8 | Deploy `dist/` as an Azure Static Web App. | Pass |
| 15 | `public/staticwebapp.config.json` maps app routes to their HTML, sets browser security rules, and caches versioned files. | Pass |
| 6 | The factory owns DNS and deployment. | Pass |
| 9 | The app sends no score text to a service. | Pass live; test gap F-6-2 |
| 6 | Shared score text appears after `#score=`. | Pass |
| 8 | Browsers do not send that part to servers. | Pass |
| 7 | See `/privacy` and `/terms` in the app. | Pass |
| 5 | Application code is MIT licensed. | Pass |
| 4 | `abcjs` is MIT licensed. | Pass |
| 15 | The hero artwork was generated for this product; its prompt and provenance are in `.factory/design.md`. | Pass |

Terminology is otherwise consistent: **ABC**, **score**, **bar**, **loop**, **tempo**, **practice**, **demo**, **score link**, **score card**, and **ABC file**. All buttons use task verbs; navigation items are links rather than buttons.

## Demo and sandbox

- One click from the cold home opened `/?demo=1`.
- At 390×844, the first demo viewport contained the persistent banner, “Evening Scale Study,” its rendered staff (`y=312–521`), **8 bars**, **Play score**, and **Play loop**. The populated source editor began at `y=793`.
- The banner says “Demo — sample data, nothing is saved to your real score” and provides **Reset demo** and **Start for real**.
- Editing wrote only `demo:abc-score-play:score`. A seeded `abc-score-play:score` value remained byte-for-byte unchanged.
- **Reset demo** restored the exact bundled eight-bar sample. **Start for real** removed demo storage, loaded the real score, navigated to `/#workbench`, and focused the visible `#workbench-title`.
- Home, Editor, Privacy, Terms, back/forward, and same-tab exit paths removed the demo key. Re-entry started with the bundled sample.
- After one online visit and service-worker activation, an offline reload retained the demo title, H1, staff, and eight-bar count.
- The live flow issued same-origin GETs only. It sent no request body, score text, analytics, account, payment, AI, or third-party request. F-6-2 concerns the regression tests, not observed production behavior.

## Declared claim results

Fresh clone: `/tmp/abc-score-play-review6-clean.BorGxv/repo` at `be9425b6481b30621f7b441e520ba5a5cb981817`. `npm ci` ran before the commands. Every exact command from `.factory/claims.json` exited 0.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `sample-score` | `npm test -- --grep @claim:sample-score` | Pass |
| `free-use` | `npm test -- --grep @claim:free-use` | Pass |
| `local-score` | `npm test -- --grep @claim:local-score` | Pass; insufficient same-origin coverage, F-6-2 |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | Pass |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass |
| `score-playback` | `npm test -- --grep @claim:score-playback` | Pass |
| `bar-loop` | `npm test -- --grep @claim:bar-loop` | Pass |
| `tempo-range` | `npm test -- --grep @claim:tempo-range` | Pass |
| `live-render` | `npm test -- --grep @claim:live-render` | Pass |
| `abc-file-open` | `npm test -- --grep @claim:abc-file-open` | Pass; insufficient same-origin and size-limit coverage, F-6-2/F-6-3 |
| `abc-file-download` | `npm test -- --grep @claim:abc-file-download` | Pass |
| `score-link` | `npm test -- --grep @claim:score-link` | Pass |
| `print-card` | `npm test -- --grep @claim:print-card` | Pass |
| `error-lines` | `npm test -- --grep @claim:error-lines` | Pass |
| `sample-load` | `npm test -- --grep @claim:sample-load` | Pass |
| `clear-editor` | `npm test -- --grep @claim:clear-editor` | Pass; does not cover F-6-4 |
| `staff-bar-selection` | `npm test -- --grep @claim:staff-bar-selection` | Pass |
| `keyboard-playback` | `npm test -- --grep @claim:keyboard-playback` | Pass |

The aggregate clean-clone run passed 8 Vitest tests and 26 Chromium tests. `npm run typecheck`, `npm run lint`, and `npm run build` passed. The generated JavaScript totals 164,433 bytes gzip, within the 200 KB product contract.

## Earlier-finding regression check

Reviews 1–5, polish reports 1, 3, 4, and 5, and the prior handoff were read in full. Review 2 contained zero findings. The clean build and all 17 deployed public files match byte-for-byte, so the live/code checks below refer to the same candidate.

| Earlier ID | Independent live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | Demo staff, bar count, and both play controls intersect the first phone viewport; `@claim:sample-score` asserts them. | Fixed |
| F-1-2 | **Start for real**, direct editor link, back, and forward focus a visible destination. | Fixed |
| F-1-3 | Web Audio test observes resume, oscillator creation, and oscillator start; live playback UI changes without errors. | Fixed |
| F-1-4 | `live-render` changes source, SVG, title, and valid state. | Fixed |
| F-1-5 | No visitor-facing sound-font promise remains. | Fixed |
| F-1-6 | Home, demo, legal, and 404 raw/runtime metadata are route-specific and complete. | Fixed |
| F-1-7 | Demo, Editor, and Privacy remain visible in every 390 px header, including the 404. | Fixed |
| F-1-8 | Landing and README both use **educators**. | Fixed |
| F-1-9 | How it works was rewritten, but the empty-editor placeholder still says “headers.” | **Reopened as F-6-1; blocking** |
| F-1-10 | README says the score plays through the listener’s speakers. | Fixed |
| F-1-11 | README uses plain open-source library attribution; MIT detail stays in licenses. | Fixed |
| F-1-12 | Sound-font jargon remains absent. | Fixed |
| F-1-13 | Sharing uses **score link** and explains the `#score=` privacy consequence directly. | Fixed |
| F-1-14 | Deployment documentation names route mapping, browser rules, and caching concretely. | Fixed |
| F-1-15 | Open/download actions preserve exact source and safe filenames; the new limit disclosure issue is F-6-3. | Fixed for original finding |
| F-1-16 | Visitor copy avoids storage-key implementation language. | Fixed |
| F-1-17 | Visitor copy consistently uses **practice**. | Fixed |
| F-1-18 | Designed 404 retains one-liner, legal links, Param Factory credit, artwork note, and `v1.0.0`. | Fixed |
| F-3-1 | Workbench labels are **Score editor** and **Sample score editor**. | Fixed |
| F-3-2 | “Three moves” remains absent. | Fixed |
| F-3-3 | “Kept focused” remains absent. | Fixed |
| F-4-1 | Live missing URL returns HTTP 404 with H1 **Page not found** and a direct explanation. | Fixed |
| F-4-2 | `package-lock.json` is tracked; clean-clone `npm ci` and all checks run successfully. | Fixed |
| F-5-1 | Every tested demo exit removes demo storage and preserves real storage. | Fixed |
| F-5-2 | `sample-load` verifies exact sample source, eight bars, playback state, and real storage. | Fixed |
| F-5-3 | `clear-editor` verifies both namespaces and preserves the inactive one. | Fixed |
| F-5-4 | Staff bar 3 selection sets both endpoints, summary, and status without a page error. | Fixed |
| F-5-5 | Space starts instrumented Web Audio and stops playback outside form fields. | Fixed |
| F-5-6 | Bars 2–3 highlight, produce audio, and complete two loop passes before Stop. | Fixed |
| F-5-7 | Every public page uses **Skip to page content** for `#main`. | Fixed |

## Structure, routing, accessibility, and identity

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` return 200. `/missing-review-6` returns the designed 404. Every discovered same-origin link returns 200; the two `mailto:` links are explicit.
- Route titles are **ABC Score Play — write, hear, and loop music**, **Demo — ABC Score Play**, **Privacy — ABC Score Play**, **Terms — ABC Score Play**, and **Page not found — ABC Score Play**. Each checked page has `lang="en"`, one H1, one main landmark, a plain meta description, canonical, OG/Twitter fields, favicon, apple-touch icon, and the 1200×630 product image.
- `robots.txt` references the sitemap; `sitemap.xml` lists home, Demo, Privacy, and Terms.
- Live back/forward changes the URL, restores the route, and focuses its H1. `/#workbench` and demo exit focus the visible editor heading.
- Live Axe checks found zero serious or critical violations on home, both demo URLs, Privacy, Terms, and 404. The supplied `verify-url.sh` passed on home and demo with one H1, `lang`, main, complete alt text, labeled buttons, and zero console errors.
- Response headers include CSP `frame-ancestors 'none'`, HSTS, `X-Content-Type-Options`, Referrer Policy, and Permissions Policy. Normal routes produced no CSP or console errors.
- The cream enamel, walnut housing, ruled paper, teal/coral transport keys, clipped panels, and original tape-console artwork visibly implement the documented mid-century instrument-panel direction. It is not a generic centered-gradient SaaS template.

## Missed leverage

No additional feature is implied by the brief. Local ABC open/download and fragment-link restore cover the expected import/export/share round trip. AI composition is an explicit non-goal, so a Sociobot model feature would be decorative. No provider key, AI endpoint, account, payment, analytics, or third-party runtime script is present.

## What would make this perfect

Close F-6-1 through F-6-4: explain the ABC fields in the empty editor, make privacy tests fail on same-origin uploads, disclose and test the 1 MB open-file boundary, and register or remove the browser-storage clearing claim. Then rerun all 18 exact claim commands, the full suite, and the cold live audit. Nothing else is required in the researched scope.
