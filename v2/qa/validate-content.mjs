import fs from 'node:fs';

const file = new URL('../content/records.json', import.meta.url);
const data = JSON.parse(fs.readFileSync(file, 'utf8'));
const locales = data.locales;
const levels = new Set(data.evidenceLevels);
const ids = new Set();
const errors = [];

for (const record of data.records) {
  if (!record.id) errors.push('record missing id');
  if (ids.has(record.id)) errors.push(`${record.id}: duplicate id`);
  ids.add(record.id);

  for (const field of ['title', 'meta', 'details']) {
    if (!record[field]) continue;
    for (const locale of locales) {
      if (!record[field][locale]?.trim()) errors.push(`${record.id}: ${field}.${locale} missing`);
    }
  }

  if (!record.evidence?.level || !levels.has(record.evidence.level)) {
    errors.push(`${record.id}: invalid evidence level`);
  }
  if (!record.evidence?.source?.trim()) errors.push(`${record.id}: evidence source missing`);
  if (record.evidence?.level === 'official' && !record.evidence.url) {
    errors.push(`${record.id}: official evidence requires URL`);
  }
  if (!Array.isArray(record.surfaces) || record.surfaces.length === 0) {
    errors.push(`${record.id}: at least one surface required`);
  }
}

if (errors.length) {
  console.error(`Content validation failed (${errors.length})`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Content validation passed: ${data.records.length} records, ${locales.length} locales.`);
