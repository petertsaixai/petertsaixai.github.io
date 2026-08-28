const graph = await fetch('/v3/data/graph.json').then(r => { if(!r.ok) throw new Error(`Graph load failed: ${r.status}`); return r.json(); });
const nodes = new Map(graph.nodes.map(n => [n.id,n]));
const edges = graph.edges;
const mount = document.querySelector('#deep-content');
const page = document.body.dataset.page;

const related = node => {
  const ids = new Set();
  for (const edge of edges){ if(edge.from===node.id) ids.add(edge.to); if(edge.to===node.id) ids.add(edge.from); }
  if(node.institution) ids.add(node.institution);
  if(node.mentor) ids.add(node.mentor);
  return [...ids].map(id => nodes.get(id)).filter(Boolean).filter(n => n.visibility !== 'internal');
};
const yearOf = n => n.year ?? n.endYear ?? n.startYear ?? '';
const evidence = node => {
  const links=[]; const seen=new Set();
  const add=(label,href)=>{ if(href && !seen.has(href)){seen.add(href);links.push({label,href});} };
  const collect=n=>{ if(n.doi) add('DOI',`https://doi.org/${n.doi}`); if(n.handle) add('Repository',`https://repository.kaust.edu.sa/handle/${n.handle}`); if(n.type==='evidence'&&n.url) add(n.label,n.url); };
  collect(node); related(node).forEach(collect); return links;
};
const safeLinks = links => links.length ? `<div class="deep-links">${links.map(l=>`<a href="${l.href}" target="_blank" rel="noopener noreferrer">${l.label}</a>`).join('')}</div>` : '';

if(page === 'research'){
  const topics = graph.nodes.filter(n => n.type==='research_topic' && n.visibility!=='internal');
  mount.innerHTML = topics.map(topic => {
    const sources = graph.nodes.filter(n => n.visibility!=='internal' && related(n).some(r => r.id===topic.id));
    return `<article class="deep-card" id="${topic.id}"><p class="card-kicker">Research thread</p><h3>${topic.label}</h3><p>Connected to ${sources.length} public milestone${sources.length===1?'':'s'} in the graph.</p><div class="deep-meta">${sources.slice(0,5).map(n=>`<span class="deep-chip">${yearOf(n)} · ${n.label}</span>`).join('')}</div></article>`;
  }).join('');
}

if(page === 'work'){
  const work = graph.nodes.filter(n => ['thesis','presentation','award'].includes(n.type) && n.visibility!=='internal').sort((a,b)=>(yearOf(b)||0)-(yearOf(a)||0));
  mount.innerHTML = work.map(node => {
    const topics = related(node).filter(n=>n.type==='research_topic');
    return `<article class="deep-card"><p class="card-kicker">${node.type.replace('_',' ')} · ${yearOf(node)}</p><h3>${node.label}</h3>${node.venue?`<p>${node.venue}${node.place?` · ${node.place}`:''}</p>`:''}<div class="deep-meta">${topics.map(t=>`<span class="deep-chip">${t.label}</span>`).join('')}</div>${safeLinks(evidence(node))}</article>`;
  }).join('');
}
