import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';

/** Parses a page from the last `astro build` output (`dist/`). */
export function loadPage(path = 'index.html'): HTMLElement {
  return parse(readFileSync(resolve('dist', path), 'utf8'));
}
