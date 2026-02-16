# Trading Charts for React - Deep Dive

*Research for Trepa mobile trading interface*

---

## Industry Standard: TradingView Lightweight Charts

**This is what most crypto trading apps use** (Phantom, Jupiter Pro, Birdeye-powered apps, etc.)

### Why Everyone Uses It
- **Free & open source** (Apache 2.0)
- **Tiny bundle** (~45kb gzipped)
- **Familiar UX** - looks like TradingView, users already know it
- **Real-time updates** built-in
- **Mobile-optimized** - touch interactions, responsive

### Install
```bash
npm install lightweight-charts
# or
yarn add lightweight-charts
```

### Basic React Component (Candlestick)

```jsx
import { useEffect, useRef } from 'react';
import { createChart, CandlestickSeries } from 'lightweight-charts';

export function TradingChart({ data }) {
  const chartContainerRef = useRef();
  const chartRef = useRef();

  useEffect(() => {
    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { color: '#1a1a1a' },
        textColor: '#d1d4dc',
      },
      grid: {
        vertLines: { color: '#2B2B43' },
        horzLines: { color: '#2B2B43' },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
    });

    // Add candlestick series
    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    // Set data
    candlestickSeries.setData(data);

    // Fit content
    chart.timeScale().fitContent();

    chartRef.current = { chart, candlestickSeries };

    // Cleanup
    return () => chart.remove();
  }, []);

  // Real-time update function
  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      chartRef.current.candlestickSeries.update(data[data.length - 1]);
    }
  }, [data]);

  return <div ref={chartContainerRef} />;
}
```

### Data Format (OHLCV)
```js
const data = [
  { time: '2024-01-01', open: 100, high: 105, low: 98, close: 103 },
  { time: '2024-01-02', open: 103, high: 110, low: 101, close: 108 },
  // Unix timestamps also work:
  { time: 1704067200, open: 108, high: 112, low: 106, close: 110 },
];
```

### Real-Time Updates (WebSocket)
```jsx
useEffect(() => {
  const ws = new WebSocket('wss://your-price-feed');
  
  ws.onmessage = (event) => {
    const tick = JSON.parse(event.data);
    // Update the last candle or add new one
    chartRef.current.candlestickSeries.update({
      time: tick.time,
      open: tick.open,
      high: tick.high,
      low: tick.low,
      close: tick.close,
    });
  };

  return () => ws.close();
}, []);
```

---

## For React Native (Mobile)

Lightweight Charts is web-only (HTML5 Canvas). For React Native, you have 3 options:

### Option 1: WebView Wrapper (Most Common)
Wrap lightweight-charts in a WebView. This is how most trading apps do it.

```jsx
import { WebView } from 'react-native-webview';

const chartHtml = `
  <!DOCTYPE html>
  <html>
  <head>
    <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
  </head>
  <body style="margin:0">
    <div id="chart"></div>
    <script>
      const chart = LightweightCharts.createChart(document.getElementById('chart'), {
        width: window.innerWidth,
        height: window.innerHeight,
      });
      // ... rest of chart setup
    </script>
  </body>
  </html>
`;

export function MobileChart() {
  return (
    <WebView
      source={{ html: chartHtml }}
      style={{ flex: 1 }}
      scrollEnabled={false}
    />
  );
}
```

### Option 2: react-native-wagmi-charts
Native implementation, good for simple line/candle charts.

```bash
npm install react-native-wagmi-charts react-native-reanimated react-native-gesture-handler
```

```jsx
import { CandlestickChart } from 'react-native-wagmi-charts';

<CandlestickChart.Provider data={data}>
  <CandlestickChart height={300}>
    <CandlestickChart.Candles />
    <CandlestickChart.Crosshair />
  </CandlestickChart>
</CandlestickChart.Provider>
```

### Option 3: Victory Native
From Formidable, good for general charts but not trading-specific.

---

## Data Sources for Solana

You need OHLCV data. Options:

| Source | Free Tier | Best For |
|--------|-----------|----------|
| **Birdeye API** | Yes (limited) | Solana tokens, real-time |
| **Jupiter Price API** | Yes | Token prices, simple |
| **DexScreener** | Yes | Multi-chain, OHLCV |
| **Pyth Network** | Yes | Oracle prices, real-time |
| **Helius** | Yes | Historical, webhooks |

### Birdeye WebSocket (Real-time OHLCV)
```js
const ws = new WebSocket('wss://public-api.birdeye.so/socket/solana');
ws.send(JSON.stringify({
  type: 'SUBSCRIBE_PRICE',
  data: { address: 'TOKEN_ADDRESS', type: '1m' } // 1m, 5m, 15m, 1H, etc.
}));
```

---

## Quick Comparison

| Library | Bundle | Trading Features | React Native | License |
|---------|--------|------------------|--------------|---------|
| **TradingView Lightweight** | 45kb | ⭐⭐⭐⭐⭐ | WebView | Free |
| **TradingView Charting Lib** | Large | ⭐⭐⭐⭐⭐ | WebView | License req |
| **react-native-wagmi-charts** | Small | ⭐⭐⭐ | Native | Free |
| **Apache ECharts** | 400kb+ | ⭐⭐⭐⭐ | WebView | Free |
| **ApexCharts** | 130kb | ⭐⭐⭐ | WebView | Free |

---

## Recommendation for Trepa

**React Web:** Use `lightweight-charts` directly. It's what the industry uses.

**React Native:** Use `lightweight-charts` in a WebView. Communicate via `postMessage` for real-time updates. This gives you the exact same UX as the web version and is how Phantom/Jupiter likely do it.

---

## Resources

- [Lightweight Charts Docs](https://tradingview.github.io/lightweight-charts/)
- [React Tutorial](https://tradingview.github.io/lightweight-charts/tutorials/react/simple)
- [Real-time Demo](https://tradingview.github.io/lightweight-charts/tutorials/demos/realtime-updates)
- [GitHub](https://github.com/tradingview/lightweight-charts)
- [Birdeye API Docs](https://docs.birdeye.so/)

---

*Compiled: Feb 5, 2026*
