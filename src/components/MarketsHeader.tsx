import React from 'react';
import { MarketCategory } from '../types/market';
import { Globe, Layers, BarChart3, TrendingUp, DollarSign, Fuel, Landmark } from 'lucide-react';

interface MarketsHeaderProps {
  currentCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  selectedRegion: 'ALL' | 'US' | 'EU' | 'ASIA' | 'GLOBAL';
  onSelectRegion: (reg: 'ALL' | 'US' | 'EU' | 'ASIA' | 'GLOBAL') => void;
}

export const MarketsHeader: React.FC<MarketsHeaderProps> = ({
  currentCategory,
  onSelectCategory,
  selectedRegion,
  onSelectRegion,
}) => {
  const tabs: { id: MarketCategory; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'indices', label: 'Indices', icon: <BarChart3 className="w-3.5 h-3.5" /> },
    { id: 'stocks', label: 'Stocks', icon: <TrendingUp className="w-3.5 h-3.5" /> },
    { id: 'crypto', label: 'Crypto', icon: <span className="font-mono text-xs font-bold">₿</span> },
    { id: 'forex', label: 'Forex', icon: <DollarSign className="w-3.5 h-3.5" /> },
    { id: 'futures', label: 'Futures', icon: <Fuel className="w-3.5 h-3.5" /> },
    { id: 'bonds', label: 'Bonds', icon: <Landmark className="w-3.5 h-3.5" /> },
  ];

  const regions: { id: 'ALL' | 'US' | 'EU' | 'ASIA' | 'GLOBAL'; label: string }[] = [
    { id: 'ALL', label: 'All Regions' },
    { id: 'US', label: 'United States' },
    { id: 'EU', label: 'Europe' },
    { id: 'ASIA', label: 'Asia-Pacific' },
  ];

  return (
    <div className="border-b border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#131722] py-4 transition-colors">
      <div className="max-w-[1560px] mx-auto px-4 md:px-6">
        {/* Title & Description */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Markets
            </h1>
            <p className="text-xs md:text-sm text-[#787b86] mt-1 max-w-xl">
              Track real-time global financial markets across equities, cryptocurrencies, currencies, commodities, and sovereign debt.
            </p>
          </div>

          {/* Region Filter Buttons */}
          <div className="flex items-center gap-1 bg-[#f0f3fa] dark:bg-[#1e222d] p-1 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] self-start md:self-auto">
            {regions.map(r => (
              <button
                key={r.id}
                onClick={() => onSelectRegion(r.id)}
                className={`px-3 py-1 rounded text-xs font-medium transition-all ${
                  selectedRegion === r.id
                    ? 'bg-white dark:bg-[#2a2e39] text-blue-600 dark:text-[#2962ff] shadow-sm font-semibold'
                    : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* Markets Sub Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {tabs.map(tab => {
            const isActive = currentCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectCategory(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#2962ff] text-white shadow-sm'
                    : 'bg-[#f8f9fd] dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] text-slate-700 dark:text-[#d1d4dc] hover:bg-[#f0f3fa] dark:hover:bg-[#252a37]'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
