import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../types/market';
import { Sparkline } from './Sparkline';
import { LineChart, Search, ArrowUpDown, ChevronDown } from 'lucide-react';

interface MarketMoversTableProps {
  assets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
  title?: string;
  defaultTab?: 'mostActive' | 'gainers' | 'losers' | 'all';
}

export const MarketMoversTable: React.FC<MarketMoversTableProps> = ({
  assets,
  onSelectAsset,
  title = 'Market Movers',
  defaultTab = 'all',
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'gainers' | 'losers' | 'mostActive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState<string>('all');
  const [sortField, setSortField] = useState<'symbol' | 'price' | 'changePercent'>('changePercent');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Available unique sectors
  const sectors = useMemo(() => {
    const set = new Set<string>();
    assets.forEach(a => {
      if (a.sector) set.add(a.sector);
    });
    return Array.from(set);
  }, [assets]);

  // Filtered and sorted assets
  const filteredAssets = useMemo(() => {
    let result = [...assets];

    // Filter by tab
    if (activeTab === 'gainers') {
      result = result.filter(a => a.changePercent > 0);
    } else if (activeTab === 'losers') {
      result = result.filter(a => a.changePercent < 0);
    } else if (activeTab === 'mostActive') {
      // sort by pseudo-volume weight
      result = result.slice(0, 10);
    }

    // Filter by Sector
    if (selectedSector !== 'all') {
      result = result.filter(a => a.sector === selectedSector);
    }

    // Filter by Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        a => a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      );
    }

    // Sort
    result.sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      if (typeof valA === 'string') {
        return sortOrder === 'asc'
          ? (valA as string).localeCompare(valB as string)
          : (valB as string).localeCompare(valA as string);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });

    return result;
  }, [assets, activeTab, selectedSector, searchQuery, sortField, sortOrder]);

  const toggleSort = (field: 'symbol' | 'price' | 'changePercent') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const formatPrice = (val: number) => {
    if (val >= 1000) return val.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (val >= 1) return val.toFixed(2);
    return val.toFixed(4);
  };

  return (
    <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl shadow-sm overflow-hidden">
      {/* Header & Filter Controls */}
      <div className="p-4 border-b border-[#e0e3eb] dark:border-[#2a2e39] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-[#f0f3fa] dark:bg-[#131722] p-1 rounded-lg self-start">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-white dark:bg-[#2a2e39] text-blue-600 dark:text-[#2962ff] shadow-sm font-semibold'
                : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Instruments
          </button>
          <button
            onClick={() => setActiveTab('gainers')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeTab === 'gainers'
                ? 'bg-white dark:bg-[#2a2e39] text-[#089981] shadow-sm font-semibold'
                : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Gainers
          </button>
          <button
            onClick={() => setActiveTab('losers')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeTab === 'losers'
                ? 'bg-white dark:bg-[#2a2e39] text-[#f23645] shadow-sm font-semibold'
                : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Losers
          </button>
          <button
            onClick={() => setActiveTab('mostActive')}
            className={`px-3 py-1 text-xs rounded-md font-medium transition-all ${
              activeTab === 'mostActive'
                ? 'bg-white dark:bg-[#2a2e39] text-slate-900 dark:text-white shadow-sm font-semibold'
                : 'text-[#787b86] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Most Active
          </button>
        </div>

        {/* Search & Sector dropdown */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-[#787b86]" />
            <input
              type="text"
              placeholder="Filter symbols..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#131722] text-slate-900 dark:text-white placeholder-[#787b86] focus:outline-none focus:border-blue-500 w-44"
            />
          </div>

          {sectors.length > 0 && (
            <select
              value={selectedSector}
              onChange={e => setSelectedSector(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-lg border border-[#e0e3eb] dark:border-[#2a2e39] bg-[#f8f9fd] dark:bg-[#131722] text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
            >
              <option value="all">All Sectors</option>
              {sectors.map(s => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono tabular-nums text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] bg-[#f8f9fd] dark:bg-[#191c24]">
              <th
                onClick={() => toggleSort('symbol')}
                className="py-3 px-4 font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
              >
                <div className="flex items-center gap-1">
                  <span>Symbol & Name</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold hidden md:table-cell">Sector</th>
              <th
                onClick={() => toggleSort('price')}
                className="py-3 px-4 text-right font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Last Price</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('changePercent')}
                className="py-3 px-4 text-right font-semibold cursor-pointer hover:text-slate-900 dark:hover:text-white select-none"
              >
                <div className="flex items-center justify-end gap-1">
                  <span>Change %</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3 px-3 text-right font-semibold hidden lg:table-cell">Volume</th>
              <th className="py-3 px-3 text-right font-semibold hidden lg:table-cell">Market Cap</th>
              <th className="py-3 px-3 text-center font-semibold">Trend</th>
              <th className="py-3 px-3 text-center font-semibold hidden sm:table-cell">Rating</th>
              <th className="py-3 px-3 text-center font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center text-[#787b86] font-sans">
                  No assets match your search or filter criteria.
                </td>
              </tr>
            ) : (
              filteredAssets.map(asset => {
                const isPos = asset.changePercent >= 0;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="border-b border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 hover:bg-[#f0f3fa] dark:hover:bg-[#252a37] cursor-pointer transition-colors group"
                  >
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-slate-900 dark:text-white text-xs group-hover:text-blue-500 dark:group-hover:text-[#2962ff] transition-colors">
                          {asset.symbol}
                        </span>
                        <span className="font-sans text-[#787b86] text-[11px] truncate max-w-[160px] hidden sm:inline">
                          {asset.name}
                        </span>
                        <span className="text-[10px] text-[#787b86] px-1 rounded bg-[#e0e3eb]/60 dark:bg-[#2a2e39]/60">
                          {asset.exchange}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-sans text-[#787b86] text-[11px] hidden md:table-cell">
                      {asset.sector || 'Broad Market'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                      ${formatPrice(asset.price)}
                    </td>
                    <td className={`py-3 px-4 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-right text-[#787b86] hidden lg:table-cell">
                      {asset.volume}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-800 dark:text-slate-200 font-medium hidden lg:table-cell">
                      {asset.marketCap || '-'}
                    </td>
                    <td className="py-3 px-3 text-center flex justify-center">
                      <Sparkline data={asset.sparkline} width={80} height={24} isPositive={isPos} />
                    </td>
                    <td className="py-3 px-3 text-center hidden sm:table-cell">
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
                    <td className="py-3 px-3 text-center" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => onSelectAsset(asset)}
                        className="px-2.5 py-1 rounded text-[11px] font-medium border border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86] hover:text-slate-900 dark:hover:text-white hover:border-blue-500 dark:hover:border-blue-500 transition-colors flex items-center gap-1 mx-auto"
                      >
                        <LineChart className="w-3 h-3 text-blue-500" />
                        <span>Chart</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
