import type abcjsType from 'abcjs';

export interface ScoreIssue {
  line: number;
  message: string;
}

export interface ParsedScore {
  visual: abcjsType.TuneObject;
  bars: number;
  issues: ScoreIssue[];
}

export type AbcModule = typeof abcjsType;

let modulePromise: Promise<AbcModule> | undefined;

export function loadAbc(): Promise<AbcModule> {
  modulePromise ??= import('abcjs').then((module) => module.default);
  return modulePromise;
}

export function validateSource(source: string): ScoreIssue[] {
  if (!source.trim()) return [];

  const lines = source.split('\n');
  const issues: ScoreIssue[] = [];
  const required = ['X:', 'T:', 'M:', 'L:', 'K:'];
  for (const field of required) {
    if (!lines.some((line) => line.trimStart().startsWith(field))) {
      issues.push({ line: 1, message: `Add a ${field.slice(0, 1)} header before the music.` });
    }
  }

  const keyLine = lines.findIndex((line) => line.trimStart().startsWith('K:'));
  if (keyLine >= 0 && !lines.slice(keyLine + 1).some((line) => /[A-Ga-gzZ]/.test(line.replace(/%.*/, '')))) {
    issues.push({ line: Math.min(keyLine + 2, lines.length), message: 'Add notes or rests after the K header.' });
  }

  lines.forEach((line, index) => {
    const clean = line.replace(/%.*/, '');
    if ((clean.match(/"/g)?.length ?? 0) % 2 !== 0) {
      issues.push({ line: index + 1, message: 'Close the chord quote on this line.' });
    }
    if ((clean.match(/\[/g)?.length ?? 0) !== (clean.match(/\]/g)?.length ?? 0)) {
      issues.push({ line: index + 1, message: 'Match the opening and closing square brackets.' });
    }
  });

  return issues.slice(0, 5);
}

export function sourceLineFromChar(source: string, char: number): number {
  return source.slice(0, Math.max(0, char)).split('\n').length;
}

export function makeLoopSource(abc: AbcModule, source: string, start: number, end: number): string {
  const tune = abc.extractMeasures(source)[0];
  if (!tune) return source;
  const first = Math.max(0, start - 1);
  const last = Math.min(tune.measures.length, end);
  const body = tune.measures.slice(first, last).map((measure) => measure.abc).join('').trimStart();
  return `${tune.header.trimEnd()}\n${body}`;
}

export function countBars(abc: AbcModule, source: string): number {
  return Math.max(1, abc.extractMeasures(source)[0]?.measures.length ?? 1);
}

export function encodeScore(source: string): string {
  const bytes = new TextEncoder().encode(source);
  let binary = '';
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

export function decodeScore(encoded: string): string | null {
  try {
    const padded = encoded.replaceAll('-', '+').replaceAll('_', '/') + '='.repeat((4 - encoded.length % 4) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

interface PlaybackNote {
  cmd: string;
  start?: number;
  duration?: number;
  pitch?: number;
  volume?: number;
}

export class LocalScorePlayer {
  private context?: AudioContext;
  private sources: OscillatorNode[] = [];
  private timers: number[] = [];
  private stopped = true;

  async play(
    visual: abcjsType.TuneObject,
    bpm: number,
    onMeasure: (measure: number) => void,
    onEnded: () => void
  ): Promise<void> {
    this.stop();
    this.stopped = false;
    this.context ??= new AudioContext();
    await this.context.resume();

    const audio = visual.setUpAudio({ qpm: bpm, chordsOff: true });
    const secondsPerWhole = 240 / bpm;
    const startsAt = this.context.currentTime + 0.06;
    const notes = audio.tracks.flatMap((track) => track as PlaybackNote[]).filter((event) => event.cmd === 'note');

    for (const note of notes) {
      if (note.pitch === undefined || note.start === undefined || note.duration === undefined) continue;
      const oscillator = this.context.createOscillator();
      const gain = this.context.createGain();
      const start = startsAt + note.start * secondsPerWhole;
      const duration = Math.max(.04, note.duration * secondsPerWhole - .025);
      const level = Math.min(.13, Math.max(.035, (note.volume ?? 80) / 900));
      oscillator.type = 'triangle';
      oscillator.frequency.value = 440 * 2 ** ((note.pitch - 69) / 12);
      gain.gain.setValueAtTime(.0001, start);
      gain.gain.exponentialRampToValueAtTime(level, start + .012);
      gain.gain.setValueAtTime(level, Math.max(start + .013, start + duration - .045));
      gain.gain.exponentialRampToValueAtTime(.0001, start + duration);
      oscillator.connect(gain).connect(this.context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration + .01);
      this.sources.push(oscillator);
    }

    const meter = visual.getMeterFraction();
    const measureWholeNotes = meter.den ? meter.num / meter.den : 1;
    const measureSeconds = Math.max(.1, measureWholeNotes * secondsPerWhole);
    const totalSeconds = Math.max(.08, audio.totalDuration * secondsPerWhole);
    const measures = Math.max(1, Math.ceil(totalSeconds / measureSeconds));
    for (let measure = 0; measure < measures; measure += 1) {
      this.timers.push(window.setTimeout(() => {
        if (!this.stopped) onMeasure(measure);
      }, 60 + measure * measureSeconds * 1000));
    }
    this.timers.push(window.setTimeout(() => {
      if (!this.stopped) onEnded();
    }, (totalSeconds + .08) * 1000));
  }

  stop(): void {
    this.stopped = true;
    this.timers.forEach(window.clearTimeout);
    this.timers = [];
    for (const source of this.sources) {
      try { source.stop(); } catch { /* It already ended. */ }
    }
    this.sources = [];
  }
}
