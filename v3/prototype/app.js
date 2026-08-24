const graph = await fetch('../data/graph.json').then(r => r.json());
const meta = await fetch('../data/site-meta.json').then(r => r.json());
const nodes = new Map(graph.nodes.map(n => [n.id, n]));
const edges = graph.edges;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const compactContext = window.matchMedia('(max-width: 900px)');

const identity = document.querySelector('.identity');
const replay = document.querySelector('.replay');
const journeyList = document.querySelector('#journey-list');
const journeyMode = document.querySelector('#journey-mode');
const context = document.querySelector('#context-content');
const siteMeta = document.querySelector('#site-meta');

const wait = ms => new Promise(r => setTimeout(r, ms));
let motionRunning = false;
let showFullJourney = false;
let activeNodeId = null;

async function runIdentityMotion(){
  if(motionRunning || reducedMotion) return;
  motionRunning = true;
  identity.classList.remove('motion-ai','motion-tsai','motion-eng');
  await wait(700);
  identity.classList.add('motion-ai');
  await wait(1500);
  identity.classList.remove('motion-ai');
  identity.classList.add('motion-tsai');
  await wait(1800);
  identity.classList.remove('motion-tsai');
  identity.classList.add('motion-eng');
  await wait(1500);
  identity.classList.remove('motion-eng');
  await wait(700);
  motionRunning = false;
}

identity.addEventListener('click', runIdentityMotion);
identity.addEventListener('keydown', e => { if(e.key==='Enter' || e.key===' '){e.preventDefault();runIdentityMotion();} });
replay.addEventListener('click', runIdentityMotion);
if(reducedMotion){ replay.hidden = true; } else { runIdentityMotion(); }

function yearOf(n){ return n.year ?? n.endYear ?? n.startYear ?? 0; }
function allJourneyNodes(){
  const keep = new Set(['education','experience','award','presentation','teaching']);
  return graph.nodes
    .filter(n => keep.has(n.type) && n.visibility !== 'internal')
    .sort((a,b) => yearOf(b)-yearOf(a));
}
function selectedJourneyNodes(){
  const preferred = new Set(['education','experience','award']);
  return allJourneyNodes().filter(n => n.visibility === 'hero' || preferred.has(n.type));
}
function publicJourneyNodes(){ return showFullJourney ? allJourneyNodes() : selectedJourneyNodes(); }

function related(node){
  const ids = new Set();
  for(const e of edges){
    if(e.from===node.id) ids.add(e.to);
    if(e.to===node.id) ids.add(e.from);
  }
  if(node.institution) ids.add(node.institution);
  if(node.mentor) ids.add(node.mentor);
  return [...ids].map(id => nodes.get(id)).filter(Boolean);
}

function contextLabel(n){
  if(n.type==='institution') return ['Institution', n.short || n.label];
  if(n.type==='mentor') return ['Mentor', n.label];
  if(n.type==='thesis') return ['Thesis', n.label];
  if(n.type==='evidence') return ['Evidence', n.label];
  return [n.type.replace('_',' '), n.label];
}

function evidenceLinks(node){
  const links = [];
  if(node.doi) links.push({label:'DOI', href:`https://doi.org/${node.doi}`});
  if(node.handle) links.push({label:'Repository', href:`https://repository.kaust.edu.sa/handle/${node.handle}`});
  for(const n of related(node)){
    if(n.type==='evidence' && n.visibility !== 'internal' && n.url) links.push({label:n.label, href:n.url});
  }
  return links;
}

function contextMarkup(node){
  const rel = related(node).filter(n => n.visibility !== 'internal');
  const [primaryInstitution] = rel.filter(n => n.type==='institution');
  const [primaryMentor] = rel.filter(n => n.type==='mentor');
  const pills = [];
  if(primaryInstitution) pills.push(contextLabel(primaryInstitution));
  if(primaryMentor) pills.push(contextLabel(primaryMentor));
  if(node.venue) pills.push(['Venue', node.venue]);
  if(node.place) pills.push(['Place', node.place]);
  if(node.detail) pills.push(['Context', node.detail]);
  const evidence = evidenceLinks(node);
  return `<strong>${node.label}</strong><p>${yearOf(node)} · ${node.type.replace('_',' ')}</p>${pills.length?`<div class="context-grid">${pills.slice(0,3).map(([k,v])=>`<div class="context-pill"><small>${k}</small><span>${v}</span></div>`).join('')}</div>`:''}${evidence.length?`<details class="evidence"><summary>View evidence</summary><div class="evidence-links">${evidence.map(e=>`<a href="${e.href}" target="_blank" rel="noopener noreferrer">${e.label}</a>`).join('')}</div></details>`:''}`;
}

function showContext(node){
  activeNodeId = node.id;
  const allItems = [...document.querySelectorAll('.journey-item')];
  allItems.forEach(el => el.classList.toggle('is-active', el.dataset.id===node.id));
  const markup = contextMarkup(node);
  context.innerHTML = markup;
  document.querySelectorAll('.journey-inline-context').forEach(el => el.remove());
  if(compactContext.matches){
    const active = allItems.find(el => el.dataset.id===node.id);
    if(active){
      const inline = document.createElement('div');
      inline.className = 'journey-inline-context';
      inline.innerHTML = `<p class="eyebrow">Connected context</p>${markup}`;
      active.appendChild(inline);
    }
  }
}

function renderJourney(){
  journeyList.innerHTML = '';
  let previousYear = null;
  const visible = publicJourneyNodes();
  for(const node of visible){
    const year = yearOf(node);
    const item = document.createElement('article');
    item.className = 'journey-item';
    item.dataset.id = node.id;
    item.tabIndex = 0;
    const repeat = previousYear === year;
    item.innerHTML = `<span class="journey-year${repeat?' is-repeat':''}" aria-hidden="${repeat?'true':'false'}">${year}</span><span class="journey-node" aria-hidden="true"></span><div class="journey-card"><strong>${node.label}</strong><span>${node.type.replace('_',' ')}</span></div>`;
    item.addEventListener('mouseenter', () => showContext(node));
    item.addEventListener('click', () => showContext(node));
    item.addEventListener('focus', () => showContext(node));
    journeyList.appendChild(item);
    previousYear = year;
  }
  const stillVisible = visible.find(n => n.id === activeNodeId);
  if(stillVisible) showContext(stillVisible);
  else if(visible[0]) showContext(visible[0]);
}

journeyMode.addEventListener('click', () => {
  showFullJourney = !showFullJourney;
  journeyMode.setAttribute('aria-expanded', String(showFullJourney));
  journeyMode.textContent = showFullJourney ? 'Show selected journey' : 'Show full journey';
  renderJourney();
});

compactContext.addEventListener('change', () => {
  const node = activeNodeId ? nodes.get(activeNodeId) : null;
  document.querySelectorAll('.journey-inline-context').forEach(el => el.remove());
  if(node) showContext(node);
});

renderJourney();

const published = meta.lastPublishedAt ? new Date(meta.lastPublishedAt).toLocaleDateString(undefined,{year:'numeric',month:'short',day:'numeric'}) : 'Not yet published';
const visits = Number.isFinite(meta.lifetimeVisits) ? meta.lifetimeVisits.toLocaleString() : 'Preserved externally / not imported yet';
siteMeta.innerHTML = `<span>Last meaningful release: ${published}</span><span>Lifetime visits: ${visits}</span>`;
