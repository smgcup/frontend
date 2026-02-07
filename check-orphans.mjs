import { readFile, readdir } from 'fs/promises';

const names = (await readFile('./player-names.txt', 'utf-8')).split('\n').filter(Boolean);

const expectedFiles = new Set(
  names.map((name) =>
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s\-']/g, '')
      .replace(/[\s\-']+/g, '_')
  )
);

const files = await readdir('./player-images');
const orphans = files.filter((f) => {
  if (f === 'damaged.txt' || f === 'failed.txt') return false;
  const base = f.replace(/\.\w+$/, '');
  return !expectedFiles.has(base);
});

console.log(`Orphan images (no matching player name): ${orphans.length}\n`);
for (const f of orphans) {
  console.log(`  ${f}`);
}
