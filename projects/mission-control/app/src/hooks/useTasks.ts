import { useState, useEffect } from 'react';
import type { Task, ActivityItem } from '../types';

const API = ''; // Relative — Vite proxies /api to port 5175

interface WorkingData {
  working: string;
  memory: string;
  lessons: Record<string, string>;
}

/**
 * Parse tasks from WORKING.md content
 * Looks for markdown task sections and extracts structured data
 */
function parseTasksFromWorking(working: string): Task[] {
  const tasks: Task[] = [];
  
  // Extract active priorities section
  const prioritiesMatch = working.match(/## 🎯 ACTIVE PRIORITIES([\s\S]*?)(?=##|$)/);
  if (!prioritiesMatch) return tasks;
  
  const content = prioritiesMatch[1];
  
  // Parse each numbered priority as a task
  const taskMatches = content.matchAll(/### (\d+)\.\s+(.+?)\n([\s\S]*?)(?=###|$)/g);
  
  let taskId = 1;
  for (const match of taskMatches) {
    const [, num, titleLine, body] = match;
    
    // Extract title and emoji
    const titleMatch = titleLine.match(/([📊🎯🎙️🔍🔎💡🚀⚡]+)\s*(.+)/);
    const title = titleMatch ? titleMatch[2].trim() : titleLine.trim();
    
    // Determine status from keywords in body
    let status: Task['status'] = 'in_progress';
    if (body.includes('✅ Completed') || body.includes('**Status: COMPLETE')) {
      status = 'done';
    } else if (body.includes('⏳ WAITING') || body.includes('Awaiting')) {
      status = 'review';
    } else if (body.includes('🚫') || body.includes('BLOCKED')) {
      status = 'blocked';
    } else if (body.includes('IN PROGRESS') || body.includes('⏳ Next')) {
      status = 'in_progress';
    } else if (body.includes('NEW -')) {
      status = 'inbox';
    }
    
    // Determine priority
    let priority: Task['priority'] = 'medium';
    if (title.includes('CRITICAL') || body.includes('PRIORITY 1')) {
      priority = 'critical';
    } else if (title.includes('Primary') || body.includes('Goal')) {
      priority = 'high';
    }
    
    // Extract assignee from mentions or deliverables
    let assignee: string | undefined;
    const assigneeMatch = body.match(/\*\*Agent\*\*:\s*(\w+)/i) || 
                          body.match(/\*\*Deliverable\*\*:.*\((\w+)\)/);
    if (assigneeMatch) {
      assignee = assigneeMatch[1].toLowerCase();
    }
    
    // Extract labels
    const labels: string[] = [];
    if (title.toLowerCase().includes('research')) labels.push('research');
    if (title.toLowerCase().includes('mission control')) labels.push('infrastructure');
    if (title.toLowerCase().includes('podcast')) labels.push('content');
    if (title.toLowerCase().includes('seo')) labels.push('seo');
    if (body.includes('quant')) labels.push('quant');
    
    tasks.push({
      id: String(taskId++),
      title: title.substring(0, 100), // Truncate long titles
      description: body.trim().substring(0, 300), // First 300 chars as description
      status,
      priority,
      assignee,
      labels,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      issueNumber: `MC-${num}`,
    });
  }
  
  return tasks;
}

/**
 * Parse recent activity from today's daily log
 */
function parseActivityFromDaily(dailyContent: string): ActivityItem[] {
  const activities: ActivityItem[] = [];
  
  // Match timestamp entries: ## HH:MM IST - AgentName
  const entries = dailyContent.matchAll(/## (\d{2}:\d{2}) IST - (.+?)\n([\s\S]*?)(?=##|$)/g);
  
  let actId = 1;
  for (const match of entries) {
    const [, time, agentLine, body] = match;
    
    // Extract agent name (before parentheses if present)
    const agent = agentLine.split('(')[0].trim();
    
    // Extract action from first line of body
    const firstLine = body.trim().split('\n')[0];
    let action = 'updated';
    let detail = firstLine;
    
    if (firstLine.includes('**Action:**')) {
      action = 'completed';
      detail = firstLine.replace(/\*\*Action:\*\*\s*/, '');
    } else if (firstLine.includes('HEARTBEAT_OK')) {
      action = 'heartbeat';
      detail = 'HEARTBEAT_OK';
    } else if (body.includes('published') || body.includes('Published')) {
      action = 'published';
    } else if (body.includes('completed') || body.includes('Completed')) {
      action = 'completed';
    }
    
    // Build ISO timestamp (assume today)
    const today = new Date().toISOString().split('T')[0];
    const timestamp = `${today}T${time}:00+05:30`;
    
    activities.push({
      id: String(actId++),
      agent,
      action,
      detail: detail.substring(0, 100),
      timestamp,
    });
  }
  
  return activities.sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  ); // Return all activities — UI handles pagination
}

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch WORKING.md
        const statusRes = await fetch(`${API}/api/status`);
        if (!statusRes.ok) throw new Error('Failed to fetch status');
        const data: WorkingData = await statusRes.json();
        
        // Parse tasks from WORKING.md
        const parsedTasks = parseTasksFromWorking(data.working);
        setTasks(parsedTasks);
        
        // Fetch today's daily log
        const today = new Date().toISOString().split('T')[0];
        const dailyPath = `memory/${today}.md`;
        
        try {
          const dailyRes = await fetch(`${API}/api/file?path=${encodeURIComponent(dailyPath)}`);
          if (dailyRes.ok) {
            const dailyData = await dailyRes.json();
            const parsedActivity = parseActivityFromDaily(dailyData.content);
            setActivity(parsedActivity);
          }
        } catch {
          // Daily log might not exist yet, use empty array
          setActivity([]);
        }
        
        setLoading(false);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Unknown error');
        setLoading(false);
      }
    }
    
    fetchData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);
  
  return { tasks, activity, loading, error };
}
