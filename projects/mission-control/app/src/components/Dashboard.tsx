import { agents } from '../data';
import type { View } from '../types';
import { useWorkingMemory } from '../hooks/useApi';
import { useTasks } from '../hooks/useTasks';

const statusColors = {
  active: 'bg-success',
  idle: 'bg-text-muted',
  blocked: 'bg-danger',
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function Dashboard({ onNavigate }: { onNavigate: (v: View) => void }) {
  const workingData = useWorkingMemory();
  const { tasks, activity, loading, error } = useTasks();
  
  const activeAgents = agents.filter(a => a.status === 'active').length;
  const inProgress = tasks.filter(t => t.status === 'in_progress').length;
  const blocked = tasks.filter(t => t.status === 'blocked').length;
  const done = tasks.filter(t => t.status === 'done').length;

  return (
    <div className="space-y-5">
      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-text-muted">Loading Mission Control...</p>
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
      
      {/* Stats Row */}
      {!loading && (
        <div className="grid grid-cols-2 gap-3">
          <StatCard label="Active Agents" value={`${activeAgents}/${agents.length}`} color="text-success" />
          <StatCard label="In Progress" value={String(inProgress)} color="text-info" />
          <StatCard label="Blocked" value={String(blocked)} color="text-danger" />
          <StatCard label="Completed" value={String(done)} color="text-accent" />
        </div>
      )}

      {/* Squad Status */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Squad Status</h2>
          <button onClick={() => onNavigate('agents')} className="text-xs text-accent">View all →</button>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
          {agents.map(agent => (
            <div key={agent.id} className="flex-shrink-0 flex flex-col items-center gap-1.5">
              <div className="relative">
                <div className="w-11 h-11 rounded-full bg-surface-2 flex items-center justify-center text-lg border border-border">
                  {agent.emoji}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-surface-1 ${statusColors[agent.status]}`} />
              </div>
              <span className="text-[10px] text-text-secondary font-medium">{agent.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Active Tasks */}
      {!loading && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Active Tasks</h2>
            <button onClick={() => onNavigate('tasks')} className="text-xs text-accent">View all →</button>
          </div>
          <div className="space-y-2">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-text-muted text-sm">
                No active tasks found
              </div>
            ) : (
              tasks
                .filter(t => ['in_progress', 'review', 'blocked'].includes(t.status))
                .map(task => (
                  <TaskCard key={task.id} task={task} />
                ))
            )}
          </div>
        </section>
      )}

      {/* Live Working Memory */}
      {workingData && (
        <section>
          <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Live Status</h2>
          <div className="bg-surface-1 rounded-xl p-4 border border-border-subtle">
            <pre className="text-xs text-text-secondary whitespace-pre-wrap leading-relaxed font-mono max-h-48 overflow-y-auto">
              {workingData.working.slice(0, 1500)}
            </pre>
          </div>
        </section>
      )}

      {/* Recent Activity */}
      {!loading && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Recent Activity</h2>
            <button onClick={() => onNavigate('activity')} className="text-xs text-accent">View all →</button>
          </div>
          <div className="space-y-1">
            {activity.length === 0 ? (
              <div className="text-center py-4 text-text-muted text-sm">
                No recent activity
              </div>
            ) : (
              activity.slice(0, 4).map(item => (
                <div key={item.id} className="flex items-start gap-3 py-2 px-3 rounded-lg hover:bg-surface-1 transition-colors">
                  <span className="text-xs text-text-muted mt-0.5 w-12 flex-shrink-0">{timeAgo(item.timestamp)}</span>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-accent">{item.agent}</span>
                    <span className="text-xs text-text-muted mx-1">{item.action}</span>
                    <span className="text-xs text-text-secondary">{item.detail}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-surface-1 rounded-xl p-4 border border-border-subtle">
      <div className={`text-2xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-text-muted mt-1">{label}</div>
    </div>
  );
}

const priorityDot = {
  critical: 'bg-danger',
  high: 'bg-warning',
  medium: 'bg-info',
  low: 'bg-text-muted',
};

const statusBadge = {
  inbox: { bg: 'bg-surface-3', text: 'text-text-muted', label: 'Inbox' },
  assigned: { bg: 'bg-surface-3', text: 'text-text-secondary', label: 'Assigned' },
  in_progress: { bg: 'bg-info/10', text: 'text-info', label: 'In Progress' },
  review: { bg: 'bg-warning/10', text: 'text-warning', label: 'Review' },
  done: { bg: 'bg-success/10', text: 'text-success', label: 'Done' },
  blocked: { bg: 'bg-danger/10', text: 'text-danger', label: 'Blocked' },
};

function TaskCard({ task }: { task: { id: string; title: string; status: string; priority: string; assignee?: string; issueNumber?: string; labels: string[]; description?: string } }) {
  const badge = statusBadge[task.status];
  return (
    <div className="bg-surface-1 rounded-xl p-4 border border-border-subtle active:scale-[0.98] transition-transform">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${priorityDot[task.priority]}`} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              {task.issueNumber && <span className="text-xs text-text-muted font-mono">{task.issueNumber}</span>}
              <h3 className="text-sm font-medium text-text-primary truncate">{task.title}</h3>
            </div>
            {task.assignee && (
              <span className="text-xs text-text-muted mt-1 inline-block">
                {agents.find(a => a.id === task.assignee)?.emoji} {agents.find(a => a.id === task.assignee)?.name}
              </span>
            )}
          </div>
        </div>
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${badge.bg} ${badge.text}`}>
          {badge.label}
        </span>
      </div>
      {task.labels.length > 0 && (
        <div className="flex gap-1.5 mt-2 ml-4">
          {task.labels.map(l => (
            <span key={l} className="text-[10px] px-1.5 py-0.5 rounded bg-surface-2 text-text-muted">{l}</span>
          ))}
        </div>
      )}
    </div>
  );
}
