# ABC Score Play

Write a short ABC score, hear it, loop bars, share a link, and print it.

ABC Score Play is for musicians and educators who prefer plain-text notation. It turns standard ABC into sheet music and plays it through your speakers. Practice controls set a tempo and repeat one or more bars.

Try the isolated sample at [`?demo=1`](https://abc-score-play.sociobot.in/?demo=1). Demo edits stay separate from your real score and are discarded when you leave.

## What it does

- Draws the score with the open-source [`abcjs`](https://github.com/paulrosen/abcjs) library.
- Plays valid scores through your browser.
- Repeats selected bars at 40–220 beats per minute.
- Opens `.abc` files without uploading them.
- Downloads the exact ABC text as an `.abc` file.
- Copies a score link that restores the same score when opened.
- Prints the notation without editor controls.
- Saves the current score in browser storage.
- Reloads offline after the first online visit.

No account is required. The product is free. It does not include a score catalogue, composing bot, or group editing.

## Run locally

Requires Node.js 20 or newer.

```sh
npm ci
npm run dev
```

Open `http://localhost:5173` or `http://localhost:5173/?demo=1`.

## Test and build

```sh
npm test
npm run build
```

`npm test` runs unit tests, builds the production site, and runs the Playwright claim checks. The build output is `dist/`, with `dist/index.html` at its root.

To run one public claim, use its command from [`.factory/claims.json`](.factory/claims.json):

```sh
npm test -- --grep @claim:bar-loop
```

## Deploy

Deploy `dist/` as an Azure Static Web App. `public/staticwebapp.config.json` maps app routes to their HTML, sets browser security rules, and caches versioned files. The factory owns DNS and deployment.

## Privacy and licenses

The app sends no score text to a service. Shared score text appears after `#score=`. Browsers do not send that part to servers. See `/privacy` and `/terms` in the app.

Application code is MIT licensed. `abcjs` is MIT licensed. The hero artwork was generated for this product; its prompt and provenance are in [`.factory/design.md`](.factory/design.md).
