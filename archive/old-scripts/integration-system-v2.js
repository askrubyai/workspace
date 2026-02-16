#!/usr/bin/env node
/**
 * OpenClaw Unified Integration System v2
 * Works with existing JSON backend on port 3210
 */

// Use built-in fetch or curl fallback
const fetch = async (url, options = {}) => {
  try {
    if (globalThis.fetch) {
      return await globalThis.fetch(url, options);
    }
    
    // Fallback to curl
    const { execSync } = require('child_process');
    let curlCmd = `curl -s`;
    
    if (options.method && options.method !== 'GET') {
      curlCmd += ` -X ${options.method}`;
    }
    
    if (options.headers) {
      for (const [key, value] of Object.entries(options.headers)) {
        curlCmd += ` -H "${key}: ${value}"`;
      }
    }
    
    if (options.body) {
      curlCmd += ` -d '${options.body}'`;
    }
    
    curlCmd += ` "${url}"`;
    
    const output = execSync(curlCmd, { encoding: 'utf8' });
    return {
      ok: true,
      json: async () => JSON.parse(output),
      text: async () => output
    };
  } catch (error) {
    return { ok: false, error: error.message };
  }
};
const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

const API_URL = 'http://localhost:3210/api';
const GATEWAY_URL = 'http://localhost:18789';
const GATEWAY_TOKEN = '084b03cc8a37457e6391255aa8b0860f92ef92f386c8f261';
const WORKSPACE = '/Users/ruby/.openclaw/workspace';

class UnifiedIntegrationSystem {
  constructor() {
    // Mapping from task types to Mission Control agents
    this.missionControlAgents = {
      'commander': 'j9771reefna3g0spmbkvhv09h580anab',
      'researcher': 'j978b91xpr1m36myrna39d0yyx80brx5', 
      'coder': 'j9771reefna3g0spmbkvhv09h580anac'
    };
    
    // Mapping from 10-agent squad to Mission Control for heartbeat notifications
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
   * Create task using Convex backend
   */
  async createTask(taskData) {
    try {
      // Step 1: Create the task (without assignment)
      const createResponse = await fetch(`${API_URL}/mutation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          path: 'tasks:create',
          args: {
            title: taskData.title,
            description: taskData.description,
            priority: taskData.priority || 'medium',
            labels: taskData.labels || []
          }
        })
      });

      const createResult = await createResponse.json();
      if (createResult.status !== 'success') {
        throw new Error(createResult.errorMessage);
      }

      const taskId = createResult.value;
      console.log(`✅ Task created: ${taskId}`);

      // Step 2: Assign task to agent if specified
      if (taskData.assignedTo) {
        const agentId = this.getAgentId(taskData.assignedTo);
        if (agentId) {
          try {
            const assignResponse = await fetch(`${API_URL}/mutation`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                path: 'tasks:assign',
                args: {
                  taskId: taskId,
                  assignee: agentId
                }
              })
            });

            const assignResult = await assignResponse.json();
            if (assignResult.status === 'success') {
              console.log(`✅ Task assigned to ${taskData.assignedTo}`);
            } else {
              console.log(`⚠️ Assignment failed: ${assignResult.errorMessage}`);
            }
          } catch (assignError) {
            console.log(`⚠️ Assignment failed: ${assignError.message}`);
          }
        }
      }

      await this.updateWorkingMemory('task_created', {
        taskId,
        title: taskData.title,
        assignedTo: taskData.assignedTo
      });

      return { id: taskId, ...taskData };
    } catch (error) {
      console.log(`❌ Task creation failed: ${error.message}`);
      return await this.createFallbackTask(taskData);
    }
  }

  /**
   * Get agent ID from agent name for task assignment
   */
  getAgentId(agentName) {
    if (!agentName || agentName === 'jarvis') return null;
    
    // For Mission Control tasks, map to the 3-agent system
    if (this.missionControlAgents[agentName]) {
      return this.missionControlAgents[agentName];
    }
    
    // Fallback to 10-agent squad mapping for notifications
    return this.agentMapping[agentName] || null;
  }

  /**
   * Map Mission Control agents to 10-agent squad for notifications
   */
  mapMissionControlToSquad(missionControlAgent) {
    const mapping = {
      'commander': 'jarvis',     // Main coordinator
      'researcher': 'fury',      // Research specialist
      'coder': 'friday'          // Development specialist
    };
    
    return mapping[missionControlAgent] || null;
  }

  /**
   * Analyze message and determine task assignment
   */
  analyzeMessage(message) {
    const tasks = [];
    const messageText = message.toLowerCase();
    
    // Enhanced task detection - Map to Mission Control agents
    const taskPatterns = {
      research: { 
        keywords: ['research', 'investigate', 'find out', 'look into', 'analyze data'],
        agent: 'researcher', priority: 'medium',
        description: 'Deep research and analysis task'
      },
      development: {
        keywords: ['code', 'build', 'implement', 'develop', 'create app', 'programming'],
        agent: 'coder', priority: 'high',
        description: 'Development and technical implementation'
      },
      content: {
        keywords: ['write', 'blog post', 'article', 'content', 'documentation'],
        agent: 'researcher', priority: 'medium', 
        description: 'Content creation and writing (assign to researcher for now)'
      },
      design: {
        keywords: ['design', 'ui', 'ux', 'visual', 'mockup', 'wireframe'],
        agent: 'coder', priority: 'medium',
        description: 'Visual design and user experience (assign to coder for implementation)'
      },
      testing: {
        keywords: ['test', 'bug', 'quality', 'edge case', 'validate'],
        agent: 'coder', priority: 'medium',
        description: 'Testing and quality assurance'
      },
      general: {
        keywords: ['help', 'need', 'want', 'please'],
        agent: 'commander', priority: 'medium',
        description: 'General coordination and planning'
      }
    };

    // Determine priority from message urgency indicators
    let priority = 'medium';
    if (messageText.includes('urgent') || messageText.includes('asap') || messageText.includes('critical')) {
      priority = 'critical';
    } else if (messageText.includes('important') || messageText.includes('priority')) {
      priority = 'high';
    } else if (messageText.includes('when you have time') || messageText.includes('no rush')) {
      priority = 'low';
    }

    // Find matching pattern
    let assignedAgent = null;
    let taskType = 'general';
    
    for (const [type, config] of Object.entries(taskPatterns)) {
      if (config.keywords.some(keyword => messageText.includes(keyword))) {
        assignedAgent = config.agent;
        taskType = type;
        priority = priority === 'medium' ? config.priority : priority; // Don't override explicit priority
        break;
      }
    }

    // Create main task
    const title = this.generateTaskTitle(message, taskType);
    tasks.push({
      title,
      description: message,
      assignedTo: assignedAgent,
      priority,
      labels: [taskType, 'telegram', 'reuben-request'],
      metadata: {
        source: 'telegram',
        messageLength: message.length,
        taskType,
        timestamp: new Date().toISOString()
      }
    });

    return tasks;
  }

  /**
   * Generate descriptive task title
   */
  generateTaskTitle(message, taskType) {
    const words = message.split(' ');
    let title = words.slice(0, 10).join(' ');
    if (words.length > 10) title += '...';
    
    // Add task type prefix
    const prefixes = {
      research: '🔍 Research:',
      development: '⚙️ Develop:',
      content: '✍️ Write:',
      design: '🎨 Design:',
      testing: '🧪 Test:',
      social: '📱 Social:',
      seo: '🔍 SEO:',
      email: '📧 Email:',
      general: '📋 Request:'
    };

    return `${prefixes[taskType] || prefixes.general} ${title}`;
  }

  /**
   * Fallback task creation using memory files
   */
  async createFallbackTask(taskData) {
    const taskId = `task-${Date.now()}`;
    const task = {
      id: taskId,
      title: taskData.title,
      description: taskData.description,
      status: 'new',
      assignedTo: taskData.assignedTo,
      priority: taskData.priority,
      createdAt: new Date().toISOString(),
      source: 'telegram-fallback'
    };

    await this.updateWorkingMemory('task_created_fallback', task);
    console.log(`✅ Fallback task created: ${taskId}`);
    return task;
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
        content = '# WORKING.md - Current Squad State\n\n*System integration active*\n\n';
      }

      // Add new entry at the top after headers
      const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
      const entry = `\n## ${timestamp} IST - Integration System\n${this.formatEvent(eventType, data)}\n`;
      
      const lines = content.split('\n');
      let insertIndex = 2; // After title and blank line
      
      // Find a good insertion point
      for (let i = 0; i < Math.min(lines.length, 10); i++) {
        if (lines[i].startsWith('## ')) {
          insertIndex = i;
          break;
        }
      }
      
      lines.splice(insertIndex, 0, entry);
      
      // Keep file manageable (max 150 lines)
      if (lines.length > 150) {
        lines.splice(150);
        lines.push('\n*... truncated for performance*');
      }

      await fs.writeFile(workingPath, lines.join('\n'));
      console.log(`📝 Updated WORKING.md: ${eventType}`);
    } catch (error) {
      console.error(`Failed to update WORKING.md: ${error.message}`);
    }
  }

  /**
   * Format event for memory logging
   */
  formatEvent(eventType, data) {
    switch (eventType) {
      case 'task_created':
        return `- ✅ **Task created**: "${data.title}"\n- **Assigned to**: ${data.assignedTo || 'Unassigned'}\n- **Task ID**: ${data.taskId}`;
      case 'task_created_fallback':
        return `- ⚠️ **Fallback task created**: "${data.title}"\n- **Assigned to**: ${data.assignedTo}\n- **Status**: ${data.status}`;
      case 'agent_notification':
        return `- 📱 **Agent notified**: ${data.agent} about "${data.message}"`;
      case 'message_processed':
        return `- 📨 **Message processed**: Created ${data.taskCount} task(s), assigned to ${data.agents.join(', ')}`;
      default:
        return `- ℹ️ ${JSON.stringify(data)}`;
    }
  }

  /**
   * Notify agent about new task
   */
  async notifyAgent(agentName, taskData) {
    try {
      const agentId = this.agentMapping[agentName];
      if (!agentId) {
        console.log(`❌ Unknown agent: ${agentName}`);
        return false;
      }

      // Use sessions_send tool to notify agent
      const message = `🎯 **NEW TASK ASSIGNMENT**

**Task**: ${taskData.title}
**Priority**: ${taskData.priority.toUpperCase()}
**Description**: ${taskData.description}

**Your next steps:**
1. Acknowledge this assignment
2. Start work and update status to "in_progress" 
3. Update progress in memory files
4. Notify when complete

Task created via Telegram integration system.`;

      // Send via OpenClaw sessions
      const { exec } = require('child_process');
      const { promisify } = require('util');
      const execAsync = promisify(exec);
      
      try {
        await execAsync(`openclaw sessions send --message "${message.replace(/"/g, '\\"')}" --session-key="agent:main:cron:${agentId}" --timeout-seconds=30`);
        console.log(`✅ Notified ${agentName} via OpenClaw sessions`);
        
        await this.updateWorkingMemory('agent_notification', {
          agent: agentName,
          message: taskData.title,
          method: 'openclaw_sessions'
        });
        return true;
      } catch (sessionError) {
        console.log(`⚠️ Sessions notification failed, using fallback: ${sessionError.message}`);
        
        // Fallback: Update agent's memory file directly
        await this.notifyAgentViaMemory(agentName, taskData);
        return true;
      }

    } catch (error) {
      console.log(`❌ Error notifying agent ${agentName}: ${error.message}`);
      return false;
    }
  }

  /**
   * Fallback agent notification via memory files
   */
  async notifyAgentViaMemory(agentName, taskData) {
    try {
      const agentMemoryPath = path.join(WORKSPACE, 'agents', agentName, 'NOTIFICATIONS.md');
      
      // Ensure directory exists
      await fs.mkdir(path.dirname(agentMemoryPath), { recursive: true });
      
      const notification = `# NEW TASK - ${new Date().toISOString()}

**Task**: ${taskData.title}
**Priority**: ${taskData.priority}
**Assigned by**: Integration System
**Source**: Telegram request from Reuben

**Description**:
${taskData.description}

**Next Steps**:
1. Start work on this task
2. Update WORKING.md with your progress
3. Mark task as "in_progress" when you begin
4. Notify when complete

---

`;

      // Append to notifications file
      try {
        const existing = await fs.readFile(agentMemoryPath, 'utf8');
        await fs.writeFile(agentMemoryPath, notification + existing);
      } catch (readError) {
        // File doesn't exist, create new
        await fs.writeFile(agentMemoryPath, notification);
      }

      console.log(`📄 Created memory notification for ${agentName}`);
      
      await this.updateWorkingMemory('agent_notification', {
        agent: agentName,
        message: taskData.title,
        method: 'memory_file'
      });
      
    } catch (error) {
      console.error(`Failed to create memory notification: ${error.message}`);
    }
  }

  /**
   * Process incoming Telegram message (main entry point)
   */
  async processTelegramMessage(message) {
    console.log(`\n🎯 PROCESSING TELEGRAM MESSAGE`);
    console.log(`Message: ${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
    
    try {
      // Analyze message and create tasks
      const tasks = this.analyzeMessage(message);
      
      const results = [];
      const assignedAgents = [];
      
      for (const taskData of tasks) {
        // Create task in database
        const task = await this.createTask(taskData);
        results.push(task);
        
        // Notify assigned agent
        if (taskData.assignedTo && taskData.assignedTo !== 'jarvis') {
          // Map Mission Control agents to 10-agent squad for notifications
          const notificationAgent = this.mapMissionControlToSquad(taskData.assignedTo);
          if (notificationAgent) {
            await this.notifyAgent(notificationAgent, task);
            assignedAgents.push(notificationAgent);
          }
        }
      }

      // Log overall processing
      await this.updateWorkingMemory('message_processed', {
        taskCount: results.length,
        agents: assignedAgents,
        timestamp: new Date().toISOString()
      });

      console.log(`✅ Message processing complete: ${results.length} tasks created`);
      return results;
      
    } catch (error) {
      console.error(`❌ Message processing failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Health check system
   */
  async healthCheck() {
    console.log('\n🏥 RUNNING SYSTEM HEALTH CHECK');
    
    const status = {
      timestamp: new Date().toISOString(),
      jsonBackend: false,
      gateway: false,
      agents: 0,
      workingMemory: false
    };

    // Check JSON backend
    try {
      const response = await fetch(`${API_URL}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: 'tasks:list', args: {} })
      });
      status.jsonBackend = response.ok;
      console.log(`${status.jsonBackend ? '✅' : '❌'} JSON Backend (port 3210)`);
    } catch (error) {
      console.log(`❌ JSON Backend: ${error.message}`);
    }

    // Check OpenClaw Gateway
    try {
      const response = await fetch(`${GATEWAY_URL}/status`, {
        headers: { 'Authorization': `Bearer ${GATEWAY_TOKEN}` },
        timeout: 5000
      });
      status.gateway = response.ok;
      console.log(`${status.gateway ? '✅' : '❌'} OpenClaw Gateway`);
    } catch (error) {
      console.log(`❌ OpenClaw Gateway: ${error.message}`);
    }

    // Count active agents
    status.agents = Object.keys(this.agentMapping).length;
    console.log(`✅ Agent mapping: ${status.agents} agents configured`);

    // Check working memory
    try {
      const workingPath = path.join(WORKSPACE, 'memory', 'WORKING.md');
      await fs.access(workingPath);
      status.workingMemory = true;
      console.log(`✅ Working memory accessible`);
    } catch (error) {
      console.log(`❌ Working memory: ${error.message}`);
    }

    console.log(`\n📊 System Status:`, status);
    return status;
  }

  /**
   * Cleanup old memory files to prevent token limits
   */
  async cleanupMemory() {
    try {
      console.log('\n🧹 CLEANING UP MEMORY FILES');
      
      const memoryDir = path.join(WORKSPACE, 'memory');
      const files = await fs.readdir(memoryDir);
      
      // Archive files older than 7 days
      const now = new Date();
      const cutoffDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      let cleanedCount = 0;
      for (const file of files) {
        if (file.match(/^\d{4}-\d{2}-\d{2}\.md$/)) {
          const fileDate = new Date(file.replace('.md', ''));
          if (fileDate < cutoffDate) {
            const oldPath = path.join(memoryDir, file);
            const archivePath = path.join(memoryDir, 'archive', file);
            
            await fs.mkdir(path.dirname(archivePath), { recursive: true });
            await fs.rename(oldPath, archivePath);
            cleanedCount++;
          }
        }
      }

      console.log(`✅ Memory cleanup: ${cleanedCount} files archived`);
    } catch (error) {
      console.error(`❌ Memory cleanup failed: ${error.message}`);
    }
  }
}

// Command-line interface
if (require.main === module) {
  const system = new UnifiedIntegrationSystem();
  
  const command = process.argv[2];
  const message = process.argv.slice(3).join(' ');

  switch (command) {
    case 'health':
      system.healthCheck();
      break;
      
    case 'cleanup':
      system.cleanupMemory();
      break;
      
    case 'test':
      if (!message) {
        console.log('Usage: node integration-system-v2.js test "your test message"');
        process.exit(1);
      }
      system.processTelegramMessage(message).then(results => {
        console.log('Test completed:', results);
      });
      break;
      
    default:
      console.log('🚀 OpenClaw Unified Integration System v2');
      console.log('Commands:');
      console.log('  health  - Run system health check');
      console.log('  cleanup - Clean up old memory files');  
      console.log('  test "message" - Test message processing');
      system.healthCheck();
  }
}

module.exports = UnifiedIntegrationSystem;