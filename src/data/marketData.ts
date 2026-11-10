import { MarketAsset, NewsItem, EconomicEvent, SectorItem, CandleData } from '../types/market';

// Realistic candle data generator for smooth charts
function generateRealisticCandles(basePrice: number, volatility: number = 0.015, count: number = 40): CandleData[] {
  const candles: CandleData[] = [];
  let currentClose = basePrice * (1 - volatility * (count / 4));
  const now = new Date('2026-11-09T18:00:00Z');

  for (let i = count - 1; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dayStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    const change = (Math.random() - 0.48) * volatility * currentClose;
    const open = currentClose;
    const close = Math.max(open + change, 0.001);
    const high = Math.max(open, close) + Math.random() * volatility * 0.7 * currentClose;
    const low = Math.min(open, close) - Math.random() * volatility * 0.7 * currentClose;
    const volume = Math.floor(Math.random() * 50000000 + 10000000);

    candles.push({
      time: dayStr,
      open: Number(open.toFixed(open > 100 ? 2 : open > 1 ? 3 : 5)),
      high: Number(high.toFixed(high > 100 ? 2 : high > 1 ? 3 : 5)),
      low: Number(low.toFixed(low > 100 ? 2 : low > 1 ? 3 : 5)),
      close: Number(close.toFixed(close > 100 ? 2 : close > 1 ? 3 : 5)),
      volume,
    });
    currentClose = close;
  }
  return candles;
}

function extractSparkline(candles: CandleData[]): number[] {
  return candles.slice(-20).map(c => c.close);
}

// Helper to construct asset
function createAsset(
  id: string,
  symbol: string,
  name: string,
  category: MarketAsset['category'],
  exchange: string,
  price: number,
  changePercent: number,
  volume: string,
  rating: MarketAsset['rating'],
  extra: Partial<MarketAsset> = {}
): MarketAsset {
  const change = (price * changePercent) / 100;
  const prevClose = price - change;
  const candles = generateRealisticCandles(price, category === 'crypto' ? 0.03 : 0.012, 35);
  // Ensure the last candle matches current price
  if (candles.length > 0) {
    candles[candles.length - 1].close = price;
  }
  const sparkline = extractSparkline(candles);
  const low = Math.min(...candles.map(c => c.low));
  const high = Math.max(...candles.map(c => c.high));

  return {
    id,
    symbol,
    name,
    category,
    exchange,
    price,
    prevClose: Number(prevClose.toFixed(2)),
    change: Number(change.toFixed(price > 100 ? 2 : 4)),
    changePercent: Number(changePercent.toFixed(2)),
    open: Number((price - change * 0.4).toFixed(2)),
    high: Number((price * 1.012).toFixed(2)),
    low: Number((price * 0.988).toFixed(2)),
    volume,
    rating,
    sparkline,
    candles,
    dayRange: {
      low: Number((price * 0.988).toFixed(2)),
      high: Number((price * 1.014).toFixed(2))
    },
    yearRange: {
      low: Number((low * 0.85).toFixed(2)),
      high: Number((high * 1.15).toFixed(2))
    },
    ...extra
  };
}

export const INITIAL_MARKETS: MarketAsset[] = [
  // --- INDICES ---
  createAsset('spx', 'S&P 500', 'S&P 500 Index', 'indices', 'INDEX', 5864.67, 0.74, '3.82B', 'Buy', {
    region: 'US',
    sector: 'Broad Market',
  }),
  createAsset('ndx', 'NDX', 'Nasdaq 100', 'indices', 'INDEX', 20498.12, 1.28, '4.91B', 'Strong Buy', {
    region: 'US',
    sector: 'Technology & Growth',
  }),
  createAsset('dji', 'DJI', 'Dow Jones Industrial Average', 'indices', 'INDEX', 43910.25, 0.59, '410M', 'Buy', {
    region: 'US',
    sector: 'Mega-Cap Industrials',
  }),
  createAsset('rut', 'RUT', 'Russell 2000', 'indices', 'INDEX', 2399.64, 1.48, '1.2B', 'Strong Buy', {
    region: 'US',
    sector: 'Small-Cap',
  }),
  createAsset('dax', 'DAX', 'DAX 40', 'indices', 'indices', 19254.90, -0.24, '84M', 'Neutral', {
    region: 'EU',
    sector: 'German Equities',
  }),
  createAsset('ftse', 'FTSE 100', 'FTSE 100 Index', 'indices', 'LSE', 8072.52, -0.31, '760M', 'Neutral', {
    region: 'EU',
    sector: 'UK Equities',
  }),
  createAsset('nikkei', 'N225', 'Nikkei 225', 'indices', 'TSE', 39500.37, 1.12, '1.4B', 'Buy', {
    region: 'ASIA',
    sector: 'Japan Equities',
  }),
  createAsset('hsi', 'HSI', 'Hang Seng Index', 'indices', 'HKEX', 20728.19, -0.65, '2.1B', 'Sell', {
    region: 'ASIA',
    sector: 'Hong Kong & China',
  }),
  createAsset('sx5e', 'SX5E', 'Euro Stoxx 50', 'indices', 'STOXX', 4803.11, -0.18, '510M', 'Neutral', {
    region: 'EU',
    sector: 'Eurozone Bluechips',
  }),

  // --- STOCKS ---
  createAsset('nvda', 'NVDA', 'NVIDIA Corporation', 'stocks', 'NASDAQ', 147.52, 3.42, '78.4M', 'Strong Buy', {
    marketCap: '3.62T',
    peRatio: 54.2,
    divYield: '0.03%',
    sector: 'Technology',
    region: 'US',
    beta: 1.68,
  }),
  createAsset('aapl', 'AAPL', 'Apple Inc.', 'stocks', 'NASDAQ', 227.48, 0.82, '52.1M', 'Buy', {
    marketCap: '3.44T',
    peRatio: 33.8,
    divYield: '0.44%',
    sector: 'Technology',
    region: 'US',
    beta: 1.04,
  }),
  createAsset('msft', 'MSFT', 'Microsoft Corporation', 'stocks', 'NASDAQ', 422.54, 1.15, '23.8M', 'Strong Buy', {
    marketCap: '3.14T',
    peRatio: 34.6,
    divYield: '0.78%',
    sector: 'Technology',
    region: 'US',
    beta: 1.12,
  }),
  createAsset('googl', 'GOOGL', 'Alphabet Inc. Class A', 'stocks', 'NASDAQ', 181.75, 1.94, '28.3M', 'Strong Buy', {
    marketCap: '2.25T',
    peRatio: 22.4,
    divYield: '0.44%',
    sector: 'Communication',
    region: 'US',
    beta: 1.08,
  }),
  createAsset('amzn', 'AMZN', 'Amazon.com Inc.', 'stocks', 'NASDAQ', 208.18, 1.45, '39.7M', 'Strong Buy', {
    marketCap: '2.18T',
    peRatio: 41.5,
    sector: 'Consumer Cyclical',
    region: 'US',
    beta: 1.16,
  }),
  createAsset('meta', 'META', 'Meta Platforms Inc.', 'stocks', 'NASDAQ', 589.34, 2.38, '18.9M', 'Strong Buy', {
    marketCap: '1.49T',
    peRatio: 27.8,
    divYield: '0.34%',
    sector: 'Communication',
    region: 'US',
    beta: 1.22,
  }),
  createAsset('tsla', 'TSLA', 'Tesla Inc.', 'stocks', 'NASDAQ', 321.22, 8.19, '94.6M', 'Strong Buy', {
    marketCap: '1.03T',
    peRatio: 88.4,
    sector: 'Consumer Cyclical',
    region: 'US',
    beta: 2.34,
  }),
  createAsset('pltr', 'PLTR', 'Palantir Technologies', 'stocks', 'NYSE', 59.88, 5.41, '64.1M', 'Strong Buy', {
    marketCap: '134.2B',
    peRatio: 112.5,
    sector: 'Technology',
    region: 'US',
    beta: 2.45,
  }),
  createAsset('amd', 'AMD', 'Advanced Micro Devices', 'stocks', 'NASDAQ', 148.60, 2.85, '44.8M', 'Buy', {
    marketCap: '240.8B',
    peRatio: 46.2,
    sector: 'Technology',
    region: 'US',
    beta: 1.72,
  }),
  createAsset('jpm', 'JPM', 'JPMorgan Chase & Co.', 'stocks', 'NYSE', 239.50, 1.10, '12.4M', 'Buy', {
    marketCap: '678.5B',
    peRatio: 12.8,
    divYield: '2.09%',
    sector: 'Financials',
    region: 'US',
    beta: 1.11,
  }),
  createAsset('lly', 'LLY', 'Eli Lilly and Company', 'stocks', 'NYSE', 824.10, -1.24, '4.2M', 'Neutral', {
    marketCap: '782.4B',
    peRatio: 62.1,
    divYield: '0.63%',
    sector: 'Healthcare',
    region: 'US',
    beta: 0.74,
  }),
  createAsset('xom', 'XOM', 'Exxon Mobil Corp.', 'stocks', 'NYSE', 119.82, -0.68, '16.1M', 'Neutral', {
    marketCap: '474.3B',
    peRatio: 13.9,
    divYield: '3.31%',
    sector: 'Energy',
    region: 'US',
    beta: 0.95,
  }),
  createAsset('asml', 'ASML', 'ASML Holding N.V.', 'stocks', 'NASDAQ', 674.30, 2.15, '2.8M', 'Buy', {
    marketCap: '266.1B',
    peRatio: 36.4,
    divYield: '0.98%',
    sector: 'Technology',
    region: 'EU',
    beta: 1.35,
  }),

  // --- CRYPTO ---
  createAsset('btcusd', 'BTC/USD', 'Bitcoin', 'crypto', 'BINANCE', 89450.00, 4.85, '$48.2B', 'Strong Buy', {
    marketCap: '$1.76T',
    sector: 'Layer 1 / Store of Value',
    region: 'GLOBAL',
  }),
  createAsset('ethusd', 'ETH/USD', 'Ethereum', 'crypto', 'BINANCE', 3145.80, 3.22, '$24.6B', 'Buy', {
    marketCap: '$378.4B',
    sector: 'Smart Contracts',
    region: 'GLOBAL',
  }),
  createAsset('solusd', 'SOL/USD', 'Solana', 'crypto', 'BINANCE', 214.30, 6.74, '$8.9B', 'Strong Buy', {
    marketCap: '$101.2B',
    sector: 'High Performance L1',
    region: 'GLOBAL',
  }),
  createAsset('xrpusd', 'XRP/USD', 'XRP Ledger', 'crypto', 'BINANCE', 0.624, 8.45, '$4.1B', 'Strong Buy', {
    marketCap: '$35.2B',
    sector: 'Cross-Border Payments',
    region: 'GLOBAL',
  }),
  createAsset('bnbusd', 'BNB/USD', 'BNB Chain', 'crypto', 'BINANCE', 642.10, 1.84, '$1.8B', 'Buy', {
    marketCap: '$93.4B',
    sector: 'Exchange Ecosystem',
    region: 'GLOBAL',
  }),
  createAsset('dogeusd', 'DOGE/USD', 'Dogecoin', 'crypto', 'BINANCE', 0.288, 14.20, '$5.4B', 'Strong Buy', {
    marketCap: '$42.1B',
    sector: 'Memes & Community',
    region: 'GLOBAL',
  }),
  createAsset('adausd', 'ADA/USD', 'Cardano', 'crypto', 'BINANCE', 0.582, 4.12, '$1.2B', 'Buy', {
    marketCap: '$20.6B',
    sector: 'Proof of Stake L1',
    region: 'GLOBAL',
  }),
  createAsset('avaxusd', 'AVAX/USD', 'Avalanche', 'crypto', 'BINANCE', 33.40, 5.10, '$890M', 'Buy', {
    marketCap: '$13.6B',
    sector: 'Subnets & Scaling',
    region: 'GLOBAL',
  }),
  createAsset('suiusd', 'SUI/USD', 'Sui Network', 'crypto', 'BINANCE', 3.24, 11.80, '$2.4B', 'Strong Buy', {
    marketCap: '$9.2B',
    sector: 'Move VM L1',
    region: 'GLOBAL',
  }),

  // --- FOREX ---
  createAsset('eurusd', 'EUR/USD', 'Euro / US Dollar', 'forex', 'FXCM', 1.0718, -0.15, '124B', 'Sell', {
    region: 'GLOBAL',
    sector: 'Majors',
  }),
  createAsset('usdjpy', 'USD/JPY', 'US Dollar / Japanese Yen', 'forex', 'FXCM', 153.42, 0.45, '98B', 'Strong Buy', {
    region: 'GLOBAL',
    sector: 'Majors',
  }),
  createAsset('gbpusd', 'GBP/USD', 'British Pound / US Dollar', 'forex', 'FXCM', 1.2915, -0.22, '74B', 'Neutral', {
    region: 'GLOBAL',
    sector: 'Majors',
  }),
  createAsset('usdchf', 'USD/CHF', 'US Dollar / Swiss Franc', 'forex', 'FXCM', 0.8744, 0.31, '42B', 'Buy', {
    region: 'GLOBAL',
    sector: 'Majors',
  }),
  createAsset('audusd', 'AUD/USD', 'Australian Dollar / US Dollar', 'forex', 'FXCM', 0.6582, -0.40, '51B', 'Sell', {
    region: 'GLOBAL',
    sector: 'Commodity Currencies',
  }),
  createAsset('usdcad', 'USD/CAD', 'US Dollar / Canadian Dollar', 'forex', 'FXCM', 1.3912, 0.28, '46B', 'Buy', {
    region: 'GLOBAL',
    sector: 'Commodity Currencies',
  }),
  createAsset('eurgbp', 'EUR/GBP', 'Euro / British Pound', 'forex', 'FXCM', 0.8298, 0.08, '38B', 'Neutral', {
    region: 'GLOBAL',
    sector: 'Crosses',
  }),
  createAsset('eurjpy', 'EUR/JPY', 'Euro / Japanese Yen', 'forex', 'FXCM', 164.44, 0.30, '49B', 'Buy', {
    region: 'GLOBAL',
    sector: 'Crosses',
  }),

  // --- FUTURES & COMMODITIES ---
  createAsset('cl1', 'CL1!', 'Crude Oil WTI', 'futures', 'NYMEX', 68.42, -1.85, '420K', 'Sell', {
    sector: 'Energy',
    region: 'GLOBAL',
  }),
  createAsset('brent', 'B1!', 'Brent Crude Oil', 'futures', 'ICE', 72.15, -1.62, '310K', 'Sell', {
    sector: 'Energy',
    region: 'GLOBAL',
  }),
  createAsset('ng1', 'NG1!', 'Natural Gas', 'futures', 'NYMEX', 2.685, 3.42, '185K', 'Buy', {
    sector: 'Energy',
    region: 'GLOBAL',
  }),
  createAsset('xauusd', 'XAU/USD', 'Gold Spot / US Dollar', 'futures', 'COMEX', 2682.40, 0.85, '820M', 'Strong Buy', {
    sector: 'Precious Metals',
    region: 'GLOBAL',
  }),
  createAsset('xagusd', 'XAG/USD', 'Silver Spot / US Dollar', 'futures', 'COMEX', 31.42, 1.48, '340M', 'Buy', {
    sector: 'Precious Metals',
    region: 'GLOBAL',
  }),
  createAsset('hg1', 'HG1!', 'High Grade Copper', 'futures', 'COMEX', 4.312, 0.65, '85K', 'Buy', {
    sector: 'Industrial Metals',
    region: 'GLOBAL',
  }),
  createAsset('zc1', 'ZC1!', 'Corn Futures', 'futures', 'CBOT', 431.50, -0.42, '110K', 'Neutral', {
    sector: 'Agriculture',
    region: 'GLOBAL',
  }),
  createAsset('zw1', 'ZW1!', 'Wheat Futures', 'futures', 'CBOT', 572.25, -0.80, '95K', 'Sell', {
    sector: 'Agriculture',
    region: 'GLOBAL',
  }),

  // --- BONDS & YIELDS ---
  createAsset('us10y', 'US10Y', 'U.S. 10 Year Treasury Yield', 'bonds', 'US TREASURY', 4.432, 0.045, '18.2B', 'Buy', {
    region: 'US',
    sector: 'Government Bonds',
  }),
  createAsset('us02y', 'US02Y', 'U.S. 2 Year Treasury Yield', 'bonds', 'US TREASURY', 4.258, 0.028, '24.1B', 'Buy', {
    region: 'US',
    sector: 'Government Bonds',
  }),
  createAsset('us05y', 'US05Y', 'U.S. 5 Year Treasury Yield', 'bonds', 'US TREASURY', 4.312, 0.035, '16.5B', 'Buy', {
    region: 'US',
    sector: 'Government Bonds',
  }),
  createAsset('us30y', 'US30Y', 'U.S. 30 Year Treasury Yield', 'bonds', 'US TREASURY', 4.618, 0.041, '12.8B', 'Buy', {
    region: 'US',
    sector: 'Government Bonds',
  }),
  createAsset('de10y', 'DE10Y', 'Germany 10Y Bund Yield', 'bonds', 'DEUTSCHE BUNDESBANK', 2.368, -0.012, '8.4B', 'Neutral', {
    region: 'EU',
    sector: 'European Sovereign',
  }),
  createAsset('gb10y', 'GB10Y', 'UK 10 Year Gilt Yield', 'bonds', 'BANK OF ENGLAND', 4.441, 0.019, '6.7B', 'Buy', {
    region: 'EU',
    sector: 'UK Sovereign',
  }),
  createAsset('jp10y', 'JP10Y', 'Japan 10 Year JGB Yield', 'bonds', 'BANK OF JAPAN', 1.002, 0.014, '5.2B', 'Neutral', {
    region: 'ASIA',
    sector: 'Asian Sovereign',
  }),
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'n1',
    title: 'NVIDIA rallies to fresh high as hyperscalers boost next-gen Blackwell cluster orders',
    source: 'Bloomberg Markets',
    timeAgo: '18m ago',
    category: 'Technology',
    relatedSymbols: ['NVDA', 'MSFT', 'GOOGL'],
    readTime: '3 min read',
  },
  {
    id: 'n2',
    title: 'Federal Reserve officials signal gradual easing pace as economic growth resilient',
    source: 'Reuters Financial',
    timeAgo: '42m ago',
    category: 'Central Banks',
    relatedSymbols: ['SPX', 'US10Y', 'EURUSD'],
    readTime: '4 min read',
  },
  {
    id: 'n3',
    title: 'Bitcoin pushes towards $90,000 threshold powered by historic spot ETF inflows',
    source: 'CoinDesk Pro',
    timeAgo: '1h ago',
    category: 'Crypto',
    relatedSymbols: ['BTC/USD', 'ETH/USD', 'SOL/USD'],
    readTime: '2 min read',
  },
  {
    id: 'n4',
    title: 'Oil slips below $70 on rising US stockpiles and China industrial demand reassessment',
    source: 'Wall Street Journal',
    timeAgo: '2h ago',
    category: 'Commodities',
    relatedSymbols: ['CL1!', 'B1!', 'XOM'],
    readTime: '4 min read',
  },
  {
    id: 'n5',
    title: 'European stocks steady as defense and aerospace outperform broader Stoxx 600 index',
    source: 'Financial Times',
    timeAgo: '3h ago',
    category: 'Equities',
    relatedSymbols: ['SX5E', 'DAX', 'FTSE 100'],
    readTime: '3 min read',
  },
];

export const ECONOMIC_EVENTS: EconomicEvent[] = [
  {
    id: 'e1',
    time: '08:30 EST',
    country: 'United States',
    flag: '🇺🇸',
    event: 'CPI Inflation YoY (Oct)',
    impact: 'high',
    actual: '2.6%',
    forecast: '2.6%',
    previous: '2.4%',
  },
  {
    id: 'e2',
    time: '14:00 EST',
    country: 'United States',
    flag: '🇺🇸',
    event: 'FOMC Interest Rate Decision',
    impact: 'high',
    actual: '4.75%',
    forecast: '4.75%',
    previous: '5.00%',
  },
  {
    id: 'e3',
    time: '03:00 GMT',
    country: 'United Kingdom',
    flag: '🇬🇧',
    event: 'GDP Monthly Growth (MoM)',
    impact: 'medium',
    actual: '0.1%',
    forecast: '0.2%',
    previous: '0.2%',
  },
  {
    id: 'e4',
    time: '07:45 CET',
    country: 'Eurozone',
    flag: '🇪🇺',
    event: 'ECB Main Refinancing Rate',
    impact: 'high',
    actual: '3.40%',
    forecast: '3.40%',
    previous: '3.65%',
  },
  {
    id: 'e5',
    time: '19:30 JST',
    country: 'Japan',
    flag: '🇯🇵',
    event: 'BoJ Governor Ueda Speech',
    impact: 'medium',
    forecast: '-',
    previous: '-',
  },
];

export const SECTORS_DATA: SectorItem[] = [
  {
    id: 'tech',
    name: 'Technology',
    changePercent: 2.18,
    marketCapWeight: 31,
    topSymbols: [
      { symbol: 'NVDA', changePercent: 3.42, weight: 12, name: 'NVIDIA' },
      { symbol: 'AAPL', changePercent: 0.82, weight: 11, name: 'Apple' },
      { symbol: 'MSFT', changePercent: 1.15, weight: 10, name: 'Microsoft' },
      { symbol: 'AVGO', changePercent: 2.80, weight: 5, name: 'Broadcom' },
    ],
  },
  {
    id: 'comm',
    name: 'Communication Services',
    changePercent: 1.84,
    marketCapWeight: 10,
    topSymbols: [
      { symbol: 'GOOGL', changePercent: 1.94, weight: 5, name: 'Alphabet' },
      { symbol: 'META', changePercent: 2.38, weight: 5, name: 'Meta' },
      { symbol: 'NFLX', changePercent: 1.10, weight: 2, name: 'Netflix' },
    ],
  },
  {
    id: 'cyclical',
    name: 'Consumer Cyclical',
    changePercent: 2.65,
    marketCapWeight: 11,
    topSymbols: [
      { symbol: 'AMZN', changePercent: 1.45, weight: 6, name: 'Amazon' },
      { symbol: 'TSLA', changePercent: 8.19, weight: 4, name: 'Tesla' },
      { symbol: 'HD', changePercent: 0.35, weight: 2, name: 'Home Depot' },
    ],
  },
  {
    id: 'fin',
    name: 'Financials',
    changePercent: 0.92,
    marketCapWeight: 13,
    topSymbols: [
      { symbol: 'JPM', changePercent: 1.10, weight: 4, name: 'JPMorgan' },
      { symbol: 'BAC', changePercent: 1.45, weight: 2, name: 'Bank of America' },
      { symbol: 'V', changePercent: 0.65, weight: 3, name: 'Visa' },
    ],
  },
  {
    id: 'health',
    name: 'Healthcare',
    changePercent: -0.45,
    marketCapWeight: 11,
    topSymbols: [
      { symbol: 'LLY', changePercent: -1.24, weight: 4, name: 'Eli Lilly' },
      { symbol: 'UNH', changePercent: -0.15, weight: 3, name: 'UnitedHealth' },
      { symbol: 'JNJ', changePercent: 0.20, weight: 2, name: 'Johnson & Johnson' },
    ],
  },
  {
    id: 'industrials',
    name: 'Industrials',
    changePercent: 0.78,
    marketCapWeight: 9,
    topSymbols: [
      { symbol: 'CAT', changePercent: 1.40, weight: 2, name: 'Caterpillar' },
      { symbol: 'GE', changePercent: 1.85, weight: 2, name: 'GE Aerospace' },
      { symbol: 'BA', changePercent: -0.85, weight: 1.5, name: 'Boeing' },
    ],
  },
  {
    id: 'energy',
    name: 'Energy',
    changePercent: -0.95,
    marketCapWeight: 4,
    topSymbols: [
      { symbol: 'XOM', changePercent: -0.68, weight: 2, name: 'Exxon Mobil' },
      { symbol: 'CVX', changePercent: -1.12, weight: 1.5, name: 'Chevron' },
    ],
  },
  {
    id: 'utilities',
    name: 'Utilities',
    changePercent: 0.15,
    marketCapWeight: 3,
    topSymbols: [
      { symbol: 'NEE', changePercent: 0.45, weight: 1.2, name: 'NextEra Energy' },
      { symbol: 'SO', changePercent: -0.10, weight: 0.8, name: 'Southern Co' },
    ],
  },
];

export const FOREX_CROSS_CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY', 'CHF', 'CAD', 'AUD'];

export const FOREX_RATES_MATRIX: Record<string, Record<string, number>> = {
  USD: { USD: 1.0000, EUR: 0.9330, GBP: 0.7743, JPY: 153.42, CHF: 0.8744, CAD: 1.3912, AUD: 1.5193 },
  EUR: { USD: 1.0718, EUR: 1.0000, GBP: 0.8298, JPY: 164.44, CHF: 0.9372, CAD: 1.4910, AUD: 1.6283 },
  GBP: { USD: 1.2915, EUR: 1.2051, GBP: 1.0000, JPY: 198.15, CHF: 1.1293, CAD: 1.7967, AUD: 1.9622 },
  JPY: { USD: 0.0065, EUR: 0.0061, GBP: 0.0050, JPY: 1.0000, CHF: 0.0057, CAD: 0.0091, AUD: 0.0099 },
  CHF: { USD: 1.1436, EUR: 1.0670, GBP: 0.8855, JPY: 175.45, CHF: 1.0000, CAD: 1.5910, AUD: 1.7375 },
  CAD: { USD: 0.7188, EUR: 0.6707, GBP: 0.5566, JPY: 110.28, CHF: 0.6285, CAD: 1.0000, AUD: 1.0921 },
  AUD: { USD: 0.6582, EUR: 0.6141, GBP: 0.5096, JPY: 100.98, CHF: 0.5755, CAD: 0.9157, AUD: 1.0000 },
};

export const YIELD_CURVE_DATA = [
  { maturity: '1M', current: 4.58, monthAgo: 4.82 },
  { maturity: '3M', current: 4.52, monthAgo: 4.75 },
  { maturity: '6M', current: 4.41, monthAgo: 4.60 },
  { maturity: '1Y', current: 4.30, monthAgo: 4.42 },
  { maturity: '2Y', current: 4.26, monthAgo: 4.02 },
  { maturity: '5Y', current: 4.31, monthAgo: 4.08 },
  { maturity: '10Y', current: 4.43, monthAgo: 4.18 },
  { maturity: '20Y', current: 4.71, monthAgo: 4.48 },
  { maturity: '30Y', current: 4.62, monthAgo: 4.40 },
];
