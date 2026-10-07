import React from 'react';
import { Shield, ArrowUpRight, QrCode, RefreshCw, Zap } from 'lucide-react';
import { AccountBalance, DomesticBank } from '../types/treasury';

interface TreasuryOverviewProps {
  balances: AccountBalance[];
  connectedBanks: DomesticBank[];
  onOpenDeposit: () => void;
  onOpenPayNowQr: () => void;
  onSelectConverter: () => void;
}

export const TreasuryOverview: React.FC<TreasuryOverviewProps> = ({
  balances,
  connectedBanks,
  onOpenDeposit,
  onOpenPayNowQr,
  onSelectConverter,
}) => {
  const totalSgdValue = balances.reduce((sum, b) => sum + b.sgdEquivalent, 0);

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden mb-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E2E8F0]">
        {/* Left Column: Consolidated Treasury Liquidity */}
        <div className="p-5 sm:p-6 lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold tracking-wider text-[#64748B] uppercase">
                Consolidated SGD Treasury Valuation
              </span>
              <div className="flex items-center gap-1.5 text-xs text-[#00875A] font-medium">
                <span className="w-2 h-2 rounded-full bg-[#00875A] animate-pulse"></span>
                <span>Interbank Mid-Market Linked</span>
              </div>
            </div>

            <div className="flex flex-wrap items-baseline gap-3">
              <div className="font-mono text-3xl sm:text-4xl font-bold tracking-tight text-[#0A2540]">
                S$ {totalSgdValue.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="flex items-center text-xs font-mono font-medium text-[#00875A] bg-[#E8F8F0] px-2 py-0.5 rounded">
                +0.28% 24h (+S$ 4,152.00)
              </div>
            </div>

            <p className="mt-2 text-xs text-[#64748B]">
              Aggregated across 5 multi-currency segregated custodial accounts with direct Singapore FAST/MEPS clearing.
            </p>
          </div>

          <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex flex-wrap items-center gap-3">
            <button
              onClick={onSelectConverter}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0052FF] hover:bg-[#0043D6] rounded-md transition-colors shadow-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Execute FX Conversion</span>
            </button>

            <button
              onClick={onOpenDeposit}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0A2540] bg-white border border-[#CBD5E1] hover:border-[#0052FF] hover:text-[#0052FF] rounded-md transition-colors"
            >
              <Zap className="w-3.5 h-3.5 text-[#0052FF]" />
              <span>Direct FAST Debit</span>
            </button>

            <button
              onClick={onOpenPayNowQr}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#0A2540] bg-white border border-[#CBD5E1] hover:border-[#0052FF] hover:text-[#0052FF] rounded-md transition-colors"
            >
              <QrCode className="w-3.5 h-3.5 text-[#DE350B]" />
              <span>PayNow Corporate QR</span>
            </button>
          </div>
        </div>

        {/* Right Column: Clearing Rails & Domestic Banking Nodes */}
        <div className="p-5 sm:p-6 lg:col-span-5 bg-[#FAFCFF] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold tracking-wider text-[#64748B] uppercase">
                Active Domestic Clearing Rails
              </span>
              <span className="text-[11px] font-mono text-[#00875A] bg-[#E8F8F0] px-1.5 py-0.5 rounded">
                MAS RTGS Operational
              </span>
            </div>

            {/* Rails indicator grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg">
                <div className="text-[11px] font-bold text-[#0A2540] flex items-center justify-between">
                  <span>FAST Rail</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Instant (&lt;2s)</div>
                <div className="text-[10px] font-mono font-semibold text-[#00875A] mt-1">24/7 S$2M Cap</div>
              </div>

              <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg">
                <div className="text-[11px] font-bold text-[#0A2540] flex items-center justify-between">
                  <span>PayNow UEN</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5">Corporate Proxy</div>
                <div className="text-[10px] font-mono font-semibold text-[#0052FF] mt-1">Direct Inbound</div>
              </div>

              <div className="p-2.5 bg-white border border-[#E2E8F0] rounded-lg">
                <div className="text-[11px] font-bold text-[#0A2540] flex items-center justify-between">
                  <span>MEPS+</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00875A]"></span>
                </div>
                <div className="text-[10px] text-[#64748B] mt-0.5">MAS High-Value</div>
                <div className="text-[10px] font-mono font-semibold text-[#49607E] mt-1">Uncapped Tier</div>
              </div>
            </div>

            {/* Connected Domestic Bank accounts summary */}
            <div className="space-y-2">
              <div className="text-[11px] font-semibold text-[#64748B]">Connected Domestic Accounts</div>
              <div className="flex flex-wrap gap-2">
                {connectedBanks.map((bank) => (
                  <div
                    key={bank.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 bg-white border border-[#E2E8F0] rounded-md text-xs"
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: bank.color }}
                    ></span>
                    <span className="font-semibold text-[#0A2540]">{bank.shortName}</span>
                    <span className="font-mono text-[#64748B] text-[11px]">{bank.accountNo}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#0052FF]" />
              MAS Payment Services Act (PS20194821)
            </span>
            <span className="font-mono text-[#00875A]">Zero Retail Markup</span>
          </div>
        </div>
      </div>
    </div>
  );
};
