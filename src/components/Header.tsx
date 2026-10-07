import React from 'react';
import { ArrowDownLeft, ShieldCheck, Building2, User, RefreshCw } from 'lucide-react';

interface HeaderProps {
  activeTab: 'converter' | 'rates' | 'accounts' | 'banks' | 'ledger';
  setActiveTab: (tab: 'converter' | 'rates' | 'accounts' | 'banks' | 'ledger') => void;
  onOpenDeposit: () => void;
  onOpenProfile: () => void;
  masStatus?: {
    source: string;
    lastSync: string;
    isKeyConfigured: boolean;
    isSyncing?: boolean;
  };
  onSyncMas?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onOpenDeposit,
  onOpenProfile,
  masStatus,
  onSyncMas,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark in Display Font */}
        <button
          onClick={() => setActiveTab('converter')}
          className="text-left group flex items-center gap-2.5 focus:outline-none"
        >
          <div className="w-8 h-8 rounded-md bg-[#0052FF] flex items-center justify-center text-white font-bold text-base shadow-sm">
            <span>S$</span>
          </div>
          <span className="font-display text-xl font-bold tracking-tight text-[#0A2540] group-hover:text-[#0052FF] transition-colors whitespace-nowrap">
            Monetary Straits
          </span>
        </button>

        {/* Zone 2: Navigation Links (Text Links with Active States) */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => setActiveTab('converter')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'converter'
                ? 'text-[#0052FF] bg-[#F0F5FF]'
                : 'text-[#49607E] hover:text-[#0A2540] hover:bg-slate-50'
            }`}
          >
            Treasury & FX
          </button>
          <button
            onClick={() => setActiveTab('rates')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'rates'
                ? 'text-[#0052FF] bg-[#F0F5FF]'
                : 'text-[#49607E] hover:text-[#0A2540] hover:bg-slate-50'
            }`}
          >
            Mid-Market Rates
          </button>
          <button
            onClick={() => setActiveTab('accounts')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'accounts'
                ? 'text-[#0052FF] bg-[#F0F5FF]'
                : 'text-[#49607E] hover:text-[#0A2540] hover:bg-slate-50'
            }`}
          >
            Multi-Currency Liquidity
          </button>
          <button
            onClick={() => setActiveTab('banks')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'banks'
                ? 'text-[#0052FF] bg-[#F0F5FF]'
                : 'text-[#49607E] hover:text-[#0A2540] hover:bg-slate-50'
            }`}
          >
            Domestic Banks (FAST)
          </button>
          <button
            onClick={() => setActiveTab('ledger')}
            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'ledger'
                ? 'text-[#0052FF] bg-[#F0F5FF]'
                : 'text-[#49607E] hover:text-[#0A2540] hover:bg-slate-50'
            }`}
          >
            Settlement Ledger
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {onSyncMas && (
            <button
              onClick={onSyncMas}
              title={`Source: ${masStatus?.source === 'mas_official_api' ? 'Official MAS API' : 'Cached Baseline'}. Click to re-sync.`}
              className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#0052FF] bg-[#F0F5FF] border border-[#CBD5E1] hover:border-[#0052FF] rounded-md font-mono transition-colors"
            >
              <RefreshCw className={`w-3 h-3 ${masStatus?.isSyncing ? 'animate-spin' : ''}`} />
              <span>MAS API: {masStatus?.source === 'mas_official_api' ? 'Live' : 'Standby'}</span>
            </button>
          )}

          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 text-xs text-[#00875A] bg-[#E8F8F0] border border-[#B3E5CD] rounded-md font-mono">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span className="whitespace-nowrap">MEPS / FAST RTGS</span>
          </div>

          <button
            onClick={onOpenDeposit}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0052FF] hover:bg-[#0043D6] active:bg-[#0038B6] rounded-md transition-colors shadow-sm whitespace-nowrap"
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Fund SGD Rail</span>
          </button>

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1 pl-2 text-left rounded-md border border-[#E2E8F0] hover:border-[#CBD5E1] bg-white transition-colors"
            title="Institutional Account Profile"
          >
            <div className="hidden xl:block text-right leading-tight pr-1">
              <div className="text-xs font-semibold text-[#0A2540]">Temasek Straits Ltd</div>
              <div className="text-[11px] text-[#64748B] font-mono">UEN: 201948210D</div>
            </div>
            <div className="w-7 h-7 rounded-md overflow-hidden bg-slate-100 flex items-center justify-center border border-slate-200">
              <img
                src="/src/assets/images/avatar_executive_user_1791359371229.jpg"
                alt="Account Holder"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <User className="w-4 h-4 text-[#49607E]" />
            </div>
          </button>
        </div>
      </div>

      {/* Mobile nav bar */}
      <div className="md:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 gap-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('converter')}
          className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'converter' ? 'text-[#0052FF] bg-[#F0F5FF]' : 'text-[#49607E]'
          }`}
        >
          Treasury Desk
        </button>
        <button
          onClick={() => setActiveTab('rates')}
          className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'rates' ? 'text-[#0052FF] bg-[#F0F5FF]' : 'text-[#49607E]'
          }`}
        >
          Mid-Market
        </button>
        <button
          onClick={() => setActiveTab('accounts')}
          className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'accounts' ? 'text-[#0052FF] bg-[#F0F5FF]' : 'text-[#49607E]'
          }`}
        >
          Liquidity
        </button>
        <button
          onClick={() => setActiveTab('banks')}
          className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'banks' ? 'text-[#0052FF] bg-[#F0F5FF]' : 'text-[#49607E]'
          }`}
        >
          DBS/OCBC/UOB
        </button>
        <button
          onClick={() => setActiveTab('ledger')}
          className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap ${
            activeTab === 'ledger' ? 'text-[#0052FF] bg-[#F0F5FF]' : 'text-[#49607E]'
          }`}
        >
          Ledger
        </button>
      </div>
    </header>
  );
};
