import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_MARKETS, INITIAL_NEWS, ECONOMIC_EVENTS } from './data/marketData';
import { MarketAsset, MarketCategory } from './types/market';
import { Navbar } from './components/Navbar';
import { TickerTape } from './components/TickerTape';
import { MarketsHeader } from './components/MarketsHeader';
import { HeroIndicesGrid } from './components/HeroIndicesGrid';
import { MarketMoversTable } from './components/MarketMoversTable';
import { HeatmapView } from './components/HeatmapView';
import { ForexMatrixView } from './components/ForexMatrixView';
import { BondsYieldCurveView } from './components/BondsYieldCurveView';
import { CryptoHubView } from './components/CryptoHubView';
import { NewsAndEventsSection } from './components/NewsAndEventsSection';
import { SuperchartModal } from './components/SuperchartModal';
import { WatchlistDrawer } from './components/WatchlistDrawer';
import { SearchModal } from './components/SearchModal';
import { Globe, Clock, Shield, Sparkles, TrendingUp, Layers, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [assets, setAssets] = useState<MarketAsset[]>(INITIAL_MARKETS);
  const [currentCategory, setCurrentCategory] = useState<MarketCategory>('overview');
  const [selectedRegion, setSelectedRegion] = useState<'ALL' | 'US' | 'EU' | 'ASIA' | 'GLOBAL'>('ALL');
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isWatchlistOpen, setIsWatchlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSimulating, setIsSimulating] = useState(true);
  const [isDark, setIsDark] = useState(true);

  // Load watchlist from local storage
  const [watchlistIds, setWatchlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('tv_watchlist_ids');
      return saved ? JSON.parse(saved) : ['nvda', 'btcusd', 'spx', 'aapl', 'tsla'];
    } catch {
      return ['nvda', 'btcusd', 'spx', 'aapl', 'tsla'];
    }
  });

  // Sync theme with HTML class
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [isDark]);

  // Save watchlist
  useEffect(() => {
    try {
      localStorage.setItem('tv_watchlist_ids', JSON.stringify(watchlistIds));
    } catch {}
  }, [watchlistIds]);

  // Global Keyboard shortcuts (Cmd+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Real-time market tick simulation engine
  useEffect(() => {
    if (!isSimulating) return;

    const interval = setInterval(() => {
      setAssets(prevAssets => {
        // Randomly pick 2-4 assets to tick
        const countToUpdate = Math.floor(Math.random() * 3) + 2;
        const indicesToUpdate = new Set<number>();
        while (indicesToUpdate.size < countToUpdate) {
          indicesToUpdate.add(Math.floor(Math.random() * prevAssets.length));
        }

        return prevAssets.map((asset, index) => {
          if (!indicesToUpdate.has(index)) return asset;

          const pctDelta = (Math.random() - 0.49) * 0.0035; // ~0.15% fluctuation
          const newPrice = Math.max(asset.price * (1 + pctDelta), 0.0001);
          const priceDiff = newPrice - asset.prevClose;
          const newChangePercent = (priceDiff / asset.prevClose) * 100;
          const tickDirection = newPrice >= asset.price ? 'up' : 'down';

          // Update last candle
          const updatedCandles = [...asset.candles];
          if (updatedCandles.length > 0) {
            const lastCandle = { ...updatedCandles[updatedCandles.length - 1] };
            lastCandle.close = Number(newPrice.toFixed(newPrice > 100 ? 2 : 4));
            lastCandle.high = Math.max(lastCandle.high, newPrice);
            lastCandle.low = Math.min(lastCandle.low, newPrice);
            updatedCandles[updatedCandles.length - 1] = lastCandle;
          }

          // Update sparkline
          const updatedSparkline = [...asset.sparkline.slice(1), newPrice];

          return {
            ...asset,
            price: Number(newPrice.toFixed(newPrice > 100 ? 2 : 4)),
            change: Number(priceDiff.toFixed(newPrice > 100 ? 2 : 4)),
            changePercent: Number(newChangePercent.toFixed(2)),
            high: Math.max(asset.high, newPrice),
            low: Math.min(asset.low, newPrice),
            sparkline: updatedSparkline,
            candles: updatedCandles,
            lastTick: tickDirection,
          };
        });
      });
    }, 2200);

    return () => clearInterval(interval);
  }, [isSimulating]);

  // Keep selectedAsset updated if it ticks
  useEffect(() => {
    if (selectedAsset) {
      const refreshed = assets.find(a => a.id === selectedAsset.id);
      if (refreshed && refreshed.price !== selectedAsset.price) {
        setSelectedAsset(refreshed);
      }
    }
  }, [assets, selectedAsset]);

  // Watchlist assets
  const watchlistAssets = useMemo(() => {
    return assets.filter(a => watchlistIds.includes(a.id));
  }, [assets, watchlistIds]);

  const handleToggleWatchlist = useCallback((asset: MarketAsset) => {
    setWatchlistIds(prev =>
      prev.includes(asset.id) ? prev.filter(id => id !== asset.id) : [...prev, asset.id]
    );
  }, []);

  const handleSelectSymbol = useCallback((symbol: string) => {
    const found = assets.find(a => a.symbol.toUpperCase() === symbol.toUpperCase() || a.id === symbol.toLowerCase());
    if (found) {
      setSelectedAsset(found);
    }
  }, [assets]);

  // Filtered assets by category and region
  const categoryAssets = useMemo(() => {
    let list = assets;
    if (currentCategory !== 'overview') {
      list = list.filter(a => a.category === currentCategory);
    }
    if (selectedRegion !== 'ALL') {
      list = list.filter(a => a.region === selectedRegion || a.region === 'GLOBAL');
    }
    return list;
  }, [assets, currentCategory, selectedRegion]);

  return (
    <div className="min-h-screen flex flex-col bg-[#ffffff] dark:bg-[#131722] text-[#131722] dark:text-[#d1d4dc] transition-colors">
      {/* 1. Global Navigation Bar */}
      <Navbar
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        onOpenSearch={() => setIsSearchOpen(true)}
        onToggleWatchlist={() => setIsWatchlistOpen(prev => !prev)}
        watchlistCount={watchlistIds.length}
        isDark={isDark}
        onToggleTheme={() => setIsDark(prev => !prev)}
        isSimulating={isSimulating}
        onToggleSimulation={() => setIsSimulating(prev => !prev)}
      />

      {/* 2. Top Running Ticker Tape */}
      <TickerTape
        assets={assets}
        onSelectAsset={setSelectedAsset}
      />

      {/* 3. Markets Sub-Navigation & Region Filter */}
      <MarketsHeader
        currentCategory={currentCategory}
        onSelectCategory={setCurrentCategory}
        selectedRegion={selectedRegion}
        onSelectRegion={setSelectedRegion}
      />

      {/* 4. Main Viewport Content */}
      <main className="flex-1 max-w-[1560px] w-full mx-auto px-4 md:px-6 py-6 space-y-8">
        {/* === SCREEN 1: OVERVIEW === */}
        {currentCategory === 'overview' && (
          <div className="space-y-8">
            {/* Hero Global Indices Cards */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  World Market Benchmarks
                </h2>
                <span className="text-xs text-[#787b86]">Click any asset for interactive Superchart</span>
              </div>
              <HeroIndicesGrid
                assets={assets}
                onSelectAsset={setSelectedAsset}
              />
            </div>

            {/* Market Movers Table */}
            <div>
              <div className="mb-3">
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Market Movers & Most Active
                </h2>
                <p className="text-xs text-[#787b86]">
                  Real-time top gainers, losers, and highest turnover instruments
                </p>
              </div>
              <MarketMoversTable
                assets={assets}
                onSelectAsset={setSelectedAsset}
              />
            </div>

            {/* S&P 500 Sector Heatmap */}
            <div className="pt-2">
              <HeatmapView
                allAssets={assets}
                onSelectSymbol={handleSelectSymbol}
              />
            </div>

            {/* Market News & Macro Calendar Split */}
            <div className="pt-2">
              <NewsAndEventsSection
                news={INITIAL_NEWS}
                events={ECONOMIC_EVENTS}
                onSelectSymbol={handleSelectSymbol}
              />
            </div>
          </div>
        )}

        {/* === SCREEN 2: INDICES === */}
        {currentCategory === 'indices' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Global Stock Market Indices
              </h2>
              <p className="text-xs text-[#787b86] mb-4">
                Real-time values, intraday changes, and technical ratings across North American, European, and Asian major benchmarks.
              </p>
              <HeroIndicesGrid
                assets={categoryAssets}
                onSelectAsset={setSelectedAsset}
              />
            </div>

            <MarketMoversTable
              assets={categoryAssets}
              onSelectAsset={setSelectedAsset}
              title="Major Regional Indices"
            />
          </div>
        )}

        {/* === SCREEN 3: STOCKS === */}
        {currentCategory === 'stocks' && (
          <div className="space-y-6">
            <HeatmapView
              allAssets={assets}
              onSelectSymbol={handleSelectSymbol}
            />

            <MarketMoversTable
              assets={categoryAssets}
              onSelectAsset={setSelectedAsset}
              title="U.S. & International Equities"
            />
          </div>
        )}

        {/* === SCREEN 4: CRYPTO === */}
        {currentCategory === 'crypto' && (
          <CryptoHubView
            cryptoAssets={categoryAssets}
            onSelectAsset={setSelectedAsset}
          />
        )}

        {/* === SCREEN 5: FOREX === */}
        {currentCategory === 'forex' && (
          <div className="space-y-6">
            <ForexMatrixView
              forexAssets={categoryAssets}
              onSelectAsset={setSelectedAsset}
            />

            <MarketMoversTable
              assets={categoryAssets}
              onSelectAsset={setSelectedAsset}
              title="Foreign Exchange Spot Quotes"
            />
          </div>
        )}

        {/* === SCREEN 6: FUTURES === */}
        {currentCategory === 'futures' && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-5 shadow-sm">
              <h2 className="text-base font-bold text-slate-900 dark:text-white mb-1">
                Commodities & Futures Contracts
              </h2>
              <p className="text-xs text-[#787b86] mb-4">
                Front-month continuous futures contracts for Energy (WTI, Brent, Nat Gas), Precious Metals (Gold, Silver), and Agriculture.
              </p>
              <HeroIndicesGrid
                assets={categoryAssets}
                onSelectAsset={setSelectedAsset}
              />
            </div>

            <MarketMoversTable
              assets={categoryAssets}
              onSelectAsset={setSelectedAsset}
              title="Continuous Futures Contracts"
            />
          </div>
        )}

        {/* === SCREEN 7: BONDS === */}
        {currentCategory === 'bonds' && (
          <BondsYieldCurveView
            bondAssets={categoryAssets}
            onSelectAsset={setSelectedAsset}
          />
        )}
      </main>

      {/* 5. Footer with Market Schedule & Disclaimers */}
      <footer className="border-t border-[#e0e3eb] dark:border-[#2a2e39] bg-[#ffffff] dark:bg-[#131722] py-8 text-xs text-[#787b86] transition-colors mt-12">
        <div className="max-w-[1560px] mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded bg-[#2962ff] flex items-center justify-center text-white text-[10px] font-black">
              TV
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">TradingView Markets Hub</span>
            <span>·</span>
            <span>All global quotes simulated in realtime</span>
          </div>

          <div className="flex items-center gap-5 text-[11px] font-mono tabular-nums">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> NYSE: Open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> NASDAQ: Open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> LSE: Open
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Crypto: 24/7 Live
            </span>
          </div>
        </div>
      </footer>

      {/* 6. Interactive TradingView Superchart Modal */}
      <SuperchartModal
        asset={selectedAsset}
        onClose={() => setSelectedAsset(null)}
        isWatchlisted={selectedAsset ? watchlistIds.includes(selectedAsset.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onSelectRelatedSymbol={handleSelectSymbol}
      />

      {/* 7. Watchlist & Alerts Sliding Drawer */}
      <WatchlistDrawer
        isOpen={isWatchlistOpen}
        onClose={() => setIsWatchlistOpen(false)}
        watchlist={watchlistAssets}
        onRemoveFromWatchlist={handleToggleWatchlist}
        onSelectAsset={setSelectedAsset}
        allAssets={assets}
        onAddToWatchlist={handleToggleWatchlist}
      />

      {/* 8. Global Quick Search Modal (Cmd+K) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        assets={assets}
        onSelectAsset={setSelectedAsset}
      />
    </div>
  );
}
