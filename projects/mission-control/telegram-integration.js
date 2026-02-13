#!/usr/bin/env node
/**
 * Mission Control - Telegram Integration
 * Auto-creates tasks from Telegram messages and sends MC issue number references
 * Works with Convex backend on port 3210
 */

const CONVEX_URL = 'http://127.0.0.1:3210/api';

/**
 * Simple fetch wrapper with curl fallback
 */
async function apiCall(endpoint, args, isMutation = false) {
  const { execSync } = require('child_process');
  
  const payload = JSON.stringify({
    path: endpoint,
    args: args || {}
  });
  
  const method = isMutation ? 'mutation' : 'query';
  const cmd = `curl -s ${CONVEX_URL}/${method} -X POST -H 'Content-Type: application/json' -d '${payload.replace(/'/g, "'\\''")}'`;
  
  try {
    const result = execSync(cmd, { encoding: 'utf8' });
    const parsed = JSON.parse(result);
    
    if (parsed.status === 'success') {
      return parsed.value;
    } else {
      throw new Error(parsed.errorMessage || 'API call failed');
    }
  } catch (error) {
    console.error(`API call failed: ${error.message}`);
    throw error;
  }
}

/**
 * Analyze message and determine task characteristics
 */
function analyzeMessage(message) {
  const msgLower = message.toLowerCase();
  
  // Determine task type and assignment
  const patterns = {
    research: {
      keywords: ['research', 'investigate', 'find out', 'analyze', 'look into'],
      labels: ['research'],
      priority: 'medium'
    },
    development: {
      keywords: ['code', 'build', 'implement', 'develop', 'fix', 'create app'],
      labels: ['development'],
      priority: 'high'
    },
    content: {
      keywords: ['write', 'blog', 'article', 'content', 'post'],
      labels: ['content'],
      priority: 'medium'
    },
    infrastructure: {
      keywords: ['deploy', 'server', 'infrastructure', 'setup', 'config'],
      labels: ['infrastructure'],
      priority: 'high'
    }
  };
  
  // Determine priority from urgency keywords
  let priority = 'medium';
  if (msgLower.includes('urgent') || msgLower.includes('asap') || msgLower.includes('critical')) {
    priority = 'critical';
  } else if (msgLower.includes('important') || msgLower.includes('high priority')) {
    priority = 'high';
  } else if (msgLower.includes('when you can') || msgLower.includes('no rush')) {
    priority = 'low';
  }
  
  // Find matching pattern
  let labels = ['telegram', 'reuben-request'];
  for (const [type, config] of Object.entries(patterns)) {
    if (config.keywords.some(kw => msgLower.includes(kw))) {
      labels = [...labels, ...config.labels];
      if (priority === 'medium') { // Don't override explicit priority
        priority = config.priority;
      }
      break;
    }
  }
  
  return {
    priority,
    labels,
    description: message
  };
}

/**
 * Generate task title from message
 */
function generateTitle(message) {
  // Take first 60 chars or until first newline
  let title = message.split('\n')[0];
  if (title.length > 60) {
    title = title.substring(0, 57) + '...';
  }
  return title;
}

/**
 * Create task from Telegram message
 */
async function createTaskFromMessage(message) {
  console.log(`\n📨 Processing Telegram message...`);
  
  const analysis = analyzeMessage(message);
  const title = generateTitle(message);
  
  try {
    const taskId = await apiCall('tasks:create', {
      title,
      description: message,
      priority: analysis.priority,
      labels: analysis.labels
    }, true); // mutation
    
    // Get the task to retrieve issue number
    const task = await apiCall('tasks:get', { id: taskId }, false); // query
    
    console.log(`✅ Task created: MC-${task.issueNumber} - ${title}`);
    console.log(`   Priority: ${analysis.priority}`);
    console.log(`   Labels: ${analysis.labels.join(', ')}`);
    
    return {
      issueNumber: task.issueNumber,
      taskId,
      title
    };
  } catch (error) {
    console.error(`❌ Failed to create task: ${error.message}`);
    throw error;
  }
}

/**
 * Format response message with MC issue reference
 */
function formatResponse(task) {
  return `✅ Created **MC-${task.issueNumber}**: ${task.title}

Track progress at http://localhost:5174 (or via ngrok when remote)`;
}

/**
 * Main entry point for integration
 */
async function processMessage(message) {
  try {
    const task = await createTaskFromMessage(message);
    return formatResponse(task);
  } catch (error) {
    return `❌ Failed to create task: ${error.message}`;
  }
}

// CLI usage
if (require.main === module) {
  const message = process.argv.slice(2).join(' ');
  
  if (!message) {
    console.log('Usage: node telegram-integration.js "Your task message"');
    console.log('\nExample:');
    console.log('  node telegram-integration.js "Research competitor pricing for SiteGPT"');
    process.exit(1);
  }
  
  processMessage(message).then(response => {
    console.log('\n' + response);
  }).catch(error => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = { processMessage, createTaskFromMessage };
