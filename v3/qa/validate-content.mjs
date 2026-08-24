import fs from 'node:fs';

const graph = JSON.parse(fs.readFileSync('v3/data/graph.json', 'utf8'));
const fail = msg => { console.error(`FAIL: ${msg}`); process.exitCode = 1; };

const nodes = new Map(graph.nodes.map(node => [node.id, node]));
const publicJourneyTypes = new Set(['education','experience','award','presentation','teaching']);
const researchEvidenceTypes = new Set(['thesis','publication','presentation']);
const identityId = graph.identity?.id;
const hasEndpoint = id => id === identityId || nodes.has(id);

function connectedNodes(id) {
  return graph.edges
    .filter(edge => edge.from === id || edge.to === id)
    .map(edge => nodes.get(edge.from === id ? edge.to : edge.from))
    .filter(Boolean);
}

function hasExternalEvidence(node) {
  return connectedNodes(node.id).some(related =>
    (related.type === 'evidence' && related.visibility !== 'internal' && related.url) ||
    (related.type === 'thesis' && related.visibility !== 'internal' && (related.doi || related.handle))
  );
}

for (const node of graph.nodes) {
  if (!node.id || !node.type || !node.label || !node.visibility) {
    fail(`node is missing required public-content fields: ${node.id || '<unknown>'}`);
    continue;
  }

  if (publicJourneyTypes.has(node.type) && node.visibility !== 'internal') {
    const hasDate = Number.isFinite(node.year) || Number.isFinite(node.startYear) || Number.isFinite(node.endYear);
    if (!hasDate) fail(`public journey node has no usable date: ${node.id}`);
  }

  if (publicJourneyTypes.has(node.type) && node.visibility === 'hero' && !hasExternalEvidence(node)) {
    fail(`hero journey node must have external evidence: ${node.id}`);
  }

  if (node.doi && !/^10\.\d{4,9}\//.test(node.doi)) {
    fail(`invalid DOI format: ${node.id}`);
  }

  if (node.handle && !/^\d+\/\d+$/.test(node.handle)) {
    fail(`invalid repository handle format: ${node.id}`);
  }

  if (node.url) {
    try {
      const url = new URL(node.url);
      if (url.protocol !== 'https:') fail(`evidence URL must use HTTPS: ${node.id}`);
    } catch {
      fail(`invalid evidence URL: ${node.id}`);
    }
  }

  if (node.type === 'evidence' && node.visibility !== 'internal' && !node.url) {
    fail(`public evidence node must include a URL: ${node.id}`);
  }
}

for (const edge of graph.edges) {
  const from = nodes.get(edge.from);
  const to = nodes.get(edge.to);
  if (!hasEndpoint(edge.from)) fail(`edge references missing source endpoint: ${edge.from}`);
  if (!hasEndpoint(edge.to)) fail(`edge references missing target endpoint: ${edge.to}`);
  if (!edge.relation) fail(`edge is missing relation: ${edge.from} -> ${edge.to}`);

  if (from && to && from.visibility !== 'internal' && to.visibility === 'internal') {
    fail(`public node must not depend on internal-only context: ${edge.from} -> ${edge.to}`);
  }
}

for (const topic of graph.nodes.filter(node => node.type === 'research_topic' && node.visibility !== 'internal')) {
  const connected = connectedNodes(topic.id);
  if (!connected.length) {
    fail(`public research topic is orphaned: ${topic.id}`);
    continue;
  }
  if (!connected.some(node => researchEvidenceTypes.has(node.type) && node.visibility !== 'internal')) {
    fail(`public research topic lacks thesis/publication/presentation support: ${topic.id}`);
  }
}

if (!identityId) fail('identity id is missing');
else {
  const identityEdges = graph.edges.filter(edge => edge.from === identityId || edge.to === identityId);
  if (!identityEdges.length) fail('identity must connect to the career/research graph');
}

const duplicateEvidenceUrls = new Map();
for (const node of graph.nodes.filter(node => node.type === 'evidence' && node.url)) {
  if (duplicateEvidenceUrls.has(node.url)) fail(`duplicate evidence URL: ${node.id} and ${duplicateEvidenceUrls.get(node.url)}`);
  else duplicateEvidenceUrls.set(node.url, node.id);
}

if (!process.exitCode) console.log('PASS: v3 content/evidence integrity');
