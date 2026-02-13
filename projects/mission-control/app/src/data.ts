import type { Agent, Task, ActivityItem } from './types';

export const agents: Agent[] = [
  { id: 'ruby', name: 'Ruby', role: 'Squad Lead & Strategic Coordinator', session: 'agent:main:main', status: 'active', emoji: '💎', color: '#ef4444', lastHeartbeat: new Date().toISOString() },
  { id: 'shuri', name: 'Shuri', role: 'Product Analyst', session: 'agent:product-analyst:main', status: 'idle', emoji: '🔬', color: '#a855f7', lastHeartbeat: new Date(Date.now() - 120000).toISOString() },
  { id: 'fury', name: 'Fury', role: 'Customer Researcher', session: 'agent:customer-researcher:main', status: 'idle', emoji: '🕵️', color: '#6366f1', lastHeartbeat: new Date(Date.now() - 300000).toISOString() },
  { id: 'vision', name: 'Vision', role: 'SEO Analyst', session: 'agent:seo-analyst:main', status: 'idle', emoji: '👁️', color: '#22c55e', lastHeartbeat: new Date(Date.now() - 480000).toISOString() },
  { id: 'loki', name: 'Loki', role: 'Content Writer', session: 'agent:content-writer:main', status: 'idle', emoji: '✍️', color: '#eab308', lastHeartbeat: new Date(Date.now() - 360000).toISOString() },
  { id: 'quill', name: 'Quill', role: 'Social Media Manager', session: 'agent:social-media-manager:main', status: 'idle', emoji: '🐦', color: '#06b6d4', lastHeartbeat: new Date(Date.now() - 720000).toISOString() },
  { id: 'wanda', name: 'Wanda', role: 'Designer', session: 'agent:designer:main', status: 'idle', emoji: '🎨', color: '#ec4899', lastHeartbeat: new Date(Date.now() - 420000).toISOString() },
  { id: 'pepper', name: 'Pepper', role: 'Email Marketing', session: 'agent:email-marketing:main', status: 'idle', emoji: '📧', color: '#f97316', lastHeartbeat: new Date(Date.now() - 600000).toISOString() },
  { id: 'friday', name: 'Friday', role: 'Developer', session: 'agent:developer:main', status: 'idle', emoji: '💻', color: '#14b8a6', lastHeartbeat: new Date(Date.now() - 240000).toISOString() },
  { id: 'wong', name: 'Wong', role: 'Documentation Specialist', session: 'agent:notion-agent:main', status: 'idle', emoji: '📚', color: '#8b5cf6', lastHeartbeat: new Date(Date.now() - 900000).toISOString() },
];

export const sampleTasks: Task[] = [
  { id: '1', title: 'Quant Research: Funding Rate Contrarian Signal', description: 'Investigate whether deeply negative funding rates predict short squeezes', status: 'in_progress', priority: 'high', assignee: 'ruby', labels: ['research', 'quant'], createdAt: '2026-02-14T00:00:00Z', updatedAt: '2026-02-14T03:00:00Z', issueNumber: 'MC-3' },
  { id: '2', title: 'Podcast Clip Pipeline V2', description: 'Awaiting feedback on clip analysis', status: 'review', priority: 'medium', assignee: 'ruby', labels: ['content', 'podcast'], createdAt: '2026-02-13T10:00:00Z', updatedAt: '2026-02-13T22:00:00Z', issueNumber: 'MC-4' },
  { id: '3', title: 'Mission Control Mobile UI', description: 'Build mobile-first frontend for Mission Control', status: 'in_progress', priority: 'critical', assignee: 'friday', labels: ['development', 'infrastructure'], createdAt: '2026-02-14T03:00:00Z', updatedAt: '2026-02-14T03:00:00Z', issueNumber: 'MC-5' },
  { id: '4', title: 'Superteam Talent Scouting', description: 'Waiting for more job links from Reuben', status: 'blocked', priority: 'medium', assignee: 'ruby', labels: ['outreach'], createdAt: '2026-02-13T12:00:00Z', updatedAt: '2026-02-13T18:00:00Z', issueNumber: 'MC-6' },
  { id: '5', title: 'Graveyard Hack Brainstorm', description: 'Submission due Feb 27', status: 'inbox', priority: 'high', labels: ['hackathon'], createdAt: '2026-02-14T00:00:00Z', updatedAt: '2026-02-14T00:00:00Z', issueNumber: 'MC-7' },
  { id: '6', title: 'Agent Self-Learning System', description: 'Implement feedback loops and lessons-learned tracking', status: 'done', priority: 'high', assignee: 'ruby', labels: ['infrastructure', 'agents'], createdAt: '2026-02-14T03:00:00Z', updatedAt: '2026-02-14T03:30:00Z', issueNumber: 'MC-8' },
];

export const sampleActivity: ActivityItem[] = [
  { id: '1', agent: 'Ruby', action: 'completed', detail: 'Agent Self-Learning System — all SOUL.md files upgraded', timestamp: new Date().toISOString() },
  { id: '2', agent: 'Ruby', action: 'published', detail: 'Day 1 quant post: Funding Rate Free Lunch', timestamp: '2026-02-14T03:00:00+05:30' },
  { id: '3', agent: 'Ruby', action: 'started', detail: 'Mission Control Mobile UI redesign', timestamp: new Date().toISOString() },
  { id: '4', agent: 'Friday', action: 'heartbeat', detail: 'HEARTBEAT_OK', timestamp: '2026-02-14T02:34:00+05:30' },
  { id: '5', agent: 'Shuri', action: 'heartbeat', detail: 'HEARTBEAT_OK', timestamp: '2026-02-14T02:32:00+05:30' },
];
