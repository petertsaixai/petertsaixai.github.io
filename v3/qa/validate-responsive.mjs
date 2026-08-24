import fs from 'node:fs';

const css = fs.readFileSync(new URL('../prototype/styles.css', import.meta.url), 'utf8');
const html = fs.readFileSync(new URL('../prototype/index.html', import.meta.url), 'utf8');

const checks = [
  ['viewport meta', /<meta\s+name="viewport"\s+content="width=device-width,initial-scale=1">/],
  ['horizontal overflow guard', /html\{[^}]*overflow-x:hidden[^}]*\}/],
  ['desktop two-column journey workbench', /\.journey-workbench\{display:grid;grid-template-columns:minmax\(0,1\.35fr\) minmax\(310px,\.8fr\)/],
  ['desktop sticky connected context', /\.context-panel\{position:sticky;top:28px;/],
  ['compact breakpoint', /@media\(max-width:900px\)/],
  ['compact single-column workbench', /@media\(max-width:900px\)[\s\S]*?\.journey-workbench\{grid-template-columns:1fr\}/],
  ['compact hides sticky context', /@media\(max-width:900px\)[\s\S]*?\.context-panel\{display:none\}/],
  ['compact exposes inline context', /@media\(max-width:900px\)[\s\S]*?\.journey-inline-context\{display:block;/],
  ['mobile breakpoint', /@media\(max-width:700px\)/],
  ['mobile one-column context grid', /@media\(max-width:700px\)[\s\S]*?\.context-grid,\.journey-inline-context \.context-grid\{grid-template-columns:1fr\}/],
  ['compact 44px journey mode target', /@media\(max-width:900px\)[\s\S]*?\.journey-mode\{[^}]*min-height:44px/],
  ['compact 44px replay target', /@media\(max-width:900px\)[\s\S]*?\.replay\{[^}]*min-height:44px/],
  ['mobile 44px milestone card target', /@media\(max-width:700px\)[\s\S]*?\.journey-card\{[^}]*min-height:44px/],
  ['mobile 44px evidence target', /@media\(max-width:700px\)[\s\S]*?\.evidence-links a\{[^}]*min-height:44px/],
  ['reduced motion support', /@media\(prefers-reduced-motion:reduce\)/]
];

const failures = [];
for (const [name, pattern] of checks) {
  const haystack = name === 'viewport meta' ? html : css;
  if (!pattern.test(haystack)) failures.push(name);
}

if (failures.length) {
  console.error('Responsive layout preflight failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Responsive layout preflight passed (${checks.length} invariants).`);
