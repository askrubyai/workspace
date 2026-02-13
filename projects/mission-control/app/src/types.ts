export interface Agent {
  id: string;
  name: string;
  role: string;
  session: string;
  status: 'active' | 'idle' | 'blocked';
  lastHeartbeat?: string;
  emoji: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'inbox' | 'assigned' | 'in_progress' | 'review' | 'done' | 'blocked';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignee?: string;
  labels: string[];
  createdAt: string;
  updatedAt: string;
  issueNumber?: string;
}

export interface ActivityItem {
  id: string;
  agent: string;
  action: string;
  detail: string;
  timestamp: string;
}

export type View = 'dashboard' | 'tasks' | 'agents' | 'activity' | 'files';
