import fs from 'node:fs';

const read = path => fs.readFileSync(path, 'utf8');
const html = read('v3/prototype/index.html');
const js = read('v3/prototype/app.js');
const css = read('v3/prototype/styles.css');

const failures = [];
const requireMatch = (source, pattern, message) => {
  if (!pattern.test(source)) failures.push(message);
};

requireMatch(html, /<html\s+lang="[^"]+"/i, 'document must declare a language');
requireMatch(html, /<meta\s+name="viewport"/i, 'responsive viewport metadata is required');
requireMatch(html, /<h1\b[^>]*>/i, 'page must have an h1');
requireMatch(html, /<main\b[^>]*>/i, 'page must have a main landmark');
requireMatch(html, /aria-labelledby="identity-name"/i, 'hero must have an accessible label relationship');
requireMatch(html, /aria-labelledby="journey-title"/i, 'journey section must have an accessible label relationship');
requireMatch(html, /class="context-panel"[^>]*aria-live="polite"/i, 'connected context must announce updates politely');
requireMatch(html, /<button[^>]+type="button"[^>]*>/i, 'interactive controls must use non-submit buttons');
requireMatch(html, /id="journey-mode"[^>]*aria-expanded="false"/i, 'journey disclosure must expose expanded state');

requireMatch(js, /setAttribute\(['"]role['"],['"]button['"]\)/, 'dynamic journey milestones must expose button semantics');
requireMatch(js, /setAttribute\(['"]aria-pressed['"]/, 'milestones must expose active state');
requireMatch(js, /setAttribute\(['"]aria-label['"]/, 'milestones must have accessible names');
requireMatch(js, /e\.key===['"]Enter['"]\s*\|\|\s*e\.key===['"] ['"]/, 'custom keyboard controls must support Enter and Space');
requireMatch(js, /journeyMode\.setAttribute\(['"]aria-expanded['"]/, 'journey disclosure state must update');
requireMatch(js, /target="_blank"\s+rel="noopener noreferrer"/, 'external evidence links must prevent opener access');

requireMatch(css, /:focus-visible/, 'keyboard focus must have a visible focus style');
requireMatch(css, /prefers-reduced-motion\s*:\s*reduce/, 'reduced-motion preference must be respected');

if (failures.length) {
  for (const failure of failures) console.error(`FAIL: ${failure}`);
  process.exitCode = 1;
} else {
  console.log('PASS: v3 static accessibility invariants');
}
