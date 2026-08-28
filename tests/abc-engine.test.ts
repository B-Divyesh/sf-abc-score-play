import { describe, expect, it } from 'vitest';
import { decodeScore, encodeScore, sourceLineFromChar, validateSource } from '../src/abc-engine';

const score = `X:1
T:Test tune
M:4/4
L:1/8
K:C
| C2 D2 E2 F2 |`;

describe('ABC source helpers', () => {
  it('round-trips Unicode score text through a URL-safe fragment', () => {
    const source = `${score}\n% café`;
    expect(decodeScore(encodeScore(source))).toBe(source);
    expect(encodeScore(source)).not.toMatch(/[+/=]/);
  });

  it('reports missing headers and unmatched notation', () => {
    const issues = validateSource('X:1\nT:Open "chord\nK:C\nC D E F');
    expect(issues.map((issue) => issue.message).join(' ')).toContain('M header');
    expect(issues.map((issue) => issue.line)).toContain(2);
  });

  it('maps character positions to line numbers', () => {
    expect(sourceLineFromChar(score, score.indexOf('K:C'))).toBe(5);
  });
});
