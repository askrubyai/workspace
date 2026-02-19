import { useState, useEffect, useCallback, useMemo } from 'react';
import type { MemoryFile } from '../types';

const API = '';

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

// Simple markdown renderer (no dependency)
function MarkdownContent({ content }: { content: string }) {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeLines: string[] = [];
  let keyCounter = 0;

  function key() { return `md-${keyCounter++}`; }

  function inlineFormat(text: string): React.ReactNode {
    // Handle **bold**, *italic*, `code`, [link](url)
    const parts: React.ReactNode[] = [];
    const re = /(\*\*(.+?)\*\*|\*(.+?)\*|`([^`]+)`|\[([^\]]+)\]\(([^)]+)\))/g;
    let lastIdx = 0;
    let m: RegExpExecArray | null;

    while ((m = re.exec(text)) !== null) {
      if (m.index > lastIdx) parts.push(text.slice(lastIdx, m.index));
      if (m[2]) parts.push(<strong key={key()} className="font-semibold text-text-primary">{m[2]}</strong>);
      else if (m[3]) parts.push(<em key={key()} className="italic">{m[3]}</em>);
      else if (m[4]) parts.push(<code key={key()} className="bg-surface-3 text-accent px-1 py-0.5 rounded text-xs font-mono">{m[4]}</code>);
      else if (m[5]) parts.push(<a key={key()} href={m[6]} target="_blank" rel="noreferrer" className="text-accent underline hover:text-accent-hover">{m[5]}</a>);
      lastIdx = re.lastIndex;
    }
    if (lastIdx < text.length) parts.push(text.slice(lastIdx));
    return parts.length > 0 ? parts : text;
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block
    if (line.startsWith('```')) {
      if (inCodeBlock) {
        elements.push(
          <pre key={key()} className="bg-surface-3 border border-border rounded-lg p-3 my-2 overflow-x-auto text-xs font-mono text-text-secondary">
            <code>{codeLines.join('\n')}</code>
          </pre>
        );
        inCodeBlock = false;
        codeLines = [];
      } else {
        inCodeBlock = true;
        // language tag ignored for now
      }
      continue;
    }

    if (inCodeBlock) {
      codeLines.push(line);
      continue;
    }

    // Headings
    if (line.startsWith('# ')) {
      elements.push(<h1 key={key()} className="text-2xl font-bold text-text-primary mt-6 mb-3 pb-2 border-b border-border">{inlineFormat(line.slice(2))}</h1>);
    } else if (line.startsWith('## ')) {
      elements.push(<h2 key={key()} className="text-xl font-semibold text-text-primary mt-5 mb-2">{inlineFormat(line.slice(3))}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key()} className="text-base font-semibold text-text-secondary mt-4 mb-1.5">{inlineFormat(line.slice(4))}</h3>);
    } else if (line.startsWith('#### ')) {
      elements.push(<h4 key={key()} className="text-sm font-semibold text-text-muted mt-3 mb-1">{inlineFormat(line.slice(5))}</h4>);
    }
    // Horizontal rule
    else if (line.match(/^---+$/) || line.match(/^===+$/)) {
      elements.push(<hr key={key()} className="border-border my-4" />);
    }
    // Blockquote
    else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key()} className="border-l-4 border-accent pl-3 my-2 text-text-secondary italic text-sm">
          {inlineFormat(line.slice(2))}
        </blockquote>
      );
    }
    // List items
    else if (line.match(/^[-*+]\s/) || line.match(/^  [-*+]\s/)) {
      const indent = line.match(/^  /) ? 'ml-4' : '';
      elements.push(
        <li key={key()} className={`flex gap-2 text-sm text-text-secondary my-0.5 ${indent}`}>
          <span className="text-accent mt-1 flex-shrink-0">•</span>
          <span>{inlineFormat(line.replace(/^  ?[-*+]\s/, ''))}</span>
        </li>
      );
    }
    // Numbered list
    else if (line.match(/^\d+\.\s/)) {
      elements.push(
        <li key={key()} className="flex gap-2 text-sm text-text-secondary my-0.5">
          <span className="text-accent font-mono text-xs mt-1 flex-shrink-0">{line.match(/^(\d+)\./)?.[1]}.</span>
          <span>{inlineFormat(line.replace(/^\d+\.\s/, ''))}</span>
        </li>
      );
    }
    // Checkbox
    else if (line.match(/^- \[[ x]\]/i)) {
      const checked = line.includes('[x]') || line.includes('[X]');
      const text = line.replace(/^- \[[ xX]\]\s*/, '');
      elements.push(
        <li key={key()} className="flex gap-2 text-sm my-0.5">
          <span className={`flex-shrink-0 mt-0.5 text-base ${checked ? 'text-success' : 'text-text-muted'}`}>{checked ? '✅' : '☐'}</span>
          <span className={checked ? 'text-text-muted line-through' : 'text-text-secondary'}>{inlineFormat(text)}</span>
        </li>
      );
    }
    // Empty line
    else if (line.trim() === '') {
      elements.push(<div key={key()} className="my-1.5" />);
    }
    // Regular paragraph
    else {
      elements.push(
        <p key={key()} className="text-sm text-text-secondary leading-relaxed">
          {inlineFormat(line)}
        </p>
      );
    }
  }

  return <div className="space-y-0.5">{elements}</div>;
}

interface SearchResult {
  path: string;
  name: string;
  matches: { line: number; text: string }[];
  totalMatches: number;
  modified: string;
}

export function MemoryBrowser() {
  const [files, setFiles] = useState<MemoryFile[]>([]);
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [fileModified, setFileModified] = useState<string>('');
  const [loadingFile, setLoadingFile] = useState(false);
  const [loadingList, setLoadingList] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [activeTab, setActiveTab] = useState<'browse' | 'search'>('browse');
  const [filterTag, setFilterTag] = useState<'all' | 'pinned' | 'today' | 'daily' | 'lessons'>('all');

  // Load file list
  useEffect(() => {
    setLoadingList(true);
    fetch(`${API}/api/memory/list`)
      .then(r => r.json())
      .then(d => { setFiles(d.files || []); setLoadingList(false); })
      .catch(() => setLoadingList(false));
  }, []);

  // Load file content
  const openFile = useCallback(async (path: string) => {
    setSelectedPath(path);
    setLoadingFile(true);
    setFileContent('');
    try {
      const r = await fetch(`${API}/api/memory/file?path=${encodeURIComponent(path)}`);
      const d = await r.json();
      setFileContent(d.content || '');
      setFileModified(d.modified || '');
    } catch {
      setFileContent('*Error reading file*');
    }
    setLoadingFile(false);
  }, []);

  // Search
  const runSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setSearchResults([]); return; }
    setSearching(true);
    try {
      const r = await fetch(`${API}/api/memory/search?q=${encodeURIComponent(q)}`);
      const d = await r.json();
      setSearchResults(d.results || []);
    } catch {
      setSearchResults([]);
    }
    setSearching(false);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => { if (searchQuery) runSearch(searchQuery); else setSearchResults([]); }, 300);
    return () => clearTimeout(t);
  }, [searchQuery, runSearch]);

  // Filtered files
  const filteredFiles = useMemo(() => {
    return files.filter(f => {
      if (filterTag === 'pinned') return f.isPinned;
      if (filterTag === 'today') return f.isToday || (new Date(f.modified).toDateString() === new Date().toDateString());
      if (filterTag === 'daily') return /^\d{4}-\d{2}-\d{2}/.test(f.name) && !f.isPinned;
      if (filterTag === 'lessons') return f.name.includes('lesson') || f.name.includes('MEMORY') || f.name.includes('WORKING') || f.name.includes('SELF');
      return true;
    });
  }, [files, filterTag]);

  const colorForFile = (f: MemoryFile) => {
    if (f.isPinned) return 'text-warning';
    if (f.isToday || new Date(f.modified).toDateString() === new Date().toDateString()) return 'text-success';
    if (/lessons/.test(f.name)) return 'text-accent';
    return 'text-text-muted';
  };

  const iconForFile = (f: MemoryFile) => {
    if (f.isPinned) return '📌';
    if (f.name === 'WORKING.md') return '⚡';
    if (f.name === 'MEMORY.md') return '🧠';
    if (f.name === 'AGENTS.md') return '🤖';
    if (/lessons/.test(f.name)) return '📚';
    if (/\d{4}-\d{2}-\d{2}/.test(f.name)) return '📅';
    if (/standup/.test(f.name)) return '📊';
    if (/rate-limit/.test(f.name)) return '⚠️';
    return '📄';
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-surface-1 rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-text-primary flex items-center gap-2">
              <span>🧠</span> Memory Browser
            </h2>
            <p className="text-xs text-text-muted mt-0.5">{files.length} files · Full-text search across all memory</p>
          </div>

          {/* Tab toggle */}
          <div className="flex bg-surface-2 rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('browse')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'browse' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-secondary'}`}
            >
              Browse
            </button>
            <button
              onClick={() => { setActiveTab('search'); }}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${activeTab === 'search' ? 'bg-accent text-white' : 'text-text-muted hover:text-text-secondary'}`}
            >
              Search
            </button>
          </div>
        </div>

        {/* Search bar */}
        {activeTab === 'search' && (
          <div className="mt-3">
            <input
              type="text"
              placeholder="Search across all memory files..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-muted focus:outline-none focus:border-accent"
              autoFocus
            />
          </div>
        )}

        {/* Filter tags */}
        {activeTab === 'browse' && (
          <div className="flex gap-2 mt-3 flex-wrap">
            {(['all', 'pinned', 'today', 'daily', 'lessons'] as const).map(tag => (
              <button
                key={tag}
                onClick={() => setFilterTag(tag)}
                className={`px-2.5 py-1 text-xs rounded-full border transition-all capitalize ${
                  filterTag === tag
                    ? 'bg-accent border-accent text-white'
                    : 'border-border text-text-muted hover:border-accent hover:text-accent'
                }`}
              >
                {tag === 'all' ? `All (${files.length})` : tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* File list */}
        <div className="lg:col-span-2 bg-surface-1 rounded-xl border border-border overflow-hidden">
          <div className="p-3 border-b border-border">
            <span className="text-xs text-text-muted font-medium uppercase tracking-wider">
              {activeTab === 'search' ? 'Search Results' : 'Files'}
            </span>
          </div>

          <div className="overflow-y-auto max-h-[60vh]">
            {activeTab === 'search' ? (
              // Search results
              <div>
                {searching && (
                  <div className="flex items-center justify-center py-8 text-text-muted text-sm gap-2">
                    <span className="animate-spin">⟳</span> Searching…
                  </div>
                )}
                {!searching && searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-8 text-text-muted text-sm">No results for "{searchQuery}"</div>
                )}
                {!searching && searchResults.map(result => (
                  <button
                    key={result.path}
                    onClick={() => { openFile(result.path); setActiveTab('browse'); }}
                    className={`w-full text-left p-3 border-b border-border-subtle hover:bg-surface-2 transition-colors ${selectedPath === result.path ? 'bg-surface-2 border-l-2 border-l-accent' : ''}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium text-text-primary truncate">{result.name}</div>
                        <div className="text-xs text-text-muted mt-0.5">{result.totalMatches} match{result.totalMatches !== 1 ? 'es' : ''} · {timeAgo(result.modified)}</div>
                        {result.matches.slice(0, 2).map((m, i) => (
                          <div key={i} className="text-xs text-text-secondary mt-1 truncate font-mono">
                            <span className="text-warning">L{m.line}:</span> {m.text.slice(0, 60)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
                {!searchQuery && (
                  <div className="text-center py-8 text-text-muted text-sm">Type to search…</div>
                )}
              </div>
            ) : (
              // Browse mode
              <div>
                {loadingList && (
                  <div className="flex items-center justify-center py-8 text-text-muted text-sm gap-2">
                    <span className="animate-spin">⟳</span> Loading…
                  </div>
                )}
                {filteredFiles.map(file => {
                  const isSelected = selectedPath === file.path;
                  const isRecent = new Date(file.modified).toDateString() === new Date().toDateString();
                  return (
                    <button
                      key={file.path}
                      onClick={() => openFile(file.path)}
                      className={`w-full text-left p-3 border-b border-border-subtle hover:bg-surface-2 transition-colors ${isSelected ? 'bg-surface-2 border-l-2 border-l-accent' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-base flex-shrink-0">{iconForFile(file)}</span>
                        <div className="min-w-0 flex-1">
                          <div className={`text-xs font-medium truncate ${isSelected ? 'text-accent' : 'text-text-primary'}`}>
                            {file.name}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className={`text-[10px] ${colorForFile(file)}`}>{timeAgo(file.modified)}</span>
                            <span className="text-[10px] text-text-muted">{formatSize(file.size)}</span>
                            {isRecent && !file.isPinned && (
                              <span className="text-[10px] bg-success/20 text-success px-1 py-0.5 rounded">new</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* File content viewer */}
        <div className="lg:col-span-3 bg-surface-1 rounded-xl border border-border overflow-hidden flex flex-col">
          {selectedPath ? (
            <>
              {/* Doc header */}
              <div className="p-3 border-b border-border flex items-center justify-between gap-2 bg-surface-2">
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary truncate">{selectedPath.split('/').pop()}</div>
                  {fileModified && (
                    <div className="text-xs text-text-muted">Modified {timeAgo(fileModified)}</div>
                  )}
                </div>
                <button
                  onClick={() => { setSelectedPath(null); setFileContent(''); }}
                  className="text-text-muted hover:text-text-primary text-lg px-1"
                  aria-label="Close"
                >✕</button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 max-h-[65vh]">
                {loadingFile ? (
                  <div className="flex items-center justify-center h-32 text-text-muted gap-2">
                    <span className="animate-spin text-xl">⟳</span>
                    <span className="text-sm">Loading…</span>
                  </div>
                ) : (
                  <MarkdownContent content={fileContent} />
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-text-muted gap-3">
              <span className="text-4xl opacity-30">📄</span>
              <div className="text-sm">Select a file to view</div>
              <div className="text-xs text-text-muted">Or use Search to find content</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
