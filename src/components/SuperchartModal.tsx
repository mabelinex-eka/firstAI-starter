import React, { useState, useMemo } from 'react';
import { MarketAsset, CandleData } from '../types/market';
import { TechnicalGauge } from './TechnicalGauge';
import {
  X,
  Maximize2,
  TrendingUp,
  TrendingDown,
  Star,
  Activity,
  Layers,
  Calendar,
  Share2,
  Clock,
  SlidersHorizontal,
  ChevronRight,
  Check,
} from 'lucide-react';

interface SuperchartModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (asset: MarketAsset) => void;
  onSelectRelatedSymbol?: (symbol: string) => void;
}

type ChartType = 'candles' | 'area' | 'line';
type Timeframe = '1D' | '5D' | '1M' | '6M' | 'YTD' | '1Y';

export const SuperchartModal: React.FC<SuperchartModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
  onSelectRelatedSymbol,
}) => {
  if (!asset) return null;

  const [chartType, setChartType] = useState<ChartType>('candles');
  const [timeframe, setTimeframe] = useState<Timeframe>('1M');
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandleData | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [simTradeSuccess, setSimTradeSuccess] = useState<string | null>(null);

  // Filter candles based on timeframe
  const candles = useMemo(() => {
    const all = asset.candles;
    switch (timeframe) {
      case '1D':
        return all.slice(-10);
      case '5D':
        return all.slice(-18);
      case '1M':
        return all.slice(-28);
      case '6M':
      case 'YTD':
      case '1Y':
      default:
        return all;
    }
  }, [asset.candles, timeframe]);

  // Calculate EMA helper
  const calculateEMA = (data: CandleData[], period: number) => {
    if (data.length < period) return [];
    const k = 2 / (period + 1);
    let emaArray: (number | null)[] = [];
    let prevEma = data.slice(0, period).reduce((sum, c) => sum + c.close, 0) / period;

    for (let i = 0; i < data.length; i++) {
      if (i < period - 1) {
        emaArray.push(null);
      } else if (i === period - 1) {
        emaArray.push(prevEma);
      } else {
        const currentEma = data[i].close * k + prevEma * (1 - k);
        emaArray.push(currentEma);
        prevEma = currentEma;
      }
    }
    return emaArray;
  };

  const ema20 = useMemo(() => calculateEMA(candles, 7), [candles]);
  const ema50 = useMemo(() => calculateEMA(candles, 14), [candles]);

  const activeCandle = hoveredCandle || (candles.length > 0 ? candles[candles.length - 1] : null);

  // SVG dimensions
  const svgWidth = 840;
  const svgHeight = 420;
  const padding = { top: 20, right: 70, bottom: 65, left: 16 };
  const chartWidth = svgWidth - padding.left - padding.right;
  const mainChartHeight = showVolume ? svgHeight - padding.top - padding.bottom - 75 : svgHeight - padding.top - padding.bottom;
  const volumeChartTop = padding.top + mainChartHeight + 15;
  const volumeHeight = 55;

  const minPrice = Math.min(...candles.map(c => c.low));
  const maxPrice = Math.max(...candles.map(c => c.high));
  const priceRange = maxPrice - minPrice || 1;
  const maxVolume = Math.max(...candles.map(c => c.volume), 1);

  const getYForPrice = (p: number) => {
    return padding.top + mainChartHeight - ((p - minPrice) / priceRange) * mainChartHeight;
  };

  const candleSpacing = chartWidth / (candles.length || 1);
  const candleBarWidth = Math.max(candleSpacing * 0.65, 3);

  // Points for Area / Line
  const linePoints = candles.map((c, i) => {
    const x = padding.left + i * candleSpacing + candleSpacing / 2;
    const y = getYForPrice(c.close);
    return { x, y };
  });

  const linePathD = linePoints.length > 0 ? `M ${linePoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}` : '';
  const areaPathD = linePoints.length > 0
    ? `${linePathD} L ${linePoints[linePoints.length - 1].x},${padding.top + mainChartHeight} L ${linePoints[0].x},${padding.top + mainChartHeight} Z`
    : '';

  // Generate EMA SVG paths
  const getEmaPath = (emaValues: (number | null)[]) => {
    const pts: string[] = [];
    emaValues.forEach((val, i) => {
      if (val !== null) {
        const x = padding.left + i * candleSpacing + candleSpacing / 2;
        const y = getYForPrice(val);
        pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
      }
    });
    return pts.length > 1 ? `M ${pts.join(' L ')}` : '';
  };

  const ema20Path = showEMA20 ? getEmaPath(ema20) : '';
  const ema50Path = showEMA50 ? getEmaPath(ema50) : '';

  // Format price helper
  const formatPrice = (val: number) => {
    if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  const isPositive = asset.changePercent >= 0;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSimTrade = (action: 'BUY' | 'SELL') => {
    setSimTradeSuccess(`Simulated ${action} 1 unit of ${asset.symbol} at $${formatPrice(asset.price)} executed!`);
    setTimeout(() => setSimTradeSuccess(null), 3500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-2 md:p-6 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[94vh] flex flex-col bg-[#ffffff] dark:bg-[#1e222d] text-[#131722] dark:text-[#d1d4dc] rounded-xl shadow-2xl border border-[#e0e3eb] dark:border-[#2a2e39] overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#191c24]">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                {asset.symbol}
              </span>
              <span className="text-xs text-[#787b86] hidden sm:inline">
                {asset.name}
              </span>
              <span className="text-[11px] text-[#787b86] font-mono px-1.5 py-0.5 rounded bg-[#e0e3eb]/60 dark:bg-[#2a2e39]/80">
                {asset.exchange}
              </span>
            </div>

            <div className="flex items-baseline gap-2 font-mono tabular-nums">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                ${formatPrice(asset.price)}
              </span>
              <span className={`text-sm font-semibold flex items-center gap-0.5 ${isPositive ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isPositive ? '+' : ''}{asset.change > 0 ? `+${asset.change}` : asset.change} ({isPositive ? '+' : ''}{asset.changePercent}%)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(asset)}
              className={`p-2 rounded-lg transition-colors border ${
                isWatchlisted
                  ? 'bg-amber-500/10 border-amber-500 text-amber-500'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white'
              }`}
              title={isWatchlisted ? 'Remove from Watchlist' : 'Add to Watchlist'}
            >
              <Star className={`w-4 h-4 ${isWatchlisted ? 'fill-current' : ''}`} />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Share Quote"
            >
              {copiedLink ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chart Toolbar */}
        <div className="flex items-center justify-between px-5 py-2 border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] text-xs gap-3 overflow-x-auto">
          {/* Timeframe selector */}
          <div className="flex items-center gap-1 bg-[#f0f3fa] dark:bg-[#131722] p-0.5 rounded-lg shrink-0">
            {(['1D', '5D', '1M', '6M', 'YTD', '1Y'] as Timeframe[]).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 rounded font-medium transition-all ${
                  timeframe === tf
                    ? 'bg-white dark:bg-[#2a2e39] text-blue-600 dark:text-[#2962ff] shadow-sm font-semibold'
                    : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Chart Type Selector */}
          <div className="flex items-center gap-1 bg-[#f0f3fa] dark:bg-[#131722] p-0.5 rounded-lg shrink-0">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                chartType === 'candles'
                  ? 'bg-white dark:bg-[#2a2e39] text-slate-900 dark:text-white shadow-sm'
                  : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Candles
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                chartType === 'area'
                  ? 'bg-white dark:bg-[#2a2e39] text-slate-900 dark:text-white shadow-sm'
                  : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Area
            </button>
            <button
              onClick={() => setChartType('line')}
              className={`px-2.5 py-1 rounded font-medium transition-all ${
                chartType === 'line'
                  ? 'bg-white dark:bg-[#2a2e39] text-slate-900 dark:text-white shadow-sm'
                  : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Line
            </button>
          </div>

          {/* Indicator Toggles */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowEMA20(!showEMA20)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                showEMA20
                  ? 'border-amber-500/50 text-amber-500 bg-amber-500/10'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              EMA 20
            </button>
            <button
              onClick={() => setShowEMA50(!showEMA50)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                showEMA50
                  ? 'border-blue-500/50 text-blue-500 bg-blue-500/10'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              EMA 50
            </button>
            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-1 rounded border text-[11px] font-medium transition-colors ${
                showVolume
                  ? 'border-emerald-500/50 text-emerald-500 bg-emerald-500/10'
                  : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]'
              }`}
            >
              Volume
            </button>
          </div>
        </div>

        {/* OHLC Bar */}
        <div className="flex items-center justify-between px-5 py-1.5 bg-[#f8f9fd] dark:bg-[#161a25] border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[11px] font-mono tabular-nums text-[#787b86] overflow-x-auto">
          {activeCandle && (
            <div className="flex items-center gap-4 shrink-0">
              <span className="text-slate-900 dark:text-[#d1d4dc] font-semibold">{activeCandle.time}</span>
              <span>O <strong className="text-slate-800 dark:text-slate-200">${formatPrice(activeCandle.open)}</strong></span>
              <span>H <strong className="text-slate-800 dark:text-slate-200">${formatPrice(activeCandle.high)}</strong></span>
              <span>L <strong className="text-slate-800 dark:text-slate-200">${formatPrice(activeCandle.low)}</strong></span>
              <span>C <strong className={activeCandle.close >= activeCandle.open ? 'text-[#089981]' : 'text-[#f23645]'}>${formatPrice(activeCandle.close)}</strong></span>
              {showVolume && <span>Vol <strong className="text-slate-800 dark:text-slate-200">{(activeCandle.volume / 1000000).toFixed(2)}M</strong></span>}
            </div>
          )}
          <span className="text-[10px] text-[#787b86] uppercase tracking-wider hidden sm:inline">
            Interactive Crosshair Active
          </span>
        </div>

        {/* Main Content Split: Chart on Left, Technical Overview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-4 flex-1 overflow-y-auto">
          {/* Chart Canvas Area */}
          <div className="lg:col-span-3 p-4 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#131722] relative">
            {simTradeSuccess && (
              <div className="absolute top-2 left-4 right-4 z-20 bg-emerald-600 text-white px-3 py-2 rounded-lg text-xs font-medium shadow-md flex items-center justify-between animate-fade-in">
                <span>{simTradeSuccess}</span>
                <button onClick={() => setSimTradeSuccess(null)}><X className="w-4 h-4" /></button>
              </div>
            )}

            <div className="w-full relative select-none">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto max-h-[440px] overflow-visible"
                onMouseLeave={() => setHoveredCandle(null)}
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2962ff" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#2962ff" stopOpacity={0.0} />
                  </linearGradient>
                </defs>

                {/* Horizontal Grid lines and Price Labels on right */}
                {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
                  const y = padding.top + mainChartHeight * pct;
                  const price = maxPrice - priceRange * pct;
                  return (
                    <g key={i}>
                      <line
                        x1={padding.left}
                        y1={y}
                        x2={padding.left + chartWidth}
                        y2={y}
                        stroke="#2a2e39"
                        strokeDasharray="3 3"
                        strokeOpacity={0.4}
                      />
                      <text
                        x={padding.left + chartWidth + 8}
                        y={y + 4}
                        fill="#787b86"
                        fontSize={10}
                        fontFamily="JetBrains Mono, monospace"
                      >
                        ${formatPrice(price)}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical Time Grid lines */}
                {candles.map((c, i) => {
                  if (i % Math.ceil(candles.length / 6) === 0) {
                    const x = padding.left + i * candleSpacing + candleSpacing / 2;
                    return (
                      <g key={i}>
                        <line
                          x1={x}
                          y1={padding.top}
                          x2={x}
                          y2={padding.top + mainChartHeight}
                          stroke="#2a2e39"
                          strokeDasharray="3 3"
                          strokeOpacity={0.3}
                        />
                        <text
                          x={x}
                          y={padding.top + mainChartHeight + (showVolume ? volumeHeight + 25 : 18)}
                          fill="#787b86"
                          fontSize={9}
                          textAnchor="middle"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          {c.time}
                        </text>
                      </g>
                    );
                  }
                  return null;
                })}

                {/* Render Selected Chart Type */}
                {chartType === 'area' && (
                  <>
                    <path d={areaPathD} fill="url(#chartGradient)" />
                    <path d={linePathD} fill="none" stroke="#2962ff" strokeWidth={2} />
                  </>
                )}

                {chartType === 'line' && (
                  <path d={linePathD} fill="none" stroke="#2962ff" strokeWidth={2} />
                )}

                {chartType === 'candles' && (
                  candles.map((c, i) => {
                    const xCenter = padding.left + i * candleSpacing + candleSpacing / 2;
                    const yOpen = getYForPrice(c.open);
                    const yClose = getYForPrice(c.close);
                    const yHigh = getYForPrice(c.high);
                    const yLow = getYForPrice(c.low);
                    const isGreen = c.close >= c.open;
                    const color = isGreen ? '#089981' : '#f23645';

                    const top = Math.min(yOpen, yClose);
                    const bodyHeight = Math.max(Math.abs(yClose - yOpen), 1.5);

                    return (
                      <g key={i} className="cursor-crosshair">
                        {/* Wick */}
                        <line
                          x1={xCenter}
                          y1={yHigh}
                          x2={xCenter}
                          y2={yLow}
                          stroke={color}
                          strokeWidth={1}
                        />
                        {/* Candle Body */}
                        <rect
                          x={xCenter - candleBarWidth / 2}
                          y={top}
                          width={candleBarWidth}
                          height={bodyHeight}
                          fill={color}
                          stroke={color}
                          strokeWidth={0.5}
                          rx={1}
                        />
                      </g>
                    );
                  })
                )}

                {/* EMA Curves */}
                {showEMA20 && ema20Path && (
                  <path d={ema20Path} fill="none" stroke="#f59e0b" strokeWidth={1.5} opacity={0.85} />
                )}
                {showEMA50 && ema50Path && (
                  <path d={ema50Path} fill="none" stroke="#3b82f6" strokeWidth={1.5} opacity={0.85} />
                )}

                {/* Volume Bars */}
                {showVolume && (
                  candles.map((c, i) => {
                    const xCenter = padding.left + i * candleSpacing + candleSpacing / 2;
                    const barH = (c.volume / maxVolume) * volumeHeight;
                    const y = volumeChartTop + volumeHeight - barH;
                    const isGreen = c.close >= c.open;

                    return (
                      <rect
                        key={`vol-${i}`}
                        x={xCenter - candleBarWidth / 2}
                        y={y}
                        width={candleBarWidth}
                        height={barH}
                        fill={isGreen ? '#089981' : '#f23645'}
                        opacity={0.35}
                      />
                    );
                  })
                )}

                {/* Interactive hover overlay columns */}
                {candles.map((c, i) => {
                  const x = padding.left + i * candleSpacing;
                  return (
                    <rect
                      key={`hit-${i}`}
                      x={x}
                      y={0}
                      width={candleSpacing}
                      height={svgHeight}
                      fill="transparent"
                      className="cursor-crosshair"
                      onMouseEnter={() => setHoveredCandle(c)}
                    />
                  );
                })}

                {/* Active Hover Crosshair Line */}
                {activeCandle && (
                  (() => {
                    const idx = candles.indexOf(activeCandle);
                    if (idx < 0) return null;
                    const x = padding.left + idx * candleSpacing + candleSpacing / 2;
                    const y = getYForPrice(activeCandle.close);

                    return (
                      <g pointerEvents="none">
                        {/* Vertical line */}
                        <line
                          x1={x}
                          y1={padding.top}
                          x2={x}
                          y2={padding.top + mainChartHeight}
                          stroke="#787b86"
                          strokeDasharray="2 2"
                          strokeWidth={1}
                        />
                        {/* Horizontal line */}
                        <line
                          x1={padding.left}
                          y1={y}
                          x2={padding.left + chartWidth}
                          stroke="#787b86"
                          strokeDasharray="2 2"
                          strokeWidth={1}
                        />
                        {/* Price badge on axis */}
                        <rect
                          x={padding.left + chartWidth}
                          y={y - 10}
                          width={65}
                          height={20}
                          fill="#2962ff"
                          rx={3}
                        />
                        <text
                          x={padding.left + chartWidth + 5}
                          y={y + 3}
                          fill="#ffffff"
                          fontSize={9}
                          fontWeight="bold"
                          fontFamily="JetBrains Mono, monospace"
                        >
                          ${formatPrice(activeCandle.close)}
                        </text>
                      </g>
                    );
                  })()
                )}
              </svg>
            </div>

            {/* Simulated Trade Execution Strip */}
            <div className="mt-3 pt-3 border-t border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimTrade('BUY')}
                  className="px-4 py-1.5 rounded-lg font-semibold text-xs text-white bg-[#089981] hover:bg-[#07856f] transition-colors shadow-sm flex items-center gap-1"
                >
                  Buy ${formatPrice(asset.price)}
                </button>
                <button
                  onClick={() => handleSimTrade('SELL')}
                  className="px-4 py-1.5 rounded-lg font-semibold text-xs text-white bg-[#f23645] hover:bg-[#d92a38] transition-colors shadow-sm flex items-center gap-1"
                >
                  Sell ${formatPrice(asset.price)}
                </button>
              </div>

              <div className="text-xs text-[#787b86] flex items-center gap-4">
                <span>Spread: <strong className="text-slate-800 dark:text-slate-200 font-mono">$0.02</strong></span>
                <span>Leverage: <strong className="text-slate-800 dark:text-slate-200 font-mono">1:1</strong></span>
              </div>
            </div>
          </div>

          {/* Right Info & Technical Analysis Panel */}
          <div className="p-5 flex flex-col justify-between bg-[#f8f9fd] dark:bg-[#191c24] space-y-6">
            {/* Technical Analysis Speedometer */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Technical Rating
                </span>
                <span className="text-[11px] text-[#787b86]">1-Day Summary</span>
              </div>
              <div className="py-2 bg-white dark:bg-[#1e222d] rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] p-3 flex justify-center">
                <TechnicalGauge rating={asset.rating} size="sm" />
              </div>
            </div>

            {/* Key Statistics */}
            <div className="space-y-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
                Key Metrics
              </span>

              {/* Day Range */}
              <div>
                <div className="flex justify-between text-[11px] text-[#787b86] mb-1 font-mono tabular-nums">
                  <span>Day Range</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    ${formatPrice(asset.dayRange.low)} - ${formatPrice(asset.dayRange.high)}
                  </span>
                </div>
                <div className="w-full bg-[#e0e3eb] dark:bg-[#2a2e39] h-1.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-blue-600 h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          ((asset.price - asset.dayRange.low) / (asset.dayRange.high - asset.dayRange.low || 1)) * 100,
                          5
                        ),
                        95
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* 52-Week Range */}
              <div>
                <div className="flex justify-between text-[11px] text-[#787b86] mb-1 font-mono tabular-nums">
                  <span>52-Week Range</span>
                  <span className="text-slate-800 dark:text-slate-200 font-medium">
                    ${formatPrice(asset.yearRange.low)} - ${formatPrice(asset.yearRange.high)}
                  </span>
                </div>
                <div className="w-full bg-[#e0e3eb] dark:bg-[#2a2e39] h-1.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-[#089981] h-full rounded-full"
                    style={{
                      width: `${Math.min(
                        Math.max(
                          ((asset.price - asset.yearRange.low) / (asset.yearRange.high - asset.yearRange.low || 1)) * 100,
                          5
                        ),
                        95
                      )}%`,
                    }}
                  />
                </div>
              </div>

              {/* Stat Grid */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e0e3eb] dark:border-[#2a2e39] text-xs font-mono tabular-nums">
                {asset.marketCap && (
                  <div className="bg-white dark:bg-[#1e222d] p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39]">
                    <div className="text-[10px] text-[#787b86]">Market Cap</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{asset.marketCap}</div>
                  </div>
                )}
                <div className="bg-white dark:bg-[#1e222d] p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39]">
                  <div className="text-[10px] text-[#787b86]">Volume</div>
                  <div className="font-semibold text-slate-900 dark:text-white">{asset.volume}</div>
                </div>
                {asset.peRatio && (
                  <div className="bg-white dark:bg-[#1e222d] p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39]">
                    <div className="text-[10px] text-[#787b86]">P/E Ratio</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{asset.peRatio}</div>
                  </div>
                )}
                {asset.divYield && (
                  <div className="bg-white dark:bg-[#1e222d] p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39]">
                    <div className="text-[10px] text-[#787b86]">Div Yield</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{asset.divYield}</div>
                  </div>
                )}
                {asset.beta && (
                  <div className="bg-white dark:bg-[#1e222d] p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39]">
                    <div className="text-[10px] text-[#787b86]">Beta (1Y)</div>
                    <div className="font-semibold text-slate-900 dark:text-white">{asset.beta}</div>
                  </div>
                )}
                <div className="bg-white dark:bg-[#1e222d] p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39]">
                  <div className="text-[10px] text-[#787b86]">Prev Close</div>
                  <div className="font-semibold text-slate-900 dark:text-white">${formatPrice(asset.prevClose)}</div>
                </div>
              </div>
            </div>

            {/* Quick Profile Bio */}
            <div className="pt-2 border-t border-[#e0e3eb] dark:border-[#2a2e39] text-xs text-[#787b86]">
              <span className="font-medium text-slate-900 dark:text-slate-300">Category:</span> {asset.category.toUpperCase()} · {asset.sector || 'Global Benchmark'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
