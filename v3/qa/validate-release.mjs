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

// Site history belongs to the site, not to an individual redesign. Keep unknown
// historical values as null rather than silently inventing a new launch date or
// resetting counters while v3 is still isolated from production.
if (!meta.rules?.preserveAcrossVersions) fail('cross-version metadata preservation rule missing');
if (!meta.rules?.lastPublishedAtMeansMeaningfulRelease) fail('meaningful-release timestamp rule missing');
if (!meta.rules?.neverResetLifetimeVisitsOnRedesign) fail('lifetime visit preservation rule missing');
if (!meta.rules?.nullMeansUnknownNotZero) fail('unknown metadata null-semantics rule missing');
if (meta.siteLaunchAt !== null && Number.isNaN(Date.parse(meta.siteLaunchAt))) fail('siteLaunchAt must be null or a valid timestamp');
if (meta.lastPublishedAt !== null && Number.isNaN(Date.parse(meta.lastPublishedAt))) fail('lastPublishedAt must be null or a valid timestamp');
if (meta.lifetimeVisits !== null && (!Number.isInteger(meta.lifetimeVisits) || meta.lifetimeVisits < 0)) fail('lifetimeVisits must be null or a non-negative integer');
if (meta.lifetimeVisits === 0) fail('unknown lifetime visits must not be reset to zero');
if (!meta.viewsByVersion || Array.isArray(meta.viewsByVersion) || typeof meta.viewsByVersion !== 'object') fail('viewsByVersion must remain an object');

const productionReleases = (meta.releaseHistory || []).filter(r => r.status === 'production');
if (!productionReleases.length) fail('release history must retain at least one production release');
for (const release of productionReleases) {
  if (!release.version || !release.commit || !release.publishedAt) fail('production release history requires version, commit, and publishedAt');
  if (release.publishedAt && Number.isNaN(Date.parse(release.publishedAt))) fail(`invalid production publishedAt for ${release.version || 'unknown version'}`);
}
const latestProduction = productionReleases.at(-1);
if (latestProduction?.publishedAt !== meta.lastPublishedAt) fail('lastPublishedAt must match the latest meaningful production release');

const v3Release = (meta.releaseHistory || []).find(r => r.version === 'v3');
if (!v3Release) fail('v3 development release-history entry missing');
if (v3Release?.branch !== 'v3-system') fail('v3 release history must remain isolated on v3-system');
if (v3Release?.status !== 'development') fail('v3 must remain development until explicit release approval');

const internalNodes = graph.nodes.filter(n => n.visibility === 'internal').map(n => n.id);
for (const id of internalNodes) {
  if (html.includes(id)) fail(`internal node leaked into static prototype: ${id}`);
}

if (!process.exitCode) console.log('PASS: v3 release-gate invariants');
