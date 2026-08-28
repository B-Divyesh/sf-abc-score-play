# ABC Score Play

Write a short ABC score, hear it, loop bars, share a link, and print it.

ABC Score Play is for musicians and educators who prefer plain-text notation. It turns standard ABC into a readable staff and local synthesized audio. Practice controls set a tempo and repeat one or more bars.

Try the isolated sample at [`/demo`](https://abc-score-play.sociobot.in/demo). Demo edits use a separate storage key and never replace the real score.

## What it does

- Draws ABC notation with the MIT-licensed [`abcjs`](https://github.com/paulrosen/abcjs) renderer.
- Plays valid scores through browser audio without a sound-font download.
- Repeats selected bars at 40–220 beats per minute.
- Copies score text into a URL fragment and restores it on reload.
- Prints the notation without editor controls.
- Saves the current score in browser storage.
- Reloads offline after the first online visit.

No account is required. The product is free. It does not include a score catalogue, composing bot, or group editing.

## Run locally

Requires Node.js 20 or newer.

```sh
npm install
npm run dev
```

Open `http://localhost:5173` or `http://localhost:5173/demo`.

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

Deploy `dist/` as an Azure Static Web App. `public/staticwebapp.config.json` provides SPA fallback, security headers, and asset caching. The factory owns DNS and deployment.

## Privacy and licenses

The app sends no score text to a service. Shared scores live after `#score=` in the URL, so the fragment is not part of HTTP requests. See `/privacy` and `/terms` in the app.

Application code is MIT licensed. `abcjs` is MIT licensed. The hero artwork was generated for this product; its prompt and provenance are in [`.factory/design.md`](.factory/design.md).
