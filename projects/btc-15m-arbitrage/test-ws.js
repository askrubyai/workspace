// Quick test of RTDS WebSocket for Chainlink prices
const { RealTimeDataClient } = require('@polymarket/real-time-data-client');

console.log('Connecting to RTDS...');

const onMessage = (message) => {
  console.log('MESSAGE:', JSON.stringify(message, null, 2));
};

const onConnect = (client) => {
  console.log('Connected! Subscribing to crypto_prices_chainlink...');
  
  // Try subscribing to all chainlink prices without filter
  client.subscribe({
    subscriptions: [
      {
        topic: 'crypto_prices_chainlink',
        type: '*',
      },
    ],
  });
  
  console.log('Subscribed. Waiting for messages...');
};

const client = new RealTimeDataClient({ onMessage, onConnect });
client.connect();

// Exit after 15 seconds
setTimeout(() => {
  console.log('Timeout - no messages received');
  process.exit(0);
}, 15000);
