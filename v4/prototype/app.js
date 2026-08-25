const graph = await fetch('/v3/data/graph.json').then(r => {
  if (!r.ok) throw new Error(`Graph load failed: ${r.status}`);
  return r.json();
});

const nodes = new Map(graph.nodes.map(n => [n.id, n]));
const edges = graph.edges;
const compact = window.matchMedia('(max-width: 900px)');
const tabs = [...document.querySelectorAll('.lens-tab')];
const lensPanel = document.querySelector('#lens-panel');
const journeyList = document.querySelector('#journey-list');
const journeyMode = document.querySelector('#journey-mode');
const context = document.querySelector('#context-content');

let activeLens = 'research';
let activeNodeId = null;
let showFull = false;

const lenses = {
  research: {
    title: 'Research lens',
    copy: 'Foreground formal research milestones, mentors, theses, and the research threads that connect talks back to the academic path.',
    typeWeight: {education: 6, presentation: 4, teaching: 2, award: 2, experience: 2},
    topicWeight: 3
  },
  technology: {
    title: 'Technology lens',
    copy: 'Foreground milestones that carry explicit technical research threads, so the journey reads through the problems and systems being worked on rather than degree labels alone.',
    typeWeight: {presentation: 7, education: 2, experience: 3, award: 1, teaching: 1},
    topicWeight: 5
  },
  impact: {
    title: 'Impact lens',
    copy: 'Foreground experience, recognition, and the institutions around the work while retaining evidence links back to the underlying research path.',
    typeWeight: {experience: 7, award: 6, education: 2, presentation: 2, teaching: 2},
    topicWeight: 1
  }
};

function yearOf(n){ return n.year ?? n.endYear ?? n.startYear ?? 0; }

function related(node){
  const ids = new Set();
  for (const edge of edges){
    if (edge.from === node.id) ids.add(edge.to);
    if (edge.to === node.id) ids.add(edge.from);
  }
  if (node.institution) ids.add(node.institution);
  if (node.mentor) ids.add(node.mentor);
  return [...ids].map(id => nodes.get(id)).filter(Boolean);
}

function researchTopics(node){
  const found = new Map();
  const inspect = n => {
    if (!n || n.visibility === 'internal') return;
    if (n.type === 'research_topic') found.set(n.id, n);
    for (const rel of related(n)){
      if (rel.type === 'research_topic' && rel.visibility !== 'internal') found.set(rel.id, rel);
    }
  };
  inspect(node);
  for (const rel of related(node)) inspect(rel);
  return [...found.values()];
}

function publicJourney(){
  const allowed = new Set(['education','experience','award','presentation','teaching']);
  return graph.nodes.filter(n => allowed.has(n.type) && n.visibility !== 'internal');
}

function score(node, lensName){
  const lens = lenses[lensName];
  const typeScore = lens.typeWeight[node.type] || 0;
  const topicScore = researchTopics(node).length ? lens.topicWeight : 0;
  const heroBonus = node.visibility === 'hero' ? 2 : 0;
  return typeScore + topicScore + heroBonus;
}

function rankedJourney(){
  return publicJourney().sort((a,b) => {
    const scoreDelta = score(b, activeLens) - score(a, activeLens);
    if (scoreDelta) return scoreDelta;
    return yearOf(b) - yearOf(a);
  });
}

function lensSignals(){
  const ranked = rankedJourney().slice(0,5);
  const signals = new Map();
  for (const node of ranked){
    for (const rel of related(node)){
      if (rel.visibility === 'internal') continue;
      if (activeLens === 'research' && ['mentor','thesis','institution'].includes(rel.type)) signals.set(rel.id, rel.label);
      if (activeLens === 'technology' && rel.type === 'research_topic') signals.set(rel.id, rel.label);
      if (activeLens === 'impact' && ['institution','evidence'].includes(rel.type)) signals.set(rel.id, rel.short || rel.label);
    }
    if (activeLens === 'technology'){
      for (const topic of researchTopics(node)) signals.set(topic.id, topic.label);
    }
  }
  return [...signals.values()].slice(0,6);
}

function renderLens(){
  const lens = lenses[activeLens];
  const signals = lensSignals();
  const ranked = rankedJourney().slice(0,3);
  lensPanel.innerHTML = `
    <div class="lens-summary">
      <p class="eyebrow">${lens.title}</p>
      <strong>${ranked.map(n => n.label).join(' · ')}</strong>
      <p>${lens.copy}</p>
      <p>These priorities are calculated from public graph relationships; no new biographical claim is introduced by the lens.</p>
    </div>
    <div class="lens-signals">
      <p class="eyebrow">Graph signals</p>
      <div class="signal-list">${signals.length ? signals.map(label => `<span class="signal">${label}</span>`).join('') : '<span class="signal">No additional public signals</span>'}</div>
    </div>`;
}

function evidenceLinks(node){
  const links = [];
  const seen = new Set();
  const add = (label, href) => {
    if (!href || seen.has(href)) return;
    seen.add(href);
    links.push({label, href});
  };
  const collect = n => {
    if (n.doi) add('DOI', `https://doi.org/${n.doi}`);
    if (n.handle) add('Repository', `https://repository.kaust.edu.sa/handle/${n.handle}`);
    if (n.type === 'evidence' && n.visibility !== 'internal' && n.url) add(n.label, n.url);
  };
  collect(node);
  for (const rel of related(node)) collect(rel);
  return links;
}

function contextMarkup(node){
  const rels = related(node).filter(n => n.visibility !== 'internal');
  const fields = [];
  const institution = rels.find(n => n.type === 'institution');
  const mentor = rels.find(n => n.type === 'mentor');
  const thesis = rels.find(n => n.type === 'thesis');
  const topics = researchTopics(node);
  if (institution) fields.push(['Institution', institution.short || institution.label]);
  if (mentor) fields.push(['Mentor', mentor.label]);
  if (thesis) fields.push(['Thesis', thesis.label]);
  if (topics.length) fields.push(['Research thread', topics.map(n => n.label).join(' · ')]);
  if (node.venue) fields.push(['Venue', node.venue]);
  if (node.place) fields.push(['Place', node.place]);
  const evidence = evidenceLinks(node);
  return `<strong>${node.label}</strong><p>${yearOf(node)} · ${node.type.replace('_',' ')}</p>${fields.length ? `<div class="context-grid">${fields.slice(0,4).map(([k,v]) => `<div class="context-pill"><small>${k}</small><span>${v}</span></div>`).join('')}</div>` : ''}${evidence.length ? `<details class="evidence"><summary>View evidence</summary><div class="evidence-links">${evidence.map(e => `<a href="${e.href}" target="_blank" rel="noopener noreferrer">${e.label}</a>`).join('')}</div></details>` : ''}`;
}

function showContext(node){
  activeNodeId = node.id;
  for (const item of document.querySelectorAll('.journey-item')){
    const active = item.dataset.id === node.id;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
    item.querySelector('.inline-context')?.remove();
  }
  const markup = contextMarkup(node);
  context.innerHTML = markup;
  if (compact.matches){
    const item = document.querySelector(`.journey-item[data-id="${CSS.escape(node.id)}"]`);
    if (item){
      const inline = document.createElement('div');
      inline.className = 'inline-context';
      inline.setAttribute('aria-live','polite');
      inline.innerHTML = `<p class="eyebrow">Connected context</p>${markup}`;
      item.appendChild(inline);
    }
  }
}

function renderJourney(){
  const ranked = rankedJourney();
  const visible = showFull ? ranked : ranked.slice(0,6);
  journeyList.innerHTML = '';
  visible.forEach((node,index) => {
    const item = document.createElement('article');
    item.className = `journey-item${index < 3 ? ' is-priority' : ''}`;
    item.dataset.id = node.id;
    item.tabIndex = 0;
    item.setAttribute('role','button');
    item.setAttribute('aria-pressed','false');
    item.setAttribute('aria-label', `${yearOf(node)}, ${node.label}, ${node.type.replace('_',' ')}, ${activeLens} perspective`);
    item.innerHTML = `<span class="journey-year">${yearOf(node)}</span><div class="journey-copy"><strong>${node.label}</strong><span>${node.type.replace('_',' ')}</span></div>`;
    const activate = () => showContext(node);
    item.addEventListener('mouseenter', activate);
    item.addEventListener('click', activate);
    item.addEventListener('focus', activate);
    item.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(); }
    });
    journeyList.appendChild(item);
  });
  const current = visible.find(n => n.id === activeNodeId) || visible[0];
  if (current) showContext(current);
}

function setLens(lensName, focusTab = false){
  activeLens = lensName;
  tabs.forEach(tab => {
    const active = tab.dataset.lens === lensName;
    tab.classList.toggle('is-active', active);
    tab.setAttribute('aria-selected', String(active));
    tab.tabIndex = active ? 0 : -1;
    if (active && focusTab) tab.focus();
  });
  renderLens();
  renderJourney();
}

tabs.forEach((tab,index) => {
  tab.addEventListener('click', () => setLens(tab.dataset.lens));
  tab.addEventListener('keydown', e => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault();
    let next = index;
    if (e.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (e.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    setLens(tabs[next].dataset.lens, true);
  });
});

journeyMode.addEventListener('click', () => {
  showFull = !showFull;
  journeyMode.setAttribute('aria-expanded', String(showFull));
  journeyMode.textContent = showFull ? 'Show focused journey' : 'Show full journey';
  renderJourney();
});

compact.addEventListener('change', () => {
  const node = activeNodeId ? nodes.get(activeNodeId) : null;
  if (node) showContext(node);
});

setLens('research');
