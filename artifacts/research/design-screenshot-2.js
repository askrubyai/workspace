const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = '/Users/ruby/.openclaw/workspace/artifacts/research/design-screenshots';

// Round 2: More specific sites for gamified betting/crash games
const SITES = [
  // Crash Games & Degen Sites
  { name: 'bustabit', url: 'https://bustabit.com/', description: 'Original crash game' },
  { name: 'bc-game', url: 'https://bc.game/', description: 'BC.Game crypto casino' },
  { name: 'csgo-crash', url: 'https://csgoempire.com/', description: 'CS:GO Empire gambling' },
  { name: 'primedice', url: 'https://primedice.com/', description: 'Primedice crypto dice' },
  
  // More Prediction Markets
  { name: 'metaculus', url: 'https://www.metaculus.com/', description: 'Metaculus predictions' },
  { name: 'manifold', url: 'https://manifold.markets/', description: 'Manifold Markets' },
  
  // Specific Dribbble shots
  { name: 'dribbble-crypto-dashboard', url: 'https://dribbble.com/search/crypto-dashboard', description: 'Crypto dashboard designs' },
  { name: 'dribbble-trading-ui', url: 'https://dribbble.com/search/trading-ui-dark', description: 'Dark trading UI designs' },
  { name: 'dribbble-casino', url: 'https://dribbble.com/tags/crypto-casino', description: 'Crypto casino designs' },
  { name: 'dribbble-slots', url: 'https://dribbble.com/search/slots-game-ui', description: 'Slots game UI' },
  
  // Finance Apps with gamification
  { name: 'coinbase', url: 'https://www.coinbase.com/', description: 'Coinbase - clean crypto UI' },
  { name: 'binance', url: 'https://www.binance.com/', description: 'Binance trading' },
  
  // Sports Betting Mobile-first
  { name: 'bet365', url: 'https://www.bet365.com/', description: 'Bet365' },
  { name: 'betfair', url: 'https://www.betfair.com/', description: 'Betfair exchange' },
  
  // Design Inspiration Aggregate
  { name: 'collectui-gambling', url: 'https://collectui.com/challenges/gambling', description: 'CollectUI gambling' },
];

async function captureScreenshots() {
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log('Launching browser (Round 2)...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const results = [];

  for (const site of SITES) {
    console.log(`\nCapturing: ${site.name} (${site.url})`);
    const page = await browser.newPage();
    
    try {
      await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 });
      await page.goto(site.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 2000));
      
      const filepath = path.join(SCREENSHOT_DIR, `${site.name}.png`);
      await page.screenshot({ path: filepath, fullPage: false });
      
      console.log(`  ✓ Saved: ${filepath}`);
      results.push({ ...site, status: 'success', filepath });
      
    } catch (error) {
      console.log(`  ✗ Failed: ${error.message}`);
      results.push({ ...site, status: 'failed', error: error.message });
    }
    
    await page.close();
  }

  await browser.close();

  console.log('\n=== Round 2 Summary ===');
  console.log(`Total: ${SITES.length}`);
  console.log(`Success: ${results.filter(r => r.status === 'success').length}`);
  console.log(`Failed: ${results.filter(r => r.status === 'failed').length}`);
  
  return results;
}

captureScreenshots().catch(console.error);
