import express from 'express';
import cors from 'cors';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative } from 'path';

const app = express();
app.use(cors());
app.use(express.json());

const WORKSPACE = '/Users/ruby/.openclaw/workspace';

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
    const memory = readFileSync(join(WORKSPACE, 'MEMORY.md'), 'utf-8');
    
    // Read agent lessons
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

app.listen(5175, () => console.log('Mission Control API on http://localhost:5175'));
