# Adversarial first-read review 3 — FAIL

**Product:** ABC Score Play  
**Live site:** <https://abc-score-play.sociobot.in>  
**Candidate reviewed:** `34096d281b3dc3b73a095a37f85a30655ff9639f`  
**Date:** 2026-08-29 UTC

## Verdict

**FAIL.** There are three minor findings and no blocking findings. The product is clear, immediately tryable, and honest in its functional claims. The verdict remains FAIL because visible landing labels still use mood/metaphor wording that supplies no useful information, contrary to the zero-findings and plain-words acceptance standard.

## Findings

### Minor

#### F-3-1 — “Practice console · local session” is decorative, unexplained interface lore

- **Quote/location:** Landing workbench eyebrow: “Practice console · local session.” Demo workbench eyebrow: “Demo practice console.”
- **Why this fails:** “Console” is a visual metaphor and “local session” is unexplained jargon. Neither tells a first-time musician what this section contains or what to do there. The product-specific visual system can remain in the presentation without making the navigation copy cryptic.
- **Concrete fix:** Replace the landing eyebrow with **“Score editor”** and the demo eyebrow with **“Sample score editor”**. The existing headings and description can remain.

#### F-3-2 — “Three moves” is a mood label, not a section name

- **Quote/location:** Landing, immediately above “How to make a practice loop”: “Three moves.”
- **Why this fails:** A visitor or screen-reader user encountering the phrase alone cannot identify the section. It adds no information beyond a count, while the adjacent heading already gives the useful section name.
- **Concrete fix:** Delete the eyebrow, or replace it with **“How it works”** and simplify the H2 to avoid repetition.

#### F-3-3 — “Kept focused” is a mood label, not a section name

- **Quote/location:** Landing, immediately above “A practice tool, not a score library”: “Kept focused.”
- **Why this fails:** It is brand tone rather than usable information. The following H2 communicates the actual boundary; the eyebrow should name that boundary or be absent.
- **Concrete fix:** Delete the eyebrow, or replace it with **“What this tool does not do.”**

## Cold first read

Fresh Chromium contexts, with no existing storage or service worker, opened the live home page at 390 × 844 and 1440 × 900 before scrolling.

| Question | Answer from first screen | Result |
| --- | --- | --- |
| What does this do? | “Write, hear, and loop an ABC score.” | Pass |
| For whom? | “For musicians and educators who need a short score ready to practice or share.” | Pass |
| What should I click first? | **Try it with sample data**; “It loads a complete score, ready to play.” | Pass |

At both sizes, the H1, audience sentence, primary action, action result, and all three factual lines were visible before scrolling. The phone page had no horizontal overflow, console errors, page errors, or cross-origin requests.

## Copy audit

Word counts treat hyphenated forms, code samples, paths, and numbers as one word. Buttons and labels are inventoried separately. No audited sentence exceeds 22 words or uses a banned marketing adjective. The three flagged eyebrow labels are the only copy findings.

### Landing sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Write, hear, and loop an ABC score | 7 | Pass |
| For musicians and educators who need a short score ready to practice or share. | 14 | Pass |
| It loads a complete score, ready to play. | 8 | Pass |
| Free to use | 3 | Pass; `free-use` |
| Your score stays in this browser | 6 | Pass; `local-score` |
| Works offline after the first visit | 6 | Pass; `offline-reload` |
| A music console turns typed notes into a paper score. | 10 | Pass; useful art alt text |
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
| Repeat the loop, copy its link, or print the clean score. | 11 | Pass; declared behavior |
| No account or cloud score storage. | 6 | Pass; `free-use` and `local-score` |
| No copyrighted score catalogue. | 5 | Pass; stated scope boundary |
| No composing bot or group editing. | 6 | Pass; stated scope boundary |
| Your browser stores the current ABC text. | 7 | Pass; `local-score` |
| Write a short ABC score, hear it, and practice a loop. | 11 | Pass |

### Landing headings, labels, and actions

| Copy | Words | Result |
| --- | ---: | --- |
| ABC notation practice tool | 4 | Pass; identifies the notation format and use |
| Practice console · local session | 4 | F-3-1 |
| Turn text into a practice loop | 6 | Pass; names the job |
| ABC source | 2 | Pass; editor heading |
| Rendered score | 2 | Pass; output heading |
| Three moves | 2 | F-3-2 |
| How to make a practice loop | 6 | Pass |
| Write the tune | 3 | Pass |
| Choose the bars | 3 | Pass |
| Play or share | 3 | Pass |
| Kept focused | 2 | F-3-3 |
| A practice tool, not a score library | 7 | Pass |
| Practice tempo | 2 | Pass; label |
| Loop from bar | 3 | Pass; label |
| Loop to bar | 3 | Pass; label |
| Try it with sample data | 5 | Pass; result-naming action |
| Load sample score | 3 | Pass; result-naming action |
| Open ABC file | 3 | Pass; result-naming action |
| Download ABC file | 3 | Pass; result-naming action |
| Copy score link | 3 | Pass; result-naming action |
| Print score card | 3 | Pass; result-naming action |
| Clear editor | 2 | Pass; result-naming action |
| Play score | 2 | Pass; result-naming action |
| Stop | 1 | Pass; clear transport action |
| Play loop | 2 | Pass; result-naming action |

### README headings

| Heading | Words | Result |
| --- | ---: | --- |
| ABC Score Play | 3 | Pass |
| What it does | 3 | Pass |
| Run locally | 2 | Pass |
| Test and build | 3 | Pass |
| Deploy | 1 | Pass |
| Privacy and licenses | 3 | Pass |

### README sentences

| Copy | Words | Result |
| --- | ---: | --- |
| Write a short ABC score, hear it, loop bars, share a link, and print it. | 15 | Pass |
| ABC Score Play is for musicians and educators who prefer plain-text notation. | 12 | Pass |
| It turns standard ABC into sheet music and plays it through your speakers. | 12 | Pass; playback claim covered |
| Practice controls set a tempo and repeat one or more bars. | 11 | Pass |
| Try the isolated sample at `?demo=1`. | 6 | Pass |
| Demo edits stay separate and never replace your real score. | 10 | Pass; `demo-isolation` |
| Draws the score with the open-source `abcjs` library. | 8 | Pass; attribution |
| Plays valid scores through your browser. | 6 | Pass; `score-playback` |
| Repeats selected bars at 40–220 beats per minute. | 9 | Pass; `bar-loop`, `tempo-range` |
| Opens `.abc` files without uploading them. | 7 | Pass; `abc-file-open` |
| Downloads the exact ABC text as an `.abc` file. | 9 | Pass; `abc-file-download` |
| Copies a score link that restores the same score when opened. | 11 | Pass; `score-link` |
| Prints the notation without editor controls. | 6 | Pass; `print-card` |
| Saves the current score in browser storage. | 7 | Pass; `local-score` |
| Reloads offline after the first online visit. | 7 | Pass; `offline-reload` |
| No account is required. | 4 | Pass; `free-use` |
| The product is free. | 4 | Pass; `free-use` |
| It does not include a score catalogue, composing bot, or group editing. | 12 | Pass; stated scope boundary |
| Requires Node.js 20 or newer. | 6 | Pass |
| `npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. | 15 | Pass |
| The build output is `dist/`, with `dist/index.html` at its root. | 12 | Pass |
| To run one public claim, use its command from `.factory/claims.json`. | 12 | Pass |
| Deploy `dist/` as an Azure Static Web App. | 8 | Pass |
| The factory owns DNS and deployment. | 6 | Pass |
| The app sends no score text to a service. | 9 | Pass; request log confirmed |
| Shared score text appears after `#score=`. | 5 | Pass; `score-link` |
| Browsers do not send that part to servers. | 8 | Pass; request log confirmed |
| See `/privacy` and `/terms` in the app. | 7 | Pass |
| Application code is MIT licensed. | 5 | Pass; `LICENSE` |
| `abcjs` is MIT licensed. | 4 | Pass; dependency metadata |
| The hero artwork was generated for this product; its prompt and provenance are in `.factory/design.md`. | 17 | Pass; provenance present |

Terminology is consistent: **ABC**, **score**, **bar**, **loop**, **tempo**, **practice**, **demo**, **score link**, **score card**, and **ABC file**. No visitor-reliance sentence lacks a matching claim; license, art-provenance, and scope-boundary statements are supported by repository evidence rather than product-operation promises.

## Demo, storage, and privacy

- `/?demo=1` loaded the original eight-bar “Evening Scale Study” at 390 × 844. The initial viewport contained its staff, “8 bars,” **Play score**, and **Play loop**.
- The persistent banner read “Demo — sample data, nothing is saved to your real score,” with working **Reset demo** and **Start for real** controls.
- With a pre-seeded real score, editing and resetting demo data left `abc-score-play:score` unchanged. **Start for real** removed only demo data, restored the real score, navigated to `/#workbench`, and focused the now-visible workbench heading.
- A live request log covered home, demo, edit, reset, demo exit, and offline-reload flows. It contained no cross-origin request and no score text in requests.
- After service-worker readiness and one online reload, an offline live reload still showed “Play the sample score,” the eight-bar staff, and the demo URL.

## Claims

Fresh clone used: `/tmp/abc-score-play-review-3` at `34096d2`. Every exact command listed in `.factory/claims.json` was run independently and passed:

| Claim IDs | Result |
| --- | --- |
| `sample-score`, `free-use`, `local-score`, `demo-isolation`, `offline-reload` | Pass |
| `score-playback`, `bar-loop`, `tempo-range`, `live-render`, `error-lines` | Pass |
| `abc-file-open`, `abc-file-download`, `score-link`, `print-card` | Pass |

`score-playback` instruments Web Audio and observes `resume`, oscillator creation, and oscillator start. Privacy tests record requests; demo isolation seeds both namespaces; offline is exercised after service-worker readiness. An additional clean-clone `npm test` passed 5 Vitest tests and 22 Chromium tests. `npm run lint` and `npm run build` also passed; the build produced `dist/`.

## Earlier history regression check

Read: `.factory/review-1.md`, `.factory/review-2.md`, `.factory/polish-1.md`, every verification report, demo guide, and the prior handoff. Each earlier finding was verified live and in code rather than accepted from its status label.

| Earlier finding | Current confirmation |
| --- | --- |
| F-1-1 | Fixed: live phone demo opens on the seeded staff, bar count, and playback controls; viewport claim test covers them. |
| F-1-2 | Fixed: live **Start for real** focused the visible `#workbench-title`; direct editor navigation and history have regression tests. |
| F-1-3 | Fixed: `score-playback` observes the Web Audio calls, not only UI state. |
| F-1-4 | Fixed: `live-render` is declared and replaces source with a distinct valid tune. |
| F-1-5 | Fixed: the unsupported sound-font clause is absent. |
| F-1-6 | Fixed: raw and runtime route heads carry their own title, canonical, OG, Twitter, favicon, and apple-touch metadata; 404 has complete metadata. |
| F-1-7 | Fixed: every live phone header exposed Demo, Editor, and Privacy; the standalone 404 matched. |
| F-1-8 | Fixed: landing and README use “educators.” |
| F-1-9 | Fixed: guidance now names the title, meter, note length, key, and notes. |
| F-1-10 | Fixed: README says the score plays through speakers. |
| F-1-11 | Fixed: the capability uses plain library attribution; license detail remains in the license section. |
| F-1-12 | Fixed: visitor-facing sound-font jargon is absent. |
| F-1-13 | Fixed: sharing and privacy use “score link” and the direct browser consequence. |
| F-1-14 | Fixed: the deployment guidance no longer relies on the earlier configuration jargon. |
| F-1-15 | Fixed: local open/download actions work and their declared tests pass. |
| F-1-16 | Fixed: visitor copy says demo edits stay separate; implementation namespaces remain in the verifier guide only. |
| F-1-17 | Fixed: the live product consistently uses “practice.” |
| F-1-18 | Fixed: live 404 has the complete footer, including `v1.0.0` and generated-artwork provenance. |

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` returned HTTP 200. An unknown URL returned the designed HTTP 404. All discovered same-origin links resolved; the two `mailto:` links are explicit email actions.
- Each checked route had `lang="en"`, one H1, a main landmark, route-specific title, description, canonical, OG/Twitter metadata, favicon, and apple-touch icon. Home title follows the product-plus-purpose pattern; route titles identify their route.
- Live routes had the consistent header/footer, skip link, Privacy and Terms links, visible focus behavior, and correct back/forward focus movement.
- The full suite's axe checks found zero serious or critical violations in light and dark/reduced-motion states. The live phone view had no horizontal overflow. The claimed first-load code is within the static-product budget: 0.33 KB bootstrap + 9.19 KB app + 154.59 KB lazy renderer gzip.
- The cream enamel, walnut frame, ruled-paper score bay, teal/coral transport controls, and original mid-century artwork implement the documented visual thesis and do not resemble a generic SaaS template.

## Missed leverage

No additional feature is required by the brief. Local ABC open/download and share-link restore cover the implied import/export round trip. AI composition is an explicit non-goal in the brief, so adding a Sociobot model feature would be decorative rather than useful. No provider key or AI endpoint appears in the product.

## What would make this perfect

Replace or remove the three decorative eyebrows in F-3-1 through F-3-3, then rerun the full cold-read and clean-clone review. Everything else required by the brief and product contract is verified.
