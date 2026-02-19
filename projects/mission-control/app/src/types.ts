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

// Content Pipeline types
export interface PipelineCard {
  id: string;
  title: string;
  stage: string;
  assignee: string;
  date: string;
  preview: string;
  threadFile?: string;
  threadExists?: boolean;
  cronDate?: string;
  tags?: string[];
}

export interface PipelineBoard {
  stages: string[];
  cards: PipelineCard[];
}

export interface PipelineData {
  askrubyai: PipelineBoard;
  reubence: PipelineBoard;
  lastUpdated: string;
}

// Calendar types
export interface CalendarEvent {
  id: string;
  type: 'research' | 'social' | 'reminder' | 'event' | 'cron';
  title: string;
  date?: string;
  time?: string;
  schedule?: string;
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  detail?: string;
  recurring?: boolean;
}

// Memory types
export interface MemoryFile {
  name: string;
  path: string;
  size: number;
  modified: string;
  isPinned?: boolean;
  isToday?: boolean;
}

export type View = 'dashboard' | 'tasks' | 'agents' | 'activity' | 'content' | 'calendar' | 'memory';
