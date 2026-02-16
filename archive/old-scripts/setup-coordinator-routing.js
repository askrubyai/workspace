#!/usr/bin/env node
/**
 * Set up Coordinator as main entry point for Telegram messages
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const CONFIG_PATH = path.join(process.env.HOME, '.openclaw/openclaw.json');

async function setupCoordinatorRouting() {
  try {
    console.log('🔧 Setting up Coordinator as Telegram entry point...');

    // Read current config
    const configData = fs.readFileSync(CONFIG_PATH, 'utf8');
    const config = JSON.parse(configData);

    // Add routing rule for Telegram to coordinator
    if (!config.agents.list.find(a => a.id === 'coordinator')) {
      console.error('❌ Coordinator agent not found in config');
      return false;
    }

    // Update main agent to use Sonnet (cheaper for routing decisions)
    const mainAgent = config.agents.list.find(a => a.id === 'main');
    if (mainAgent) {
      mainAgent.model = 'anthropic/claude-sonnet-4-20250514';
    }

    // Ensure coordinator uses Opus for strategic decisions
    const coordinator = config.agents.list.find(a => a.id === 'coordinator');
    if (coordinator) {
      coordinator.model = 'anthropic/claude-opus-4-5';
      
      // Add routing rules for coordinator
      coordinator.routing = {
        rules: [
          {
            channel: 'telegram',
            userId: '603633311', // Reuben's Telegram ID
            priority: 1
          }
        ]
      };
    }

    // Write updated config
    fs.writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2));
    console.log('✅ Updated OpenClaw configuration');

    // Restart gateway to apply changes
    console.log('🔄 Restarting gateway...');
    try {
      execSync('openclaw gateway restart', { stdio: 'inherit' });
      console.log('✅ Gateway restarted');
    } catch (error) {
      console.log('⚠️  Gateway restart may have failed, but config is updated');
    }

    return true;
  } catch (error) {
    console.error('❌ Failed to setup routing:', error.message);
    return false;
  }
}

if (require.main === module) {
  setupCoordinatorRouting().then(success => {
    if (success) {
      console.log('🎯 Coordinator routing setup complete!');
      console.log('Next messages from Telegram will go to Coordinator (Opus) for delegation.');
    } else {
      console.log('❌ Setup failed');
      process.exit(1);
    }
  });
}

module.exports = setupCoordinatorRouting;