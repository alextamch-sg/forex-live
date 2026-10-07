import React from 'react';
import { ArrowUpRight, ArrowDownRight, RefreshCw, Activity, ArrowRight } from 'lucide-react';
import { FxRate } from '../types/treasury';
import { SUPPORTED_CURRENCIES } from '../data/mockData';

interface LiveRatesBoardProps {
  rates: FxRate[];
  onSelectPair: (pair: FxRate) => void;
  lastTickPair?: string;
  lastTickDirection?: 'up' | 'down';
  masStatus?: {
    source: string;
    lastSync: string;
    isKeyConfigured: boolean;
    isSyncing?: boolean;
    endOfDay?: string;
  };
  onSyncMas?: () => void;
}

export const LiveRatesBoard: React.FC<LiveRatesBoardProps> = ({
  rates,
  onSelectPair,
  lastTickPair,
  lastTickDirection,
  masStatus,
  onSyncMas,
}) => {
  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden mb-8">
      {/* Header */}
      <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-lg font-bold text-[#0A2540]">
              Interbank Mid-Market Quotes & Spread Matrix
            </h2>
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-[#00875A] bg-[#E8F8F0]">
              <Activity className="w-3 h-3 animate-pulse" />
              <span>Direct Wholesale Liquidity</span>
            </div>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Real-time Singapore wholesale rates with sub-pip spreads and instant FAST clearing execution.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-xs font-mono text-[#64748B]">
            Feed:{' '}
            <span className="text-[#0A2540] font-semibold">
              {masStatus?.source === 'mas_official_api'
                ? `MAS MSB (${masStatus.endOfDay || 'Daily'})`
                : 'MAS Gateway / BCS Interbank'}
            </span>
          </div>

          {onSyncMas && (
            <button
              onClick={onSyncMas}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F0F5FF] hover:bg-[#E0EBFF] text-[#0052FF] font-semibold text-xs rounded-md transition-colors border border-[#CBD5E1]"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${masStatus?.isSyncing ? 'animate-spin' : ''}`} />
              <span>Sync MAS API</span>
            </button>
          )}
        </div>
      </div>

      {/* Rates Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] uppercase font-bold text-[#64748B] tracking-wider">
              <th className="py-3 px-4 sm:px-6">Currency Pair</th>
              <th className="py-3 px-4 text-right">Mid-Market Rate</th>
              <th className="py-3 px-4 text-right">Bid (Sell)</th>
              <th className="py-3 px-4 text-right">Ask (Buy)</th>
              <th className="py-3 px-4 text-right">Spread (Pips)</th>
              <th className="py-3 px-4 text-right">24h Delta</th>
              <th className="py-3 px-4 text-right hidden lg:table-cell">24h Range</th>
              <th className="py-3 px-4 sm:px-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {rates.map((rate) => {
              const isTicked = lastTickPair === rate.pair;
              const tickClass =
                isTicked && lastTickDirection === 'up'
                  ? 'bg-emerald-50/80 transition-colors duration-700'
                  : isTicked && lastTickDirection === 'down'
                  ? 'bg-red-50/80 transition-colors duration-700'
                  : 'hover:bg-[#F8FAFC] transition-colors';

              const baseInfo = SUPPORTED_CURRENCIES[rate.base];
              const quoteInfo = SUPPORTED_CURRENCIES[rate.quote];

              return (
                <tr key={rate.pair} className={`h-[52px] ${tickClass}`}>
                  {/* Pair */}
                  <td className="py-3 px-4 sm:px-6 font-medium text-[#0A2540]">
                    <div className="flex items-center gap-2">
                      <span className="text-base">
                        {baseInfo?.flag}
                        {quoteInfo?.flag}
                      </span>
                      <span className="font-mono font-bold text-sm">{rate.pair}</span>
                    </div>
                  </td>

                  {/* Mid Rate */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-sm text-[#0052FF]">
                    {rate.rate.toFixed(4)}
                  </td>

                  {/* Bid */}
                  <td className="py-3 px-4 text-right font-mono text-[#0A2540]">
                    {rate.bid.toFixed(4)}
                  </td>

                  {/* Ask */}
                  <td className="py-3 px-4 text-right font-mono text-[#0A2540]">
                    {rate.ask.toFixed(4)}
                  </td>

                  {/* Spread */}
                  <td className="py-3 px-4 text-right font-mono text-[#49607E]">
                    <span className="bg-[#F1F5F9] px-1.5 py-0.5 rounded text-[11px] font-semibold">
                      {rate.spreadPips.toFixed(1)} pips
                    </span>
                  </td>

                  {/* 24h Delta */}
                  <td className="py-3 px-4 text-right font-mono">
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[11px] font-semibold ${
                        rate.change24h >= 0
                          ? 'text-[#00875A] bg-[#E8F8F0]'
                          : 'text-[#DE350B] bg-[#FDECEB]'
                      }`}
                    >
                      {rate.change24h >= 0 ? (
                        <ArrowUpRight className="w-3 h-3" />
                      ) : (
                        <ArrowDownRight className="w-3 h-3" />
                      )}
                      {rate.change24h >= 0 ? '+' : ''}
                      {rate.change24h.toFixed(2)}%
                    </span>
                  </td>

                  {/* 24h Range */}
                  <td className="py-3 px-4 text-right font-mono text-[11px] text-[#64748B] hidden lg:table-cell">
                    <span>{rate.dayLow.toFixed(4)}</span> - <span>{rate.dayHigh.toFixed(4)}</span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => onSelectPair(rate)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-[#0052FF] hover:bg-[#0043D6] text-white font-semibold text-xs rounded-md transition-colors shadow-2xs"
                    >
                      <span>Transact</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
