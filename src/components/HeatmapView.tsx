import React from 'react';
import { SECTORS_DATA } from '../data/marketData';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface HeatmapViewProps {
  onSelectSymbol: (symbol: string) => void;
  allAssets: MarketAsset[];
}

export const HeatmapView: React.FC<HeatmapViewProps> = ({ onSelectSymbol, allAssets }) => {
  // Helper for color coding heat tile
  const getTileBg = (change: number) => {
    if (change >= 3) return 'bg-[#089981] text-white';
    if (change >= 1.5) return 'bg-[#10b981] text-white';
    if (change >= 0.3) return 'bg-[#059669]/90 text-white';
    if (change >= -0.3) return 'bg-[#374151] text-gray-200';
    if (change >= -1.5) return 'bg-[#ef4444]/90 text-white';
    return 'bg-[#dc2626] text-white';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>S&P 500 & Sector Performance Heatmap</span>
            <span className="text-[11px] font-normal text-[#787b86]">Market Cap Weighted</span>
          </h3>
          <p className="text-xs text-[#787b86] mt-0.5">
            Click any company or sector block to inspect realtime charts and technical meters
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] font-mono tabular-nums text-[#787b86]">
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#dc2626]" /> -3%+
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#ef4444]" /> -1.5%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#374151]" /> 0.0%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#059669]" /> +1.5%
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#089981]" /> +3%+
          </span>
        </div>
      </div>

      {/* Grid of Sector Heatmap Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {SECTORS_DATA.map(sec => {
          const isSecPos = sec.changePercent >= 0;
          return (
            <div
              key={sec.id}
              className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-3 flex flex-col justify-between hover:border-blue-500/50 transition-all shadow-sm"
            >
              {/* Sector Header */}
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#e0e3eb] dark:border-[#2a2e39]">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{sec.name}</h4>
                  <span className="text-[10px] text-[#787b86]">Weight: {sec.marketCapWeight}%</span>
                </div>
                <div
                  className={`flex items-center gap-0.5 text-xs font-semibold font-mono tabular-nums ${
                    isSecPos ? 'text-[#089981]' : 'text-[#f23645]'
                  }`}
                >
                  {isSecPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {isSecPos ? '+' : ''}{sec.changePercent.toFixed(2)}%
                </div>
              </div>

              {/* Company Blocks inside Sector */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                {sec.topSymbols.map(sym => {
                  const asset = allAssets.find(a => a.symbol === sym.symbol);
                  const change = asset ? asset.changePercent : sym.changePercent;
                  const price = asset ? asset.price : 0;
                  const bgClass = getTileBg(change);

                  return (
                    <button
                      key={sym.symbol}
                      onClick={() => onSelectSymbol(sym.symbol)}
                      className={`p-2.5 rounded-lg flex flex-col justify-between transition-transform hover:scale-[1.02] active:scale-[0.98] ${bgClass} text-left cursor-pointer shadow-sm`}
                      style={{ minHeight: '68px' }}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="font-bold text-xs tracking-tight">{sym.symbol}</span>
                        <span className="text-[10px] opacity-90 font-mono tabular-nums">
                          {change >= 0 ? '+' : ''}{change.toFixed(2)}%
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between w-full mt-2">
                        <span className="text-[10px] opacity-80 truncate max-w-[80px]">{sym.name}</span>
                        {price > 0 && (
                          <span className="text-[10px] font-mono font-medium opacity-95">
                            ${price > 100 ? price.toFixed(1) : price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
