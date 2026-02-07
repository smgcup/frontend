import { readFile, readdir } from 'fs/promises';

const names = (await readFile('./player-names.txt', 'utf-8')).split('\n').filter(Boolean);
const files = await readdir('./player-images');

const missing = [];
const found = [];

for (const name of names) {
  const safeName = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s\-']/g, '')
    .replace(/[\s\-']+/g, '_');

  const hasImage = files.some((f) => f.startsWith(safeName + '.'));

  if (hasImage) {
    found.push(name);
  } else {
    missing.push(name);
  }
}

console.log(`Found: ${found.length}/${names.length}`);
console.log(`Missing: ${missing.length}/${names.length}\n`);

if (missing.length > 0) {
  console.log('Missing images:');
  for (const name of missing) {
    console.log(`  ${name}`);
  }
}
