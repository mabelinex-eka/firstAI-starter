import React, { useState } from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { X, Star, Bell, Plus, Trash2, ArrowUpRight, ArrowDownRight, Check } from 'lucide-react';

interface WatchlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: MarketAsset[];
  onRemoveFromWatchlist: (asset: MarketAsset) => void;
  onSelectAsset: (asset: MarketAsset) => void;
  allAssets: MarketAsset[];
  onAddToWatchlist: (asset: MarketAsset) => void;
}

interface AlertItem {
  id: string;
  symbol: string;
  targetPrice: number;
  condition: 'above' | 'below';
  isTriggered: boolean;
}

export const WatchlistDrawer: React.FC<WatchlistDrawerProps> = ({
  isOpen,
  onClose,
  watchlist,
  onRemoveFromWatchlist,
  onSelectAsset,
  allAssets,
  onAddToWatchlist,
}) => {
  const [activeTab, setActiveTab] = useState<'watchlist' | 'alerts'>('watchlist');
  const [newAlertSymbol, setNewAlertSymbol] = useState(allAssets[0]?.symbol || 'NVDA');
  const [newAlertPrice, setNewAlertPrice] = useState('150');
  const [newAlertCondition, setNewAlertCondition] = useState<'above' | 'below'>('above');
  const [alerts, setAlerts] = useState<AlertItem[]>([
    { id: '1', symbol: 'BTC/USD', targetPrice: 90000, condition: 'above', isTriggered: false },
    { id: '2', symbol: 'NVDA', targetPrice: 150, condition: 'above', isTriggered: false },
    { id: '3', symbol: 'SPX', targetPrice: 5800, condition: 'below', isTriggered: false },
  ]);
  const [alertSuccess, setAlertSuccess] = useState(false);

  if (!isOpen) return null;

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseFloat(newAlertPrice);
    if (isNaN(p) || p <= 0) return;

    setAlerts([
      ...alerts,
      {
        id: Date.now().toString(),
        symbol: newAlertSymbol,
        targetPrice: p,
        condition: newAlertCondition,
        isTriggered: false,
      },
    ]);
    setAlertSuccess(true);
    setTimeout(() => setAlertSuccess(false), 2000);
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id));
  };

  const formatPrice = (val: number) => {
    if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white dark:bg-[#1e222d] border-l border-[#e0e3eb] dark:border-[#2a2e39] shadow-2xl flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('watchlist')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'watchlist'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Star className="w-3.5 h-3.5 fill-current" />
            Watchlist ({watchlist.length})
          </button>
          <button
            onClick={() => setActiveTab('alerts')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              activeTab === 'alerts'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            Alerts ({alerts.length})
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-[#e0e3eb] dark:hover:bg-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {activeTab === 'watchlist' ? (
          watchlist.length === 0 ? (
            <div className="text-center py-12 text-[#787b86] text-xs">
              <Star className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p className="font-semibold text-slate-800 dark:text-slate-200">Your watchlist is empty</p>
              <p className="mt-1">Click the star icon on any asset or chart to track it here.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {watchlist.map(asset => {
                const isPos = asset.changePercent >= 0;
                return (
                  <div
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="p-3 rounded-lg border border-[#e0e3eb]/70 dark:border-[#2a2e39]/80 bg-[#f8f9fd] dark:bg-[#161a25] hover:border-blue-500/60 transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="text-[10px] text-[#787b86] px-1 rounded bg-[#e0e3eb]/50 dark:bg-[#2a2e39]/50">
                          {asset.exchange}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#787b86] truncate max-w-[120px]">{asset.name}</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right font-mono tabular-nums">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          ${formatPrice(asset.price)}
                        </div>
                        <div className={`text-[10px] font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                          {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                        </div>
                      </div>

                      <button
                        onClick={e => {
                          e.stopPropagation();
                          onRemoveFromWatchlist(asset);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-[#787b86] hover:text-[#f23645] transition-opacity"
                        title="Remove"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          /* Alerts Section */
          <div className="space-y-4">
            {/* Create Alert Form */}
            <form onSubmit={handleAddAlert} className="bg-[#f8f9fd] dark:bg-[#161a25] p-3 rounded-xl border border-[#e0e3eb] dark:border-[#2a2e39] space-y-2.5">
              <span className="text-xs font-bold text-slate-900 dark:text-white block">Create Price Alert</span>
              
              <div className="grid grid-cols-2 gap-2 text-xs">
                <select
                  value={newAlertSymbol}
                  onChange={e => setNewAlertSymbol(e.target.value)}
                  className="p-1.5 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] text-slate-900 dark:text-white"
                >
                  {allAssets.map(a => (
                    <option key={a.id} value={a.symbol}>{a.symbol}</option>
                  ))}
                </select>

                <select
                  value={newAlertCondition}
                  onChange={e => setNewAlertCondition(e.target.value as 'above' | 'below')}
                  className="p-1.5 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] text-slate-900 dark:text-white"
                >
                  <option value="above">Crosses Above</option>
                  <option value="below">Crosses Below</option>
                </select>
              </div>

              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Target price ($)"
                  value={newAlertPrice}
                  onChange={e => setNewAlertPrice(e.target.value)}
                  className="flex-1 p-1.5 text-xs rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] text-slate-900 dark:text-white font-mono"
                  required
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Set Alert
                </button>
              </div>

              {alertSuccess && (
                <div className="text-[11px] text-emerald-600 dark:text-[#089981] flex items-center gap-1 font-medium">
                  <Check className="w-3.5 h-3.5" /> Alert activated!
                </div>
              )}
            </form>

            {/* Existing Alerts */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-[#787b86] tracking-wider block">Active Alerts</span>
              {alerts.map(al => (
                <div
                  key={al.id}
                  className="p-2.5 rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-white dark:bg-[#1e222d] flex items-center justify-between text-xs font-mono"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{al.symbol}</span>
                    <span className="text-[#787b86] ml-2 text-[11px]">
                      {al.condition === 'above' ? '≥' : '≤'} ${al.targetPrice}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteAlert(al.id)}
                    className="text-[#787b86] hover:text-[#f23645] p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
