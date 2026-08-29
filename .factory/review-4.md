# Adversarial first-read review 4 — FAIL

**Product:** ABC Score Play · **Live:** https://abc-score-play.sociobot.in · **Candidate:** 93d4b7769e5de84d7ed09146c2089b625aeee831 · **Date:** 2026-08-29 UTC

## Verdict

**FAIL.** Two minor findings remain. The job is clear, the demo is immediately usable and isolated, and all declared claim checks pass. PASS requires zero findings.

## Findings

### Minor

#### F-4-1 — The 404 headline is a metaphor, not an error heading

- **Quote/location:** Live unknown route /missing-review-4: “This bar is not in the score”.
- **Why:** A recovery page must state what happened. The visitor has to translate a music metaphor before learning the address is missing; this breaches the plain-words heading rule.
- **Fix:** Use H1 “Page not found.” Keep the designed styling and “Return to the editor.” Rewrite the paragraph as “This address does not lead to a page in ABC Score Play.”

#### F-4-2 — The handoff instructs a clean install that cannot run

- **Quote/location:** .factory/handoff.md says claims passed “after npm ci” and makes npm ci the first verification command.
- **Evidence:** A new clone has no package-lock.json or npm-shrinkwrap.json. npm ci exits EUSAGE. npm install succeeds, but resolves transitive dependencies anew.
- **Why:** The next worker cannot follow the stated verification path, and dependency resolution is not pinned.
- **Fix:** Commit package-lock.json, verify npm ci and the full suite from a new clone, then retain npm ci. If a lockfile is intentionally excluded, replace the claim and command with the tested npm install path.

## Cold first read

Fresh Chromium contexts without storage or a service worker opened the live home before scrolling.

| Question | Phone, 390 x 844 | Desktop, 1440 x 900 |
| --- | --- | --- |
| What does it do? | “Write, hear, and loop an ABC score.” | Same |
| For whom? | “For musicians and educators who need a short score ready to practice or share.” | Same |
| Click first? | **Try it with sample data**; “It loads a complete score, ready to play.” | Same |
| Result | Pass | Pass |

The H1, audience, action, action result, and three facts were visible at both widths. No page/console errors, cross-origin requests, or phone overflow occurred.

## Copy audit

Counts treat hyphenated terms, paths, numbers, and ABC snippets as one word. No sentence exceeds 22 words. Terms consistently use ABC, score, bar, loop, tempo, practice, demo, score link, score card, and ABC file.

### Landing page sentences

| Words | Sentence | Result |
| ---: | --- | --- |
| 7 | Write, hear, and loop an ABC score | Pass |
| 14 | For musicians and educators who need a short score ready to practice or share. | Pass |
| 8 | It loads a complete score, ready to play. | Pass; sample-score |
| 3 | Free to use | Pass; free-use |
| 6 | Your score stays in this browser | Pass; local-score |
| 6 | Works offline after the first visit | Pass; offline-reload |
| 10 | A music console turns typed notes into a paper score. | Pass; alt text |
| 5 | Write ABC on the left. | Pass |
| 6 | The staff updates as you type. | Pass; live-render |
| 12 | Tip: write a bar with notes such as `| C2 D2 E2 F2 |`. | Pass |
| 5 | Your staff will appear here. | Pass |
| 7 | Write ABC or load the sample score. | Pass |
| 8 | Choose a valid score to set a loop. | Pass |
| 9 | Select a bar in the staff to loop it. | Pass |
| 6 | Press Space to play or stop. | Pass |
| 7 | Write or load a score to begin. | Pass |
| 10 | Type the title, meter, note length, key, and notes. | Pass |
| 5 | Errors point to a line. | Pass; error-lines |
| 6 | Set the first and last bar. | Pass |
| 5 | Change the tempo for practice. | Pass; tempo-range |
| 11 | Repeat the loop, copy its link, or print the clean score. | Pass; declared actions |
| 6 | No account or cloud score storage. | Pass; scope/free/local |
| 5 | No copyrighted score catalogue. | Pass; scope |
| 6 | No composing bot or group editing. | Pass; scope |
| 7 | Your browser stores the current ABC text. | Pass; local-score |
| 11 | Write a short ABC score, hear it, and practice a loop. | Pass |

Landing headings are task-specific: **ABC notation practice tool**, **Score editor**, **Turn text into a practice loop**, **ABC source**, **Rendered score**, **How to make a practice loop**, **Write the tune**, **Choose the bars**, **Play or share**, **A practice tool, not a score library**, **Practice tempo**, **Loop from bar**, and **Loop to bar**. Buttons are result-naming verbs: **Try it with sample data**, **Load sample score**, **Open ABC file**, **Download ABC file**, **Copy score link**, **Print score card**, **Clear editor**, **Play score**, **Stop**, and **Play loop**.

### README headings and sentences

Headings **ABC Score Play**, **What it does**, **Run locally**, **Test and build**, **Deploy**, and **Privacy and licenses** make sense out of context.

| Words | Sentence | Result |
| ---: | --- | --- |
| 15 | Write a short ABC score, hear it, loop bars, share a link, and print it. | Pass |
| 12 | ABC Score Play is for musicians and educators who prefer plain-text notation. | Pass |
| 12 | It turns standard ABC into sheet music and plays it through your speakers. | Pass; playback |
| 11 | Practice controls set a tempo and repeat one or more bars. | Pass |
| 6 | Try the isolated sample at `?demo=1`. | Pass |
| 10 | Demo edits stay separate and never replace your real score. | Pass; isolation |
| 8 | Draws the score with the open-source `abcjs` library. | Pass; attribution |
| 6 | Plays valid scores through your browser. | Pass; playback |
| 9 | Repeats selected bars at 40–220 beats per minute. | Pass; range/loop |
| 7 | Opens `.abc` files without uploading them. | Pass; open |
| 9 | Downloads the exact ABC text as an `.abc` file. | Pass; download |
| 11 | Copies a score link that restores the same score when opened. | Pass; score-link |
| 6 | Prints the notation without editor controls. | Pass; print |
| 7 | Saves the current score in browser storage. | Pass; local |
| 7 | Reloads offline after the first online visit. | Pass; offline |
| 4 | No account is required. | Pass; free-use |
| 4 | The product is free. | Pass; free-use |
| 12 | It does not include a score catalogue, composing bot, or group editing. | Pass; scope |
| 6 | Requires Node.js 20 or newer. | Pass |
| 15 | `npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. | Pass |
| 12 | The build output is `dist/`, with `dist/index.html` at its root. | Pass |
| 12 | To run one public claim, use its command from `.factory/claims.json`. | Pass |
| 8 | Deploy `dist/` as an Azure Static Web App. | Pass |
| 6 | The factory owns DNS and deployment. | Pass |
| 9 | The app sends no score text to a service. | Pass; request log |
| 5 | Shared score text appears after `#score=`. | Pass |
| 8 | Browsers do not send that part to servers. | Pass; request log |
| 7 | See `/privacy` and `/terms` in the app. | Pass |
| 5 | Application code is MIT licensed. | Pass; LICENSE |
| 4 | `abcjs` is MIT licensed. | Pass; dependency metadata |
| 17 | The hero artwork was generated for this product; its prompt and provenance are in `.factory/design.md`. | Pass; provenance |

No landing/README visitor-reliance claim lacks a claims.json entry. License, provenance, and scope statements have repository evidence.

## Demo, sandbox, and claims

- /?demo=1 is one click from home. Its first phone view contained the original eight-bar “Evening Scale Study,” “8 bars,” Play score, Play loop, and the persistent banner.
- Banner text is “Demo — sample data, nothing is saved to your real score.” Reset restored the sample. With a seeded real score, demo edits wrote only demo:abc-score-play:score; Start for real deleted it, restored the real value, and focused the visible workbench after scrolling.
- Live request logging during home, demo, edit, reset, exit, and playback found same-origin traffic only: no score upload, analytics, account, payment, AI, API, or other external request.
- All 14 exact claim commands ran independently in clean clone /tmp/abc-score-play-review4.kdLlaJ after npm install and passed. Full npm test passed 5 Vitest and 23 Chromium checks; npm run build and npm run lint passed.

| Claims | Result |
| --- | --- |
| sample-score, free-use, local-score, demo-isolation, offline-reload | Pass |
| score-playback, bar-loop, tempo-range, live-render, error-lines | Pass |
| abc-file-open, abc-file-download, score-link, print-card | Pass |

Playback checks observe AudioContext resume plus oscillator creation/start. Privacy, file, link, and isolation checks assert observable sandbox outcomes.

## History, structure, and leverage

Every review-1, review-2, review-3, polish, verification, and previous-handoff record was read. F-1-1 through F-1-18 remain fixed live and in source: immediate demo, focused routes, observable audio, declared rendering, plain copy, metadata, navigation, file round trip, isolation, spelling, and 404 footer. F-3-1 through F-3-3 remain fixed: task-specific labels replaced decorative eyebrows. F-4-1 is new and does not reopen F-1-18.

- /, /demo, /privacy, and /terms return 200; a missing route returns the designed 404. Every discovered same-origin link returns 200; mailto links are explicit.
- Checked routes have lang=en, one H1, main, route-specific title/description/canonical/OG/Twitter metadata, favicon, and apple touch icon. Back navigation moves focus to the H1 and announces it.
- Phone axe scans of home, both demo URLs, Privacy, Terms, and 404 found zero serious/critical violations; no phone overflow appeared.
- Build output is dist; JavaScript is about 164 KB gzip, below 200 KB. The mid-century panel art, walnut frame, ruled paper, and transport controls are distinct from a generic SaaS template.
- No additional feature is implied by the brief: local ABC open/download and score-link restore cover import/export. AI composition is explicitly a non-goal; no provider key or AI endpoint is present.

## What would make this perfect

Repair F-4-1 and F-4-2. Then run npm ci from a new clone, every declared claim command, npm test, and the cold browser audit.
