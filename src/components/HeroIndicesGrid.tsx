import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { ArrowUpRight, ArrowDownRight, Maximize2 } from 'lucide-react';

interface HeroIndicesGridProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const HeroIndicesGrid: React.FC<HeroIndicesGridProps> = ({ assets, onSelectAsset }) => {
  // Key benchmarks to show
  const keySymbols = ['S&P 500', 'NDX', 'DJI', 'RUT', 'BTC/USD', 'XAU/USD', 'CL1!', 'US10Y'];
  const keyAssets = keySymbols
    .map(sym => assets.find(a => a.symbol === sym))
    .filter((a): a is MarketAsset => Boolean(a));

  const formatPrice = (val: number) => {
    if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(3);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {keyAssets.map(asset => {
        const isPos = asset.changePercent >= 0;

        return (
          <div
            key={asset.id}
            onClick={() => onSelectAsset(asset)}
            className="group relative bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 hover:border-blue-500/60 transition-all cursor-pointer shadow-sm hover:shadow-md flex flex-col justify-between"
          >
            {/* Top Row: Symbol & Name */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {asset.symbol}
                  </h3>
                  <span className="text-[10px] text-[#787b86] font-mono px-1 rounded bg-[#e0e3eb]/60 dark:bg-[#2a2e39]">
                    {asset.exchange}
                  </span>
                </div>
                <div className="text-xs text-[#787b86] truncate max-w-[170px] mt-0.5">
                  {asset.name}
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-[#787b86] hover:text-slate-900 dark:hover:text-white">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Middle: Price & Change */}
            <div className="my-3 flex items-baseline justify-between font-mono tabular-nums">
              <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                ${formatPrice(asset.price)}
              </span>
              <div className={`flex items-center text-xs font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                {isPos ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                <span>
                  {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                </span>
              </div>
            </div>

            {/* Bottom: Sparkline Preview */}
            <div className="pt-2 border-t border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 flex items-center justify-between">
              <div className="text-[10px] text-[#787b86] font-mono tabular-nums">
                H: ${formatPrice(asset.high)} · L: ${formatPrice(asset.low)}
              </div>
              <Sparkline data={asset.sparkline} width={90} height={26} isPositive={isPos} />
            </div>
          </div>
        );
      })}
    </div>
  );
};
