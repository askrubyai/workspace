import { useState, useEffect } from 'react';
import type { View } from './types';
import { Dashboard } from './components/Dashboard';
import { TaskBoard } from './components/TaskBoard';
import { AgentGrid } from './components/AgentGrid';
import { ActivityFeed } from './components/ActivityFeed';

const navItems: { view: View; label: string; icon: string; key: string }[] = [
  { view: 'dashboard', label: 'Home', icon: '⚡', key: '1' },
  { view: 'tasks', label: 'Tasks', icon: '📋', key: '2' },
  { view: 'agents', label: 'Squad', icon: '🤖', key: '3' },
  { view: 'activity', label: 'Feed', icon: '📡', key: '4' },
];

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    // Initialize from localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Only respond if not typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      // Number keys 1-4 for navigation
      const item = navItems.find(item => item.key === e.key);
      if (item) {
        e.preventDefault();
        setView(item.view);
      }

      // 'd' for dark mode toggle
      if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        setDarkMode(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-1/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl" role="img" aria-label="Target">🎯</span>
            <h1 className="text-lg font-semibold text-text-primary tracking-tight">Mission Control</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-lg hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={`Dark mode ${darkMode ? 'on' : 'off'} (press 'd' to toggle)`}
            >
              <span className="text-lg" role="img" aria-hidden="true">
                {darkMode ? '☀️' : '🌙'}
              </span>
            </button>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
              <span className="text-xs text-text-secondary">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="max-w-5xl mx-auto px-4 py-4">
          {view === 'dashboard' && <Dashboard onNavigate={setView} />}
          {view === 'tasks' && <TaskBoard />}
          {view === 'agents' && <AgentGrid />}
          {view === 'activity' && <ActivityFeed />}
        </div>
      </main>

      {/* Bottom Nav - Mobile First */}
      <nav 
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1/90 backdrop-blur-xl border-t border-border"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-5xl mx-auto flex justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                view === item.view
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              aria-label={`${item.label} (press ${item.key})`}
              aria-current={view === item.view ? 'page' : undefined}
              title={`${item.label} - Press ${item.key}`}
            >
              <span className="text-lg" role="img" aria-hidden="true">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
