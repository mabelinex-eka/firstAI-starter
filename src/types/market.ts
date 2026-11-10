export type MarketCategory = 'overview' | 'indices' | 'stocks' | 'crypto' | 'forex' | 'futures' | 'bonds';

export type TechnicalRating = 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface MarketAsset {
  id: string;
  symbol: string;
  name: string;
  category: MarketCategory;
  exchange: string;
  price: number;
  prevClose: number;
  change: number;
  changePercent: number;
  high: number;
  low: number;
  open: number;
  volume: string;
  marketCap?: string;
  peRatio?: number;
  divYield?: string;
  rating: TechnicalRating;
  sector?: string;
  region?: 'US' | 'EU' | 'ASIA' | 'GLOBAL';
  sparkline: number[];
  candles: CandleData[];
  dayRange: { low: number; high: number };
  yearRange: { low: number; high: number };
  beta?: number;
  sharesOutstanding?: string;
  lastTick?: 'up' | 'down' | null;
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  relatedSymbols: string[];
  url?: string;
  readTime: string;
}

export interface EconomicEvent {
  id: string;
  time: string;
  country: string;
  flag: string;
  event: string;
  impact: 'high' | 'medium' | 'low';
  actual?: string;
  forecast: string;
  previous: string;
}

export interface SectorItem {
  id: string;
  name: string;
  changePercent: number;
  marketCapWeight: number; // e.g., 28 for Tech
  topSymbols: { symbol: string; changePercent: number; weight: number; name: string }[];
}
