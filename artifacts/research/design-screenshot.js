const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const SCREENSHOT_DIR = '/Users/ruby/.openclaw/workspace/artifacts/research/design-screenshots';

// Sites to capture for Treppa 60s pools design inspiration
const SITES = [
  // Prediction Markets
  { name: 'kalshi-home', url: 'https://kalshi.com/', description: 'Kalshi - Clean prediction market UI' },
  { name: 'kalshi-markets', url: 'https://kalshi.com/markets', description: 'Kalshi markets listing' },
  { name: 'polymarket-home', url: 'https://polymarket.com/', description: 'Polymarket homepage' },
  
  // Dribbble Design Inspiration
  { name: 'dribbble-betting-app', url: 'https://dribbble.com/tags/betting-app', description: 'Dribbble betting app designs' },
  { name: 'dribbble-gambling-ui', url: 'https://dribbble.com/tags/gambling-ui', description: 'Dribbble gambling UI designs' },
  { name: 'dribbble-gamification', url: 'https://dribbble.com/search/gamification-ui', description: 'Dribbble gamification UI' },
  { name: 'dribbble-dark-trading', url: 'https://dribbble.com/search/dark-trading-app', description: 'Dark trading app designs' },
  
  // Crypto Casinos (aesthetic gambling)
  { name: 'stake-home', url: 'https://stake.com/', description: 'Stake.com - Major crypto casino' },
  { name: 'rollbit-home', url: 'https://rollbit.com/', description: 'Rollbit - Gamified crypto casino' },
  { name: 'roobet-home', url: 'https://roobet.com/', description: 'Roobet - Crypto casino' },
  
  // Trading Platforms (gamified)
  { name: 'robinhood-home', url: 'https://robinhood.com/', description: 'Robinhood - Gamified trading' },
  { name: 'webull-home', url: 'https://www.webull.com/', description: 'Webull trading platform' },
  
  // Sports Betting
  { name: 'fanduel-home', url: 'https://www.fanduel.com/', description: 'FanDuel - Sports betting' },
  { name: 'draftkings-home', url: 'https://www.draftkings.com/', description: 'DraftKings - Sports betting' },
  
  // Horse Racing
  { name: 'tvg-home', url: 'https://www.tvg.com/', description: 'TVG - Horse racing betting' },
  
  // Awwwards Winners (general design)
  { name: 'awwwards-gambling', url: 'https://www.awwwards.com/websites/gambling/', description: 'Award-winning gambling sites' },
  
  // Additional Design Resources
  { name: 'behance-betting', url: 'https://www.behance.net/search/projects?search=betting%20app%20ui', description: 'Behance betting UI projects' },
  { name: 'mobbin-betting', url: 'https://mobbin.com/browse/ios/apps', description: 'Mobbin app UI patterns' },
];

async function captureScreenshots() {
  // Create screenshot directory
  if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  }

  console.log('Launching browser...');
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
      
      // Wait for any animations/loaders
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

  // Generate summary
  const summary = {
    timestamp: new Date().toISOString(),
    total: SITES.length,
    success: results.filter(r => r.status === 'success').length,
    failed: results.filter(r => r.status === 'failed').length,
    results
  };

  fs.writeFileSync(
    path.join(SCREENSHOT_DIR, 'capture-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('\n=== Summary ===');
  console.log(`Total: ${summary.total}`);
  console.log(`Success: ${summary.success}`);
  console.log(`Failed: ${summary.failed}`);
  
  return summary;
}

captureScreenshots().catch(console.error);
