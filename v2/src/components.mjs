const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function identityHero(locale, copy) {
  return `<section class="identity-hero" data-section-id="identity"><div class="identity-copy"><p class="eyebrow">${esc(copy.eyebrow)}</p><h1 class="identity-title">${locale==='en'?'':`<span class="identity-cjk">${esc(copy.chineseName)}</span>`}<span class="identity-name">Peter Ts<span class="identity-ai">ai</span> Ming-Ch<span class="identity-eng">eng</span></span></h1><p class="degree-line">Ph.D. · Electrical &amp; Computer Engineering</p><p class="identity-lead">${esc(copy.lead)}</p></div><figure class="portrait-glass glass"><img src="${esc(copy.portrait)}" alt="${esc(copy.portraitAlt)}" width="200" height="200" loading="eager" decoding="async"><span class="portrait-signal" aria-hidden="true"></span></figure></section>`;
}

export function portalGrid(locale, items) {
  return `<nav class="portal-grid" data-section-id="portals" aria-label="Primary sections">${items.map((item,index)=>`<a class="portal-card glass" data-portal-id="${esc(item.id)}" href="/${locale}/${esc(item.path)}"><span class="portal-index">${String(index+1).padStart(2,'0')}</span><span class="portal-copy"><strong>${esc(item.title[locale])}</strong><small>${esc(item.description[locale])}</small></span><span class="portal-arrow" aria-hidden="true">↗</span></a>`).join('')}</nav>`;
}

export function recordCard(record, locale, labels) {
  const evidence = record.evidence?.url ? `<a class="evidence-link" href="${esc(record.evidence.url)}" rel="noopener">${esc(labels.officialRecord)} <span aria-hidden="true">↗</span></a>` : '';
  return `<article class="record-card glass" data-record-id="${esc(record.id)}" data-evidence="${esc(record.evidence.level)}"><p class="record-meta">${esc(record.date ?? '')}${record.meta?.[locale] ? ` · ${esc(record.meta[locale])}` : ''}</p><h2>${esc(record.title[locale])}</h2>${record.details?.[locale] ? `<p class="record-detail">${esc(record.details[locale])}</p>` : ''}${evidence}</article>`;
}

function milestoneKey(record){
  if(record.id?.startsWith('kaust-phd-')) return 'phd';
  if(record.id?.startsWith('kaust-ms-')) return 'ms';
  return record.id;
}
function milestoneTitle(key,locale,records){
  const fixed={phd:{en:'Ph.D. Milestone','zh-tw':'博士里程碑','zh-cn':'博士里程碑'},ms:{en:'M.S. Milestone','zh-tw':'碩士里程碑','zh-cn':'硕士里程碑'}};
  return fixed[key]?.[locale] ?? records[0]?.title?.[locale] ?? key;
}
export function milestoneTimeline(records, locale, labels) {
  const groups=new Map();
  for(const record of records){const key=milestoneKey(record);if(!groups.has(key))groups.set(key,[]);groups.get(key).push(record);}
  const milestones=[...groups.entries()].map(([key,items])=>({key,items:items.sort((a,b)=>(b.date??'').localeCompare(a.date??'')),date:items.map(r=>r.date??'').sort().at(-1)??''})).sort((a,b)=>b.date.localeCompare(a.date));
  return `<section class="timeline milestone-timeline" data-section-id="timeline" aria-label="${esc(labels.timelineLabel ?? labels.title)}">${milestones.map((m,index)=>`<div class="timeline-item milestone-item" data-milestone-id="${esc(m.key)}"><div class="timeline-axis" aria-hidden="true"><span class="timeline-node${index===0?' is-latest':''}"></span></div><div class="timeline-content"><details class="milestone glass"${index===0?' open':''}><summary><span class="milestone-year">${esc(m.date.slice(0,4))}</span><strong>${esc(milestoneTitle(m.key,locale,m.items))}</strong><span class="milestone-count">${m.items.length}</span></summary><div class="milestone-records">${m.items.map(record=>recordCard(record,locale,labels)).join('')}</div></details></div></div>`).join('')}</section>`;
}

export function timeline(records, locale, labels) {
  return `<section class="timeline" data-section-id="timeline" aria-label="${esc(labels.timelineLabel ?? labels.title)}">${records.map((record,index)=>`<div class="timeline-item" data-record-id="${esc(record.id)}"><div class="timeline-axis" aria-hidden="true"><span class="timeline-node${index===0?' is-latest':''}"></span></div><div class="timeline-content">${recordCard(record,locale,labels)}</div></div>`).join('')}</section>`;
}

export function institutionRail(data, locale, label) {
  return `<section class="institution-section" data-section-id="institutions" aria-label="${esc(label)}"><p class="institution-label">${esc(label)}</p><div class="institution-rail">${data.institutions.map(item => `<a class="institution-chip" data-institution-id="${esc(item.id)}" data-evidence="${esc(item.evidenceLevel)}" href="/${locale}/${esc(item.target)}.html"><strong>${esc(item.name)}</strong><span>${esc(item.relation[locale])}</span></a>`).join('')}</div><p class="institution-note">${esc(data.disclaimer[locale])}</p></section>`;
}

export function siteHeader(locale) {
  const localeLinks = [['en','EN'],['zh-tw','繁中'],['zh-cn','简中']];
  return `<header class="site-header"><a class="wordmark" href="/${locale}/" aria-label="Peter Tsai home"><span>TS</span><span class="brand-ai">AI</span></a><nav class="locale-nav" aria-label="Language">${localeLinks.map(([key,text]) => `<a href="/${key}/"${key===locale?' aria-current="true"':''}>${text}</a>`).join('')}</nav></header>`;
}

export function pageShell({locale, lang, title, eyebrow, body, hero=false}) {
  const intro=hero?'':`<p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1>`;
  return `<!doctype html><html lang="${esc(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)} · Peter Tsai Ming-Cheng</title><link rel="stylesheet" href="/v2/assets/v2.css"><link rel="stylesheet" href="/v2/assets/timeline.css"></head><body>${siteHeader(locale)}<main class="shell page">${intro}${body}</main><footer class="shell site-footer">© 2026 Peter Tsai Ming-Cheng</footer></body></html>`;
}
