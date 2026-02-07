import { chromium } from 'playwright';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

const OUTPUT_DIR = './player-images';

async function scrapePlayerImages() {
  await mkdir(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to player standings page...');
  await page.goto('https://smgcup.com/player-standings', {
    waitUntil: 'networkidle',
  });

  await page.waitForSelector('img', { timeout: 15000 });
  await page.waitForTimeout(3000);

  // Scroll up and down 10 times to trigger lazy loading of all players
  for (let i = 1; i <= 7; i++) {
    console.log(`  Scroll cycle ${i}/10 - scrolling to bottom...`);
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(5000);
    console.log(`  Scroll cycle ${i}/10 - scrolling to top...`);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(5000);
  }

  // Get all player names and image URLs
  const players = await page.evaluate(() => {
    const results = [];
    const links = document.querySelectorAll('a[href*="/players/"]');

    for (const link of links) {
      const img = link.querySelector('img');
      if (!img || !img.src || img.src.includes('data:image')) continue;

      const nameEl = link.querySelector('.flex-1 > .font-bold');
      const fullName = nameEl?.textContent?.trim();
      if (!fullName) continue;

      results.push({ name: fullName, src: img.src });
    }

    return results;
  });

  // Deduplicate by name
  const seen = new Set();
  const uniquePlayers = players.filter((p) => {
    if (seen.has(p.name)) return false;
    seen.add(p.name);
    return true;
  });

  console.log(`\nFound ${uniquePlayers.length} unique players`);
  console.log('Saving images from browser cache...\n');

  let saved = 0;
  const failedPlayers = [];

  for (const player of uniquePlayers) {
    const safeName = player.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9\s\-']/g, '')
      .replace(/[\s\-']+/g, '_');

    try {
      // Fetch image from browser cache (same as right-click save)
      const dataUrl = await page.evaluate(async (src) => {
        const res = await fetch(src, { cache: 'force-cache' });
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      }, player.src);

      const base64 = dataUrl.replace(/^data:[^;]+;base64,/, '');
      const buffer = Buffer.from(base64, 'base64');
      const filename = `${safeName}.webp`;
      await writeFile(join(OUTPUT_DIR, filename), buffer);
      saved++;
      console.log(`  [${saved}/${uniquePlayers.length}] ${filename}`);
    } catch (err) {
      console.error(`  FAILED: ${player.name} - ${err.message}`);
      failedPlayers.push({ name: player.name, error: err.message });
    }
  }

  if (failedPlayers.length > 0) {
    const failedReport = failedPlayers.map((p) => `${p.name} - ${p.error}`).join('\n');
    await writeFile(join(OUTPUT_DIR, 'failed.txt'), failedReport);
    console.log(`\n  Failed players written to ${OUTPUT_DIR}/failed.txt`);
  }

  console.log(`\nDone!`);
  console.log(`  Saved: ${saved}`);
  console.log(`  Failed: ${failedPlayers.length}`);
  console.log(`  Images saved to: ${OUTPUT_DIR}/`);

  await browser.close();
}

scrapePlayerImages().catch(console.error);
