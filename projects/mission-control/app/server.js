import express from 'express';
import cors from 'cors';
import { readFileSync, readdirSync, statSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, relative, extname } from 'path';
import { execSync } from 'child_process';

const app = express();
app.use(cors());
app.use(express.json());

const WORKSPACE = '/Users/ruby/.openclaw/workspace';
const DATA_DIR = join(WORKSPACE, 'memory');
const PIPELINE_FILE = join(WORKSPACE, 'memory', 'content-pipeline.json');
const SOCIAL_DIR = join(WORKSPACE, 'artifacts/social');

// ─── Utility ─────────────────────────────────────────────────────────────────

function safePath(base, rel) {
  const full = join(base, rel);
  if (!full.startsWith(base)) throw new Error('forbidden');
  return full;
}

// ─── Existing endpoints ───────────────────────────────────────────────────────

// Read a file
app.get('/api/file', (req, res) => {
  const filePath = req.query.path;
  if (!filePath || typeof filePath !== 'string') return res.status(400).json({ error: 'path required' });
  const full = join(WORKSPACE, filePath);
  if (!full.startsWith(WORKSPACE)) return res.status(403).json({ error: 'forbidden' });
  try {
    const content = readFileSync(full, 'utf-8');
    res.json({ path: filePath, content });
  } catch (e) {
    res.status(404).json({ error: 'not found' });
  }
});

// List directory
app.get('/api/files', (req, res) => {
  const dirPath = req.query.path || '';
  const full = join(WORKSPACE, dirPath);
  if (!full.startsWith(WORKSPACE)) return res.status(403).json({ error: 'forbidden' });
  try {
    const entries = readdirSync(full).filter(f => !f.startsWith('.')).map(name => {
      const fp = join(full, name);
      const stat = statSync(fp);
      return { name, isDirectory: stat.isDirectory(), size: stat.size, modified: stat.mtime.toISOString() };
    });
    res.json({ path: dirPath, entries });
  } catch (e) {
    res.status(404).json({ error: 'not found' });
  }
});

// Get working memory
app.get('/api/status', (req, res) => {
  try {
    const working = readFileSync(join(WORKSPACE, 'memory/WORKING.md'), 'utf-8');
    const memory = existsSync(join(WORKSPACE, 'MEMORY.md'))
      ? readFileSync(join(WORKSPACE, 'MEMORY.md'), 'utf-8')
      : '';

    const agentDirs = ['shuri', 'fury', 'vision', 'loki', 'quill', 'wanda', 'pepper', 'friday', 'wong', 'coordinator'];
    const lessons = {};
    for (const agent of agentDirs) {
      const lf = join(WORKSPACE, `agents/${agent}/lessons-learned.md`);
      if (existsSync(lf)) lessons[agent] = readFileSync(lf, 'utf-8');
    }

    res.json({ working, memory, lessons });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Memory Browser endpoints ─────────────────────────────────────────────────

// List all memory files (flat list, sortable)
app.get('/api/memory/list', (req, res) => {
  try {
    const files = [];

    function walk(dir, base = '') {
      if (!existsSync(dir)) return;
      for (const name of readdirSync(dir)) {
        if (name.startsWith('.')) continue;
        const fp = join(dir, name);
        const rel = base ? `${base}/${name}` : name;
        const stat = statSync(fp);
        if (stat.isDirectory()) {
          walk(fp, rel);
        } else if (['.md', '.txt', '.json'].includes(extname(name))) {
          files.push({
            name,
            path: rel,
            size: stat.size,
            modified: stat.mtime.toISOString(),
            isToday: rel.startsWith(new Date().toISOString().split('T')[0]),
          });
        }
      }
    }

    walk(DATA_DIR);

    // Also include root MEMORY.md and WORKING.md
    for (const rootFile of ['MEMORY.md', 'WORKING.md', 'AGENTS.md']) {
      const fp = join(WORKSPACE, rootFile);
      if (existsSync(fp)) {
        const stat = statSync(fp);
        files.push({
          name: rootFile,
          path: `../${rootFile}`,
          size: stat.size,
          modified: stat.mtime.toISOString(),
          isPinned: true,
        });
      }
    }

    // Sort: pinned first, then by modified desc
    files.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.modified).getTime() - new Date(a.modified).getTime();
    });

    res.json({ files });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Read a memory file
app.get('/api/memory/file', (req, res) => {
  const filePath = req.query.path;
  if (!filePath || typeof filePath !== 'string') return res.status(400).json({ error: 'path required' });

  // Allow memory dir and root workspace files
  let full;
  if (filePath.startsWith('../')) {
    full = join(WORKSPACE, filePath.slice(3));
    if (!full.startsWith(WORKSPACE)) return res.status(403).json({ error: 'forbidden' });
  } else {
    full = join(DATA_DIR, filePath);
    if (!full.startsWith(DATA_DIR)) return res.status(403).json({ error: 'forbidden' });
  }

  try {
    const content = readFileSync(full, 'utf-8');
    const stat = statSync(full);
    res.json({ path: filePath, content, modified: stat.mtime.toISOString() });
  } catch (e) {
    res.status(404).json({ error: 'not found' });
  }
});

// Full-text search across memory files
app.get('/api/memory/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase().trim();
  if (!q) return res.json({ results: [] });

  const results = [];

  function searchFile(filePath, displayPath) {
    try {
      const content = readFileSync(filePath, 'utf-8');
      const lines = content.split('\n');
      const matches = [];
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(q)) {
          matches.push({ line: i + 1, text: lines[i].trim() });
        }
      }
      if (matches.length > 0) {
        const stat = statSync(filePath);
        results.push({
          path: displayPath,
          name: filePath.split('/').pop(),
          matches: matches.slice(0, 5),
          totalMatches: matches.length,
          modified: stat.mtime.toISOString(),
        });
      }
    } catch (_) {}
  }

  function walk(dir, base = '') {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      if (name.startsWith('.')) continue;
      const fp = join(dir, name);
      const rel = base ? `${base}/${name}` : name;
      if (statSync(fp).isDirectory()) {
        walk(fp, rel);
      } else if (['.md', '.txt'].includes(extname(name))) {
        searchFile(fp, rel);
      }
    }
  }

  walk(DATA_DIR);
  searchFile(join(WORKSPACE, 'MEMORY.md'), '../MEMORY.md');
  searchFile(join(WORKSPACE, 'WORKING.md'), '../WORKING.md');

  results.sort((a, b) => b.totalMatches - a.totalMatches);
  res.json({ results: results.slice(0, 20), query: q });
});

// ─── Content Pipeline endpoints ───────────────────────────────────────────────

function getDefaultPipeline() {
  // Pull thread files from /artifacts/social/ for @askrubyai
  const socialFiles = [];
  if (existsSync(SOCIAL_DIR)) {
    for (const f of readdirSync(SOCIAL_DIR)) {
      if (f.endsWith('-thread-final.md') || f.endsWith('-thread.md')) {
        socialFiles.push(f);
      }
    }
  }

  const askrubyCards = [
    { id: 'ar-1', title: 'Day 1: Funding Rate Free Lunch', stage: 'Deployed', assignee: 'Ruby', date: '2026-02-14', preview: 'How funding rates create free lunch opportunities in Polymarket binary options', threadFile: 'day1-funding-rate-thread.md', cronDate: '2026-02-17' },
    { id: 'ar-2', title: 'Day 2: Contrarian Signal Myth-Busting', stage: 'Deployed', assignee: 'Ruby', date: '2026-02-14', preview: 'When the crowd is wrong about being wrong — debunking popular contrarian signals', threadFile: 'day2-contrarian-signal-thread.md', cronDate: '2026-02-18' },
    { id: 'ar-3', title: 'Day 3: Liquidity Cluster Edge', stage: 'Deployed', assignee: 'Ruby', date: '2026-02-15', preview: 'When humans beat bots — reverse-engineering manual trading edges', threadFile: 'day3-liquidity-cluster-thread.md', cronDate: '2026-02-19' },
    { id: 'ar-4', title: 'Day 4: Implied Volatility Extraction', stage: 'Thread Ready', assignee: 'Ruby', date: '2026-02-15', preview: 'Extracting IV from binary options using Black-Scholes inversion', threadFile: 'day4-implied-volatility-thread.md', cronDate: '2026-02-20' },
    { id: 'ar-5', title: 'Day 5: Regime Detector', stage: 'Thread Ready', assignee: 'Ruby', date: '2026-02-16', preview: 'Building a volatility regime detector for crypto binary options', threadFile: 'day5-regime-detector-thread.md', cronDate: '2026-02-23' },
    { id: 'ar-6', title: 'Day 6: Multi-Factor Backtest', stage: 'Thread Ready', assignee: 'Ruby', date: '2026-02-16', preview: 'The moment of truth — backtesting the full pipeline on real BTC data', threadFile: 'day6-backtest-thread.md', cronDate: '2026-02-24' },
    { id: 'ar-7', title: 'Day 7: Paper Trading Bot', stage: 'Thread Ready', assignee: 'Ruby', date: '2026-02-17', preview: 'Building the live paper trading bot with real CLOB integration', threadFile: 'day7-paper-trading-thread.md', cronDate: '2026-02-19' },
    { id: 'ar-8', title: 'Day 8: Kelly Criterion', stage: 'Deployed', assignee: 'Ruby', date: '2026-02-17', preview: 'Kelly criterion for binary options — optimal position sizing', threadFile: 'day8-kelly-criterion-thread.md', cronDate: '2026-02-18' },
    { id: 'ar-9', title: 'Day 9: Signal Filtering', stage: 'Deployed', assignee: 'Ruby', date: '2026-02-18', preview: 'Only trade when the estimated win rate is ≥65% — radical selectivity', threadFile: 'day9-signal-filtering-thread.md', cronDate: '2026-02-19' },
    { id: 'ar-10', title: 'Day 10: Paper Run 2', stage: 'Thread Ready', assignee: 'Ruby', date: '2026-02-18', preview: 'Forensic replay of 28 Run 1 trades through enhanced filter — 94.7% win rate', threadFile: 'day10-paper-run2-thread.md', cronDate: '2026-02-20' },
    { id: 'ar-11', title: 'Day 11: Live Bot Dry Run', stage: 'Thread Ready', assignee: 'Ruby', date: '2026-02-19', preview: 'The dry run that saved $10.49 — uncovering the 10% taker fee problem', threadFile: 'day11-live-trading-thread-final.md', cronDate: '2026-02-21' },
    { id: 'ar-12', title: 'Day 12: Maker Order Redesign', stage: 'Thread Ready', assignee: 'Ruby', date: '2026-02-19', preview: 'The fee flip — from paying 10% to earning rebates with GTC maker orders', threadFile: 'day12-maker-redesign-thread-final.md', cronDate: '2026-02-25' },
    { id: 'ar-13', title: 'Day 13: GTC Paper Run 3', stage: 'Draft', assignee: 'Ruby', date: '', preview: 'Validating the maker order strategy with real paper trading', threadFile: '', cronDate: '' },
    { id: 'ar-idea-1', title: 'Polymarket Market Making Strategy', stage: 'Research', assignee: 'Ruby', date: '', preview: 'Deep dive into automated market making on binary option orderbooks', threadFile: '', cronDate: '' },
  ];

  const reubenceCards = [
    { id: 'rb-1', title: 'jugaad scales to a billion', stage: 'Posted', assignee: 'Reuben', date: '2026-02-02', preview: 'jugaad scales to a billion. bakchodi scales to infinity.' },
    { id: 'rb-2', title: 'exports about to go brrrrrr', stage: 'Posted', assignee: 'Reuben', date: '2026-02-03', preview: 'exports about to go brrrrrr' },
    { id: 'rb-3', title: 'prediction markets x trepa integration', stage: 'Draft', assignee: 'Reuben', date: '', preview: 'something about merging prediction markets with trepa workflows — keep it low-key absurdist' },
    { id: 'rb-4', title: 'requestAnimationFrame enlightenment', stage: 'Ready', assignee: 'Reuben', date: '', preview: 'i understand requestAnimationFrame on a spiritual level now. this is not a flex.' },
    { id: 'rb-idea-1', title: 'AI agents doing your taxes LARP', stage: 'Idea', assignee: 'Reuben', date: '', preview: 'something about agents LARPing as accountants — absurdist angle' },
    { id: 'rb-idea-2', title: 'superteam vibes check', stage: 'Idea', assignee: 'Reuben', date: '', preview: 'community hype + subtle flex, all lowercase, sub-10 words' },
  ];

  return {
    askrubyai: {
      stages: ['Idea', 'Research', 'Draft', 'Editorial Review', 'Published', 'Thread Ready', 'Deployed'],
      cards: askrubyCards,
    },
    reubence: {
      stages: ['Idea', 'Draft', 'Ready', 'Posted'],
      cards: reubenceCards,
    },
    lastUpdated: new Date().toISOString(),
  };
}

app.get('/api/content/pipeline', (req, res) => {
  try {
    if (existsSync(PIPELINE_FILE)) {
      const data = JSON.parse(readFileSync(PIPELINE_FILE, 'utf-8'));
      // Check for thread files that exist in social dir
      if (existsSync(SOCIAL_DIR)) {
        const socialFiles = readdirSync(SOCIAL_DIR);
        for (const card of data.askrubyai.cards) {
          if (card.threadFile) {
            card.threadExists = socialFiles.includes(card.threadFile);
          }
        }
      }
      return res.json(data);
    }
    const defaultData = getDefaultPipeline();
    writeFileSync(PIPELINE_FILE, JSON.stringify(defaultData, null, 2));
    res.json(defaultData);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/content/pipeline', (req, res) => {
  try {
    const data = req.body;
    data.lastUpdated = new Date().toISOString();
    writeFileSync(PIPELINE_FILE, JSON.stringify(data, null, 2));
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Add a new card
app.post('/api/content/pipeline/card', (req, res) => {
  try {
    const { board, card } = req.body;
    let data;
    if (existsSync(PIPELINE_FILE)) {
      data = JSON.parse(readFileSync(PIPELINE_FILE, 'utf-8'));
    } else {
      data = getDefaultPipeline();
    }
    if (!data[board]) return res.status(400).json({ error: 'invalid board' });
    card.id = `${board}-${Date.now()}`;
    card.date = card.date || new Date().toISOString().split('T')[0];
    data[board].cards.push(card);
    data.lastUpdated = new Date().toISOString();
    writeFileSync(PIPELINE_FILE, JSON.stringify(data, null, 2));
    res.json({ ok: true, card });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Calendar endpoints ───────────────────────────────────────────────────────

app.get('/api/calendar/events', (req, res) => {
  try {
    // Get cron jobs from openclaw
    let cronJobs = [];
    try {
      const output = execSync('openclaw cron list 2>/dev/null', {
        encoding: 'utf-8',
        timeout: 8000,
        shell: '/bin/zsh',
      });

      // The openclaw cron list output has a header line with column positions
      // Format: UUID  Name  Schedule  Next  Last  Status  Target  Agent
      const lines = output.split('\n');
      if (lines.length < 2) throw new Error('no output');

      // Find header line to get column positions
      const headerLine = lines.find(l => l.startsWith('ID'));
      if (!headerLine) throw new Error('no header');

      const colPositions = {
        id: 0,
        name: headerLine.indexOf('Name'),
        schedule: headerLine.indexOf('Schedule'),
        next: headerLine.indexOf('Next'),
        last: headerLine.indexOf('Last'),
        status: headerLine.indexOf('Status'),
        target: headerLine.indexOf('Target'),
        agent: headerLine.indexOf('Agent'),
      };

      // UUID pattern: 8-4-4-4-12 hex chars
      const uuidRe = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i;

      for (const line of lines) {
        if (!uuidRe.test(line.trim())) continue;
        const trimmed = line.trimStart();

        const extract = (start, end) => {
          if (start < 0) return '';
          const s = line.substring(start, end > 0 ? end : undefined).trim();
          return s;
        };

        cronJobs.push({
          id: extract(colPositions.id, colPositions.name),
          name: extract(colPositions.name, colPositions.schedule),
          schedule: extract(colPositions.schedule, colPositions.next),
          next: extract(colPositions.next, colPositions.last),
          last: extract(colPositions.last, colPositions.status),
          status: extract(colPositions.status, colPositions.target),
        });
      }
    } catch (_) {
      // openclaw cron list failed, use hardcoded from WORKING.md context
      cronJobs = [
        { id: 'efb8d151', name: 'Quant Research Session', schedule: 'cron 30 1 * * * @ Asia/Calcutta', next: 'in 9h', last: '3d ago', status: 'ok' },
        { id: 'b71a6e79', name: 'Quant Research (Afternoon)', schedule: 'cron 0 15 * * * @ Asia/Calcutta', next: 'in 23h', last: '1h ago', status: 'ok' },
        { id: 'c8e1d100', name: 'Daily Standup', schedule: 'cron 30 23 * * * @ Asia/Calcutta', next: 'in 7h', last: '17h ago', status: 'ok' },
        { id: 'c8375638', name: 'Morning Routine Reminder', schedule: 'cron 30 8 * * * @ Asia/Calcutta', next: 'in 16h', last: '8h ago', status: 'ok' },
        { id: '8aff3129', name: 'Session Cleanup', schedule: 'cron 0 */6 * * * @ Asia/Calcutta', next: 'in 2h', last: '4h ago', status: 'ok' },
        { id: 'aeff46b9', name: 'Rate Limit Monitor', schedule: 'cron 0 */6 * * * @ Asia/Calcutta', next: 'in 2h', last: '4h ago', status: 'ok' },
        { id: '1c592938', name: 'GitHub Workspace Auto-sync', schedule: 'cron 0 */4 * * * @ Asia/Calcutta', next: 'in 3h', last: '1h ago', status: 'ok' },
        { id: '2a2b8105', name: 'Mission Control Sync', schedule: 'cron 0,30 * * * * @ Asia/Calcutta', next: 'in 15m', last: '30m ago', status: 'ok' },
      ];
    }

    // Static recurring events
    const recurringEvents = [
      { id: 'research-am', type: 'research', title: 'Quant Research Session', schedule: 'cron 30 1 * * *', time: '01:30', color: 'blue', recurring: true },
      { id: 'research-pm', type: 'research', title: 'Quant Research (Afternoon)', schedule: 'cron 0 15 * * *', time: '15:00', color: 'blue', recurring: true },
      { id: 'standup', type: 'reminder', title: 'Daily Standup Report', schedule: 'cron 30 23 * * *', time: '23:30', color: 'yellow', recurring: true },
      { id: 'morning-routine', type: 'reminder', title: 'Morning Routine Reminder', schedule: 'cron 30 8 * * *', time: '08:30', color: 'yellow', recurring: true },
    ];

    // Upcoming thread deployments from pipeline
    const threadEvents = [];
    if (existsSync(PIPELINE_FILE)) {
      const pipeline = JSON.parse(readFileSync(PIPELINE_FILE, 'utf-8'));
      for (const card of (pipeline.askrubyai?.cards || [])) {
        if (card.cronDate && card.stage !== 'Deployed') {
          threadEvents.push({
            id: `thread-${card.id}`,
            type: 'social',
            title: `🐦 ${card.title}`,
            date: card.cronDate,
            color: 'green',
          });
        }
      }
    }

    // Upcoming events (hardcoded from WORKING.md context)
    const upcomingEvents = [
      { id: 'visa-bio', type: 'event', title: '🛂 Visa Biometrics — US Consulate Mumbai', date: '2026-02-19', time: '12:00', color: 'red', detail: 'Bring passport, DS-160, appointment letter, photos' },
      { id: 'podcast', type: 'event', title: '🎙️ Astralane Podcast (TBD)', date: '', color: 'red', detail: 'Confirm slot with Sujith/Kirat/Paarug' },
    ];

    res.json({
      cronJobs,
      recurringEvents,
      threadEvents,
      upcomingEvents,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

app.listen(5175, () => console.log('Mission Control API on http://localhost:5175'));
