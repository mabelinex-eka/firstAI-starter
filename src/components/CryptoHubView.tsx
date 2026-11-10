import React from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { Flame, PieChart, BarChart2, ShieldCheck, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface CryptoHubViewProps {
  cryptoAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const CryptoHubView: React.FC<CryptoHubViewProps> = ({ cryptoAssets, onSelectAsset }) => {
  return (
    <div className="space-y-6">
      {/* Crypto Macro Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Fear & Greed */}
        <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              Crypto Fear & Greed Index
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-[#089981]">68</span>
            <span className="text-xs font-semibold text-[#089981] uppercase tracking-wide">Greed</span>
          </div>
          <div className="w-full bg-[#e0e3eb] dark:bg-[#2a2e39] h-2 rounded-full overflow-hidden flex">
            <div className="bg-[#f23645] h-full" style={{ width: '25%' }} title="Extreme Fear" />
            <div className="bg-amber-500 h-full" style={{ width: '25%' }} title="Fear" />
            <div className="bg-[#10b981] h-full" style={{ width: '25%' }} title="Neutral / Greed" />
            <div className="bg-[#089981] h-full" style={{ width: '25%' }} title="Extreme Greed" />
          </div>
        </div>

        {/* Total Crypto Market Cap */}
        <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <PieChart className="w-4 h-4 text-blue-500" />
              Total Market Capitalization
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">$2.74T</span>
            <span className="text-xs font-semibold text-[#089981] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +3.8%
            </span>
          </div>
          <span className="text-[11px] text-[#787b86]">Over 14,000 digital tokens indexed</span>
        </div>

        {/* 24h Volume */}
        <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-purple-500" />
              24h Spot & Derivatives Volume
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">$94.2B</span>
            <span className="text-xs font-semibold text-[#089981] flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
          <span className="text-[11px] text-[#787b86]">High liquidity across tier-1 exchanges</span>
        </div>

        {/* BTC Dominance */}
        <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-[#787b86]">
            <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-500" />
              Bitcoin Dominance (BTC.D)
            </span>
          </div>
          <div className="my-2 flex items-baseline gap-2 font-mono">
            <span className="text-2xl font-bold text-slate-900 dark:text-white">58.4%</span>
            <span className="text-xs font-semibold text-blue-500">ETH: 13.8%</span>
          </div>
          <div className="w-full bg-[#e0e3eb] dark:bg-[#2a2e39] h-2 rounded-full overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '58.4%' }} />
          </div>
        </div>
      </div>

      {/* Main Crypto Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Cryptocurrencies by Market Cap</h3>
            <p className="text-xs text-[#787b86]">Live pricing, 24-hour volume, and 7-day trendlines</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono tabular-nums text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]">
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Asset</th>
                <th className="py-2.5 px-3 text-right">Price</th>
                <th className="py-2.5 px-3 text-right">24h Chg %</th>
                <th className="py-2.5 px-3 text-right">24h Volume</th>
                <th className="py-2.5 px-3 text-right">Market Cap</th>
                <th className="py-2.5 px-3 text-center">Last 7 Days</th>
                <th className="py-2.5 px-3 text-center">Rating</th>
              </tr>
            </thead>
            <tbody>
              {cryptoAssets.map((asset, index) => {
                const isPos = asset.changePercent >= 0;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="border-b border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 hover:bg-[#f0f3fa] dark:hover:bg-[#252a37] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 text-[#787b86] font-normal">{index + 1}</td>
                    <td className="py-3 px-3 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 dark:text-white font-mono">{asset.symbol}</span>
                        <span className="text-[#787b86] text-[11px] truncate max-w-[120px]">{asset.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      ${asset.price >= 1 ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2 }) : asset.price.toFixed(3)}
                    </td>
                    <td className={`py-3 px-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right text-[#787b86]">{asset.volume}</td>
                    <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200 font-medium">{asset.marketCap}</td>
                    <td className="py-3 px-3 text-center flex justify-center">
                      <Sparkline data={asset.sparkline} width={90} height={26} isPositive={isPos} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          asset.rating.includes('Buy')
                            ? 'bg-[#089981]/10 text-[#089981]'
                            : asset.rating.includes('Sell')
                            ? 'bg-[#f23645]/10 text-[#f23645]'
                            : 'bg-gray-500/10 text-[#787b86]'
                        }`}
                      >
                        {asset.rating}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
