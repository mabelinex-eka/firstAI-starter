import React from 'react';
import { Search, Sun, Moon, Star, Radio, Activity } from 'lucide-react';
import { MarketCategory } from '../types/market';

interface NavbarProps {
  currentCategory: MarketCategory;
  onSelectCategory: (cat: MarketCategory) => void;
  onOpenSearch: () => void;
  onToggleWatchlist: () => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
  isSimulating: boolean;
  onToggleSimulation: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCategory,
  onSelectCategory,
  onOpenSearch,
  onToggleWatchlist,
  watchlistCount,
  isDark,
  onToggleTheme,
  isSimulating,
  onToggleSimulation,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#ffffff] dark:bg-[#131722] border-b border-[#e0e3eb] dark:border-[#2a2e39] transition-colors">
      <div className="max-w-[1560px] mx-auto flex items-center justify-between gap-6 px-4 md:px-6 h-14">
        {/* Zone 1: Brand wordmark & Iconic TV Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onSelectCategory('overview')}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            {/* TradingView Iconic 3-shape glyph */}
            <div className="w-8 h-8 rounded-lg bg-[#2962ff] flex items-center justify-center text-white font-black text-sm tracking-tighter shadow-sm group-hover:bg-[#1e54e8] transition-colors">
              <svg width="22" height="16" viewBox="0 0 36 26" fill="currentColor">
                <path d="M0 0H6V26H0V0ZM15 7H21V26H15V7ZM30 14H36V26H30V14Z" fill="white" />
              </svg>
            </div>
            <span className="text-lg font-extrabold tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
              TradingView
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-[#787b86]">
          <button
            onClick={() => onSelectCategory('overview')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
              currentCategory === 'overview' ? 'text-blue-600 dark:text-white font-semibold' : ''
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => onSelectCategory('stocks')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
              currentCategory === 'stocks' ? 'text-blue-600 dark:text-white font-semibold' : ''
            }`}
          >
            Stocks
          </button>
          <button
            onClick={() => onSelectCategory('crypto')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
              currentCategory === 'crypto' ? 'text-blue-600 dark:text-white font-semibold' : ''
            }`}
          >
            Crypto
          </button>
          <button
            onClick={() => onSelectCategory('forex')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
              currentCategory === 'forex' ? 'text-blue-600 dark:text-white font-semibold' : ''
            }`}
          >
            Forex
          </button>
          <button
            onClick={() => onSelectCategory('futures')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
              currentCategory === 'futures' ? 'text-blue-600 dark:text-white font-semibold' : ''
            }`}
          >
            Futures
          </button>
          <button
            onClick={() => onSelectCategory('bonds')}
            className={`transition-colors whitespace-nowrap hover:text-slate-900 dark:hover:text-white ${
              currentCategory === 'bonds' ? 'text-blue-600 dark:text-white font-semibold' : ''
            }`}
          >
            Bonds
          </button>
        </nav>

        {/* Zone 3: Search, Watchlist, Theme Toggle, Live Simulation, CTA */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Quick Search Button */}
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#1e222d] text-xs text-[#787b86] hover:text-slate-900 dark:hover:text-white hover:border-blue-500 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-blue-500" />
            <span className="hidden sm:inline">Search markets</span>
            <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-mono rounded bg-white dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39]">
              ⌘K
            </kbd>
          </button>

          {/* Live Data Simulation Switch */}
          <button
            onClick={onToggleSimulation}
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              isSimulating
                ? 'border-emerald-500/40 bg-emerald-500/10 text-[#089981]'
                : 'border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]'
            }`}
            title="Toggle Real-Time Tick Feed Simulation"
          >
            <span
              className={`w-2 h-2 rounded-full ${
                isSimulating ? 'bg-[#089981] animate-pulse' : 'bg-gray-400'
              }`}
            />
            <span className="hidden xl:inline">{isSimulating ? 'Live Feed' : 'Feed Paused'}</span>
          </button>

          {/* Watchlist Toggle */}
          <button
            onClick={onToggleWatchlist}
            className="relative p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white transition-colors"
            title="Open Watchlist"
          >
            <Star className="w-4 h-4" />
            {watchlistCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                {watchlistCount}
              </span>
            )}
          </button>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white transition-colors"
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Primary Action Button */}
          <button
            onClick={() => onSelectCategory('overview')}
            className="hidden sm:inline-block px-3.5 py-1.5 text-xs font-semibold text-white bg-[#2962ff] hover:bg-[#1e54e8] rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            Get started
          </button>
        </div>
      </div>
    </header>
  );
};
