import React, { useState } from 'react';
import { Building2, ShieldCheck, Check, ArrowRight, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { DomesticBank } from '../types/treasury';

interface DomesticBankingRailsProps {
  banks: DomesticBank[];
  onOpenDeposit: () => void;
}

export const DomesticBankingRails: React.FC<DomesticBankingRailsProps> = ({
  banks,
  onOpenDeposit,
}) => {
  const [selectedBankId, setSelectedBankId] = useState<string>('bank-dbs');
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  const handlePingRail = (bankName: string) => {
    setPingSuccess(`Direct FAST clearance handshake verified with ${bankName} (Latency: 0.8s)`);
    setTimeout(() => {
      setPingSuccess(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 mb-8">
      {/* Overview Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F1F5F9]">
          <div>
            <h2 className="font-display text-lg font-bold text-[#0A2540]">
              Singapore Domestic Banking & Clearing Rails
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Direct API linkages with Tier-1 Singapore domestic banks under the MAS Payment Services Act.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00875A] animate-ping"></span>
            <span className="text-xs font-mono font-semibold text-[#00875A]">
              BCS Clearing Gateway: ONLINE
            </span>
          </div>
        </div>

        {pingSuccess && (
          <div className="mt-4 p-3 bg-[#E8F8F0] border border-[#B3E5CD] rounded-lg text-xs text-[#00875A] flex items-center gap-2 font-mono">
            <Check className="w-4 h-4 shrink-0" />
            <span>{pingSuccess}</span>
          </div>
        )}

        {/* Domestic Bank Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
          {banks.map((bank) => {
            const isSelected = selectedBankId === bank.id;
            const percentageUsed = (bank.fastLimitUsed / bank.fastLimitDaily) * 100;

            return (
              <div
                key={bank.id}
                onClick={() => setSelectedBankId(bank.id)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-[#0052FF] bg-[#F0F5FF]/40 ring-1 ring-[#0052FF]'
                    : 'border-[#CBD5E1] bg-white hover:border-[#94A3B8]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs text-white"
                      style={{ backgroundColor: bank.color }}
                    >
                      {bank.shortName}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-[#0A2540]">{bank.shortName}</div>
                      <div className="text-[11px] text-[#64748B]">{bank.name}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      bank.status === 'Connected'
                        ? 'bg-[#E8F8F0] text-[#00875A]'
                        : 'bg-[#F1F5F9] text-[#64748B]'
                    }`}
                  >
                    {bank.status}
                  </span>
                </div>

                <div className="mt-4 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>Account Number:</span>
                    <span className="font-mono font-bold text-[#0A2540]">{bank.accountNo}</span>
                  </div>
                  <div className="flex items-center justify-between text-[#64748B]">
                    <span>PayNow Proxy:</span>
                    <span className="font-mono text-[#0A2540]">{bank.paynowProxy}</span>
                  </div>
                </div>

                {/* FAST Daily Limit Meter */}
                <div className="mt-4 pt-3 border-t border-[#E2E8F0]">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="text-[#64748B]">FAST 24h Quota:</span>
                    <span className="font-mono text-[#0A2540]">
                      S$ {(bank.fastLimitUsed / 1000).toFixed(0)}k / {(bank.fastLimitDaily / 1000).toFixed(0)}k
                    </span>
                  </div>
                  <div className="w-full bg-[#E2E8F0] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#0052FF] h-full rounded-full transition-all"
                      style={{ width: `${percentageUsed}%` }}
                    ></div>
                  </div>
                </div>

                {/* Handshake test button */}
                <div className="mt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePingRail(bank.shortName);
                    }}
                    className="text-xs font-semibold text-[#0052FF] hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Ping FAST Rail</span>
                  </button>

                  {isSelected && (
                    <span className="text-[11px] font-semibold text-[#00875A] flex items-center gap-1">
                      <Check className="w-3 h-3" /> Primary Rail
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Clearing Rails Architecture Technical Spec */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-[#0A2540]">FAST (Fast And Secure Transfers)</h3>
            <span className="font-mono text-xs text-[#00875A] font-bold">24/7/365</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed mb-3">
            Direct clearing through Singapore BCS engine. Real-time settlement up to S$ 2,000,000 per single execution tranche.
          </p>
          <div className="text-[11px] font-mono space-y-1 text-[#49607E] border-t border-[#F1F5F9] pt-2">
            <div>Average clearing latency: <strong>1.1 seconds</strong></div>
            <div>Clearing protocol: ISO 20022 Direct XML</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-[#0A2540]">PayNow Corporate Proxy</h3>
            <span className="font-mono text-xs text-[#00875A] font-bold">Instant</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed mb-3">
            Inbound collection routing tied directly to Company UEN. Generates dynamic SGQR payloads with pre-filled currency amounts.
          </p>
          <div className="text-[11px] font-mono space-y-1 text-[#49607E] border-t border-[#F1F5F9] pt-2">
            <div>Linked Entity: <strong>Temasek Straits Ltd</strong></div>
            <div>Proxy Type: UEN + Corporate Suffix</div>
          </div>
        </div>

        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-sm text-[#0A2540]">MEPS+ (MAS Electronic Payment)</h3>
            <span className="font-mono text-xs text-[#0052FF] font-bold">RTGS Uncapped</span>
          </div>
          <p className="text-xs text-[#64748B] leading-relaxed mb-3">
            Monetary Authority of Singapore Real-Time Gross Settlement system for interbank and high-value institutional SGD transfers.
          </p>
          <div className="text-[11px] font-mono space-y-1 text-[#49607E] border-t border-[#F1F5F9] pt-2">
            <div>Operating hours: 09:00 - 19:00 SGT (Mon-Fri)</div>
            <div>Tranche limit: <strong>Unlimited</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
