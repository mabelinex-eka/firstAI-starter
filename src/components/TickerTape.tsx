import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface TickerTapeProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const TickerTape: React.FC<TickerTapeProps> = ({ assets, onSelectAsset }) => {
  // Select 12 key global assets for the top ticker tape
  const tapeSymbols = ['S&P 500', 'NDX', 'DJI', 'BTC/USD', 'ETH/USD', 'NVDA', 'AAPL', 'TSLA', 'XAU/USD', 'CL1!', 'US10Y', 'EUR/USD'];
  const tapeAssets = tapeSymbols
    .map(sym => assets.find(a => a.symbol === sym))
    .filter((a): a is MarketAsset => Boolean(a));

  const formatPrice = (val: number) => {
    if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  return (
    <div className="w-full bg-[#ffffff] dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] overflow-x-auto select-none py-1.5 px-4 scrollbar-none">
      <div className="flex items-center gap-5 min-w-max">
        {tapeAssets.map(asset => {
          const isPos = asset.changePercent >= 0;
          return (
            <button
              key={asset.id}
              onClick={() => onSelectAsset(asset)}
              className="flex items-center gap-2.5 px-2 py-1 rounded hover:bg-[#f0f3fa] dark:hover:bg-[#1e222d] transition-colors cursor-pointer group text-left"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                    {asset.symbol}
                  </span>
                  <span className="text-[10px] text-[#787b86] font-mono">
                    ${formatPrice(asset.price)}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-mono tabular-nums">
                  <span className={`font-semibold flex items-center ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                    {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                  </span>
                  <span className="text-[10px] text-[#787b86]">
                    ({isPos ? '+' : ''}{asset.change})
                  </span>
                </div>
              </div>

              <div className="hidden sm:block opacity-75 group-hover:opacity-100 transition-opacity">
                <Sparkline data={asset.sparkline} width={50} height={18} isPositive={isPos} />
              </div>

              <div className="h-5 w-[1px] bg-[#e0e3eb] dark:bg-[#2a2e39] ml-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
