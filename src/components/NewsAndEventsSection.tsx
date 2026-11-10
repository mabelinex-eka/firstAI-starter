import React from 'react';
import { NewsItem, EconomicEvent } from '../types/market';
import { Newspaper, Calendar, Clock, ExternalLink } from 'lucide-react';

interface NewsAndEventsSectionProps {
  news: NewsItem[];
  events: EconomicEvent[];
  onSelectSymbol: (symbol: string) => void;
}

export const NewsAndEventsSection: React.FC<NewsAndEventsSectionProps> = ({
  news,
  events,
  onSelectSymbol,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Latest Market News (2 cols) */}
      <div className="lg:col-span-2 bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Newspaper className="w-4 h-4 text-blue-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Stories & Breaking News</h3>
          </div>
          <span className="text-xs text-[#787b86]">Live Wire</span>
        </div>

        <div className="space-y-4">
          {news.map(item => (
            <div
              key={item.id}
              className="pb-4 border-b border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 last:border-b-0 last:pb-0 group"
            >
              <h4 className="text-xs md:text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-500 transition-colors leading-snug cursor-pointer">
                {item.title}
              </h4>
              
              <div className="mt-2 flex items-center justify-between flex-wrap gap-2 text-[11px] text-[#787b86]">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                  <span>·</span>
                  <span>{item.timeAgo}</span>
                  <span>·</span>
                  <span>{item.readTime}</span>
                </div>

                {/* Related tickers */}
                <div className="flex items-center gap-1.5">
                  {item.relatedSymbols.map(sym => (
                    <button
                      key={sym}
                      onClick={() => onSelectSymbol(sym)}
                      className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#f0f3fa] dark:bg-[#131722] border border-[#e0e3eb] dark:border-[#2a2e39] text-blue-600 dark:text-[#2962ff] hover:border-blue-500 transition-colors"
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Economic Calendar (1 col) */}
      <div className="bg-white dark:bg-[#1e222d] border border-[#e0e3eb] dark:border-[#2a2e39] rounded-xl p-5 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Economic Calendar</h3>
            </div>
            <span className="text-xs text-[#787b86]">Macro Events</span>
          </div>

          <div className="space-y-3">
            {events.map(ev => {
              const isHigh = ev.impact === 'high';
              return (
                <div
                  key={ev.id}
                  className="p-2.5 rounded-lg border border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 bg-[#f8f9fd] dark:bg-[#161a25] space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#787b86] font-mono flex items-center gap-1.5">
                      <span>{ev.flag}</span>
                      <span>{ev.time}</span>
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
                        isHigh ? 'bg-red-500/10 text-[#f23645]' : 'bg-amber-500/10 text-amber-500'
                      }`}
                    >
                      {ev.impact}
                    </span>
                  </div>

                  <div className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                    {ev.event}
                  </div>

                  <div className="flex items-center gap-3 text-[10px] text-[#787b86] font-mono tabular-nums pt-1">
                    {ev.actual && (
                      <span>
                        Act: <strong className="text-[#089981]">{ev.actual}</strong>
                      </span>
                    )}
                    <span>
                      Frc: <strong className="text-slate-700 dark:text-slate-300">{ev.forecast}</strong>
                    </span>
                    <span>
                      Prev: <strong className="text-slate-700 dark:text-slate-300">{ev.previous}</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="pt-3 mt-3 border-t border-[#e0e3eb]/60 dark:border-[#2a2e39]/60 text-center">
          <span className="text-[11px] text-[#787b86]">
            All times in local market schedule (EST/GMT/CET)
          </span>
        </div>
      </div>
    </div>
  );
};
