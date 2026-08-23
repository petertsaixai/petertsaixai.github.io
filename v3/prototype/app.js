const graph = await fetch('../data/graph.json').then(r => r.json());
const nodes = new Map(graph.nodes.map(n => [n.id, n]));
const edges = graph.edges;

const identity = document.querySelector('.identity');
const replay = document.querySelector('.replay');
const journeyList = document.querySelector('#journey-list');
const context = document.querySelector('#context-content');

const wait = ms => new Promise(r => setTimeout(r, ms));
let motionRunning = false;

async function runIdentityMotion(){
  if(motionRunning) return;
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
runIdentityMotion();

function yearOf(n){ return n.year ?? n.endYear ?? n.startYear ?? 0; }
function publicJourneyNodes(){
  const keep = new Set(['education','experience','award','presentation','teaching']);
  return graph.nodes
    .filter(n => keep.has(n.type) && n.visibility !== 'internal')
    .sort((a,b) => yearOf(b)-yearOf(a));
}

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

function showContext(node){
  document.querySelectorAll('.journey-item').forEach(el => el.classList.toggle('is-active', el.dataset.id===node.id));
  const rel = related(node).filter(n => n.visibility !== 'internal');
  const [primaryInstitution] = rel.filter(n => n.type==='institution');
  const [primaryMentor] = rel.filter(n => n.type==='mentor');
  const pills = [];
  if(primaryInstitution) pills.push(contextLabel(primaryInstitution));
  if(primaryMentor) pills.push(contextLabel(primaryMentor));
  if(node.venue) pills.push(['Venue', node.venue]);
  if(node.place) pills.push(['Place', node.place]);
  if(node.detail) pills.push(['Context', node.detail]);
  context.innerHTML = `<strong>${node.label}</strong><p>${yearOf(node)} · ${node.type.replace('_',' ')}</p>${pills.length?`<div class="context-grid">${pills.slice(0,3).map(([k,v])=>`<div class="context-pill"><small>${k}</small><span>${v}</span></div>`).join('')}</div>`:''}`;
}

for(const node of publicJourneyNodes()){
  const item = document.createElement('article');
  item.className = 'journey-item';
  item.dataset.id = node.id;
  item.tabIndex = 0;
  item.innerHTML = `<span class="journey-year">${yearOf(node)}</span><span class="journey-node" aria-hidden="true"></span><div class="journey-card"><strong>${node.label}</strong><span>${node.type.replace('_',' ')}</span></div>`;
  item.addEventListener('mouseenter', () => showContext(node));
  item.addEventListener('click', () => showContext(node));
  item.addEventListener('focus', () => showContext(node));
  journeyList.appendChild(item);
}
