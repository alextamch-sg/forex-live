import React, { useState } from 'react';
import { Search, ArrowDownLeft, ArrowUpRight, RefreshCw, QrCode } from 'lucide-react';
import { AccountBalance, CurrencyCode } from '../types/treasury';
import { SUPPORTED_CURRENCIES } from '../data/mockData';

interface MultiCurrencyVaultProps {
  balances: AccountBalance[];
  onSelectConvert: (currency: CurrencyCode) => void;
  onOpenDeposit: (currency: CurrencyCode) => void;
  onOpenPayNowQr: () => void;
}

export const MultiCurrencyVault: React.FC<MultiCurrencyVaultProps> = ({
  balances,
  onSelectConvert,
  onOpenDeposit,
  onOpenPayNowQr,
}) => {
  const [search, setSearch] = useState('');

  const filteredBalances = balances.filter(
    (b) =>
      b.currency.toLowerCase().includes(search.toLowerCase()) ||
      SUPPORTED_CURRENCIES[b.currency]?.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden mb-8">
      {/* Header & Search */}
      <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-[#0A2540]">
            Multi-Currency Treasury Accounts
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Segregated multi-currency accounts with direct domestic settlement clearing.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-[#64748B] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Filter currency (SGD, USD...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#0A2540] focus:outline-none focus:border-[#0052FF]"
          />
        </div>
      </div>

      {/* Account Rows Grid */}
      <div className="divide-y divide-[#E2E8F0]">
        {filteredBalances.map((acc) => {
          const info = SUPPORTED_CURRENCIES[acc.currency];
          return (
            <div
              key={acc.currency}
              className="p-5 hover:bg-[#F8FAFC] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              {/* Currency info & flag */}
              <div className="flex items-center gap-3">
                <span className="text-2xl">{info.flag}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-[#0A2540]">{acc.currency}</span>
                    <span className="text-xs text-[#64748B]">· {info.name}</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-[#F1F5F9] text-[#49607E] rounded">
                      {acc.clearingRail}
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-[#64748B] mt-0.5">
                    {acc.accountNumber} · {acc.bankBranch}
                  </div>
                </div>
              </div>

              {/* Balances */}
              <div className="flex flex-wrap items-center gap-6 md:gap-8 justify-between md:justify-end">
                <div className="text-left md:text-right">
                  <div className="font-mono text-base font-bold text-[#0A2540]">
                    {info.symbol}{' '}
                    {acc.amount.toLocaleString('en-US', {
                      minimumFractionDigits: info.decimals,
                      maximumFractionDigits: info.decimals,
                    })}
                  </div>
                  <div className="text-xs font-mono text-[#64748B]">
                    ≈ S${' '}
                    {acc.sgdEquivalent.toLocaleString('en-SG', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>

                {/* 24h delta */}
                <div className="w-20 text-right">
                  <span
                    className={`inline-block font-mono text-xs px-2 py-0.5 rounded ${
                      acc.change24hPercent >= 0
                        ? 'text-[#00875A] bg-[#E8F8F0]'
                        : 'text-[#DE350B] bg-[#FDECEB]'
                    }`}
                  >
                    {acc.change24hPercent >= 0 ? '+' : ''}
                    {acc.change24hPercent.toFixed(2)}%
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSelectConvert(acc.currency)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0052FF] bg-[#F0F5FF] hover:bg-[#E0EBFF] rounded-md transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Convert</span>
                  </button>

                  <button
                    onClick={() => onOpenDeposit(acc.currency)}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#0A2540] bg-white border border-[#CBD5E1] hover:border-[#0052FF] rounded-md transition-colors"
                  >
                    <ArrowDownLeft className="w-3 h-3" />
                    <span>Fund</span>
                  </button>

                  {acc.currency === 'SGD' && (
                    <button
                      onClick={onOpenPayNowQr}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-[#DE350B] bg-[#FDECEB] hover:bg-[#FCD8D6] rounded-md transition-colors"
                      title="PayNow QR Inbound"
                    >
                      <QrCode className="w-3 h-3" />
                      <span>PayNow</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
