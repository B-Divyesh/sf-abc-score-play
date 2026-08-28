# Adversarial first-read review 1 — FAIL

**Product:** ABC Score Play  
**Live site:** <https://abc-score-play.sociobot.in>  
**Candidate reviewed:** `0a9ee1e46ee8dc16db6813a59e9ab5d9a574272f` (`main`)  
**Date:** 2026-08-28 UTC

## Verdict

**FAIL.** There are 18 findings: 3 blocking, 2 major, and 13 minor. All declared claim commands pass, the landing page passes the cold first-read gate, and demo storage remains isolated. The demo nevertheless fails its main proof obligation on a phone: its first screen shows another hero and illustration instead of the seeded editor and rendered score.

## Findings

### Blocking

#### F-1-1 — The demo's first screen does not show the sample product in use

- **Quote/location:** `/demo`, immediately after **Try it with sample data**. The visible phone content is “Play a ready-made ABC score,” “Edit the scale study, choose bars, and hear the loop repeat,” and the decorative console illustration.
- **Evidence:** In a fresh 390 × 844 context after the one-click transition, the ABC editor begins at approximately `y=992`, the rendered score begins at `y=1601`, and “8 bars” begins at `y=1562`. None is in the first viewport. At 1440 × 900, only the top 54 pixels of the workbench enter the viewport; the usable score continues below it.
- **Why this fails:** The visitor clicked to try the product, but the next screen repeats explanation and art. They still have to scroll substantially before seeing realistic sample data or a usable control. This is a weak demo under the mandatory demo-sandbox rule.
- **Concrete fix:** Make `/demo` start with the seeded workbench. Keep the banner, then show a compact title and the populated editor/rendered score with **Play score** and **Play loop** in the first 390 × 844 viewport. Remove or move the large demo illustration below the workbench. Add a viewport test that asserts the rendered score, “8 bars,” and one playback control intersect the initial mobile viewport.

#### F-1-2 — “Start for real” creates a workbench URL but leaves the user at the hero

- **Quote/location:** Demo banner button **Start for real**; destination `/#workbench`.
- **Evidence:** At 390 × 844, clicking the button produced `https://abc-score-play.sociobot.in/#workbench`, but `scrollY` was 71, focus was on `<main>`, and `#workbench` began at approximately `y=888`, below the viewport. The real score remained intact and loaded correctly.
- **Why this fails:** The address promises an editor deep link while the visible result is the landing hero. The route code focuses `<main>` and skips the hash-scroll branch on internal navigation. This is broken routing in a required demo exit path.
- **Concrete fix:** After rendering `/#workbench`, scroll to and focus the workbench heading or editor. For other route changes, focus the new `<h1>` itself, as the site-structure contract requires. Add tests for **Start for real**, direct `/#workbench`, and back/forward that assert both URL and focused/visible destination.

#### F-1-3 — The playback claim test does not prove that audio is generated

- **Quote/location:** Claim `score-playback`: “A valid ABC score plays with local audio.” Its test only asserts “Score playing.”, the `.is-playing` class, and the later stop status.
- **Why this fails:** Those UI changes occur before `LocalScorePlayer.play()` proves that an `AudioContext` resumed or an oscillator started. Broken or silent Web Audio can still leave this test green. The claim is therefore not fully tested even though its command passes.
- **Concrete fix:** Instrument Web Audio in the browser test and assert that `AudioContext.resume()`, `createOscillator()`, and at least one oscillator `start()` occur after **Play score**. Also fail on `pageerror`. Keep the existing visible-state and stop assertions.

### Major

#### F-1-4 — “The staff updates on the right” is an unlisted claim

- **Quote/location:** Landing workbench introduction: “The staff updates on the right.”
- **Why this fails:** `sample-score` proves that the bundled score initially renders, but no claim entry promises or tests a changed source producing a changed staff. This is a core behavior a visitor can rely on.
- **Concrete fix:** Add a `live-render` claim and one tagged test that edits the source to a distinct valid tune and asserts the SVG output changes, the new title is present, and the valid state remains. Alternatively remove the sentence.

#### F-1-5 — “Without a sound-font download” is an unlisted claim

- **Quote/location:** README, **What it does**: “Plays valid scores through browser audio without a sound-font download.”
- **Why this fails:** `score-playback` does not assert the absence of a sound-font request, and `local-score` only rejects cross-origin requests. The extra “without” promise has no matching claim entry.
- **Concrete fix:** Prefer the plain rewrite “Plays valid scores through your browser.” If the download distinction matters, add a `no-soundfont-download` claim that records the complete demo playback request log and asserts no audio/font sample asset is requested.

### Minor

#### F-1-6 — Route-specific social metadata stays set to the home page

- **Quote/location:** `/demo`, `/privacy`, and `/terms` all retain `og:title` “ABC Score Play — write, hear, and loop ABC music” and `og:url` `https://abc-score-play.sociobot.in/`. The 404 response has no canonical, Open Graph, Twitter, or apple-touch metadata.
- **Why this fails:** Shared internal routes describe the home page rather than the route being shared. The 404 head is incomplete relative to the stated metadata contract.
- **Concrete fix:** Extend `setMetadata` to update Open Graph and Twitter title, description, and URL for each SPA route. Generate route-specific HTML heads if link-preview crawlers must receive these values without JavaScript. Give the standalone 404 its favicon and apple-touch metadata; retain `noindex`, and either add intentional 404 social metadata or document why it is omitted. Test both browser DOM metadata and raw route responses.

#### F-1-7 — The mobile header is inconsistent and removes Privacy

- **Quote/location:** At 390px, the SPA CSS hides `.site-nav a:nth-child(3)`, so `/`, `/demo`, `/privacy`, and `/terms` show only **Demo** and **Editor**. The standalone 404 shows **Demo**, **Editor**, and **Privacy**.
- **Why this fails:** The required header is not consistent across routes, and the privacy link disappears from the phone header even on the privacy page.
- **Concrete fix:** Keep **Privacy** visible in every header at 390px, using a compact wrap or menu if needed. Share the same responsive header rules with `404.html` and test identical link names on every route.

#### F-1-8 — The audience name changes between “teachers” and “educators”

- **Quote/location:** Landing: “For musicians and **teachers** …” README: “ABC Score Play is for musicians and **educators** …”
- **Why this fails:** Two names are used for the same audience, contrary to the one-term rule.
- **Concrete fix:** Use “educators” in both places to match the researched brief: “For musicians and educators who need a short score ready to practise or share.”

#### F-1-9 — “ABC headers” is unexplained jargon in task guidance

- **Quote/location:** Landing **Write the tune** step: “Type standard ABC headers and notes.”
- **Why this fails:** A new user may know music but not which fields count as an ABC header.
- **Concrete fix:** “Type the title, meter, note length, key, and notes.”

#### F-1-10 — “Local synthesized audio” is abstract README copy

- **Quote/location:** README introduction: “It turns standard ABC into a readable staff and local synthesized audio.”
- **Why this fails:** “Local synthesized audio” describes implementation, not what the person gets.
- **Concrete fix:** “It turns standard ABC into sheet music and plays it through your speakers.”

#### F-1-11 — “MIT-licensed abcjs renderer” stacks legal and implementation jargon

- **Quote/location:** README **What it does**: “Draws ABC notation with the MIT-licensed abcjs renderer.”
- **Why this fails:** “Renderer” is unnecessary in the capability list, and the license detail belongs in the license section.
- **Concrete fix:** “Draws the score with the open-source abcjs library.” Keep the exact MIT license statement under **Privacy and licenses**.

#### F-1-12 — “Sound-font” is unexplained jargon

- **Quote/location:** README **What it does**: “Plays valid scores through browser audio without a sound-font download.”
- **Why this fails:** A first reader should not need to know a synthesis asset term to understand playback.
- **Concrete fix:** “Plays valid scores through your browser.” This also removes the unlisted clause in F-1-5.

#### F-1-13 — “URL fragment” and “HTTP requests” make the privacy explanation harder than needed

- **Quote/location:** README **What it does**: “Copies score text into a URL fragment and restores it on reload.” README **Privacy and licenses**: “Shared scores live after `#score=` in the URL, so the fragment is not part of HTTP requests.”
- **Why this fails:** These sentences use protocol terms where the user needs a direct action and privacy consequence.
- **Concrete fix:** Use “Copies a score link that restores the same score when opened” in the capability list. Use “Shared score text appears after `#score=`. Browsers do not send that part to servers” in the privacy section.

#### F-1-14 — The deploy sentence relies on unexplained platform jargon

- **Quote/location:** README **Deploy**: “`public/staticwebapp.config.json` provides SPA fallback, security headers, and asset caching.”
- **Why this fails:** “SPA fallback” and “asset caching” do not state the concrete deployment behavior.
- **Concrete fix:** “`public/staticwebapp.config.json` maps app routes to `index.html`, sets browser security rules, and caches versioned files.”

#### F-1-15 — The obvious ABC file round trip is missing

- **Quote/location:** Product workbench; no **Open ABC file** or **Download ABC file** action exists.
- **Why this fails:** The brief positions the product as a text-native, shareable ABC tool. A normal ABC user will expect to open an existing `.abc` file and save the edited source without copying text or encoding it in a link.
- **Concrete fix:** Add local **Open ABC file** and **Download ABC file** actions. Keep both browser-only and demo-isolated. Add claims that opening a fixture reproduces its source/staff and that download preserves the exact ABC text and a safe `.abc` filename. Do not add AI composition; the brief explicitly makes that a non-goal.

#### F-1-16 — “Storage key” exposes an implementation detail

- **Quote/location:** README demo introduction: “Demo edits use a separate storage key and never replace the real score.”
- **Why this fails:** A visitor needs the isolation guarantee, not the browser implementation term.
- **Concrete fix:** “Demo edits stay separate and never replace your real score.” Keep the exact key names in `.factory/demo.md` for verifiers.

#### F-1-17 — The site mixes “practise” and “practice” as verbs

- **Quote/location:** Landing audience sentence says “ready to **practise** or share,” while the footer says “**practice** a loop.”
- **Why this fails:** The same verb changes spelling within one page.
- **Concrete fix:** Pick one dialect and use it throughout. The existing product vocabulary and brief favor “practice”: “ready to practice or share.”

#### F-1-18 — The standalone 404 footer omits the required build identity

- **Quote/location:** SPA footer: “Built by Param Factory · v1.0.0 · Original generated artwork.” Standalone 404 footer: “Built by Param Factory.”
- **Why this fails:** The required footer is not consistent across routes, and the 404 omits the version/build identifier.
- **Concrete fix:** Give `404.html` the same product one-liner, Privacy/Terms links, Param Factory credit, and build ID as the SPA footer. Generate both from one version value or add a test that compares their required fields.

## Cold first read

Fresh contexts were opened without prior site storage or service workers.

| Question | Phone, 390 × 844 | Desktop, 1440 × 900 |
| --- | --- | --- |
| What does it do? | “Write, hear, and loop an ABC score.” | Same. |
| For whom? | “For musicians and teachers who need a short score ready to practise or share.” | Same. |
| What should I click first? | **Try it with sample data**, followed by “It loads a complete score, ready to play.” | Same. |
| Result | PASS | PASS |

At both widths, the headline, audience sentence, primary action, result sentence, and all three facts are visible before scrolling. The phone view does not show the hero art until below those facts, so the first-read copy is not displaced.

## Copy audit

Word counts treat hyphenated compounds, paths, URLs, and numbers as one word. Inline commands are not prose sentences. No landing or README sentence exceeds 22 words, no banned marketing adjective appears, and the averages are 6.5 words for the landing inventory and 9.6 words for README sentences.

### Landing-page sentences and sentence-like copy

| Copy | Words | Result |
| --- | ---: | --- |
| ABC notation practice tool | 4 | Pass |
| Write, hear, and loop an ABC score | 7 | Pass |
| For musicians and teachers who need a short score ready to practise or share. | 14 | F-1-8, F-1-17 |
| It loads a complete score, ready to play. | 8 | Pass |
| Free to use | 3 | Pass |
| Your score stays in this browser | 6 | Pass |
| Works offline after the first visit | 6 | Pass |
| A music console turns typed notes into a paper score. | 10 | Pass; useful alt text |
| Practice console · local session | 4 | Pass |
| Turn text into a practice loop | 6 | Pass |
| Write ABC on the left. | 5 | Pass |
| The staff updates on the right. | 6 | F-1-4 |
| Tip: write a bar with notes such as `| C2 D2 E2 F2 |`. | 12 | Pass |
| Your staff will appear here. | 5 | Pass |
| Write ABC or load the sample score. | 7 | Pass |
| Choose a valid score to set a loop. | 8 | Pass |
| Select a bar in the staff to loop it. | 9 | Pass; covered by the sample interaction test |
| Press Space to play or stop. | 6 | Pass |
| Write or load a score to begin. | 7 | Pass |
| How to make a practice loop | 6 | Pass |
| Write the tune | 3 | Pass |
| Type standard ABC headers and notes. | 6 | F-1-9 |
| Errors point to a line. | 5 | Pass |
| Choose the bars | 3 | Pass |
| Set the first and last bar. | 6 | Pass |
| Change the tempo for practice. | 5 | Pass |
| Play or share | 3 | Pass |
| Repeat the loop, copy its link, or print the clean score. | 11 | Pass |
| A practice tool, not a score library | 7 | Pass |
| No account or cloud score storage. | 6 | Pass |
| No copyrighted score catalogue. | 4 | Pass |
| No composing bot or group editing. | 6 | Pass |
| Your browser stores the current ABC text. | 7 | Pass |
| Write a short ABC score, hear it, and practice a loop. | 11 | F-1-17 |

### Landing headings, labels, and actions

| Copy | Words | Type/result |
| --- | ---: | --- |
| ABC source | 2 | Heading; clear in product context |
| Rendered score | 2 | Heading; clear |
| Three moves | 2 | Eyebrow; clear with adjacent heading |
| Kept focused | 2 | Eyebrow; clear with adjacent heading |
| Practice tempo | 2 | Label; clear |
| Loop from bar | 3 | Label; clear |
| Loop to bar | 3 | Label; clear |
| Try it with sample data | 5 | Result-naming action |
| Load sample score | 3 | Result-naming action |
| Copy score link | 3 | Result-naming action |
| Print score card | 3 | Result-naming action |
| Clear editor | 2 | Result-naming action |
| Play score | 2 | Result-naming action |
| Stop | 1 | Clear transport action |
| Play loop | 2 | Result-naming action |

All headings make sense with their immediate product context. All buttons use verbs and name the outcome. Navigation nouns (**Demo**, **Editor**, **Privacy**, **Terms**) are links, not buttons.

### README headings

| Heading | Words | Result |
| --- | ---: | --- |
| ABC Score Play | 3 | Product name; clear |
| What it does | 3 | Clear |
| Run locally | 2 | Clear |
| Test and build | 3 | Clear |
| Deploy | 1 | Clear |
| Privacy and licenses | 3 | Clear |

### README sentences

| Sentence | Words | Result |
| --- | ---: | --- |
| Write a short ABC score, hear it, loop bars, share a link, and print it. | 15 | Pass |
| ABC Score Play is for musicians and educators who prefer plain-text notation. | 12 | F-1-8 |
| It turns standard ABC into a readable staff and local synthesized audio. | 12 | F-1-10 |
| Practice controls set a tempo and repeat one or more bars. | 11 | Pass |
| Try the isolated sample at `/demo`. | 6 | Pass |
| Demo edits use a separate storage key and never replace the real score. | 13 | F-1-16 |
| Draws ABC notation with the MIT-licensed `abcjs` renderer. | 8 | F-1-11 |
| Plays valid scores through browser audio without a sound-font download. | 10 | F-1-5, F-1-12 |
| Repeats selected bars at 40–220 beats per minute. | 9 | Pass |
| Copies score text into a URL fragment and restores it on reload. | 12 | F-1-13 |
| Prints the notation without editor controls. | 6 | Pass |
| Saves the current score in browser storage. | 7 | Pass |
| Reloads offline after the first online visit. | 7 | Pass |
| No account is required. | 4 | Pass |
| The product is free. | 4 | Pass |
| It does not include a score catalogue, composing bot, or group editing. | 12 | Pass |
| Requires Node.js 20 or newer. | 6 | Pass |
| Open `http://localhost:5173` or `http://localhost:5173/demo`. | 9 | Pass |
| `npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. | 15 | Pass |
| The build output is `dist/`, with `dist/index.html` at its root. | 12 | Pass |
| To run one public claim, use its command from `.factory/claims.json`. | 12 | Pass |
| Deploy `dist/` as an Azure Static Web App. | 8 | Pass; named deployment target |
| `public/staticwebapp.config.json` provides SPA fallback, security headers, and asset caching. | 12 | F-1-14 |
| The factory owns DNS and deployment. | 6 | Pass in deploy context |
| The app sends no score text to a service. | 9 | Pass; exercised with request interception |
| Shared scores live after `#score=` in the URL, so the fragment is not part of HTTP requests. | 17 | F-1-13 |
| See `/privacy` and `/terms` in the app. | 7 | Pass |
| Application code is MIT licensed. | 5 | Pass; `LICENSE` is present |
| `abcjs` is MIT licensed. | 4 | Pass; package license is MIT |
| The hero artwork was generated for this product; its prompt and provenance are in `.factory/design.md`. | 17 | Pass; provenance is present |

## Demo and sandbox evidence

- The first-screen presentation fails as F-1-1.
- The bundled sample is the realistic, original eight-bar **Evening Scale Study** at 104 BPM.
- The banner remains visible and says “Demo — sample data, nothing is saved to your real score,” with **Reset demo** and **Start for real**.
- Editing used only `demo:abc-score-play:score`; a seeded `abc-score-play:score` value remained byte-for-byte unchanged.
- **Reset demo** restored “Evening Scale Study” and the eight-bar render.
- **Start for real** removed the demo key and loaded the real value, but its viewport destination fails as F-1-2.
- The observed demo/edit/reset flow made no cross-origin request and sent no score text in any request URL or body.
- After an online visit, a network-offline reload retained the `/demo` title, H1, and eight-bar rendered score under the active same-origin service worker.

## Claims results

All commands below were run separately from clean clone `/tmp/abc-review-clean.mSG8ce`; every command exited 0.

| Claim ID | Exact command | Result |
| --- | --- | --- |
| `sample-score` | `npm test -- --grep @claim:sample-score` | PASS |
| `free-use` | `npm test -- --grep @claim:free-use` | PASS |
| `local-score` | `npm test -- --grep @claim:local-score` | PASS |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |
| `score-playback` | `npm test -- --grep @claim:score-playback` | PASS command; insufficient observable proof in F-1-3 |
| `bar-loop` | `npm test -- --grep @claim:bar-loop` | PASS |
| `tempo-range` | `npm test -- --grep @claim:tempo-range` | PASS |
| `score-link` | `npm test -- --grep @claim:score-link` | PASS |
| `print-card` | `npm test -- --grep @claim:print-card` | PASS |
| `error-lines` | `npm test -- --grep @claim:error-lines` | PASS |

The clean clone's unfiltered `npm test` also passed: 4 Vitest checks and 16 Chromium checks. F-1-4 and F-1-5 are unlisted public claims.

## Structure, accessibility, links, and identity

- `/`, `/demo`, `/privacy`, and `/terms` returned 200. An unknown path returned the designed standalone 404 with HTTP 404.
- Each route had `lang="en"`, one H1, one main landmark, a route-specific title and description, a canonical on SPA routes, favicon, and apple-touch icon on SPA routes.
- The home title follows “Product — what it does” and is under 60 characters. Demo, Privacy, Terms, and 404 titles identify their routes.
- Back/forward restored routes and announced the new H1, but focus landed on `<main>` rather than `<h1>`; the user-visible failure is recorded in F-1-2.
- All discovered same-origin links returned 200; the deliberately unknown route returned 404. `mailto:` links were allowed.
- Fresh dark/reduced-motion axe scans found no WCAG A/AA violations. Every visible mobile control measured at least 44 × 44 CSS pixels. No horizontal overflow occurred.
- The previously broken focused skip-link contrast now passes in dark mode.
- The visual identity is distinct: cream enamel, walnut, teal/coral controls, ruled paper, and original console art form a recognizable mid-century practice instrument rather than a generic SaaS template.
- The landing order follows the standard skeleton: header, first-read hero, real editor, three-step explanation, boundaries/privacy, and footer. There is no paid tier.
- Open Graph route metadata and header/footer consistency fail as F-1-6, F-1-7, and F-1-18.

## Earlier-history regression check

No earlier `.factory/review-*.md` or `.factory/polish-*.md` existed before this report. The earlier handoff and all three verification reports were read. Every previously reported finding was checked live and in code:

| Earlier finding | Current result | Evidence |
| --- | --- | --- |
| Mobile controls below 44 × 44 | Fixed | No visible target below 44 × 44 on all live routes at 390px; regression test exists. |
| Focused dark-mode skip link at 1.02:1 | Fixed | Live dark/reduced-motion focused axe scan has zero violations; panel/ink tokens are used; regression test exists. |
| Unknown routes return 200 | Fixed | Live unknown path returns HTTP 404 with the styled standalone page; host config has `responseOverrides.404`. |
| Missing demo-isolation claim | Fixed | Claim and test seed both storage namespaces, exit demo, and assert the real key is unchanged. |
| Missing 40–220 BPM claim | Fixed | Claim and test cover both endpoints and clamp 39/221. |
| Print claim only checked `window.print()` | Fixed | Test emulates print media, keeps notation visible, and hides header, demo strip, editor, transport, and footer. |

None of those earlier IDs regressed. This review's findings are new.

## Missed leverage

F-1-15 records the missing `.abc` file import/export round trip. AI composition should not be added: the researched brief explicitly identifies it as a non-goal, and the core job does not need a decorative model call. No provider keys or AI endpoints are present.

## What would make this perfect

Resolve every finding above, then rerun the review from a fresh browser context and clean clone. The acceptance check should show the seeded editor, rendered eight-bar staff, and a playback control in the first 390 × 844 demo viewport; **Start for real** should visibly focus the real editor; audio generation and live staff updates should have direct claim tests; every route should carry correct metadata and the same Privacy-capable header; the flagged copy should use one audience term and plain words; and `.abc` files should round-trip locally. A perfect round has zero remaining findings and no untested claim.
