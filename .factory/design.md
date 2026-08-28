# ABC Score Play — visual thesis

## Direction

**Mid-century instrument panel.** The score is the instrument, so the interface borrows from a compact 1960s classroom tape deck: a cream enamel faceplate, walnut housing, oxidized-teal controls, coral pilot lamps, ruled labels, and large mechanical switches. The app avoids a generic software dashboard. Its wide workbench, inset score bay, vertical transport rail, and knurled control shapes make the product recognizable in a thumbnail.

The panel metaphor stays functional. Recessed areas hold input and paper; raised controls change playback. Fine rules group related settings before boxes do. The hero artwork shows the bridge from typed ABC to a moving paper score.

## Palette

Light mode is the thesis. Dark mode is a purposeful late-practice variation, not an inverted theme.

| Token | Light | Dark | Purpose |
| --- | --- | --- | --- |
| `--canvas` | `#F2E9D5` | `#171C1B` | warm paper / night room |
| `--panel` | `#FFF9EA` | `#242B29` | enamel work surface |
| `--ink` | `#202421` | `#F7EED9` | copy and notation |
| `--muted` | `#5D625B` | `#C2C9C0` | secondary labels |
| `--teal` | `#146B66` | `#6BC7BC` | primary controls |
| `--teal-deep` | `#0C4E4A` | `#A5E1D9` | pressed/focus contrast |
| `--coral` | `#C54F38` | `#FF8E77` | playhead and warnings |
| `--walnut` | `#513B2A` | `#0E1211` | frame and grounding |
| `--success` | `#267047` | `#76D29B` | valid score |
| `--danger` | `#A8332A` | `#FF9A8E` | parse errors |

All body text and controls meet 4.5:1 against their intended backgrounds. State never relies on color alone.

## Type

- Display and control labels: **Arial Narrow**, then `Roboto Condensed`, `Arial`, sans-serif. Uppercase is reserved for tiny engraved labels.
- Body and editor: **ui-monospace**, `SFMono-Regular`, `Cascadia Mono`, `Liberation Mono`, monospace. ABC is the product material, so the text face continues into supporting copy.
- No font downloads. System faces avoid network access and stay within the font budget.

## Spacing and shape

- Base unit: 8 px. Section rhythm: 64–96 px desktop and 48–64 px mobile.
- Reading measure: 68 characters. Main workbench may span 1180 px.
- Corners: 2–6 px, like fabricated sheet metal, with clipped upper-right corners on key panels.
- Borders: dark 1–2 px rules; low, hard-edged shadows imply physical layers.
- Targets: at least 44 × 44 px with 8 px separation.

## Interaction grammar

- The main action is a wide teal switch labeled “Try it with sample data.” Its adjacent note says it loads a score ready to play.
- Playback controls behave like transport keys: distinct pressed states, plain labels, and one coral play indicator.
- The staff is an off-white sheet in a darker recessed bay. Bars selected for a loop receive coral brackets and a plain text summary.
- Editor errors use a numbered list linked to line numbers. The last valid score remains visible while a fix is possible.
- Phone layout stacks the editor above the score. Transport controls wrap without hiding labels.

## Motion policy

The signature motion is **tape travel**: the current bar receives a short horizontal sweep and the play lamp warms as playback begins. UI transitions run 160–220 ms using opacity and transform only. Nothing decorative loops. With `prefers-reduced-motion: reduce`, sweeps and transitions are removed; the bar changes instantly and the lamp still changes state.

## Original asset plan and provenance

Hero artwork: a wide editorial gouache-and-paper illustration of a compact mid-century music practice console. Typed notation feeds in at the left; a clean staff card emerges at the right. It clarifies the text-to-score job without showing a fake product UI.

Prompt sheet:

- Subject: compact 1960s classroom music practice console, paper score strip, one small speaker grille, tactile transport buttons.
- World: quiet music room workbench; no people.
- Materials: cream enamel, walnut veneer, brushed aluminum, off-white score paper.
- Light: soft late-afternoon window light; shallow but readable depth.
- Lens/composition: wide 3:2 editorial crop, console weighted right, calm negative space left.
- Palette words: warm parchment, dark walnut, oxidized teal, muted coral, charcoal ink.
- Negative list: no text, no logos, no watermark, no brand marks, no neon gradients, no modern laptop, no illegible notation, no hands.

Generated on 2026-08-28 with the factory `factory-image` deployment through `/opt/fleet/lib/gen-image.sh`. Source: `assets/src/hero-panel.png`; structured prompt: `assets/src/hero-panel.prompt.json`. The candidate was reviewed at full resolution: no stray text, logos, people, broken controls, or misleading product UI were found. Production crops are WebP and AVIF. Generated imagery is decorative and never represents a stored user score.

## Accessibility and modes

- A visible skip link leads to `#main`.
- Focus uses a 3 px coral outline plus 2 px panel offset.
- Light and dark color schemes are selected by the operating system; printed output always uses white paper and black ink.
- The illustration has purpose-based alt text. Decorative texture is CSS and hidden from assistive technology.
- Status and route changes use polite live regions. The editor retains a visible label at every size.
