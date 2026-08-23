import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const data = JSON.parse(fs.readFileSync(path.join(root, 'content', 'records.json'), 'utf8'));
const expected = data.records.filter(r => r.surfaces.includes('talks') && r.evidence.level !== 'narrative').map(r => r.id).sort();
const errors = [];

for (const locale of data.locales) {
  const file = path.join(root, 'dist', locale, 'talks.html');
  if (!fs.existsSync(file)) { errors.push(`${locale}: talks.html missing`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const actual = [...html.matchAll(/data-record-id="([^"]+)"/g)].map(m => m[1]).sort();
  if (JSON.stringify(actual) !== JSON.stringify(expected)) errors.push(`${locale}: record parity mismatch`);
  if (/overflow-x\s*:\s*auto/i.test(html)) errors.push(`${locale}: horizontal auto-scroll detected`);
}

if (errors.length) {
  console.error('Render validation failed');
  errors.forEach(e => console.error(`- ${e}`));
  process.exit(1);
}
console.log(`Render parity passed for ${data.locales.length} locales and ${expected.length} talks records.`);
