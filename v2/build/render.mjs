import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageShell, recordCard } from '../src/components.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'records.json'), 'utf8'));
const out = path.join(root, 'dist');

const labels = {
  en: { lang: 'en', title: 'Academic Milestones', eyebrow: 'Talks · Academic Record', officialRecord: 'Official record' },
  'zh-tw': { lang: 'zh-Hant', title: '學術里程碑', eyebrow: '演講與發表 · 學術紀錄', officialRecord: '官方紀錄' },
  'zh-cn': { lang: 'zh-Hans', title: '学术里程碑', eyebrow: '演讲与发表 · 学术记录', officialRecord: '官方记录' }
};

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.cpSync(path.join(root, 'public'), out, { recursive: true });

for (const locale of data.locales) {
  const copy = labels[locale];
  const records = data.records.filter(r => r.surfaces.includes('talks') && r.evidence.level !== 'narrative');
  const body = `<section class="record-stack" aria-label="${copy.title}">${records.map(r => recordCard(r, locale, copy)).join('\n')}</section>`;
  const html = pageShell({ locale, lang: copy.lang, title: copy.title, eyebrow: copy.eyebrow, body, labels: copy });
  const dir = path.join(out, locale);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'talks.html'), html);
}

console.log(`Rendered ${data.locales.length} locale pages from shared components and ${data.records.length} canonical records.`);
