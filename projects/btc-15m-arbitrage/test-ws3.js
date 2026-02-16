// Direct WebSocket to RTDS
const WebSocket = require('ws');

const ws = new WebSocket('wss://ws-live-data.polymarket.com/');

ws.on('open', () => {
  console.log('Connected!');
  // Subscribe to Chainlink prices
  ws.send(JSON.stringify({
    action: 'subscribe',
    subscriptions: [{
      topic: 'crypto_prices_chainlink',
      type: '*',
    }],
  }));
});

ws.on('message', (data) => {
  try {
    const msg = JSON.parse(data.toString());
    if (msg.topic === 'crypto_prices_chainlink' && msg.payload) {
      const { symbol, value } = msg.payload;
      console.log(`${symbol}: $${value}`);
    }
  } catch (e) {
    console.error('Parse error:', e.message);
  }
});

ws.on('error', (e) => console.error('Error:', e.message));
ws.on('close', () => console.log('Disconnected'));

setTimeout(() => { ws.close(); process.exit(0); }, 10000);
