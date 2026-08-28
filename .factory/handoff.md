# ABC Score Play review 1 handoff

## Outcome

**FAIL.** The adversarial first-read report is in `.factory/review-1.md`. No product code was changed.

The cold landing page is clear at 390px and desktop, all 11 declared claim commands pass, the full test suite passes, demo storage stays separate from real storage, offline reload works, links and accessibility checks pass, and earlier reported regressions remain fixed.

The release remains blocked because the first `/demo` viewport does not show the seeded editor or rendered score, **Start for real** does not visibly reach its `#workbench` destination, and the playback claim test proves UI state rather than audio generation. The report also records claim-catalog, metadata, mobile-header, copy, and `.abc` import/export findings.

## Verification performed

- Fresh live Chromium contexts at 390 × 844 and 1440 × 900.
- One-click demo, edit, Reset demo, Start for real, real/demo localStorage isolation, request interception, and offline reload.
- Live route/title/H1/canonical/social metadata, back/forward focus, internal-link crawl, real 404, touch-target, overflow, dark/reduced-motion, and axe checks.
- Every earlier verification finding rechecked live and in code.
- Every exact command from `.factory/claims.json` run separately from clean clone `/tmp/abc-review-clean.mSG8ce`; all passed.
- Full clean-clone `npm test`: 4 Vitest checks and 16 Chromium checks passed; the build emitted `dist/`.

## Reproduce

```sh
npm ci
npm test
```

For the primary blocker, open <https://abc-score-play.sociobot.in> in a fresh 390 × 844 browser context, click **Try it with sample data**, and do not scroll. The rendered staff is below the first viewport. Then click **Start for real**: the URL becomes `/#workbench`, but the visible/focused destination remains the landing `<main>` rather than the workbench.

## Remaining work

Resolve every `F-1-*` item in `.factory/review-1.md` and rerun the full review from scratch. Do not treat the passing claim commands as sufficient until the audio claim has observable sound-generation evidence and the unlisted claims are catalogued or removed.
