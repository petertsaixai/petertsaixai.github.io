import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageShell, recordCard, institutionRail } from '../src/components.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'records.json'), 'utf8'));
const institutions = JSON.parse(fs.readFileSync(path.join(root, 'content', 'institutions.json'), 'utf8'));
const out = path.join(root, 'dist');

const labels = {
  en: { lang:'en', title:'Peter Tsai Ming-Cheng', eyebrow:'Communications · Intelligent Connectivity · AI', institutions:'Selected institutions & communities', officialRecord:'Official record' },
  'zh-tw': { lang:'zh-Hant', title:'蔡明城 Peter Tsai Ming-Cheng', eyebrow:'Communications · Intelligent Connectivity · AI', institutions:'精選機構與專業社群', officialRecord:'官方紀錄' },
  'zh-cn': { lang:'zh-Hans', title:'蔡明城 Peter Tsai Ming-Cheng', eyebrow:'Communications · Intelligent Connectivity · AI', institutions:'精选机构与专业社群', officialRecord:'官方记录' }
};
const talksLabels = {
  en: { lang:'en', title:'Academic Milestones', eyebrow:'Talks · Academic Record', officialRecord:'Official record' },
  'zh-tw': { lang:'zh-Hant', title:'學術里程碑', eyebrow:'演講與發表 · 學術紀錄', officialRecord:'官方紀錄' },
  'zh-cn': { lang:'zh-Hans', title:'学术里程碑', eyebrow:'演讲与发表 · 学术记录', officialRecord:'官方记录' }
};

fs.rmSync(out,{recursive:true,force:true}); fs.mkdirSync(out,{recursive:true}); fs.cpSync(path.join(root,'public'),out,{recursive:true});
for (const locale of data.locales) {
  const copy=labels[locale];
  const trajectory=data.records.find(r=>r.id==='home-trajectory');
  const homeBody=`<p class="home-trajectory" data-record-id="home-trajectory">${trajectory.title[locale]}</p>${institutionRail(institutions,locale,copy.institutions)}`;
  const dir=path.join(out,locale); fs.mkdirSync(dir,{recursive:true});
  fs.writeFileSync(path.join(dir,'index.html'),pageShell({locale,lang:copy.lang,title:copy.title,eyebrow:copy.eyebrow,body:homeBody,labels:copy}));
  const t=talksLabels[locale];
  const records=data.records.filter(r=>r.surfaces.includes('talks')&&r.evidence.level!=='narrative');
  const talksBody=`<section class="record-stack" aria-label="${t.title}">${records.map(r=>recordCard(r,locale,t)).join('\n')}</section>`;
  fs.writeFileSync(path.join(dir,'talks.html'),pageShell({locale,lang:t.lang,title:t.title,eyebrow:t.eyebrow,body:talksBody,labels:t}));
}
console.log(`Rendered home + talks for ${data.locales.length} locales from canonical data.`);
