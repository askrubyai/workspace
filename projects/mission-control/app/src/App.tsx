import { useState, useEffect } from 'react';
import type { View } from './types';
import { Dashboard } from './components/Dashboard';
import { TaskBoard } from './components/TaskBoard';
import { AgentGrid } from './components/AgentGrid';
import { ActivityFeed } from './components/ActivityFeed';
import { ContentPipeline } from './components/ContentPipeline';
import { CalendarView } from './components/CalendarView';
import { MemoryBrowser } from './components/MemoryBrowser';

const navItems: { view: View; label: string; icon: string; key: string }[] = [
  { view: 'dashboard', label: 'Home',     icon: '⚡', key: '1' },
  { view: 'tasks',     label: 'Tasks',    icon: '📋', key: '2' },
  { view: 'content',   label: 'Content',  icon: '📝', key: '3' },
  { view: 'calendar',  label: 'Calendar', icon: '📅', key: '4' },
  { view: 'memory',    label: 'Memory',   icon: '🧠', key: '5' },
  { view: 'agents',    label: 'Team',     icon: '🤖', key: '6' },
];

// Desktop-only nav items (shown in top bar)
const desktopNav = navItems;

// Mobile bottom nav (5 items max)
const mobileNav = [
  navItems[0], // Home
  navItems[1], // Tasks
  navItems[2], // Content
  navItems[3], // Calendar
  navItems[4], // Memory
];

export default function App() {
  const [view, setView] = useState<View>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', String(darkMode));
  }, [darkMode]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLSelectElement) return;

      const item = navItems.find(item => item.key === e.key);
      if (item) { e.preventDefault(); setView(item.view); return; }

      if (e.key === 'd' || e.key === 'D') { e.preventDefault(); setDarkMode(prev => !prev); }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-1/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className="text-xl" role="img" aria-label="Mission Control">🎯</span>
            <h1 className="text-base font-semibold text-text-primary tracking-tight hidden sm:block">Mission Control</h1>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1" role="navigation" aria-label="Main navigation">
            {desktopNav.map(item => (
              <button
                key={item.view}
                onClick={() => setView(item.view)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                  view === item.view
                    ? 'bg-accent/10 text-accent'
                    : 'text-text-muted hover:text-text-secondary hover:bg-surface-2'
                }`}
                aria-current={view === item.view ? 'page' : undefined}
                title={`${item.label} (press ${item.key})`}
              >
                <span role="img" aria-hidden="true">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Team button for mobile */}
            <button
              onClick={() => setView('agents')}
              className={`md:hidden p-2 rounded-lg hover:bg-surface-2 transition-colors ${view === 'agents' ? 'text-accent' : 'text-text-muted'}`}
              aria-label="Team"
              title="Team"
            >
              <span className="text-lg">🤖</span>
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={() => setDarkMode(prev => !prev)}
              className="p-2 rounded-lg hover:bg-surface-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={`Dark mode (press 'd')`}
            >
              <span className="text-lg" role="img" aria-hidden="true">{darkMode ? '☀️' : '🌙'}</span>
            </button>

            {/* Live indicator */}
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" aria-hidden="true" />
              <span className="text-xs text-text-secondary hidden sm:block">Live</span>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-6">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {view === 'dashboard' && <Dashboard onNavigate={setView} />}
          {view === 'tasks'    && <TaskBoard />}
          {view === 'agents'   && <AgentGrid />}
          {view === 'activity' && <ActivityFeed />}
          {view === 'content'  && <ContentPipeline />}
          {view === 'calendar' && <CalendarView />}
          {view === 'memory'   && <MemoryBrowser />}
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1/90 backdrop-blur-xl border-t border-border md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex justify-around py-1.5 px-2">
          {mobileNav.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-lg transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface ${
                view === item.view
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
              aria-label={`${item.label} (press ${item.key})`}
              aria-current={view === item.view ? 'page' : undefined}
            >
              <span className="text-lg" role="img" aria-hidden="true">{item.icon}</span>
              <span className="text-[9px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
