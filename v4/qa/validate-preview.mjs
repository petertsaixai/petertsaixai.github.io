import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');
const graph = JSON.parse(read('v3/data/graph.json'));
const html = read('v4/prototype/index.html');
const researchHtml = read('v4/prototype/research.html');
const workHtml = read('v4/prototype/work.html');
const js = read('v4/prototype/app.js');
const deepJs = read('v4/prototype/deep.js');
const css = read('v4/prototype/styles.css');
const siteCss = read('v4/prototype/site.css');
const readme = read('v4/README.md');
const productionRoot = read('index.html');

const fail = msg => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

for (const [name,markup] of [['overview',html],['research',researchHtml],['work',workHtml]]) {
  if (!markup.includes('noindex,nofollow')) fail(`${name} preview must remain noindex,nofollow`);
  if (!markup.includes('Production v3 remains unchanged')) fail(`${name} preview must state production isolation`);
}
if (!html.includes('role="tablist"') || !html.includes('role="tab"') || !html.includes('role="tabpanel"')) fail('perspective lenses require tab semantics');
if (!html.includes('aria-live="polite"')) fail('lens/context updates require polite live regions');
if (!html.includes('Skip to perspectives')) fail('overview needs a skip link');
if (!html.includes('./research.html') || !html.includes('./work.html')) fail('full-site preview must expose research and selected-work routes');
if (!html.includes('Throughline') || !html.includes('Research map') || !html.includes('Selected work') || !html.includes('Current direction')) fail('full-site narrative sections incomplete');
if (!researchHtml.includes('data-page="research"') || !workHtml.includes('data-page="work"')) fail('deep pages need explicit graph rendering modes');
if (!js.includes("fetch('/v3/data/graph.json')") || !deepJs.includes("fetch('/v3/data/graph.json')")) fail('all v4 views must reuse the validated public v3 graph');
if (!js.includes("n.visibility !== 'internal'") || !deepJs.includes("n.visibility!=='internal'")) fail('internal visibility exclusion missing from public v4 views');
if (!js.includes("rel=\"noopener noreferrer\"") || !deepJs.includes("rel=\"noopener noreferrer\"")) fail('dynamic external evidence links need noopener noreferrer');
if (!html.includes('rel="noopener noreferrer"')) fail('static profile links need noopener noreferrer');
if (!js.includes('ArrowLeft') || !js.includes('ArrowRight') || !js.includes("e.key === 'Home'") || !js.includes("e.key === 'End'")) fail('lens tabs need keyboard arrow/home/end support');
if (!css.includes('@media(max-width:900px)') || !siteCss.includes('@media(max-width:900px)')) fail('responsive breakpoints missing');
if (!css.includes('min-height:44px') || !siteCss.includes('min-height:44px')) fail('interactive controls need 44px minimum touch target');
if (!css.includes('prefers-reduced-motion')) fail('reduced-motion rule missing');
if (!readme.includes('Perspective Lenses') || !readme.includes('No lens may invent new facts')) fail('v4 product/safety thesis missing');
if (!productionRoot.includes('v3 · production')) fail('v3 production root baseline changed unexpectedly');
if (!productionRoot.includes('<base href="/v3/prototype/">')) fail('v3 production asset routing baseline changed unexpectedly');
if (!graph.visibilityLevels?.includes('internal')) fail('source graph visibility model incomplete');
if (!graph.rules?.avoidUnsupportedClaims) fail('source graph unsupported-claims invariant missing');

for (const lens of ['research','technology','impact']) {
  if (!html.includes(`data-lens="${lens}"`)) fail(`missing ${lens} lens control`);
  if (!js.includes(`${lens}: {`)) fail(`missing ${lens} lens definition`);
}

if (!process.exitCode) console.log('PASS: v4 full-site preview invariants');
