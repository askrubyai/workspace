import { useState, useEffect } from 'react';

const API = 'http://localhost:5175';

export function useWorkingMemory() {
  const [data, setData] = useState<{ working: string; memory: string } | null>(null);
  
  useEffect(() => {
    fetch(`${API}/api/status`)
      .then(r => r.json())
      .then(setData)
      .catch(() => {});
    
    const interval = setInterval(() => {
      fetch(`${API}/api/status`)
        .then(r => r.json())
        .then(setData)
        .catch(() => {});
    }, 30000); // refresh every 30s
    
    return () => clearInterval(interval);
  }, []);
  
  return data;
}

export function useFile(path: string) {
  const [content, setContent] = useState<string | null>(null);
  
  useEffect(() => {
    if (!path) return;
    fetch(`${API}/api/file?path=${encodeURIComponent(path)}`)
      .then(r => r.json())
      .then(d => setContent(d.content))
      .catch(() => {});
  }, [path]);
  
  return content;
}

export function useFiles(dirPath: string) {
  const [entries, setEntries] = useState<Array<{ name: string; isDirectory: boolean; size: number; modified: string }>>([]);
  
  useEffect(() => {
    fetch(`${API}/api/files?path=${encodeURIComponent(dirPath)}`)
      .then(r => r.json())
      .then(d => setEntries(d.entries || []))
      .catch(() => {});
  }, [dirPath]);
  
  return entries;
}
