#!/usr/bin/env node
/**
 * OpenClaw Unified Integration System
 * Connects Telegram → Coordinator → Task Management → Agent Squad
 */

const fetch = require('node-fetch');
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const CONVEX_URL = 'http://localhost:3210';
const GATEWAY_URL = 'http://localhost:18789';
const GATEWAY_TOKEN = '084b03cc8a37457e6391255aa8b0860f92ef92f386c8f261';
const WORKSPACE = '/Users/ruby/.openclaw/workspace';

class UnifiedIntegrationSystem {
  constructor() {
    this.agentMapping = {
      'shuri': 'f422f376-0080-47b8-8ccc-80d2878e87da',
      'friday': 'dd1e2d54-840a-4717-8f84-92fd78cdfda6', 
      'fury': '21bbc04c-7aa9-44a6-be4c-4a93ddbd0027',
      'vision': 'ac34c02d-b1b5-4b16-a0a4-34735d85f756',
      'loki': '5460935b-25ba-44ae-875a-5d163b7a8691',
      'quill': 'f6c5eece-e356-4249-9709-a70978273540',
      'wanda': '5f1bb0eb-56e1-4842-8219-4cd5993de9b7',
      'pepper': 'bc7b1275-ffc2-4fde-83d1-866034146d3e',
      'jarvis': 'b3dee643-16ad-43d6-9f94-ea7e275dc4c6'
    };
  }

  /**
   * Create task in Convex database and assign to agents
   */
  async createTask(taskData) {
    try {
      // Create task via Convex API
      const response = await fetch(`${CONVEX_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: taskData.title,
          description: taskData.description,
          status: 'inbox',
          priority: taskData.priority || 'medium',
          assignedTo: taskData.assignedTo || null,
          metadata: {
            source: 'telegram',
            requesterId: 'reuben',
            createdAt: new Date().toISOString(),
            ...taskData.metadata
          }
        })
      });

      if (response.ok) {
        const task = await response.json();
        console.log(`✅ Task created in Convex: ${task.id}`);
        
        // Update WORKING.md with new task
        await this.updateWorkingMemory('task_created', {
          taskId: task.id,
          title: taskData.title,
          assignedTo: taskData.assignedTo,
          timestamp: new Date().toISOString()
        });

        return task;
      } else {
        console.log(`❌ Convex not available, using fallback task tracking`);
        return await this.createFallbackTask(taskData);
      }
    } catch (error) {
      console.log(`❌ Convex error: ${error.message}, using fallback`);
      return await this.createFallbackTask(taskData);
    }
  }

  /**
   * Fallback task creation using memory files when Convex is unavailable
   */
  async createFallbackTask(taskData) {
    const taskId = `task-${Date.now()}`;
    const task = {
      id: taskId,
      title: taskData.title,
      description: taskData.description,
      status: 'assigned',
      assignedTo: taskData.assignedTo,
      createdAt: new Date().toISOString(),
      source: 'telegram'
    };

    // Update WORKING.md with the new task
    await this.updateWorkingMemory('task_created_fallback', task);
    
    console.log(`✅ Fallback task created: ${taskId}`);
    return task;
  }

  /**
   * Parse Telegram message and create appropriate tasks
   */
  analyzeMessage(message) {
    const tasks = [];
    
    // Simple keyword-based task detection
    const taskKeywords = {
      'research': { agent: 'fury', priority: 'medium' },
      'analyze': { agent: 'shuri', priority: 'medium' },
      'code': { agent: 'friday', priority: 'high' },
      'implement': { agent: 'friday', priority: 'high' },
      'write': { agent: 'loki', priority: 'medium' },
      'design': { agent: 'wanda', priority: 'medium' },
      'social': { agent: 'quill', priority: 'low' },
      'email': { agent: 'pepper', priority: 'medium' },
      'seo': { agent: 'vision', priority: 'medium' },
      'test': { agent: 'shuri', priority: 'medium' }
    };

    // Detect task type from message content
    const messageText = message.toLowerCase();
    let assignedAgent = 'jarvis'; // Default to main coordinator
    let priority = 'medium';

    for (const [keyword, config] of Object.entries(taskKeywords)) {
      if (messageText.includes(keyword)) {
        assignedAgent = config.agent;
        priority = config.priority;
        break;
      }
    }

    // Create main task
    tasks.push({
      title: `Request from Reuben: ${message.substring(0, 100)}...`,
      description: message,
      assignedTo: assignedAgent,
      priority: priority,
      metadata: {
        messageLength: message.length,
        detectedKeywords: Object.keys(taskKeywords).filter(k => messageText.includes(k))
      }
    });

    return tasks;
  }

  /**
   * Update WORKING.md with new information
   */
  async updateWorkingMemory(eventType, data) {
    try {
      const workingPath = path.join(WORKSPACE, 'memory', 'WORKING.md');
      let content = '';
      
      try {
        content = await fs.readFile(workingPath, 'utf8');
      } catch (error) {
        // File doesn't exist, create new
        content = '# WORKING.md - Current Squad State\n\n*Last updated: ' + new Date().toISOString() + '*\n\n';
      }

      // Add new entry at the top
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const entry = `\n## ${timestamp} IST - Integration System\n${this.formatEvent(eventType, data)}\n`;
      
      // Insert after the header
      const lines = content.split('\n');
      lines.splice(4, 0, entry);
      
      // Keep file manageable (max 200 lines)
      if (lines.length > 200) {
        lines.splice(200);
        lines.push('\n*... archived older entries to preserve memory*');
      }

      await fs.writeFile(workingPath, lines.join('\n'));
      console.log(`📝 Updated WORKING.md with ${eventType}`);
    } catch (error) {
      console.error(`Failed to update WORKING.md: ${error.message}`);
    }
  }

  formatEvent(eventType, data) {
    switch (eventType) {
      case 'task_created':
        return `- ✅ Task created: "${data.title}" assigned to ${data.assignedTo}\n- Task ID: ${data.taskId}`;
      case 'task_created_fallback':
        return `- ✅ Fallback task created: "${data.title}" assigned to ${data.assignedTo}\n- Status: ${data.status}`;
      case 'agent_notification':
        return `- 📱 Notified agent ${data.agent}: ${data.message}`;
      default:
        return `- ${JSON.stringify(data)}`;
    }
  }

  /**
   * Notify specific agent about new task
   */
  async notifyAgent(agentName, taskData) {
    try {
      const agentId = this.agentMapping[agentName];
      if (!agentId) {
        console.log(`❌ Unknown agent: ${agentName}`);
        return false;
      }

      // Send message to agent's session
      const message = `🎯 NEW TASK ASSIGNMENT

**Task**: ${taskData.title}
**Description**: ${taskData.description}
**Priority**: ${taskData.priority}
**Source**: Telegram request from Reuben

Please acknowledge receipt and begin work. Update your progress in memory files.`;

      const response = await fetch(`${GATEWAY_URL}/sessions/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GATEWAY_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionKey: `agent:main:cron:${agentId}`,
          message: message,
          timeoutSeconds: 30
        })
      });

      if (response.ok) {
        console.log(`✅ Notified agent ${agentName} (${agentId})`);
        await this.updateWorkingMemory('agent_notification', {
          agent: agentName,
          message: taskData.title,
          timestamp: new Date().toISOString()
        });
        return true;
      } else {
        console.log(`❌ Failed to notify agent ${agentName}: ${response.status}`);
        return false;
      }
    } catch (error) {
      console.log(`❌ Error notifying agent ${agentName}: ${error.message}`);
      return false;
    }
  }

  /**
   * Process incoming Telegram message
   */
  async processTelegramMessage(message) {
    console.log(`📨 Processing message: ${message.substring(0, 100)}...`);
    
    // Analyze message and create tasks
    const tasks = this.analyzeMessage(message);
    
    const results = [];
    for (const taskData of tasks) {
      // Create task in database
      const task = await this.createTask(taskData);
      
      // Notify assigned agent
      if (taskData.assignedTo && taskData.assignedTo !== 'jarvis') {
        await this.notifyAgent(taskData.assignedTo, task);
      }
      
      results.push(task);
    }

    return results;
  }

  /**
   * Cleanup memory files to prevent token limit issues
   */
  async cleanupMemory() {
    try {
      const memoryDir = path.join(WORKSPACE, 'memory');
      const files = await fs.readdir(memoryDir);
      
      // Archive old daily files (keep last 7 days)
      const now = new Date();
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      for (const file of files) {
        if (file.match(/^\d{4}-\d{2}-\d{2}\.md$/)) {
          const fileDate = new Date(file.replace('.md', ''));
          if (fileDate < sevenDaysAgo) {
            const archivePath = path.join(memoryDir, 'archive', file);
            await fs.mkdir(path.join(memoryDir, 'archive'), { recursive: true });
            await fs.rename(path.join(memoryDir, file), archivePath);
            console.log(`📁 Archived old memory file: ${file}`);
          }
        }
      }

      console.log('✅ Memory cleanup completed');
    } catch (error) {
      console.error(`❌ Memory cleanup failed: ${error.message}`);
    }
  }

  /**
   * Health check - verify all systems are operational
   */
  async healthCheck() {
    const status = {
      convex: false,
      gateway: false,
      agents: 0,
      lastCheck: new Date().toISOString()
    };

    // Check Convex
    try {
      const convexResponse = await fetch(`${CONVEX_URL}/`, { timeout: 5000 });
      status.convex = convexResponse.ok;
    } catch (error) {
      status.convex = false;
    }

    // Check Gateway
    try {
      const gatewayResponse = await fetch(`${GATEWAY_URL}/status`, {
        headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` },
        timeout: 5000
      });
      status.gateway = gatewayResponse.ok;
    } catch (error) {
      status.gateway = false;
    }

    // Count active agents
    status.agents = Object.keys(this.agentMapping).length;

    console.log(`🏥 Health Check:`, status);
    return status;
  }
}

// Export for use as module or run directly
if (require.main === module) {
  const system = new UnifiedIntegrationSystem();
  
  // Run health check
  system.healthCheck().then(() => {
    console.log('🚀 Unified Integration System initialized');
  });
}

module.exports = UnifiedIntegrationSystem;