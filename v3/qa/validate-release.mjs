import fs from 'node:fs';

const read = p => fs.readFileSync(p, 'utf8');
const graph = JSON.parse(read('v3/data/graph.json'));
const meta = JSON.parse(read('v3/data/site-meta.json'));
const html = read('v3/prototype/index.html');
const js = read('v3/prototype/app.js');
const css = read('v3/prototype/styles.css');

const fail = msg => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

if (!html.includes('noindex,nofollow')) fail('prototype must remain noindex until release approval');
if (!html.includes('aria-live')) fail('interactive context needs an aria-live region');
if (!css.includes('prefers-reduced-motion')) fail('reduced-motion support is required');
if (!js.includes("visibility !== 'internal'")) fail('internal facts must not enter public Journey');
if (!graph.visibilityLevels?.includes('internal')) fail('graph visibility model incomplete');
if (!graph.rules?.evidenceOnDemand) fail('evidence-on-demand rule missing');
if (!meta.rules?.preserveAcrossVersions) fail('cross-version metadata preservation rule missing');
if (meta.lifetimeVisits === 0) fail('unknown lifetime visits must not be reset to zero');
if (meta.releaseHistory?.at(-1)?.status === 'production') fail('v3 must remain development until explicit release approval');

const internalNodes = graph.nodes.filter(n => n.visibility === 'internal').map(n => n.id);
for (const id of internalNodes) {
  if (html.includes(id)) fail(`internal node leaked into static prototype: ${id}`);
}

if (!process.exitCode) console.log('PASS: v3 release-gate invariants');
