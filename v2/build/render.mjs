import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pageShell, institutionRail, identityHero, portalGrid, timeline } from '../src/components.mjs';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'content','records.json'),'utf8'));
const institutions=JSON.parse(fs.readFileSync(path.join(root,'content','institutions.json'),'utf8'));
const portals=JSON.parse(fs.readFileSync(path.join(root,'content','portals.json'),'utf8'));
const out=path.join(root,'dist');
const portrait='https://media.licdn.com/dms/image/v2/D4E03AQG_UYjpZjFpTg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1712650512624?e=2147483647&v=beta&t=drg6yKAaWPMffsPBby_dwCvIoZGv1mvmPxjFDOy0duo';
const labels={
 en:{lang:'en',title:'Peter Tsai Ming-Cheng',chineseName:'',eyebrow:'Communications · Intelligent Connectivity · AI',lead:'Communications researcher and technology ecosystem practitioner working across wireless and optical communications, satellite connectivity, emerging AI, and industry engagement.',institutions:'Selected institutions & communities',officialRecord:'Official record',portrait,portraitAlt:'Portrait of Peter Tsai Ming-Cheng'},
 'zh-tw':{lang:'zh-Hant',title:'蔡明城 Peter Tsai Ming-Cheng',chineseName:'蔡明城',eyebrow:'Communications · Intelligent Connectivity · AI',lead:'從通訊研究出發，跨越無線與光通訊、衛星與非地面網路、AI 智慧互聯，到技術探索、產業生態系統與專業服務。',institutions:'精選機構與專業社群',officialRecord:'官方紀錄',portrait,portraitAlt:'蔡明城 Peter Tsai Ming-Cheng 個人照片'},
 'zh-cn':{lang:'zh-Hans',title:'蔡明城 Peter Tsai Ming-Cheng',chineseName:'蔡明城',eyebrow:'Communications · Intelligent Connectivity · AI',lead:'从通信研究出发，跨越无线与光通信、卫星与非地面网络、AI 智能互联，到技术探索、产业生态系统与专业服务。',institutions:'精选机构与专业社群',officialRecord:'官方记录',portrait,portraitAlt:'蔡明城 Peter Tsai Ming-Cheng 个人照片'}
};
const talksLabels={
 en:{lang:'en',title:'Academic Milestones',eyebrow:'Talks · Academic Record',officialRecord:'Official record',timelineLabel:'Academic milestones, newest to oldest'},
 'zh-tw':{lang:'zh-Hant',title:'學術里程碑',eyebrow:'演講與發表 · 學術紀錄',officialRecord:'官方紀錄',timelineLabel:'學術里程碑，由新至舊'},
 'zh-cn':{lang:'zh-Hans',title:'学术里程碑',eyebrow:'演讲与发表 · 学术记录',officialRecord:'官方记录',timelineLabel:'学术里程碑，由新至旧'}
};
fs.rmSync(out,{recursive:true,force:true});fs.mkdirSync(out,{recursive:true});fs.cpSync(path.join(root,'public'),out,{recursive:true});
for(const locale of data.locales){
 const copy=labels[locale],trajectory=data.records.find(r=>r.id==='home-trajectory');
 const homeBody=`${identityHero(locale,copy)}<p class="home-trajectory" data-record-id="home-trajectory">${trajectory.title[locale]}</p>${institutionRail(institutions,locale,copy.institutions)}${portalGrid(locale,portals.portals)}`;
 const dir=path.join(out,locale);fs.mkdirSync(dir,{recursive:true});
 fs.writeFileSync(path.join(dir,'index.html'),pageShell({locale,lang:copy.lang,title:copy.title,eyebrow:copy.eyebrow,body:homeBody,hero:true}));
 const t=talksLabels[locale];
 const records=data.records.filter(r=>r.surfaces.includes('talks')&&r.evidence.level!=='narrative').sort((a,b)=>(b.date??'').localeCompare(a.date??''));
 const talksBody=timeline(records,locale,t);
 fs.writeFileSync(path.join(dir,'talks.html'),pageShell({locale,lang:t.lang,title:t.title,eyebrow:t.eyebrow,body:talksBody}));
}
console.log(`Rendered identity home, institutions, portals + chronological talks for ${data.locales.length} locales.`);
