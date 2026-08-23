import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(here,'..');
const data=JSON.parse(fs.readFileSync(path.join(root,'content','records.json'),'utf8'));
const institutions=JSON.parse(fs.readFileSync(path.join(root,'content','institutions.json'),'utf8'));
const expectedTalks=data.records.filter(r=>r.surfaces.includes('talks')&&r.evidence.level!=='narrative').map(r=>r.id).sort();
const expectedInstitutions=institutions.institutions.map(i=>i.id);
const errors=[];
for(const locale of data.locales){
  const talksFile=path.join(root,'dist',locale,'talks.html');
  const homeFile=path.join(root,'dist',locale,'index.html');
  if(!fs.existsSync(talksFile)){errors.push(`${locale}: talks.html missing`);}else{
    const html=fs.readFileSync(talksFile,'utf8');
    const actual=[...html.matchAll(/data-record-id="([^"]+)"/g)].map(m=>m[1]).sort();
    if(JSON.stringify(actual)!==JSON.stringify(expectedTalks))errors.push(`${locale}: talks record parity mismatch`);
  }
  if(!fs.existsSync(homeFile)){errors.push(`${locale}: index.html missing`);}else{
    const html=fs.readFileSync(homeFile,'utf8');
    const actual=[...html.matchAll(/data-institution-id="([^"]+)"/g)].map(m=>m[1]);
    if(JSON.stringify(actual)!==JSON.stringify(expectedInstitutions))errors.push(`${locale}: institution order/parity mismatch`);
    if(!html.includes('data-section-id="institutions"'))errors.push(`${locale}: institution section missing`);
  }
}
const css=fs.readFileSync(path.join(root,'dist','assets','v2.css'),'utf8');
if(/overflow-x\s*:\s*auto/i.test(css))errors.push('CSS: horizontal auto-scroll prohibited');
if(!css.includes('grid-template-columns:repeat(2,minmax(0,1fr))'))errors.push('CSS: mobile 2-column institution rail missing');
if(errors.length){console.error('Render validation failed');errors.forEach(e=>console.error(`- ${e}`));process.exit(1);}
console.log(`Render parity passed: ${data.locales.length} locales, ${expectedInstitutions.length} institutions, ${expectedTalks.length} talks records.`);
