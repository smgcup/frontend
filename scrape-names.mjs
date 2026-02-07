import { chromium } from 'playwright';
import { writeFile } from 'fs/promises';

async function scrapePlayerNames() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to player standings page...');
  await page.goto('https://smgcup.com/player-standings', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('img', { timeout: 15000 });
  await page.waitForTimeout(3000);

  for (let i = 1; i <= 7; i++) {
    console.log(`  Scroll cycle ${i}/7...`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(5000);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(5000);
  }

  const names = await page.evaluate(() => {
    const results = [];
    const links = document.querySelectorAll('a[href*="/players/"]');
    for (const link of links) {
      const nameEl = link.querySelector('.flex-1 > .font-bold');
      const name = nameEl?.textContent?.trim();
      if (name) results.push(name);
    }
    return results;
  });

  const unique = [...new Set(names)];
  await writeFile('./player-names.txt', unique.join('\n'));

  console.log(`\nDone! ${unique.length} player names written to player-names.txt`);
  await browser.close();
}

scrapePlayerNames().catch(console.error);
