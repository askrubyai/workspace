import { useState } from 'react';
import type { View } from './types';
import { Dashboard } from './components/Dashboard';
import { TaskBoard } from './components/TaskBoard';
import { AgentGrid } from './components/AgentGrid';
import { ActivityFeed } from './components/ActivityFeed';

const navItems: { view: View; label: string; icon: string }[] = [
  { view: 'dashboard', label: 'Home', icon: '⚡' },
  { view: 'tasks', label: 'Tasks', icon: '📋' },
  { view: 'agents', label: 'Squad', icon: '🤖' },
  { view: 'activity', label: 'Feed', icon: '📡' },
];

export default function App() {
  const [view, setView] = useState<View>('dashboard');

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface-1/80 backdrop-blur-xl border-b border-border px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎯</span>
            <h1 className="text-lg font-semibold text-text-primary tracking-tight">Mission Control</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs text-text-secondary">Live</span>
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
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface-1/90 backdrop-blur-xl border-t border-border">
        <div className="max-w-5xl mx-auto flex justify-around py-2">
          {navItems.map((item) => (
            <button
              key={item.view}
              onClick={() => setView(item.view)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg transition-all ${
                view === item.view
                  ? 'text-accent'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
