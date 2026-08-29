import './style.css';
import { countBars, decodeScore, encodeScore, loadAbc, LocalScorePlayer, makeLoopSource, sourceLineFromChar, validateSource, type AbcModule, type ScoreIssue } from './abc-engine';

const SAMPLE_SCORE = `X:1
T:Evening Scale Study
C:ABC Score Play sample
M:4/4
L:1/8
Q:1/4=104
K:G
|: G2 B2 d2 B2 | A2 c2 e2 c2 |
G2 A2 B2 c2 | d4 B4 :|
|: e2 d2 c2 B2 | A2 G2 F2 D2 |
G2 B2 A2 F2 | G8 :|`;

const STORAGE_REAL = 'abc-score-play:score';
const STORAGE_DEMO = 'demo:abc-score-play:score';
const DEMO_SESSION = 'abc-score-play:demo-active';
const BUILD_ID = 'v1.0.0';

const app = document.querySelector<HTMLDivElement>('#app')!;
let routeCleanup: (() => void) | undefined;
let activeRouteIsDemo = false;

function header(): string {
  return `<a class="skip-link" href="#main">Skip to page content</a>
    <header class="site-header">
      <a class="wordmark" href="/" data-route aria-label="ABC Score Play home"><span class="wordmark-mark" aria-hidden="true">ABC</span><span>Score Play</span></a>
      <nav class="site-nav" aria-label="Main navigation">
        <a href="/demo" data-route>Demo</a>
        <a href="/#workbench" data-route>Editor</a>
        <a href="/privacy" data-route>Privacy</a>
      </nav>
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
      <p>Write a short ABC score, hear it, and practice a loop.</p>
      <nav class="footer-links" aria-label="Footer navigation"><a href="/privacy" data-route>Privacy</a><a href="/terms" data-route>Terms</a></nav>
      <p>Built by Param Factory · ${BUILD_ID} · <span>Original generated artwork</span></p>
    </footer>
    <div class="visually-hidden" id="route-status" aria-live="polite"></div>`;
}

function setMetadata(title: string, description: string, path: string): void {
  const url = `https://abc-score-play.sociobot.in${path}`;
  document.title = title;
  document.querySelector<HTMLMetaElement>('meta[name="description"]')!.content = description;
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')!.href = url;
  document.querySelector<HTMLMetaElement>('meta[property="og:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[property="og:description"]')!.content = description;
  document.querySelector<HTMLMetaElement>('meta[property="og:url"]')!.content = url;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]')!.content = title;
  document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]')!.content = description;
}

function editorMarkup(demo: boolean): string {
  return `<section class="work-section${demo ? ' demo-work-section' : ''}" id="workbench" aria-labelledby="workbench-title">
      <div class="section-heading">
        <p class="eyebrow">${demo ? 'Sample score editor' : 'Score editor'}</p>
        ${demo ? '<h1 id="workbench-title" tabindex="-1">Play the sample score</h1><p>Evening Scale Study is loaded and ready to play.</p>' : '<h2 id="workbench-title" tabindex="-1">Turn text into a practice loop</h2><p>Write ABC on the left. The staff updates as you type.</p>'}
      </div>
      <div class="workbench">
        <section class="editor-panel" aria-labelledby="editor-title">
          <div class="panel-head">
            <div class="panel-title"><span class="status-lamp" id="valid-lamp" aria-hidden="true"></span><${demo ? 'h2' : 'h3'} id="editor-title">ABC source</${demo ? 'h2' : 'h3'}></div>
            <span id="validation-label">Waiting for notes</span>
          </div>
          <label class="visually-hidden" for="abc-source">ABC score text</label>
          <div class="editor-wrap">
            <div class="line-gutter" id="line-gutter" aria-hidden="true">1</div>
            <textarea id="abc-source" spellcheck="false" autocapitalize="off" aria-describedby="editor-help validation-errors" placeholder="Start with X:, T:, M:, L:, and K: headers."></textarea>
          </div>
          <p id="editor-help" class="score-help">Tip: write a bar with notes such as <code>| C2 D2 E2 F2 |</code>.</p>
          <div id="validation-errors" aria-live="polite"></div>
          <div class="editor-actions">
            <button class="button small" id="load-sample" type="button">Load sample score</button>
            <button class="button small" id="open-score" type="button">Open ABC file</button>
            <input id="open-score-file" type="file" accept=".abc,text/vnd.abc,text/plain" hidden>
            <button class="button small" id="download-score" type="button" disabled>Download ABC file</button>
            <button class="button small" id="share-score" type="button" disabled>Copy score link</button>
            <button class="button small" id="print-score" type="button" disabled>Print score card</button>
            <button class="button small" id="clear-score" type="button">Clear editor</button>
          </div>
        </section>
        <section class="score-panel" aria-labelledby="score-title">
          <div class="panel-head"><div class="panel-title"><${demo ? 'h2' : 'h3'} id="score-title">Rendered score</${demo ? 'h2' : 'h3'}></div><span id="bar-count">0 bars</span></div>
          <div class="paper-bay" id="paper-bay" tabindex="0" role="region" aria-label="Scrollable score paper">
            <div class="empty-score" id="empty-score"><strong>Your staff will appear here.</strong><p>Write ABC or load the sample score.</p></div>
            <div id="paper" role="img" aria-label="Rendered music notation"></div>
          </div>
          <div class="transport" id="transport">
            <div class="transport-keys">
              <button class="button primary" id="play-score" type="button" disabled><span class="play-lamp" aria-hidden="true"></span><span>Play score</span></button>
              <button class="button" id="stop-score" type="button" disabled>Stop</button>
            </div>
            <div class="field">
              <label for="tempo">Practice tempo</label>
              <div class="tempo-row"><input id="tempo" type="range" min="40" max="220" value="104" step="1"><input id="tempo-number" type="number" min="40" max="220" value="104" aria-label="Tempo in beats per minute"></div>
            </div>
            <div class="loop-panel">
              <div class="field"><label for="loop-start">Loop from bar</label><input id="loop-start" type="number" min="1" value="1"></div>
              <div class="field"><label for="loop-end">Loop to bar</label><input id="loop-end" type="number" min="1" value="1"></div>
              <button class="button coral" id="play-loop" type="button" disabled>Play loop</button>
              <p class="loop-summary" id="loop-summary">Choose a valid score to set a loop.</p>
            </div>
          </div>
          <p class="score-help">Select a bar in the staff to loop it. Press Space to play or stop.</p>
          <p class="app-status" id="app-status" role="status" aria-live="polite">${demo ? 'Sample score ready.' : 'Write or load a score to begin.'}</p>
        </section>
      </div>
    </section>`;
}

function homePage(): string {
  return `${header()}<main id="main" tabindex="-1">
    <section class="hero">
      <div>
        <p class="eyebrow">ABC notation practice tool</p>
        <h1>Write, hear, and loop an ABC score</h1>
        <p class="lede">For musicians and educators who need a short score ready to practice or share.</p>
        <div class="hero-action-row">
          <a class="button primary" href="/?demo=1" data-route>Try it with sample data</a>
          <p class="action-note">It loads a complete score, ready to play.</p>
        </div>
        <ul class="facts"><li>Free to use</li><li>Your score stays in this browser</li><li>Works offline after the first visit</li></ul>
      </div>
      <figure class="hero-art-shell">
        <picture>
          <source srcset="/assets/abc-score-play-hero.avif" type="image/avif">
          <img class="hero-art" src="/assets/abc-score-play-hero.webp" width="900" height="600" alt="A music console turns typed notes into a paper score." fetchpriority="high" decoding="async">
        </picture>
      </figure>
    </section>
    ${editorMarkup(false)}
    <section class="how" aria-labelledby="how-title">
      <h2 id="how-title">How to make a practice loop</h2>
      <div class="how-grid">
        <article class="step"><span class="step-number">01</span><h3>Write the tune</h3><p>Type the title, meter, note length, key, and notes. Errors point to a line.</p></article>
        <article class="step"><span class="step-number">02</span><h3>Choose the bars</h3><p>Set the first and last bar. Change the tempo for practice.</p></article>
        <article class="step"><span class="step-number">03</span><h3>Play or share</h3><p>Repeat the loop, copy its link, or print the clean score.</p></article>
      </div>
    </section>
    <section class="boundaries" aria-labelledby="boundaries-title">
      <div><h2 id="boundaries-title">A practice tool, not a score library</h2></div>
      <div><ul class="boundary-list"><li>No account or cloud score storage.</li><li>No copyrighted score catalogue.</li><li>No composing bot or group editing.</li><li>Your browser stores the current ABC text.</li></ul></div>
    </section>
  </main>${footer()}`;
}

function demoPage(): string {
  return `${header()}<div class="demo-strip" role="status"><span>Demo — sample data, nothing is saved to your real score</span><button id="reset-demo" type="button">Reset demo</button><button id="start-real" type="button">Start for real</button></div>
    <main id="main" class="demo-page" tabindex="-1">
      ${editorMarkup(true)}
    </main>${footer()}`;
}

function legalPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  const title = privacy ? 'Keep your score on this device' : 'Use the tool for scores you may share';
  return `${header()}<main id="main" tabindex="-1"><article class="legal-page">
    <p class="eyebrow">${privacy ? 'Privacy' : 'Terms'}</p><h1>${title}</h1>
    ${privacy ? `<h2>What this tool stores</h2><p>The app stores your current ABC text in this browser. Demo edits stay separate from your real score.</p><h2>What leaves this device</h2><p>Your score is not sent to us. Shared score text appears after <code>#score=</code>. Browsers do not send that part to servers.</p><h2>Control your score</h2><p>Use “Clear editor” to remove saved text. Clearing browser storage also removes it.</p><h2>Contact</h2><p>Email <a href="mailto:privacy@sociobot.in">privacy@sociobot.in</a> with a privacy question.</p>` : `<h2>Your scores</h2><p>Only enter music you wrote or have permission to use. You remain responsible for links and printed copies you share.</p><h2>The service</h2><p>ABC Score Play is provided free of charge and without a warranty. The tool may change or stop.</p><h2>Acceptable use</h2><p>Do not use the service to break laws, distribute harmful material, or infringe another person’s rights.</p><h2>Contact</h2><p>Email <a href="mailto:hello@sociobot.in">hello@sociobot.in</a> with a terms question.</p>`}
    <p><a href="/" data-route>Return to the score editor</a></p>
  </article></main>${footer()}`;
}

function notFoundPage(): string {
  return `${header()}<main id="main" tabindex="-1"><section class="not-found"><p class="not-found-code">404</p><h1>Page not found</h1><p>This address does not lead to a page in ABC Score Play.</p><a class="button primary" href="/" data-route>Return to the editor</a></section></main>${footer()}`;
}

function readSharedScore(): string | null {
  const match = location.hash.match(/(?:^#|&)score=([^&]+)/);
  return match ? decodeScore(match[1]) : null;
}

function writeLineGutter(source: string, issues: ScoreIssue[]): void {
  const gutter = document.querySelector<HTMLDivElement>('#line-gutter');
  if (!gutter) return;
  const errors = new Set(issues.map((issue) => issue.line));
  gutter.innerHTML = source.split('\n').map((_, index) => `<span${errors.has(index + 1) ? ' class="line-error"' : ''}>${index + 1}</span>`).join('\n');
}

function setupEditor(demo: boolean): () => void {
  const source = document.querySelector<HTMLTextAreaElement>('#abc-source')!;
  const paper = document.querySelector<HTMLDivElement>('#paper')!;
  const empty = document.querySelector<HTMLDivElement>('#empty-score')!;
  const errors = document.querySelector<HTMLDivElement>('#validation-errors')!;
  const lamp = document.querySelector<HTMLSpanElement>('#valid-lamp')!;
  const validation = document.querySelector<HTMLSpanElement>('#validation-label')!;
  const status = document.querySelector<HTMLParagraphElement>('#app-status')!;
  const play = document.querySelector<HTMLButtonElement>('#play-score')!;
  const stop = document.querySelector<HTMLButtonElement>('#stop-score')!;
  const loop = document.querySelector<HTMLButtonElement>('#play-loop')!;
  const share = document.querySelector<HTMLButtonElement>('#share-score')!;
  const print = document.querySelector<HTMLButtonElement>('#print-score')!;
  const open = document.querySelector<HTMLButtonElement>('#open-score')!;
  const openFile = document.querySelector<HTMLInputElement>('#open-score-file')!;
  const download = document.querySelector<HTMLButtonElement>('#download-score')!;
  const transport = document.querySelector<HTMLDivElement>('#transport')!;
  const tempo = document.querySelector<HTMLInputElement>('#tempo')!;
  const tempoNumber = document.querySelector<HTMLInputElement>('#tempo-number')!;
  const loopStart = document.querySelector<HTMLInputElement>('#loop-start')!;
  const loopEnd = document.querySelector<HTMLInputElement>('#loop-end')!;
  const loopSummary = document.querySelector<HTMLParagraphElement>('#loop-summary')!;
  const barCount = document.querySelector<HTMLSpanElement>('#bar-count')!;
  const player = new LocalScorePlayer();
  const storageKey = demo ? STORAGE_DEMO : STORAGE_REAL;
  let abc: AbcModule | undefined;
  let visual: import('abcjs').TuneObject | undefined;
  let bars = 0;
  let inputTimer = 0;
  let renderToken = 0;
  let playingLoop = false;
  let loopPasses = 0;

  const setPlaying = (active: boolean): void => {
    transport.classList.toggle('is-playing', active);
    play.querySelector('span:last-child')!.textContent = active && !playingLoop ? 'Playing score' : 'Play score';
    stop.disabled = !active;
  };

  const clearHighlights = (): void => paper.querySelectorAll('.playing').forEach((element) => element.classList.remove('playing'));
  const highlightMeasure = (measure: number): void => {
    clearHighlights();
    paper.querySelectorAll(`.abcjs-mm${measure}`).forEach((element) => element.classList.add('playing'));
  };

  const render = async (): Promise<void> => {
    const token = ++renderToken;
    const text = source.value;
    download.disabled = !text.trim();
    const basicIssues = validateSource(text);
    writeLineGutter(text || '', basicIssues);
    player.stop();
    setPlaying(false);
    if (!text.trim()) {
      visual = undefined; bars = 0; paper.innerHTML = ''; empty.hidden = false;
      validation.textContent = 'Waiting for notes'; lamp.className = 'status-lamp'; errors.innerHTML = '';
      [play, loop, share, print].forEach((button) => { button.disabled = true; });
      barCount.textContent = '0 bars'; loopSummary.textContent = 'Choose a valid score to set a loop.';
      return;
    }
    if (basicIssues.length) {
      visual = undefined; lamp.className = 'status-lamp error'; validation.textContent = `${basicIssues.length} ${basicIssues.length === 1 ? 'issue' : 'issues'}`;
      errors.innerHTML = `<div class="error-list"><strong>Fix the ABC text:</strong><ul>${basicIssues.map((issue) => `<li><button type="button" data-error-line="${issue.line}">Line ${issue.line}</button>: ${issue.message}</li>`).join('')}</ul></div>`;
      writeLineGutter(text, basicIssues);
      [play, loop, share, print].forEach((button) => { button.disabled = true; });
      return;
    }
    validation.textContent = 'Reading score…';
    try {
      abc ??= await loadAbc();
      if (token !== renderToken) return;
      const parsed = abc.renderAbc(paper, text, {
        responsive: 'resize', add_classes: true, selectionColor: '#c54f38', paddingtop: 12, paddingbottom: 12,
        clickListener: (_element, _tune, classes, analysis) => {
          const globalMeasure = `${classes} ${analysis.parentClasses.join(' ')} ${analysis.clickedClasses.join(' ')}`.match(/abcjs-mm(\d+)/)?.[1];
          const selected = Math.min(bars, Math.max(1, Number(globalMeasure ?? analysis.measure) + 1));
          loopStart.value = String(selected); loopEnd.value = String(selected); updateLoopSummary();
          status.textContent = `Bar ${selected} selected for looping.`;
        }
      });
      const tune = parsed[0];
      if (!tune) throw new Error('No tune was found.');
      const warnings = (tune.warnings ?? []).filter(Boolean);
      if (warnings.length) {
        const renderIssues = warnings.slice(0, 4).map((message) => {
          const char = Number(message.match(/(?:character|char)\s+(\d+)/i)?.[1] ?? 0);
          return { line: sourceLineFromChar(text, char), message: String(message).replace(/<[^>]*>/g, '').slice(0, 180) };
        });
        errors.innerHTML = `<div class="error-list"><strong>Check this notation:</strong><ul>${renderIssues.map((issue) => `<li><button type="button" data-error-line="${issue.line}">Line ${issue.line}</button>: ${issue.message}</li>`).join('')}</ul></div>`;
        writeLineGutter(text, renderIssues);
      } else {
        errors.innerHTML = '';
      }
      visual = tune; bars = countBars(abc, text); empty.hidden = true;
      lamp.className = 'status-lamp valid'; validation.textContent = warnings.length ? 'Score drawn with warnings' : 'Valid score';
      barCount.textContent = `${bars} ${bars === 1 ? 'bar' : 'bars'}`;
      loopStart.max = String(bars); loopEnd.max = String(bars);
      loopStart.value = String(Math.min(Number(loopStart.value), bars));
      loopEnd.value = String(Math.min(Math.max(Number(loopEnd.value), Number(loopStart.value)), bars));
      [play, loop, share, print].forEach((button) => { button.disabled = false; });
      updateLoopSummary();
    } catch (error) {
      visual = undefined; lamp.className = 'status-lamp error'; validation.textContent = 'Could not draw score';
      errors.innerHTML = `<div class="error-list"><strong>The score could not be drawn.</strong> Check the headers and bar lines, then try again.</div>`;
      status.textContent = error instanceof Error ? error.message : 'The score could not be drawn.';
      [play, loop, share, print].forEach((button) => { button.disabled = true; });
    }
  };

  const updateLoopSummary = (): void => {
    const start = Math.max(1, Math.min(bars || 1, Number(loopStart.value) || 1));
    const end = Math.max(start, Math.min(bars || 1, Number(loopEnd.value) || start));
    loopStart.value = String(start); loopEnd.value = String(end);
    loopSummary.textContent = start === end ? `Bar ${start} will repeat until you stop.` : `Bars ${start}–${end} will repeat until you stop.`;
  };

  const playVisual = async (tune: import('abcjs').TuneObject, loopMode: boolean): Promise<void> => {
    playingLoop = loopMode;
    setPlaying(true);
    status.textContent = loopMode
      ? (loopPasses ? `Loop played ${loopPasses} ${loopPasses === 1 ? 'time' : 'times'} and is repeating.` : 'Loop playing. Press Stop when finished.')
      : 'Score playing.';
    const offset = loopMode ? Number(loopStart.value) - 1 : 0;
    await player.play(tune, Number(tempo.value), (measure) => highlightMeasure(measure + offset), async () => {
      if (playingLoop) {
        loopPasses += 1;
        status.textContent = `Loop played ${loopPasses} ${loopPasses === 1 ? 'time' : 'times'}.`;
        await playVisual(tune, true);
      } else {
        setPlaying(false); clearHighlights(); status.textContent = 'Score finished.';
      }
    });
  };

  const stopPlayback = (): void => {
    playingLoop = false; player.stop(); setPlaying(false); clearHighlights(); status.textContent = 'Playback stopped.';
  };

  const initial = readSharedScore() ?? localStorage.getItem(storageKey) ?? (demo ? SAMPLE_SCORE : '');
  source.value = initial;
  writeLineGutter(initial, []);
  void render();

  const onInput = (): void => {
    localStorage.setItem(storageKey, source.value);
    window.clearTimeout(inputTimer);
    inputTimer = window.setTimeout(() => void render(), 220);
  };
  source.addEventListener('input', onInput);
  source.addEventListener('scroll', () => { document.querySelector<HTMLDivElement>('#line-gutter')!.scrollTop = source.scrollTop; });
  paper.addEventListener('pointerdown', (event) => {
    const notationElement = (event.target as Element).closest<SVGElement>('[class*="abcjs-mm"]');
    const globalMeasure = [...(notationElement?.classList ?? [])].find((name) => /^abcjs-mm\d+$/.test(name))?.slice(8);
    if (globalMeasure === undefined) return;
    const selected = Math.min(bars, Number(globalMeasure) + 1);
    loopStart.value = String(selected); loopEnd.value = String(selected); updateLoopSummary();
    status.textContent = `Bar ${selected} selected for looping.`;
  }, { capture: true });
  errors.addEventListener('click', (event) => {
    const button = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-error-line]');
    if (!button) return;
    const targetLine = Number(button.dataset.errorLine);
    const start = source.value.split('\n').slice(0, targetLine - 1).reduce((sum, line) => sum + line.length + 1, 0);
    const end = start + (source.value.split('\n')[targetLine - 1]?.length ?? 0);
    source.focus(); source.setSelectionRange(start, end);
  });
  document.querySelector<HTMLButtonElement>('#load-sample')!.addEventListener('click', () => {
    source.value = SAMPLE_SCORE; localStorage.setItem(storageKey, source.value); status.textContent = 'Sample score loaded.'; void render();
  });
  open.addEventListener('click', () => openFile.click());
  openFile.addEventListener('change', async () => {
    const file = openFile.files?.[0];
    if (!file) return;
    if (file.size > 1_000_000) {
      status.textContent = 'That file is over 1 MB. Choose a smaller ABC file.';
      openFile.value = '';
      return;
    }
    source.value = await file.text();
    localStorage.setItem(storageKey, source.value);
    status.textContent = `${file.name} opened.`;
    openFile.value = '';
    await render();
  });
  download.addEventListener('click', () => {
    const title = source.value.split('\n').find((line) => line.startsWith('T:'))?.slice(2).trim() || 'abc-score';
    const safeTitle = title.normalize('NFKD').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'abc-score';
    const url = URL.createObjectURL(new Blob([source.value], { type: 'text/vnd.abc;charset=utf-8' }));
    const anchor = document.createElement('a');
    anchor.href = url; anchor.download = `${safeTitle}.abc`; anchor.hidden = true;
    document.body.append(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 0);
    status.textContent = `${safeTitle}.abc downloaded.`;
  });
  document.querySelector<HTMLButtonElement>('#clear-score')!.addEventListener('click', () => {
    stopPlayback(); source.value = ''; localStorage.removeItem(storageKey); status.textContent = 'Editor cleared.'; void render(); source.focus();
  });
  play.addEventListener('click', () => { if (visual) { loopPasses = 0; void playVisual(visual, false); } });
  loop.addEventListener('click', async () => {
    if (!abc || !visual) return;
    player.stop(); loopPasses = 0;
    const loopText = makeLoopSource(abc, source.value, Number(loopStart.value), Number(loopEnd.value));
    const loopTune = abc.renderAbc('*', loopText, {})[0];
    if (loopTune) await playVisual(loopTune, true);
  });
  stop.addEventListener('click', stopPlayback);
  [loopStart, loopEnd].forEach((input) => input.addEventListener('change', updateLoopSummary));
  const setTempo = (value: string): void => {
    const next = Math.max(40, Math.min(220, Number(value) || 104));
    tempo.value = String(next); tempoNumber.value = String(next); status.textContent = `Tempo set to ${next} beats per minute.`;
  };
  tempo.addEventListener('input', () => setTempo(tempo.value));
  tempoNumber.addEventListener('change', () => setTempo(tempoNumber.value));
  share.addEventListener('click', async () => {
    const url = `${location.origin}${demo ? '/demo' : '/'}#score=${encodeScore(source.value)}`;
    history.replaceState({}, '', `${location.pathname}#score=${encodeScore(source.value)}`);
    try { await navigator.clipboard.writeText(url); status.textContent = 'Score link copied.'; }
    catch { status.textContent = 'The score link is in the address bar. Copy it there.'; }
  });
  print.addEventListener('click', () => { status.textContent = 'Print view opened.'; window.print(); });
  const keyHandler = (event: KeyboardEvent): void => {
    if (event.code !== 'Space' || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.target instanceof HTMLTextAreaElement || event.target instanceof HTMLInputElement) return;
    event.preventDefault();
    if (transport.classList.contains('is-playing')) stopPlayback();
    else if (visual) void playVisual(visual, false);
  };
  document.addEventListener('keydown', keyHandler);

  document.querySelector<HTMLButtonElement>('#reset-demo')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_DEMO); source.value = SAMPLE_SCORE; localStorage.setItem(STORAGE_DEMO, SAMPLE_SCORE); status.textContent = 'Demo reset.'; void render();
  });
  document.querySelector<HTMLButtonElement>('#start-real')?.addEventListener('click', () => {
    localStorage.removeItem(STORAGE_DEMO); navigate('/#workbench');
  });

  return () => { player.stop(); window.clearTimeout(inputTimer); document.removeEventListener('keydown', keyHandler); };
}

function bindRoutes(): void {
  document.querySelectorAll<HTMLAnchorElement>('a[data-route]').forEach((link) => link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); navigate(link.getAttribute('href') ?? '/');
  }));
}

function navigate(path: string): void {
  history.pushState({}, '', path);
  renderRoute(true);
}

function renderRoute(focus = false): void {
  routeCleanup?.(); routeCleanup = undefined;
  const path = location.pathname.replace(/\/+$/, '') || '/';
  const demo = path === '/demo' || (path === '/' && new URLSearchParams(location.search).get('demo') === '1');
  if (demo) {
    sessionStorage.setItem(DEMO_SESSION, '1');
  } else if (activeRouteIsDemo || sessionStorage.getItem(DEMO_SESSION) === '1') {
    localStorage.removeItem(STORAGE_DEMO);
    sessionStorage.removeItem(DEMO_SESSION);
  }
  activeRouteIsDemo = demo;
  if (demo) {
    const metadataPath = path === '/demo' ? '/demo' : '/?demo=1';
    setMetadata('Demo — ABC Score Play', 'Play, edit, and loop a ready-made ABC score.', metadataPath);
    app.innerHTML = demoPage(); routeCleanup = setupEditor(true);
  } else if (path === '/') {
    setMetadata('ABC Score Play — write, hear, and loop music', 'Write a short ABC score, hear it, loop bars for practice, share a link, and print clean notation.', '/');
    app.innerHTML = homePage(); routeCleanup = setupEditor(false);
  } else if (path === '/privacy') {
    setMetadata('Privacy — ABC Score Play', 'How ABC Score Play keeps score text in your browser.', '/privacy'); app.innerHTML = legalPage('privacy');
  } else if (path === '/terms') {
    setMetadata('Terms — ABC Score Play', 'Terms for using ABC Score Play.', '/terms'); app.innerHTML = legalPage('terms');
  } else {
    setMetadata('Page not found — ABC Score Play', 'The requested ABC Score Play page was not found.', path); app.innerHTML = notFoundPage();
  }
  bindRoutes();
  const focusDestination = (): void => {
    const workbenchHeading = location.hash === '#workbench' ? document.querySelector<HTMLElement>('#workbench-title') : null;
    const destination = workbenchHeading ?? document.querySelector<HTMLElement>('h1');
    if (workbenchHeading) workbenchHeading.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
    destination?.setAttribute('tabindex', '-1');
    destination?.focus({ preventScroll: Boolean(workbenchHeading) });
    const announcement = document.querySelector('#route-status');
    if (announcement) announcement.textContent = destination?.textContent ?? document.title;
  };
  if (focus || location.hash === '#workbench') requestAnimationFrame(focusDestination);
}

window.addEventListener('popstate', () => renderRoute(true));
renderRoute();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => navigator.serviceWorker.register('/sw.js').catch(() => undefined));
}
