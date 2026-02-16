#!/usr/bin/env node

/**
 * SYNTHDATA DASHBOARD SCRAPER
 * 
 * Free alternative to SynthData API ($49-199/mo)
 * Scrapes volatility forecasts from https://dashboard.synthdata.co
 * 
 * Usage:
 *   node synthdata-scraper.js                    # Fetch all assets
 *   node synthdata-scraper.js BTC                # Fetch BTC only
 *   node synthdata-scraper.js --json             # Output as JSON
 * 
 * Returns: { BTC: { forecastVol, realizedVol, price, lastFetch }, ... }
 */

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

const CONFIG = {
  dashboardUrl: 'https://dashboard.synthdata.co/insights/volatility',
  loginUrl: 'https://dashboard.synthdata.co/login',
  
  // Credentials (Google OAuth)
  // Option 1: Use existing Chrome profile with logged-in session
  // Option 2: Store session cookies for reuse
  // Option 3: Implement full Google OAuth flow (complex)
  
  sessionCookiesFile: path.join(__dirname, '.synthdata-session.json'),
  
  // Assets we need
  assets: ['BTC', 'ETH', 'SOL'],
  
  // Timeouts
  timeout: 30000,
  navigationTimeout: 60000,
  
  // Output
  outputFormat: 'json', // 'json' or 'log'
  cacheFile: path.join(__dirname, '.synthdata-cache.json'),
  cacheTTL: 5 * 60 * 1000, // 5 minutes
};

// ═══════════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════════

function log(msg) {
  if (CONFIG.outputFormat !== 'json') {
    console.log(`[SynthData] ${msg}`);
  }
}

function loadCache() {
  try {
    if (fs.existsSync(CONFIG.cacheFile)) {
      const cache = JSON.parse(fs.readFileSync(CONFIG.cacheFile, 'utf8'));
      const age = Date.now() - cache.timestamp;
      if (age < CONFIG.cacheTTL) {
        log(`Cache hit (${Math.floor(age / 1000)}s old)`);
        return cache.data;
      }
    }
  } catch (e) {
    log(`Cache read error: ${e.message}`);
  }
  return null;
}

function saveCache(data) {
  try {
    fs.writeFileSync(CONFIG.cacheFile, JSON.stringify({
      timestamp: Date.now(),
      data,
    }, null, 2));
  } catch (e) {
    log(`Cache write error: ${e.message}`);
  }
}

async function saveCookies(page) {
  try {
    const cookies = await page.cookies();
    fs.writeFileSync(CONFIG.sessionCookiesFile, JSON.stringify(cookies, null, 2));
    log('Session cookies saved');
  } catch (e) {
    log(`Cookie save error: ${e.message}`);
  }
}

async function loadCookies(page) {
  try {
    if (fs.existsSync(CONFIG.sessionCookiesFile)) {
      const cookies = JSON.parse(fs.readFileSync(CONFIG.sessionCookiesFile, 'utf8'));
      await page.setCookie(...cookies);
      log('Session cookies loaded');
      return true;
    }
  } catch (e) {
    log(`Cookie load error: ${e.message}`);
  }
  return false;
}

// ═══════════════════════════════════════════════════════════════════════════════
// AUTHENTICATION
// ═══════════════════════════════════════════════════════════════════════════════

async function checkAuthentication(page) {
  try {
    // Check if we're on the login page or if we see auth-protected content
    const url = page.url();
    const title = await page.title();
    
    log(`Current URL: ${url}`);
    log(`Page title: ${title}`);
    
    // If we're on the login page, we need to authenticate
    if (url.includes('/login') || title.includes('Sign In') || title.includes('Log In')) {
      return false;
    }
    
    // Check if the volatility dashboard loaded successfully
    // Look for specific elements that indicate successful load
    const hasVolatilityData = await page.evaluate(() => {
      // Look for data tables, charts, or specific text
      return document.body.innerText.includes('volatility') ||
             document.body.innerText.includes('BTC') ||
             document.querySelector('[data-testid*="volatility"]') !== null;
    });
    
    return hasVolatilityData;
    
  } catch (e) {
    log(`Auth check error: ${e.message}`);
    return false;
  }
}

async function handleGoogleOAuth(page) {
  log('Google OAuth flow required');
  log('NOTE: For automated scraping, you have two options:');
  log('  1. Run this script with HEADLESS=false to manually log in once');
  log('  2. Use an existing Chrome profile that\'s already logged in');
  log('');
  log('Opening browser for manual login...');
  log('Please log in with askruby.ai@gmail.com');
  log('After logging in, the scraper will continue automatically.');
  
  // Wait for successful navigation to dashboard (indicates login success)
  try {
    await page.waitForNavigation({ 
      timeout: 120000, // 2 minutes for manual login
      waitUntil: 'networkidle0'
    });
    
    const authenticated = await checkAuthentication(page);
    if (authenticated) {
      log('Login successful!');
      await saveCookies(page);
      return true;
    } else {
      log('Login may have failed - check manually');
      return false;
    }
  } catch (e) {
    log(`Login timeout or error: ${e.message}`);
    return false;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// SCRAPING
// ═══════════════════════════════════════════════════════════════════════════════

async function scrapeVolatilityData(page) {
  log('Scraping volatility data from dashboard...');
  
  try {
    // Wait for the page to fully load
    await page.waitForSelector('body', { timeout: CONFIG.timeout });
    
    // Extract data from the page
    // This will need to be customized based on the actual dashboard structure
    const data = await page.evaluate((assets) => {
      const result = {};
      
      // Strategy 1: Look for data in the DOM
      // The exact selectors will depend on the dashboard structure
      
      // Strategy 2: Try to access any exposed JavaScript variables or state
      // Some dashboards expose data via window.__ variables
      
      // Strategy 3: Look for JSON data in script tags
      const scriptTags = Array.from(document.querySelectorAll('script'));
      for (const script of scriptTags) {
        const content = script.textContent || '';
        // Look for JSON data patterns
        if (content.includes('volatility') && content.includes('BTC')) {
          try {
            // Try to extract JSON
            const jsonMatch = content.match(/\{[^{}]*"(?:forecast|realized|volatility)"[^{}]*\}/g);
            if (jsonMatch) {
              console.log('Found potential data:', jsonMatch[0].substring(0, 100));
            }
          } catch (e) {}
        }
      }
      
      // Strategy 4: Extract from visible table/chart elements
      // Look for tables, divs, or other elements containing the data
      assets.forEach(asset => {
        // This is a placeholder - needs to be customized based on actual page structure
        const assetData = {
          forecastVol: null,
          realizedVol: null,
          price: null,
          lastFetch: Date.now(),
          source: 'dashboard_scrape',
        };
        
        // Try to find elements containing this asset's data
        const bodyText = document.body.innerText;
        const assetSection = bodyText.match(new RegExp(`${asset}[\\s\\S]{0,500}`, 'i'));
        if (assetSection) {
          // Look for numbers that might be volatility values
          const numbers = assetSection[0].match(/(\d+\.\d+)%?/g);
          if (numbers && numbers.length >= 2) {
            assetData.forecastVol = parseFloat(numbers[0]);
            assetData.realizedVol = parseFloat(numbers[1]);
          }
        }
        
        result[asset] = assetData;
      });
      
      return result;
    }, CONFIG.assets);
    
    log(`Scraped data for ${Object.keys(data).length} assets`);
    return data;
    
  } catch (e) {
    log(`Scraping error: ${e.message}`);
    throw e;
  }
}

async function takeDebugScreenshot(page, name = 'debug') {
  try {
    const screenshotPath = path.join(__dirname, `synthdata-${name}.png`);
    await page.screenshot({ path: screenshotPath, fullPage: true });
    log(`Debug screenshot saved: ${screenshotPath}`);
  } catch (e) {
    log(`Screenshot error: ${e.message}`);
  }
}

async function extractNetworkData(page) {
  log('Monitoring network requests for API calls...');
  
  const apiData = [];
  
  page.on('response', async (response) => {
    const url = response.url();
    
    // Look for API endpoints that might contain volatility data
    if (url.includes('api') || url.includes('volatility') || url.includes('forecast')) {
      try {
        const contentType = response.headers()['content-type'] || '';
        if (contentType.includes('json')) {
          const data = await response.json();
          log(`API Response from ${url.substring(0, 80)}...`);
          apiData.push({ url, data });
        }
      } catch (e) {
        // Not JSON or error reading
      }
    }
  });
  
  return apiData;
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════════

async function main() {
  // Check cache first
  const cached = loadCache();
  if (cached) {
    if (CONFIG.outputFormat === 'json') {
      console.log(JSON.stringify(cached, null, 2));
    }
    return cached;
  }
  
  log('Starting SynthData dashboard scraper...');
  
  // Launch browser
  const headless = process.env.HEADLESS !== 'false';
  log(`Launching browser (headless: ${headless})...`);
  
  const browser = await puppeteer.launch({
    headless,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
    ],
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    
    // Set a reasonable user agent
    await page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
    
    // Try to load existing session
    await loadCookies(page);
    
    // Setup network monitoring
    const networkData = await extractNetworkData(page);
    
    // Navigate to volatility dashboard
    log(`Navigating to ${CONFIG.dashboardUrl}...`);
    await page.goto(CONFIG.dashboardUrl, {
      waitUntil: 'networkidle0',
      timeout: CONFIG.navigationTimeout,
    });
    
    // Take screenshot for debugging
    await takeDebugScreenshot(page, 'initial-load');
    
    // Check if we're authenticated
    const authenticated = await checkAuthentication(page);
    
    if (!authenticated) {
      log('Not authenticated - login required');
      
      // If headless, we can't do manual login
      if (headless) {
        log('ERROR: Headless mode requires pre-existing session cookies');
        log('Run once with HEADLESS=false to log in manually');
        await takeDebugScreenshot(page, 'auth-required');
        process.exit(1);
      }
      
      // Manual login flow
      const loginSuccess = await handleGoogleOAuth(page);
      if (!loginSuccess) {
        log('Authentication failed');
        process.exit(1);
      }
      
      // Navigate again after login
      await page.goto(CONFIG.dashboardUrl, {
        waitUntil: 'networkidle0',
        timeout: CONFIG.navigationTimeout,
      });
      
      await takeDebugScreenshot(page, 'after-login');
    }
    
    // Scrape the data
    const data = await scrapeVolatilityData(page);
    
    // Save to cache
    saveCache(data);
    
    // Output
    if (CONFIG.outputFormat === 'json') {
      console.log(JSON.stringify(data, null, 2));
    } else {
      Object.entries(data).forEach(([asset, info]) => {
        console.log(`${asset}: forecast=${info.forecastVol}% realized=${info.realizedVol}% price=$${info.price}`);
      });
    }
    
    return data;
    
  } catch (e) {
    log(`Fatal error: ${e.message}`);
    console.error(e);
    process.exit(1);
    
  } finally {
    await browser.close();
    log('Browser closed');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
// CLI
// ═══════════════════════════════════════════════════════════════════════════════

if (require.main === module) {
  // Parse CLI args
  if (process.argv.includes('--json')) {
    CONFIG.outputFormat = 'json';
  }
  
  if (process.argv.includes('--no-cache')) {
    if (fs.existsSync(CONFIG.cacheFile)) {
      fs.unlinkSync(CONFIG.cacheFile);
      log('Cache cleared');
    }
  }
  
  // Run
  main().catch(e => {
    console.error('Fatal error:', e);
    process.exit(1);
  });
}

module.exports = { scrapeVolatilityData, CONFIG };
