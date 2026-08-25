import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');
const graph = JSON.parse(read('v3/data/graph.json'));
const html = read('v4/prototype/index.html');
const js = read('v4/prototype/app.js');
const css = read('v4/prototype/styles.css');
const readme = read('v4/README.md');
const productionRoot = read('index.html');

const fail = msg => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

if (!html.includes('noindex,nofollow')) fail('v4 preview must remain noindex,nofollow');
if (!html.includes('role="tablist"') || !html.includes('role="tab"') || !html.includes('role="tabpanel"')) fail('perspective lenses require tab semantics');
if (!html.includes('aria-live="polite"')) fail('lens/context updates require polite live regions');
if (!html.includes('Skip to perspectives')) fail('preview needs a skip link');
if (!js.includes("fetch('/v3/data/graph.json')")) fail('v4 preview must reuse the validated public v3 graph');
if (!js.includes("n.visibility !== 'internal'")) fail('internal visibility exclusion missing from v4 journey');
if (!js.includes("rel.visibility === 'internal'")) fail('internal related-node exclusion missing from lens signals');
if (!js.includes("rel=\"noopener noreferrer\"")) fail('external evidence links need noopener noreferrer');
if (!js.includes('ArrowLeft') || !js.includes('ArrowRight') || !js.includes("e.key === 'Home'") || !js.includes("e.key === 'End'")) fail('lens tabs need keyboard arrow/home/end support');
if (!css.includes('@media(max-width:900px)')) fail('mobile context breakpoint missing');
if (!css.includes('min-height:44px')) fail('lens controls need 44px minimum touch target');
if (!css.includes('prefers-reduced-motion')) fail('reduced-motion rule missing');
if (!readme.includes('Perspective Lenses') || !readme.includes('no lens may invent new facts'.replace('no','No'))) fail('v4 product/safety thesis missing');
if (!productionRoot.includes('v3 · production')) fail('v3 production root baseline changed unexpectedly');
if (!productionRoot.includes('<base href="/v3/prototype/">')) fail('v3 production asset routing baseline changed unexpectedly');
if (!graph.visibilityLevels?.includes('internal')) fail('source graph visibility model incomplete');
if (!graph.rules?.avoidUnsupportedClaims) fail('source graph unsupported-claims invariant missing');

const lensNames = ['research','technology','impact'];
for (const lens of lensNames) {
  if (!html.includes(`data-lens="${lens}"`)) fail(`missing ${lens} lens control`);
  if (!js.includes(`${lens}: {`)) fail(`missing ${lens} lens definition`);
}

if (!process.exitCode) console.log('PASS: v4 preview invariants');
