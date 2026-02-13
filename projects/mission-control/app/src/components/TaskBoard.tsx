import { useState } from 'react';
import { agents } from '../data';
import type { Task } from '../types';
import { useTasks } from '../hooks/useTasks';

const columns = [
  { key: 'inbox', label: 'Inbox', icon: '📥' },
  { key: 'in_progress', label: 'In Progress', icon: '🔄' },
  { key: 'review', label: 'Review', icon: '👀' },
  { key: 'blocked', label: 'Blocked', icon: '🚫' },
  { key: 'done', label: 'Done', icon: '✅' },
] as const;

const priorityDot: Record<string, string> = {
  critical: 'bg-danger',
  high: 'bg-warning',
  medium: 'bg-info',
  low: 'bg-text-muted',
};

export function TaskBoard() {
  const [filter, setFilter] = useState<string>('all');
  const { tasks, loading, error } = useTasks();

  const filteredTasks = filter === 'all' ? tasks : tasks.filter(t => t.status === filter);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Tasks</h2>
      
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-text-muted">Loading tasks...</p>
          </div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-danger/10 border border-danger/20 rounded-xl p-4">
          <p className="text-sm text-danger font-medium">⚠️ Error loading tasks</p>
          <p className="text-xs text-text-muted mt-1">{error}</p>
        </div>
      )}
      
      {/* Filter chips - horizontal scroll on mobile */}
      {!loading && !error && (
        <>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            <FilterChip active={filter === 'all'} onClick={() => setFilter('all')} label="All" count={tasks.length} />
            {columns.map(col => (
              <FilterChip
                key={col.key}
                active={filter === col.key}
                onClick={() => setFilter(col.key)}
                label={col.label}
                count={tasks.filter(t => t.status === col.key).length}
                icon={col.icon}
              />
            ))}
          </div>

          {/* Task list (mobile-friendly vertical list) */}
          <div className="space-y-2">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 text-text-muted">No tasks here</div>
            ) : (
              filteredTasks.map(task => <TaskRow key={task.id} task={task} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}

function FilterChip({ active, onClick, label, count, icon }: { active: boolean; onClick: () => void; label: string; count: number; icon?: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
        active
          ? 'bg-accent text-white'
          : 'bg-surface-2 text-text-secondary hover:bg-surface-3'
      }`}
    >
      {icon && <span className="text-xs">{icon}</span>}
      {label}
      <span className={`ml-0.5 ${active ? 'text-white/70' : 'text-text-muted'}`}>{count}</span>
    </button>
  );
}

function TaskRow({ task }: { task: Task }) {
  const [expanded, setExpanded] = useState(false);
  const assignee = agents.find(a => a.id === task.assignee);

  return (
    <div
      className="bg-surface-1 rounded-xl border border-border-subtle overflow-hidden transition-all"
      onClick={() => setExpanded(!expanded)}
    >
      <div className="p-4 flex items-start gap-3">
        <span className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${priorityDot[task.priority]}`} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs text-text-muted font-mono">{task.issueNumber}</span>
            <h3 className="text-sm font-medium text-text-primary">{task.title}</h3>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            {assignee && (
              <span className="text-xs text-text-muted">{assignee.emoji} {assignee.name}</span>
            )}
            <div className="flex gap-1">
              {task.labels.map(l => (
                <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-text-muted">{l}</span>
              ))}
            </div>
          </div>
        </div>
        <span className="text-text-muted text-xs">{expanded ? '▲' : '▼'}</span>
      </div>
      {expanded && task.description && (
        <div className="px-4 pb-4 pt-0 ml-5">
          <p className="text-xs text-text-secondary leading-relaxed">{task.description}</p>
          <div className="flex gap-2 mt-3">
            <ActionButton label="Start" icon="▶" />
            <ActionButton label="Assign" icon="👤" />
            <ActionButton label="Priority" icon="⬆" />
          </div>
        </div>
      )}
    </div>
  );
}

function ActionButton({ label, icon }: { label: string; icon: string }) {
  return (
    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-2 text-xs text-text-secondary hover:bg-surface-3 transition-colors">
      <span>{icon}</span> {label}
    </button>
  );
}
