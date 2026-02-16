// Test RTDS message format
const { RealTimeDataClient } = require('@polymarket/real-time-data-client');

console.log('Testing RTDS message format...');

const onMessage = (message) => {
  // Log the raw message structure
  console.log('MESSAGE TYPE:', typeof message);
  console.log('MESSAGE KEYS:', message ? Object.keys(message) : 'null');
  if (message && message.topic) console.log('TOPIC:', message.topic);
  if (message && message.payload) {
    console.log('PAYLOAD:', JSON.stringify(message.payload).slice(0, 200));
  }
  console.log('---');
};

const onConnect = (client) => {
  console.log('Connected! Subscribing...');
  client.subscribe({
    subscriptions: [{
      topic: 'crypto_prices_chainlink',
      type: '*',
    }],
  });
};

const client = new RealTimeDataClient({ onMessage, onConnect });
client.connect();

setTimeout(() => process.exit(0), 8000);
