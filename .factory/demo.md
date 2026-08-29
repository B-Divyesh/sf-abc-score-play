# Demo sandbox

## Entry point

- Local: `http://localhost:4173/?demo=1` after `npm run build && npm run preview -- --port 4173`
- Production: `https://abc-score-play.sociobot.in/?demo=1`

The catalog can use `?demo=1` directly. `/demo` remains an equivalent shareable route. No account or setup is required.

## Sample data

The demo bundles “Evening Scale Study,” an original eight-bar tune in G major. It includes repeats, a 4/4 meter, and a practice tempo of 104 beats per minute. The first phone screen shows its rendered staff, bar count, and playback controls. Its populated ABC editor follows in the same workbench.

The local **Open ABC file** action accepts `.abc` files up to 1 MB. It reads the selected file only in the active browser mode and does not upload it.

## Isolation and reset

Demo edits use `localStorage` key `demo:abc-score-play:score`. Real edits use `abc-score-play:score`. The demo never reads or writes the real key.

Use **Reset demo** in the persistent banner to restore the bundled score. Leaving through Home, Editor, Privacy, Terms, or **Start for real** removes demo data. Returning to the demo starts again with the bundled score. The sample remains bundled in the service worker cache for offline testing.

## Verification path

From a fresh browser context:

1. Open `/?demo=1` and wait for the eight-bar staff.
2. Play the score, then stop it.
3. Set bar 1 to bar 1, raise the tempo to 220, and play the loop twice.
4. Edit the ABC and confirm the demo storage key changes.
5. Reset the demo and confirm the sample returns.
6. Reload once, go offline, and reload again.

Every public claim and its exact automated command appears in `.factory/claims.json`.
