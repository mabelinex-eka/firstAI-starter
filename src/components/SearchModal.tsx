import React, { useState, useEffect, useRef } from 'react';
import { MarketAsset } from '../types/market';
import { Search, X, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  assets,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const filteredAssets = query.trim()
    ? assets.filter(
        a =>
          a.symbol.toLowerCase().includes(query.toLowerCase()) ||
          a.name.toLowerCase().includes(query.toLowerCase()) ||
          a.category.toLowerCase().includes(query.toLowerCase()) ||
          (a.sector && a.sector.toLowerCase().includes(query.toLowerCase()))
      )
    : assets.slice(0, 8); // Top featured when empty

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredAssets.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredAssets[selectedIndex]) {
        onSelectAsset(filteredAssets[selectedIndex]);
        onClose();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#e0e3eb] dark:border-[#2a2e39] gap-3">
          <Search className="w-5 h-5 text-blue-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search markets, stocks, crypto, forex, bonds..."
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-[#787b86] text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-[#787b86] hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="text-[10px] font-mono text-[#787b86] px-1.5 py-0.5 rounded bg-[#e0e3eb]/60 dark:bg-[#2a2e39] border border-[#e0e3eb] dark:border-[#2a2e39]">
            ESC
          </span>
        </div>

        {/* Quick Tag Pills */}
        <div className="px-4 py-2 bg-[#f8f9fd] dark:bg-[#161a25] border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center gap-1.5 overflow-x-auto text-[11px] text-[#787b86]">
          <span className="font-medium text-slate-800 dark:text-slate-200">Popular:</span>
          {['NVDA', 'BTC/USD', 'S&P 500', 'AAPL', 'EUR/USD', 'Gold', 'Crude Oil'].map(tag => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-2 py-0.5 rounded hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="max-h-[380px] overflow-y-auto p-2">
          {filteredAssets.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#787b86]">
              No instruments found matching "{query}"
            </div>
          ) : (
            filteredAssets.map((asset, idx) => {
              const isSelected = idx === selectedIndex;
              const isPos = asset.changePercent >= 0;

              return (
                <div
                  key={asset.id}
                  onClick={() => {
                    onSelectAsset(asset);
                    onClose();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-[#252a37] text-blue-600 dark:text-white'
                      : 'hover:bg-[#f8f9fd] dark:hover:bg-[#191c24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-xs text-slate-900 dark:text-white font-mono w-16">
                      {asset.symbol}
                    </span>
                    <div>
                      <div className="text-xs text-slate-800 dark:text-slate-200 font-medium">
                        {asset.name}
                      </div>
                      <div className="text-[10px] text-[#787b86] flex items-center gap-1.5">
                        <span className="uppercase">{asset.exchange}</span>
                        <span>·</span>
                        <span className="capitalize">{asset.category}</span>
                        {asset.sector && (
                          <>
                            <span>·</span>
                            <span>{asset.sector}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-right font-mono tabular-nums">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        ${asset.price.toFixed(asset.price > 100 ? 2 : 4)}
                      </div>
                      <div className={`text-[10px] font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                        {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-[#787b86] opacity-60" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
