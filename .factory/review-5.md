# Adversarial first-read review 5 — FAIL

**Product:** ABC Score Play

**Live site:** <https://abc-score-play.sociobot.in>

**Candidate reviewed:** `00172b90a44a0fa4174e1a0abb8199ccc4676829`

**Date:** 2026-08-29 UTC

## Verdict

**FAIL.** Seven findings remain: six major and one minor. There are no blocking findings. The first screen is clear, the sample is immediately usable, real storage stayed untouched, all 14 declared claim commands passed, and the deployed files match the candidate build. PASS still requires zero findings and no unlisted or incompletely tested claim.

## Findings

### Major

#### F-5-1 — Ordinary navigation out of the demo does not discard demo data

- **Quote/location:** Demo header links **ABC Score Play home**, **Editor**, and **Privacy**. The attached demo contract says leaving demo mode discards demo data.
- **Evidence:** In three fresh live contexts, editing the demo to `T:DEMO NAV MARKER` and using each link left that exact text in `demo:abc-score-play:score` after navigation to `/`, `/#workbench`, or `/privacy`. `abc-score-play:score` remained untouched. **Start for real** correctly removed the demo key, so only that exit path performs cleanup.
- **Why this matters:** Re-entering the demo after an ordinary exit restores a prior experiment instead of the bundled sample. The sandbox remains isolated from real data, but its lifecycle does not meet the stated discard-on-exit behavior.
- **Concrete fix:** When routing from demo mode to any non-demo route, remove `demo:abc-score-play:score` before rendering the destination. Add a browser test that edits the demo, exits through the wordmark, Editor, and Privacy, confirms the demo key is absent and the real key unchanged, then re-enters and sees “Evening Scale Study.”

#### F-5-2 — “Load sample score” is an unlisted action claim

- **Quote/location:** Landing workbench button **Load sample score**.
- **Evidence:** `.factory/claims.json` has no claim for this real-editor action. `@claim:sample-score` enters demo mode and tests **Reset demo**; it never clicks `#load-sample` on the real editor.
- **Why this matters:** The control promises a result that the claim registry does not describe or verify from a clean state.
- **Concrete fix:** Add a `sample-load` claim and tagged test that starts with a distinct real score, clicks **Load sample score**, and verifies the bundled source, eight-bar render, playback-enabled state, and real storage value.

#### F-5-3 — “Clear editor” and its saved-text promise are unlisted claims

- **Quote/location:** Landing button **Clear editor**; Privacy: “Use ‘Clear editor’ to remove saved text.”
- **Evidence:** No claim entry or tagged test clicks `#clear-score` or verifies that the active score text and active storage namespace are removed.
- **Why this matters:** Clearing saved work is a destructive privacy control. A visitor can rely on it, so it requires an observable sandbox test.
- **Concrete fix:** Add a `clear-editor` claim and tagged test for real and demo modes. Seed both namespaces, clear the active editor, verify its text/key are removed, and verify the other namespace is byte-for-byte unchanged.

#### F-5-4 — Staff-click loop selection is an unlisted claim

- **Quote/location:** Landing workbench: “Select a bar in the staff to loop it.”
- **Evidence:** No claim in `.factory/claims.json` states this interaction. `@claim:sample-score` happens to click a rendered measure and inspect `#loop-start`, but its registered claim is only that the demo loads a complete score.
- **Why this matters:** The public instruction is not traceable to a matching claim ID, so a future sample-loading test change could remove its only coverage without exposing the lost interaction.
- **Concrete fix:** Add a `staff-bar-selection` claim and tagged test that clicks a non-default rendered bar and verifies both loop endpoints and the plain-language loop summary identify that bar.

#### F-5-5 — The Space-key playback shortcut is an unlisted claim

- **Quote/location:** Landing workbench: “Press Space to play or stop.”
- **Evidence:** `.factory/claims.json` contains no keyboard-playback claim. The suite has an untagged test named “keyboard access reaches the skip link and controls playback,” but the public promise is absent from the claim registry.
- **Why this matters:** The shortcut is a user-facing behavior and must remain visible to the clean-sandbox claim runner.
- **Concrete fix:** Add a `keyboard-playback` claim and tag the existing browser test `@claim:keyboard-playback`. Keep its assertions for playing and stopped status, and instrument Web Audio as `@claim:score-playback` does.

#### F-5-6 — Multi-bar looping is broader than the declared test

- **Quote/location:** README: “Practice controls set a tempo and repeat one or more bars.” Landing: “Set the first and last bar.”
- **Evidence:** `@claim:bar-loop` leaves both loop inputs at their default value of 1 and observes bar 1 repeat. It never changes `#loop-start` or `#loop-end`, and therefore does not verify “more bars” or the first/last range controls.
- **Why this matters:** The single-bar result does not prove the separately promised multi-bar path.
- **Concrete fix:** Extend `@claim:bar-loop` to set a non-default range such as bars 2–3 and observe both selected measures before the second pass. Keep the existing repeat-until-stopped assertion.

### Minor

#### F-5-7 — The skip link names the wrong destination on several routes

- **Quote/location:** `/`, `/privacy`, and `/terms` skip link: **Skip to score editor**; its target is always `#main`.
- **Evidence:** On home, `#main` starts at the hero near `y=64` while `#workbench` starts near `y=952`. On Privacy the target H1 is “Keep your score on this device.” The standalone 404 instead uses **Skip to page content**.
- **Why this matters:** Keyboard and screen-reader users are told they will reach an editor when the link actually reaches the page’s main content. The shared header also differs from the 404.
- **Concrete fix:** Use **Skip to page content** on every route, retaining `href="#main"`, and assert the same text and target across home, demo, legal, and 404 pages.

## Cold first read

Fresh Chromium contexts with service workers blocked opened `/` at 390 × 844 and 1440 × 900 with `scrollY = 0`.

| Question | Answer visible before scrolling | Result |
| --- | --- | --- |
| What does it do? | “Write, hear, and loop an ABC score.” | Pass |
| For whom? | “For musicians and educators who need a short score ready to practice or share.” | Pass |
| What should I click first? | **Try it with sample data**, beside “It loads a complete score, ready to play.” | Pass |

At 390 px, the action ended at `y=531` and the three facts ended at `y=631`, inside the 844 px viewport. At desktop width the same information ended at `y=684`. Neither view had horizontal overflow, a console error, a page error, or a cross-origin request.

## Copy audit

Counts use visible whitespace-separated words after resolving Markdown link labels. Hyphenated terms, paths, code tokens without spaces, and numeric ranges count as one word. No sentence exceeds 22 words, and none uses a banned marketing adjective. F-5-2 through F-5-6 are claim-governance findings rather than clarity problems; F-5-7 is the only plain-words label failure.

### Landing-page sentences and sentence-like copy

| Words | Exact copy | Result |
| ---: | --- | --- |
| 7 | Write, hear, and loop an ABC score | Pass |
| 14 | For musicians and educators who need a short score ready to practice or share. | Pass |
| 8 | It loads a complete score, ready to play. | Pass |
| 3 | Free to use | Pass |
| 6 | Your score stays in this browser | Pass |
| 6 | Works offline after the first visit | Pass |
| 10 | A music console turns typed notes into a paper score. | Pass; useful image alt text |
| 5 | Write ABC on the left. | Pass |
| 6 | The staff updates as you type. | Pass; `live-render` |
| 12 | Tip: write a bar with notes such as <code>&#124; C2 D2 E2 F2 &#124;</code>. | Pass |
| 5 | Your staff will appear here. | Pass |
| 7 | Write ABC or load the sample score. | Pass |
| 8 | Choose a valid score to set a loop. | Pass |
| 9 | Select a bar in the staff to loop it. | F-5-4 |
| 6 | Press Space to play or stop. | F-5-5 |
| 7 | Write or load a score to begin. | Pass |
| 9 | Type the title, meter, note length, key, and notes. | Pass |
| 5 | Errors point to a line. | Pass; `error-lines` |
| 6 | Set the first and last bar. | F-5-6 |
| 5 | Change the tempo for practice. | Pass; `tempo-range` |
| 11 | Repeat the loop, copy its link, or print the clean score. | Pass; declared actions |
| 6 | No account or cloud score storage. | Pass; `free-use`, `local-score` |
| 4 | No copyrighted score catalogue. | Pass; scope boundary |
| 6 | No composing bot or group editing. | Pass; researched non-goals |
| 7 | Your browser stores the current ABC text. | Pass; `local-score` |
| 11 | Write a short ABC score, hear it, and practice a loop. | Pass |
| 8 | Built by Param Factory · v1.0.0 · Original generated artwork | Pass; attribution/build label |

### Landing headings, labels, links, and actions

| Words | Exact copy | Type/result |
| ---: | --- | --- |
| 4 | Skip to score editor | Skip link; F-5-7 |
| 3 | ABC Score Play | Wordmark; clear |
| 1 each | Demo · Editor · Privacy · Terms | Navigation links; clear nouns |
| 4 | ABC notation practice tool | Section label; names format and task |
| 2 | Score editor | Section label; clear |
| 6 | Turn text into a practice loop | Heading; clear |
| 2 | ABC source | Heading; clear |
| 3 | Waiting for notes | Status; clear |
| 3 | ABC score text | Accessible field label; clear |
| 2 | Rendered score | Heading; clear |
| 2 | 0 bars | Count; clear |
| 2 | Practice tempo | Label; clear |
| 3 | Loop from bar | Label; clear |
| 3 | Loop to bar | Label; clear |
| 6 | How to make a practice loop | Heading; clear |
| 3 | Write the tune | Heading; clear |
| 3 | Choose the bars | Heading; clear |
| 3 | Play or share | Heading; clear |
| 7 | A practice tool, not a score library | Heading; clear |
| 5 | Try it with sample data | Result-naming action; pass |
| 3 | Load sample score | Result-naming action; copy passes, claim gap F-5-2 |
| 3 | Open ABC file | Result-naming action; pass |
| 3 | Download ABC file | Result-naming action; pass |
| 3 | Copy score link | Result-naming action; pass |
| 3 | Print score card | Result-naming action; pass |
| 2 | Clear editor | Result-naming action; copy passes, claim gap F-5-3 |
| 2 | Play score | Result-naming action; pass |
| 1 | Stop | Clear transport action; pass |
| 2 | Play loop | Result-naming action; pass |

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
| 13 | It turns standard ABC into sheet music and plays it through your speakers. | Pass; `live-render`, `score-playback` |
| 11 | Practice controls set a tempo and repeat one or more bars. | F-5-6 |
| 6 | Try the isolated sample at `?demo=1`. | Pass |
| 10 | Demo edits stay separate and never replace your real score. | Pass; `demo-isolation` |
| 8 | Draws the score with the open-source `abcjs` library. | Pass; dependency attribution confirmed |
| 6 | Plays valid scores through your browser. | Pass; `score-playback` |
| 8 | Repeats selected bars at 40–220 beats per minute. | Pass; `bar-loop`, `tempo-range` |
| 6 | Opens `.abc` files without uploading them. | Pass; `abc-file-open` |
| 9 | Downloads the exact ABC text as an `.abc` file. | Pass; `abc-file-download` |
| 11 | Copies a score link that restores the same score when opened. | Pass; `score-link` |
| 6 | Prints the notation without editor controls. | Pass; `print-card` |
| 7 | Saves the current score in browser storage. | Pass; `local-score` |
| 7 | Reloads offline after the first online visit. | Pass; `offline-reload` |
| 4 | No account is required. | Pass; `free-use` |
| 4 | The product is free. | Pass; `free-use` |
| 12 | It does not include a score catalogue, composing bot, or group editing. | Pass; researched scope boundary |
| 5 | Requires Node.js 20 or newer. | Pass; manifest and lockfile confirm it |
| 4 | Open `http://localhost:5173` or `http://localhost:5173/?demo=1`. | Pass |
| 15 | `npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. | Pass; clean-clone command confirmed |
| 10 | The build output is `dist/`, with `dist/index.html` at its root. | Pass; clean build confirmed |
| 10 | To run one public claim, use its command from `.factory/claims.json`. | Pass |
| 8 | Deploy `dist/` as an Azure Static Web App. | Pass; deployment instruction |
| 15 | `public/staticwebapp.config.json` maps app routes to their HTML, sets browser security rules, and caches versioned files. | Pass; configuration confirmed |
| 6 | The factory owns DNS and deployment. | Pass; repository boundary |
| 9 | The app sends no score text to a service. | Pass; `local-score` and live request log |
| 6 | Shared score text appears after `#score=`. | Pass; `score-link` |
| 8 | Browsers do not send that part to servers. | Pass; request log confirmed |
| 7 | See `/privacy` and `/terms` in the app. | Pass; both links return 200 |
| 5 | Application code is MIT licensed. | Pass; `LICENSE` present |
| 4 | `abcjs` is MIT licensed. | Pass; package metadata confirmed |
| 15 | The hero artwork was generated for this product; its prompt and provenance are in `.factory/design.md`. | Pass; provenance present |

Terminology remains consistent: **ABC**, **score**, **bar**, **loop**, **tempo**, **practice**, **demo**, **score link**, **score card**, and **ABC file**. No metaphor/mood heading or banned marketing adjective remains.

## Demo and sandbox verification

- One click from home opened `/?demo=1`. The live 390 × 844 first viewport showed the “Evening Scale Study” staff (`y=312–521`), **8 bars**, **Play score**, and **Play loop** before the editor began at `y=793`.
- The sticky banner read “Demo — sample data, nothing is saved to your real score” and exposed **Reset demo** and **Start for real**.
- With `abc-score-play:score` seeded to `T:REAL SHOULD SURVIVE`, a demo edit wrote only `demo:abc-score-play:score`. Reset restored the exact bundled eight-bar source and left the real key unchanged.
- **Start for real** removed the demo key, loaded the real source, reached `/#workbench`, focused `#workbench-title`, and placed it at the top of the viewport.
- Ordinary navigation exits retain demo data as F-5-1 records.
- A fresh live online visit, service-worker activation, online reload, and offline reload retained the demo H1 and rendered eight-bar score.
- The observed home/demo/edit/reset/exit/offline flow issued same-origin GET requests only. It produced no request body, cross-origin request, console error, or page error.

## Declared claims

Every exact command in `.factory/claims.json` ran independently after `npm ci` in clean clone `/tmp/abc-score-play-review5.cJa6s1/repo`. All exited 0.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `sample-score` | `npm test -- --grep @claim:sample-score` | Pass |
| `free-use` | `npm test -- --grep @claim:free-use` | Pass |
| `local-score` | `npm test -- --grep @claim:local-score` | Pass |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | Pass |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass |
| `score-playback` | `npm test -- --grep @claim:score-playback` | Pass |
| `bar-loop` | `npm test -- --grep @claim:bar-loop` | Pass; scope gap F-5-6 |
| `tempo-range` | `npm test -- --grep @claim:tempo-range` | Pass |
| `live-render` | `npm test -- --grep @claim:live-render` | Pass |
| `abc-file-open` | `npm test -- --grep @claim:abc-file-open` | Pass |
| `abc-file-download` | `npm test -- --grep @claim:abc-file-download` | Pass |
| `score-link` | `npm test -- --grep @claim:score-link` | Pass |
| `print-card` | `npm test -- --grep @claim:print-card` | Pass |
| `error-lines` | `npm test -- --grep @claim:error-lines` | Pass |

No declared command failed. F-5-2 through F-5-5 identify public claims that are not registered; F-5-6 identifies the untested multi-bar portion of registered copy.

## Earlier-finding regression check

Read in full: reviews 1–4, polish reports 1, 3, and 4, and the prior handoff. Review 2 contained no findings. Every earlier finding was checked in the live product and the current source/test suite.

| Earlier ID | Live and code confirmation | Status |
| --- | --- | --- |
| F-1-1 | Demo staff, count, and both play controls intersect the first phone viewport; `@claim:sample-score` asserts them. | Fixed |
| F-1-2 | **Start for real**, direct `/#workbench`, back, and forward focus the visible destination. | Fixed |
| F-1-3 | `@claim:score-playback` observes resume, oscillator creation, and oscillator start. | Fixed |
| F-1-4 | `live-render` is declared and changes SVG/title after editing. | Fixed |
| F-1-5 | Visitor copy contains no sound-font promise. | Fixed |
| F-1-6 | Home, demo, legal, and 404 heads have route-specific title, description, canonical, OG/Twitter, favicon, and apple-touch metadata. | Fixed |
| F-1-7 | Demo, Editor, and Privacy remain visible in each 390 px header; 404 main navigation matches. | Fixed |
| F-1-8 | Landing and README use **educators**. | Fixed |
| F-1-9 | Guidance names title, meter, note length, key, and notes. | Fixed |
| F-1-10 | README says playback uses the listener’s speakers. | Fixed |
| F-1-11 | README uses plain open-source library attribution. | Fixed |
| F-1-12 | Sound-font jargon remains absent from visitor copy. | Fixed |
| F-1-13 | Sharing copy uses **score link** and directly explains the `#score=` privacy consequence. | Fixed |
| F-1-14 | Deployment documentation describes route mapping, security rules, and caching in concrete terms. | Fixed |
| F-1-15 | Open/download actions and both tagged tests remain present and pass. | Fixed |
| F-1-16 | Visitor copy avoids “storage key”; exact namespaces remain in verifier documentation. | Fixed |
| F-1-17 | Visitor copy consistently uses **practice**. | Fixed |
| F-1-18 | Live 404 retains legal links, product line, Param Factory credit, `v1.0.0`, and artwork provenance. | Fixed |
| F-3-1 | Workbench labels are **Score editor** and **Sample score editor**. | Fixed |
| F-3-2 | “Three moves” remains absent. | Fixed |
| F-3-3 | “Kept focused” remains absent. | Fixed |
| F-4-1 | Live unknown route returns HTTP 404 with H1 **Page not found** and the direct address explanation. | Fixed |
| F-4-2 | `package-lock.json` is tracked; clean-clone `npm ci` and the full suite pass. | Fixed |

F-5-7 does not reopen F-1-7: the visible main navigation is consistent; the newly identified defect is the skip link’s inaccurate destination name.

## Structure, accessibility, and deployment

- `/`, `/?demo=1`, `/demo`, `/privacy`, and `/terms` returned 200. `/missing-review-5` returned the designed 404. Every discovered normal same-origin link returned 200; the two `mailto:` links are explicit. The 404’s own hash link remains on the expected 404 response.
- Every route has `lang="en"`, one H1, one main landmark, a route title, description, canonical, OG/Twitter metadata, favicon, and apple-touch icon. `robots.txt` names the sitemap; `sitemap.xml` lists home, demo, Privacy, and Terms.
- Browser back/forward restored the route and focused the new H1 after the animation frame. `/#workbench` and demo exit focus the workbench heading. F-5-7 is the remaining skip-link wording defect.
- Live axe scans found no serious or critical violation on home, both demo URLs, Privacy, Terms, or 404. There was no 390 px overflow. Reduced-motion CSS removes smooth scrolling and transitions; all visible mobile controls are covered by a 44 × 44 regression test.
- Response headers include CSP with `frame-ancestors 'none'`, `X-Content-Type-Options`, Referrer Policy, Permissions Policy, and HSTS. No CSP or normal-route console error appeared.
- The cream enamel, walnut frame, ruled score paper, teal/coral transport controls, and original console artwork implement the documented mid-century instrument-panel direction. The result is not a generic SaaS template.
- Clean-clone `npm test` passed 6 unit/config tests and 23 Chromium tests. `npm run typecheck`, `npm run lint`, and `npm run build` passed. `dist/` was produced. Demo JavaScript totals about 164.07 kB gzip, within the 200 kB product contract.
- Sixteen deployable files served by production matched the candidate `dist/` byte-for-byte. `staticwebapp.config.json` is hosting configuration and is not a public URL.
- `/opt/fleet/lib/verify-url.sh` passed on live home and demo with one H1, `lang`, main, alt text, labeled buttons, and no console errors.

## Missed leverage

No additional product feature is implied by the brief. Local ABC open/download and fragment-link restore cover the expected import/export/share round trip. AI composition is an explicit non-goal, so a Sociobot model feature would be decorative rather than useful. No provider key, AI endpoint, account, payment, analytics, or third-party runtime script appears.

## What would make this perfect

Close F-5-1 through F-5-7: discard the demo namespace on every exit, register and tag the sample-load, clear-editor, staff-selection, and Space-key claims, exercise a non-default multi-bar loop, and give every route the accurate **Skip to page content** link. Then rerun all claim commands and the complete cold live audit. Nothing else is required by the researched scope.
