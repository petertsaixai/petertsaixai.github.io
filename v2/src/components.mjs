const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function recordCard(record, locale, labels) {
  const evidence = record.evidence?.url ? `<a class="evidence-link" href="${esc(record.evidence.url)}" rel="noopener">${esc(labels.officialRecord)} <span aria-hidden="true">↗</span></a>` : '';
  return `<article class="record-card glass" data-record-id="${esc(record.id)}" data-evidence="${esc(record.evidence.level)}">
    <p class="record-meta">${esc(record.date ?? '')}${record.meta?.[locale] ? ` · ${esc(record.meta[locale])}` : ''}</p>
    <h2>${esc(record.title[locale])}</h2>
    ${record.details?.[locale] ? `<p class="record-detail">${esc(record.details[locale])}</p>` : ''}
    ${evidence}
  </article>`;
}

export function siteHeader(locale, labels) {
  const localeLinks = [['en','EN'],['zh-tw','繁中'],['zh-cn','简中']];
  return `<header class="site-header"><a class="wordmark" href="/${locale}/" aria-label="Peter Tsai home"><span>TS</span><span class="brand-ai">AI</span></a><nav class="locale-nav" aria-label="Language">${localeLinks.map(([key,text]) => `<a href="/${key}/"${key===locale?' aria-current="true"':''}>${text}</a>`).join('')}</nav></header>`;
}

export function pageShell({locale, lang, title, eyebrow, body, labels}) {
  return `<!doctype html><html lang="${esc(lang)}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${esc(title)} · Peter Tsai Ming-Cheng</title><link rel="stylesheet" href="/v2/assets/v2.css"></head><body>${siteHeader(locale,labels)}<main class="shell page"><p class="eyebrow">${esc(eyebrow)}</p><h1>${esc(title)}</h1>${body}</main><footer class="shell site-footer">© 2026 Peter Tsai Ming-Cheng</footer></body></html>`;
}
