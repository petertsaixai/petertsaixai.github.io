import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'records.json'), 'utf8'));
const out = path.join(root, 'dist');

const labels = {
  en: { lang: 'en', title: 'Academic Milestones', evidence: 'Official record' },
  'zh-tw': { lang: 'zh-Hant', title: '學術里程碑', evidence: '官方紀錄' },
  'zh-cn': { lang: 'zh-Hans', title: '学术里程碑', evidence: '官方记录' }
};

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function renderRecord(record, locale) {
  const evidence = record.evidence?.url
    ? `<a class="evidence" href="${escapeHtml(record.evidence.url)}" rel="noopener">${labels[locale].evidence} ↗</a>`
    : '';
  return `<article class="record" data-record-id="${escapeHtml(record.id)}" data-evidence="${escapeHtml(record.evidence.level)}">
    <p class="meta">${escapeHtml(record.date ?? '')} · ${escapeHtml(record.meta?.[locale] ?? record.type)}</p>
    <h2>${escapeHtml(record.title[locale])}</h2>
    ${record.details?.[locale] ? `<p>${escapeHtml(record.details[locale])}</p>` : ''}
    ${evidence}
  </article>`;
}

for (const locale of data.locales) {
  const records = data.records.filter(r => r.surfaces.includes('talks') && r.evidence.level !== 'narrative');
  const html = `<!doctype html>
<html lang="${labels[locale].lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${labels[locale].title} · Peter Tsai Ming-Cheng</title>
<style>
:root{color-scheme:light;--ink:#172033;--navy:#17365d;--muted:#667085;--line:#dce4ed;--blue:#2f5597}*{box-sizing:border-box}body{margin:0;padding:48px 20px;background:#fbfcfe;color:var(--ink);font:16px/1.65 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.shell{width:min(760px,100%);margin:auto}.eyebrow{color:var(--blue);font-size:.75rem;font-weight:800;letter-spacing:.14em;text-transform:uppercase}.record{margin-top:24px;padding:28px;border:1px solid rgba(255,255,255,.9);border-radius:20px;background:rgba(255,255,255,.72);box-shadow:0 18px 55px rgba(23,54,93,.07);backdrop-filter:blur(16px)}.meta{color:var(--blue);font-size:.78rem;font-weight:800;letter-spacing:.06em}.record h2{color:var(--navy);font-size:clamp(1.45rem,5vw,2.15rem);line-height:1.2}.record p{color:var(--muted)}.evidence{display:inline-block;margin-top:8px;color:var(--blue);text-decoration:none;border-bottom:1px solid #c8d6e7}@media(max-width:520px){body{padding:30px 14px}.record{padding:21px;border-radius:17px}}
</style>
</head>
<body><main class="shell"><p class="eyebrow">Peter Tsai · v2 system prototype</p><h1>${labels[locale].title}</h1>${records.map(r => renderRecord(r, locale)).join('\n')}</main></body>
</html>`;
  const dir = path.join(out, locale);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'talks.html'), html);
}

console.log(`Rendered ${data.locales.length} locale pages from ${data.records.length} canonical records.`);
