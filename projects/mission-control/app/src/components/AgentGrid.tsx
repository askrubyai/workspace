import { agents, sampleTasks } from '../data';

const statusLabel = {
  active: { text: 'Active', color: 'text-success', bg: 'bg-success/10' },
  idle: { text: 'Idle', color: 'text-text-muted', bg: 'bg-surface-3' },
  blocked: { text: 'Blocked', color: 'text-danger', bg: 'bg-danger/10' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  return `${hrs}h ago`;
}

export function AgentGrid() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">The Squad</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {agents.map(agent => {
          const agentTasks = sampleTasks.filter(t => t.assignee === agent.id && t.status !== 'done');
          const st = statusLabel[agent.status];
          return (
            <div key={agent.id} className="bg-surface-1 rounded-xl p-4 border border-border-subtle">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-lg border border-border flex-shrink-0">
                  {agent.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${st.bg} ${st.color}`}>
                      {st.text}
                    </span>
                  </div>
                  <p className="text-xs text-text-muted mt-0.5">{agent.role}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-text-muted">
                      Last heartbeat: {agent.lastHeartbeat ? timeAgo(agent.lastHeartbeat) : 'Never'}
                    </span>
                    {agentTasks.length > 0 && (
                      <span className="text-[10px] text-accent">{agentTasks.length} task{agentTasks.length > 1 ? 's' : ''}</span>
                    )}
                  </div>
                </div>
              </div>
              {agentTasks.length > 0 && (
                <div className="mt-3 ml-13 space-y-1">
                  {agentTasks.map(task => (
                    <div key={task.id} className="text-xs text-text-secondary flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-info flex-shrink-0" />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
