import React from 'react';
import { YIELD_CURVE_DATA } from '../data/marketData';
import { MarketAsset } from '../types/market';
import { TrendingUp, TrendingDown, AlertCircle, Info } from 'lucide-react';

interface BondsYieldCurveViewProps {
  bondAssets: MarketAsset[];
  onSelectAsset: (asset: MarketAsset) => void;
}

export const BondsYieldCurveView: React.FC<BondsYieldCurveViewProps> = ({ bondAssets, onSelectAsset }) => {
  // Yield Curve SVG dimensions
  const width = 760;
  const height = 260;
  const padding = { top: 25, right: 35, bottom: 45, left: 45 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const minYield = 3.8;
  const maxYield = 5.2;
  const yieldRange = maxYield - minYield;

  const getY = (yVal: number) => {
    return padding.top + graphHeight - ((yVal - minYield) / yieldRange) * graphHeight;
  };

  const getX = (index: number) => {
    return padding.left + (index / (YIELD_CURVE_DATA.length - 1)) * graphWidth;
  };

  // Generate paths
  const currentPoints = YIELD_CURVE_DATA.map((d, i) => `${getX(i).toFixed(1)},${getY(d.current).toFixed(1)}`);
  const monthAgoPoints = YIELD_CURVE_DATA.map((d, i) => `${getX(i).toFixed(1)},${getY(d.monthAgo).toFixed(1)}`);

  const currentPath = `M ${currentPoints.join(' L ')}`;
  const monthAgoPath = `M ${monthAgoPoints.join(' L ')}`;

  // Spread calculation: 10Y - 2Y
  const y10 = YIELD_CURVE_DATA.find(d => d.maturity === '10Y')?.current ?? 4.43;
  const y2 = YIELD_CURVE_DATA.find(d => d.maturity === '2Y')?.current ?? 4.26;
  const spread2s10s = (y10 - y2).toFixed(2);
  const isInverted = y2 > y10;

  return (
    <div className="space-y-6">
      {/* Yield Curve Visualizer Card */}
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">U.S. Treasury Yield Curve</h3>
            <p className="text-xs text-[#787b86]">Benchmark sovereign term structure and interest rate expectations</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono tabular-nums">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-blue-600 dark:bg-[#2962ff] inline-block" />
              <span className="text-slate-800 dark:text-white font-medium">Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-gray-400 stroke-dasharray inline-block" />
              <span className="text-[#787b86]">1 Month Ago</span>
            </div>
            <div className="px-2.5 py-1 rounded bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] flex items-center gap-1.5">
              <span className="text-[#787b86]">2Y/10Y Spread:</span>
              <strong className={isInverted ? 'text-[#f23645]' : 'text-[#089981]'}>
                {isInverted ? '' : '+'}{spread2s10s}% ({isInverted ? 'Inverted' : 'Normal'})
              </strong>
            </div>
          </div>
        </div>

        {/* SVG Curve Canvas */}
        <div className="w-full overflow-x-auto">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[600px] h-auto">
            {/* Horizontal Grid lines */}
            {[4.0, 4.25, 4.5, 4.75, 5.0].map((rate, i) => {
              const y = getY(rate);
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={padding.left + graphWidth}
                    y2={y}
                    stroke="#2a2e39"
                    strokeDasharray="2 2"
                    strokeOpacity={0.4}
                  />
                  <text
                    x={padding.left - 8}
                    y={y + 4}
                    fill="#787b86"
                    fontSize={10}
                    textAnchor="end"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {rate.toFixed(2)}%
                  </text>
                </g>
              );
            })}

            {/* 1 Month Ago Curve */}
            <path
              d={monthAgoPath}
              fill="none"
              stroke="#787b86"
              strokeWidth={1.5}
              strokeDasharray="4 4"
              opacity={0.6}
            />

            {/* Current Curve */}
            <path
              d={currentPath}
              fill="none"
              stroke="#2962ff"
              strokeWidth={2.5}
            />

            {/* Data points */}
            {YIELD_CURVE_DATA.map((d, i) => {
              const x = getX(i);
              const y = getY(d.current);
              return (
                <g key={i} className="group cursor-pointer">
                  <circle cx={x} cy={y} r={4} fill="#2962ff" stroke="#ffffff" strokeWidth={1.5} />
                  <text
                    x={x}
                    y={padding.top + graphHeight + 20}
                    fill="#787b86"
                    fontSize={11}
                    textAnchor="middle"
                    fontWeight="500"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {d.maturity}
                  </text>
                  <text
                    x={x}
                    y={y - 9}
                    fill="#2962ff"
                    fontSize={10}
                    fontWeight="600"
                    textAnchor="middle"
                    fontFamily="JetBrains Mono, monospace"
                  >
                    {d.current.toFixed(2)}%
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Sovereign Bond Table */}
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-5 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Global Government Bond Benchmarks</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono tabular-nums text-left">
            <thead>
              <tr className="border-b border-[#e0e3eb] dark:border-[#2a2e39] text-[#787b86]">
                <th className="py-2.5 px-3">Symbol</th>
                <th className="py-2.5 px-3">Name</th>
                <th className="py-2.5 px-3">Issuer</th>
                <th className="py-2.5 px-3 text-right">Yield</th>
                <th className="py-2.5 px-3 text-right">Day Chg</th>
                <th className="py-2.5 px-3 text-center">Signal</th>
              </tr>
            </thead>
            <tbody>
              {bondAssets.map(asset => {
                const isPos = asset.changePercent >= 0;
                return (
                  <tr
                    key={asset.id}
                    onClick={() => onSelectAsset(asset)}
                    className="border-b border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 hover:bg-[#f0f3fa] dark:hover:bg-[#252a37] cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-bold text-blue-600 dark:text-[#2962ff]">{asset.symbol}</td>
                    <td className="py-3 px-3 font-sans text-slate-800 dark:text-slate-200">{asset.name}</td>
                    <td className="py-3 px-3 text-[#787b86]">{asset.exchange}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900 dark:text-white">
                      {asset.price.toFixed(3)}%
                    </td>
                    <td className={`py-3 px-3 text-right font-semibold ${isPos ? 'text-[#089981]' : 'text-[#f23645]'}`}>
                      {isPos ? '+' : ''}{asset.change.toFixed(3)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-500">
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
