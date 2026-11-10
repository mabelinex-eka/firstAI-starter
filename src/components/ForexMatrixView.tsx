import React, { useState } from 'react';
import { FOREX_CROSS_CURRENCIES, FOREX_RATES_MATRIX } from '../data/marketData';
import { MarketAsset } from '../types/market';
import { ArrowUpRight, ArrowDownRight, RefreshCw } from 'lucide-react';

interface ForexMatrixViewProps {
  forexAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const ForexMatrixView: React.FC<ForexMatrixViewProps> = ({ forexAssets, onSelectAsset }) => {
  const [selectedBase, setSelectedBase] = useState<string>('USD');

  // Currency Strength values
  const currencyStrength: { code: string; strength: number; bias: 'Bullish' | 'Bearish' | 'Neutral' }[] = [
    { code: 'USD', strength: 84, bias: 'Bullish' },
    { code: 'CHF', strength: 72, bias: 'Bullish' },
    { code: 'GBP', strength: 58, bias: 'Neutral' },
    { code: 'EUR', strength: 46, bias: 'Neutral' },
    { code: 'CAD', strength: 41, bias: 'Bearish' },
    { code: 'AUD', strength: 34, bias: 'Bearish' },
    { code: 'JPY', strength: 22, bias: 'Bearish' },
  ];

  return (
    <div className="space-y-6">
      {/* Currency Strength Meter Widget */}
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Forex Currency Strength Meter</h3>
            <p className="text-xs text-[#787b86]">Aggregated relative purchasing power index across G8 economies</p>
          </div>
          <span className="text-[11px] font-mono text-[#787b86] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Realtime Basket
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3">
          {currencyStrength.map(c => {
            const isHigh = c.strength >= 65;
            const isLow = c.strength <= 35;
            const barColor = isHigh ? 'bg-[#089981]' : isLow ? 'bg-[#f23645]' : 'bg-amber-500';

            return (
              <div
                key={c.code}
                className="bg-[#f8f9fd] dark:bg-[#161a25] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-lg p-2.5 text-center flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{c.code}</span>
                  <span className={`text-[10px] font-semibold ${isHigh ? 'text-[#089981]' : isLow ? 'text-[#f23645]' : 'text-amber-500'}`}>
                    {c.bias}
                  </span>
                </div>
                <div className="my-2">
                  <div className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">{c.strength}</div>
                </div>
                <div className="w-full bg-[#e0e3eb] dark:bg-[#2a2e39] h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} rounded-full`} style={{ width: `${c.strength}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Interactive Currency Cross-Rates Grid */}
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Forex Cross-Rates Matrix</h3>
            <p className="text-xs text-[#787b86]">Click any pair or base currency to compare conversion multiples</p>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-[#787b86]">Base Focus:</span>
            <div className="flex gap-1 bg-[#f0f3fa] dark:bg-[#131722] p-0.5 rounded-lg">
              {['USD', 'EUR', 'GBP'].map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBase(b)}
                  className={`px-2 py-0.5 text-xs rounded font-medium transition-colors ${
                    selectedBase === b
                      ? 'bg-blue-600 text-white font-semibold'
                      : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono tabular-nums text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]">
                <th className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">Base / Quote</th>
                {FOREX_CROSS_CURRENCIES.map(col => (
                  <th key={col} className={`py-2.5 px-3 text-right font-semibold ${selectedBase === col ? 'text-blue-500 dark:text-[#2962ff]' : ''}`}>
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FOREX_CROSS_CURRENCIES.map(row => (
                <tr
                  key={row}
                  className={`border-b border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 hover:bg-[#f0f3fa] dark:hover:bg-[#252a37] transition-colors ${
                    selectedBase === row ? 'bg-blue-500/5 dark:bg-blue-500/10' : ''
                  }`}
                >
                  <td className="py-2.5 px-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    {row}
                  </td>
                  {FOREX_CROSS_CURRENCIES.map(col => {
                    const isDiagonal = row === col;
                    const rate = FOREX_RATES_MATRIX[row]?.[col] ?? 1;

                    return (
                      <td
                        key={`${row}-${col}`}
                        className={`py-2.5 px-3 text-right ${
                          isDiagonal
                            ? 'text-[#787b86]/50 bg-gray-500/5'
                            : rate > 1
                            ? 'text-slate-900 dark:text-slate-100 font-medium'
                            : 'text-[#787b86]'
                        }`}
                      >
                        {isDiagonal ? '1.0000' : rate >= 100 ? rate.toFixed(2) : rate.toFixed(4)}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
