# Adversarial first-read review 2 — PASS

**Product:** ABC Score Play  
**Live site:** <https://abc-score-play.sociobot.in>  
**Candidate reviewed:** `4af2b71a2a714ced5e27751515b38a6b7b4ae145`  
**Date:** 2026-08-28 UTC

## Verdict

**PASS.** Zero findings. The cold first screen answers what the product does, who it is for, and what to click. The one-click demo opens on realistic sample notation, stays separate from real data, and all declared claims pass from a clean clone.

## Cold first read

Fresh Chromium contexts at 390 × 844 and 1440 × 900 opened `/` before scrolling.

- **What it does:** write a short ABC music score, hear it, and repeat selected bars for practice.
- **For whom:** musicians and educators who need a short score to practice or share.
- **First action:** **Try it with sample data**. Its adjacent sentence says, “It loads a complete score, ready to play.”

The phone’s first viewport contained the seven-word headline, 14-word audience sentence, action, action result, and all three factual lines. There were no page/console errors or cross-origin requests.

## Copy audit

Counts treat hyphenated forms and ABC snippets as one word. No sentence exceeds 22 words, uses a banned marketing word, or creates terminology drift.

### Landing page sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Write, hear, and loop an ABC score | 7 | Pass |
| For musicians and educators who need a short score ready to practice or share. | 14 | Pass |
| It loads a complete score, ready to play. | 8 | Pass |
| Free to use | 3 | Pass |
| Your score stays in this browser | 6 | Pass |
| Works offline after the first visit | 6 | Pass |
| A music console turns typed notes into a paper score. | 10 | Pass; alt |
| Write ABC on the left. | 5 | Pass |
| The staff updates as you type. | 6 | Pass; `live-render` |
| Tip: write a bar with notes such as `| C2 D2 E2 F2 |`. | 12 | Pass |
| Your staff will appear here. | 5 | Pass |
| Write ABC or load the sample score. | 7 | Pass |
| Choose a valid score to set a loop. | 8 | Pass |
| Select a bar in the staff to loop it. | 9 | Pass |
| Press Space to play or stop. | 6 | Pass |
| Write or load a score to begin. | 7 | Pass |
| Type the title, meter, note length, key, and notes. | 10 | Pass |
| Errors point to a line. | 5 | Pass; `error-lines` |
| Set the first and last bar. | 6 | Pass |
| Change the tempo for practice. | 5 | Pass; `tempo-range` |
| Repeat the loop, copy its link, or print the clean score. | 11 | Pass; claim coverage |
| No account or cloud score storage. | 6 | Pass; claim coverage |
| No copyrighted score catalogue. | 5 | Pass; scope boundary |
| No composing bot or group editing. | 6 | Pass; scope boundary |
| Your browser stores the current ABC text. | 7 | Pass; `local-score` |
| Write a short ABC score, hear it, and practice a loop. | 11 | Pass; footer |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Write a short ABC score, hear it, loop bars, share a link, and print it. | 15 | Pass |
| ABC Score Play is for musicians and educators who prefer plain-text notation. | 12 | Pass |
| It turns standard ABC into sheet music and plays it through your speakers. | 12 | Pass; claim coverage |
| Practice controls set a tempo and repeat one or more bars. | 11 | Pass |
| Try the isolated sample at `?demo=1`. | 6 | Pass |
| Demo edits stay separate and never replace your real score. | 10 | Pass; `demo-isolation` |
| Draws the score with the open-source `abcjs` library. | 8 | Pass; attribution |
| Plays valid scores through your browser. | 6 | Pass; `score-playback` |
| Repeats selected bars at 40–220 beats per minute. | 9 | Pass; claim coverage |
| Opens `.abc` files without uploading them. | 7 | Pass; `abc-file-open` |
| Downloads the exact ABC text as an `.abc` file. | 9 | Pass; `abc-file-download` |
| Copies a score link that restores the same score when opened. | 11 | Pass; `score-link` |
| Prints the notation without editor controls. | 6 | Pass; `print-card` |
| Saves the current score in browser storage. | 7 | Pass; `local-score` |
| Reloads offline after the first online visit. | 7 | Pass; `offline-reload` |
| No account is required. | 4 | Pass; `free-use` |
| The product is free. | 4 | Pass; `free-use` |
| It does not include a score catalogue, composing bot, or group editing. | 12 | Pass; scope boundary |
| Requires Node.js 20 or newer. | 6 | Pass |
| `npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. | 15 | Pass |
| The build output is `dist/`, with `dist/index.html` at its root. | 12 | Pass |
| To run one public claim, use its command from `.factory/claims.json`. | 12 | Pass |
| Deploy `dist/` as an Azure Static Web App. | 8 | Pass |
| The factory owns DNS and deployment. | 6 | Pass |
| The app sends no score text to a service. | 9 | Pass; request interception |
| Shared score text appears after `#score=`. | 5 | Pass; `score-link` |
| Browsers do not send that part to servers. | 8 | Pass; request interception |
| See `/privacy` and `/terms` in the app. | 7 | Pass |
| Application code is MIT licensed. | 5 | Pass; `LICENSE` |
| `abcjs` is MIT licensed. | 4 | Pass; package license |
| The hero artwork was generated for this product; its prompt and provenance are in `.factory/design.md`. | 17 | Pass; provenance |

Headings make sense in context. Result-naming controls are **Try it with sample data**, **Load sample score**, **Open ABC file**, **Download ABC file**, **Copy score link**, **Print score card**, **Clear editor**, **Play score**, and **Play loop**. Terms stay consistent: ABC, score, bar, loop, tempo, demo, score link, score card, and ABC file.

## Demo and sandbox

- `/demo` and `/?demo=1` showed “Evening Scale Study,” rendered staff, **8 bars**, **Play score**, and **Play loop** in the initial 390 × 844 viewport.
- The persistent banner says “Demo — sample data, nothing is saved to your real score,” with **Reset demo** and **Start for real**.
- A seeded real score remained unchanged. Reset restored the bundled sample. Start for real removed only `demo:abc-score-play:score`, restored the real score, and focused the visible workbench after the brief smooth scroll.
- Production offline reload after service-worker readiness retained the demo H1 and staff. The full flow made no cross-origin requests.
- The brief lists AI composing as a non-goal; local ABC open/download and share-link restore cover the obvious import/export leverage. No decorative AI, provider key, account, or external service appears.

## Claims

All 14 exact commands in `.factory/claims.json` were run independently from fresh clone `/tmp/abc-score-play-review-2.G89ilc`; all passed. A subsequent clean-clone `npm test` passed 5 unit tests and 22 Chromium checks. The temporary offline command race caused by concurrent local preview builds was rerun alone and passed.

| Claims | Result |
| --- | --- |
| `sample-score`, `free-use`, `local-score`, `demo-isolation`, `offline-reload` | Pass |
| `score-playback`, `bar-loop`, `tempo-range`, `live-render`, `error-lines` | Pass |
| `abc-file-open`, `abc-file-download`, `score-link`, `print-card` | Pass |

The audio test instruments Web Audio (`resume`, oscillator creation, oscillator start). Privacy checks intercept requests; offline is tested after a service-worker visit. No unlisted visitor-reliance claim remains: functional/privacy sentences map to declared claims; library/license/artwork statements are checked provenance or attribution.

## History, structure, and accessibility

All 18 earlier findings were confirmed fixed both live and in code:

| Earlier findings | Confirmation |
| --- | --- |
| F-1-1 to F-1-3 | Mobile demo starts in use; editor route scrolls/focuses correctly; audio proof is observable. |
| F-1-4 to F-1-5 | `live-render` exists and sound-font wording is removed. |
| F-1-6 to F-1-7 | Route-specific raw metadata and consistent mobile header/nav are present. |
| F-1-8 to F-1-14 | Audience, ABC guidance, privacy, README, and deployment wording are repaired. |
| F-1-15 to F-1-16 | Local ABC open/download work; visitor copy avoids storage-key jargon. |
| F-1-17 to F-1-18 | “Practice” is consistent; designed 404 includes legal links and `v1.0.0`. |

`/`, `/demo`, `/privacy`, and `/terms` return 200. Unknown URLs return the designed HTTP 404. Every normal discovered link returns 200; the two explicit `mailto:` links are valid. Each route has `lang="en"`, one H1, main, route title, description, canonical, OG/Twitter fields, favicon, apple touch icon, and product social image. The production UI had no dead links, console errors, cross-origin requests, mobile horizontal overflow, or serious/critical axe findings.

The cream enamel, walnut, teal/coral transport controls, ruled paper, and original panel art are visibly distinct from a generic SaaS template while retaining the required header → hero → product → how-it-works → boundary → footer structure.

## What would make this perfect

Nothing is required in the researched scope or product contract. Continue running the declared claims after any copy, route, storage, or service-worker change.
