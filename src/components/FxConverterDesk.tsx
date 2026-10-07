import React, { useState, useEffect } from 'react';
import {
  ArrowUpDown,
  Lock,
  RefreshCw,
  Zap,
  TrendingUp,
  Info,
  CheckCircle2,
  Calendar,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { CurrencyCode, FxRate, OrderType } from '../types/treasury';
import { SUPPORTED_CURRENCIES } from '../data/mockData';
import { RateChart } from './RateChart';

interface FxConverterDeskProps {
  rates: FxRate[];
  onExecuteOrder: (params: {
    sellCurrency: CurrencyCode;
    sellAmount: number;
    buyCurrency: CurrencyCode;
    buyAmount: number;
    rate: number;
    type: OrderType;
    clearingRail: 'FAST' | 'PayNow' | 'MEPS';
    fundingBank: string;
    feeSGD: number;
    savingsSGD: number;
  }) => void;
  onOpenLimitModal: (pair: string, currentRate: number) => void;
}

export const FxConverterDesk: React.FC<FxConverterDeskProps> = ({
  rates,
  onExecuteOrder,
  onOpenLimitModal,
}) => {
  const [sellCurrency, setSellCurrency] = useState<CurrencyCode>('SGD');
  const [buyCurrency, setBuyCurrency] = useState<CurrencyCode>('USD');
  const [sellAmountStr, setSellAmountStr] = useState<string>('50000');
  const [orderType, setOrderType] = useState<OrderType>('SPOT');
  const [fundingRail, setFundingRail] = useState<'FAST' | 'PayNow' | 'MEPS'>('FAST');
  const [fundingBank, setFundingBank] = useState<string>('DBS Bank Ltd');
  const [lockSeconds, setLockSeconds] = useState<number>(30);
  const [sellDropdownOpen, setSellDropdownOpen] = useState(false);
  const [buyDropdownOpen, setBuyDropdownOpen] = useState(false);

  // Rate countdown lock timer
  useEffect(() => {
    const timer = setInterval(() => {
      setLockSeconds((prev) => (prev <= 1 ? 30 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Compute conversion rate based on sellCurrency and buyCurrency
  const calculateRate = (from: CurrencyCode, to: CurrencyCode): number => {
    if (from === to) return 1.0;

    // Check direct pair
    const directPair = rates.find((r) => r.base === from && r.quote === to);
    if (directPair) return directPair.rate;

    // Check inverse pair
    const inversePair = rates.find((r) => r.base === to && r.quote === from);
    if (inversePair) return 1 / inversePair.rate;

    // Route via SGD if cross-currency
    const fromToSgd = from === 'SGD' ? 1 : 1 / (rates.find((r) => r.base === 'SGD' && r.quote === from)?.rate || 1);
    const sgdToBuy = to === 'SGD' ? 1 : (rates.find((r) => r.base === 'SGD' && r.quote === to)?.rate || 1);
    return fromToSgd * sgdToBuy;
  };

  const currentRate = calculateRate(sellCurrency, buyCurrency);
  const sellAmount = parseFloat(sellAmountStr) || 0;
  const buyAmount = sellAmount * currentRate;

  // Mid-market savings calculation:
  // Retail banks take ~2.00% markup on FX; Monetary Straits takes 0.08%
  const retailSpreadPercent = 0.021; // 2.10%
  const institutionalSpreadPercent = 0.0008; // 0.08%
  
  // Normalized in SGD
  const sellInSgd = sellCurrency === 'SGD' ? sellAmount : sellAmount * calculateRate(sellCurrency, 'SGD');
  const feeSGD = sellInSgd * institutionalSpreadPercent;
  const retailFeeSGD = sellInSgd * retailSpreadPercent;
  const savingsSGD = Math.max(0, retailFeeSGD - feeSGD);

  const handleSwap = () => {
    setSellCurrency(buyCurrency);
    setBuyCurrency(sellCurrency);
  };

  const handleExecute = () => {
    if (sellAmount <= 0) return;
    onExecuteOrder({
      sellCurrency,
      sellAmount,
      buyCurrency,
      buyAmount,
      rate: currentRate,
      type: orderType,
      clearingRail: fundingRail,
      fundingBank,
      feeSGD,
      savingsSGD,
    });
  };

  const currencyList = Object.keys(SUPPORTED_CURRENCIES) as CurrencyCode[];
  const currentPairDisplay = `${sellCurrency}/${buyCurrency}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
      {/* 7 Columns: Dual-Panel Currency Converter & Execution Control */}
      <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-5 sm:p-6 shadow-xs flex flex-col justify-between">
        <div>
          {/* Header & Order Type Segments */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#F1F5F9]">
            <div>
              <h2 className="font-display text-lg font-bold text-[#0A2540]">
                Institutional FX Conversion Desk
              </h2>
              <div className="text-xs text-[#64748B] flex items-center gap-1.5 mt-0.5">
                <span>Verified Clearing Rails:</span>
                <span className="font-mono text-[#00875A] font-medium">FAST · PayNow · MEPS</span>
              </div>
            </div>

            {/* Segmented Control for Execution Type */}
            <div className="flex items-center bg-[#F1F5F9] p-1 rounded-lg">
              <button
                onClick={() => setOrderType('SPOT')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  orderType === 'SPOT'
                    ? 'bg-white text-[#0052FF] shadow-xs'
                    : 'text-[#49607E] hover:text-[#0A2540]'
                }`}
              >
                Spot Instant
              </button>
              <button
                onClick={() => {
                  setOrderType('LIMIT');
                  onOpenLimitModal(currentPairDisplay, currentRate);
                }}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  orderType === 'LIMIT'
                    ? 'bg-white text-[#0052FF] shadow-xs'
                    : 'text-[#49607E] hover:text-[#0A2540]'
                }`}
              >
                Rate Target
              </button>
              <button
                onClick={() => setOrderType('RECURRING')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  orderType === 'RECURRING'
                    ? 'bg-white text-[#0052FF] shadow-xs'
                    : 'text-[#49607E] hover:text-[#0A2540]'
                }`}
              >
                Tranche
              </button>
            </div>
          </div>

          {/* DUAL PANEL CONVERSION FIELD */}
          <div className="space-y-3 relative">
            {/* Field 1: SELL Zone */}
            <div className="rounded-lg border border-[#CBD5E1] p-3.5 focus-within:ring-2 focus-within:ring-[#0052FF] focus-within:border-transparent transition-all bg-[#FAFCFF]">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
                <span className="font-medium">You Transfer (Debit)</span>
                <span className="font-mono text-[11px]">
                  Balance: {SUPPORTED_CURRENCIES[sellCurrency].symbol}{' '}
                  {sellCurrency === 'SGD' ? '842,150.80' : '320,400.00'}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <input
                  type="number"
                  value={sellAmountStr}
                  onChange={(e) => setSellAmountStr(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-transparent font-mono text-2xl sm:text-3xl font-bold text-[#0A2540] focus:outline-none tracking-tight"
                />

                {/* Sell Currency Dropdown Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setSellDropdownOpen(!sellDropdownOpen);
                      setBuyDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-[#CBD5E1] hover:border-[#0052FF] rounded-lg text-sm font-bold text-[#0A2540] transition-colors shadow-xs whitespace-nowrap"
                  >
                    <span className="text-base">{SUPPORTED_CURRENCIES[sellCurrency].flag}</span>
                    <span className="font-mono">{sellCurrency}</span>
                    <ChevronDown className="w-4 h-4 text-[#64748B]" />
                  </button>

                  {sellDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 max-h-60 overflow-y-auto bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1">
                      {currencyList.map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setSellCurrency(code);
                            setSellDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#F1F5F9] transition-colors ${
                            sellCurrency === code ? 'bg-[#F0F5FF] text-[#0052FF] font-bold' : 'text-[#0A2540]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{SUPPORTED_CURRENCIES[code].flag}</span>
                            <span>{code}</span>
                          </span>
                          <span className="text-[#64748B] text-[10px]">{SUPPORTED_CURRENCIES[code].symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Middle Action: Swap button & Live rate tag */}
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-xs font-mono text-[#0A2540]">
                <span className="font-semibold">Mid-Market Rate:</span>
                <span className="text-[#0052FF] font-bold">
                  1 {sellCurrency} = {currentRate.toFixed(4)} {buyCurrency}
                </span>
              </div>

              <button
                type="button"
                onClick={handleSwap}
                title="Inverse Rate"
                className="w-8 h-8 rounded-full bg-white border border-[#CBD5E1] hover:border-[#0052FF] hover:text-[#0052FF] shadow-xs flex items-center justify-center text-[#49607E] transition-colors"
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>

            {/* Field 2: BUY Zone */}
            <div className="rounded-lg border border-[#CBD5E1] p-3.5 focus-within:ring-2 focus-within:ring-[#0052FF] focus-within:border-transparent transition-all bg-[#FAFCFF]">
              <div className="flex items-center justify-between text-xs text-[#64748B] mb-1.5">
                <span className="font-medium">You Receive (Credit)</span>
                <span className="font-mono text-[11px] text-[#00875A]">
                  Guaranteed Rate Applied
                </span>
              </div>

              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#00875A] tracking-tight">
                  {buyAmount.toLocaleString('en-US', {
                    minimumFractionDigits: SUPPORTED_CURRENCIES[buyCurrency].decimals,
                    maximumFractionDigits: SUPPORTED_CURRENCIES[buyCurrency].decimals,
                  })}
                </div>

                {/* Buy Currency Dropdown Selector */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => {
                      setBuyDropdownOpen(!buyDropdownOpen);
                      setSellDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 px-3 py-2 bg-white border border-[#CBD5E1] hover:border-[#0052FF] rounded-lg text-sm font-bold text-[#0A2540] transition-colors shadow-xs whitespace-nowrap"
                  >
                    <span className="text-base">{SUPPORTED_CURRENCIES[buyCurrency].flag}</span>
                    <span className="font-mono">{buyCurrency}</span>
                    <ChevronDown className="w-4 h-4 text-[#64748B]" />
                  </button>

                  {buyDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 max-h-60 overflow-y-auto bg-white border border-[#CBD5E1] rounded-lg shadow-lg z-50 py-1">
                      {currencyList.map((code) => (
                        <button
                          key={code}
                          type="button"
                          onClick={() => {
                            setBuyCurrency(code);
                            setBuyDropdownOpen(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:bg-[#F1F5F9] transition-colors ${
                            buyCurrency === code ? 'bg-[#F0F5FF] text-[#0052FF] font-bold' : 'text-[#0A2540]'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <span>{SUPPORTED_CURRENCIES[code].flag}</span>
                            <span>{code}</span>
                          </span>
                          <span className="text-[#64748B] text-[10px]">{SUPPORTED_CURRENCIES[code].symbol}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Clearing Rail & Domestic Funding Account Selector */}
          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4 border-t border-[#F1F5F9]">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">
                SGD Clearing Settlement Rail
              </label>
              <div className="grid grid-cols-3 gap-1 bg-[#F1F5F9] p-1 rounded-md">
                {(['FAST', 'PayNow', 'MEPS'] as const).map((rail) => (
                  <button
                    key={rail}
                    type="button"
                    onClick={() => setFundingRail(rail)}
                    className={`py-1.5 text-xs font-mono font-medium rounded transition-colors ${
                      fundingRail === rail
                        ? 'bg-white text-[#0052FF] shadow-xs font-bold'
                        : 'text-[#49607E] hover:text-[#0A2540]'
                    }`}
                  >
                    {rail}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] mb-1">
                Domestic Settlement Account
              </label>
              <select
                value={fundingBank}
                onChange={(e) => setFundingBank(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-[#CBD5E1] rounded-md text-xs font-medium text-[#0A2540] focus:outline-none focus:border-[#0052FF]"
              >
                <option value="DBS Bank Ltd">DBS (003-902481-8) · FAST Active</option>
                <option value="OCBC Velocity">OCBC (581-229410-001) · Velocity</option>
                <option value="UOB Infinity">UOB (301-102948-2) · Infinity MEPS</option>
              </select>
            </div>
          </div>

          {/* Institutional Spread Transparency Box & Savings Counter */}
          <div className="mt-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3.5 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Interbank Mid-Market Fee (0.08%):</span>
              <span className="font-mono font-semibold text-[#0A2540]">
                S$ {feeSGD.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#64748B]">Standard Retail Bank Markup (~2.1%):</span>
              <span className="font-mono text-[#DE350B] line-through">
                S$ {retailFeeSGD.toFixed(2)}
              </span>
            </div>
            <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between text-xs">
              <span className="font-semibold text-[#00875A] flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Estimated Treasury Savings:
              </span>
              <span className="font-mono font-bold text-sm text-[#00875A]">
                S$ {savingsSGD.toLocaleString('en-SG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Lock Timer & Execution Trigger Button */}
        <div className="mt-6 pt-4 border-t border-[#F1F5F9] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <Lock className="w-3.5 h-3.5 text-[#0052FF]" />
            <span>Rate locked for</span>
            <span className="font-mono font-bold text-[#0052FF]">{lockSeconds}s</span>
            <button
              onClick={() => setLockSeconds(30)}
              className="text-[#49607E] hover:text-[#0052FF] transition-colors p-1"
              title="Refresh Rate Lock"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <button
            type="button"
            onClick={handleExecute}
            disabled={sellAmount <= 0}
            className="w-full sm:w-auto px-6 py-3 bg-[#0052FF] hover:bg-[#0043D6] active:bg-[#0038B6] disabled:opacity-50 text-white font-semibold text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" />
            <span>
              {orderType === 'SPOT'
                ? `Execute via ${fundingRail} Direct`
                : orderType === 'LIMIT'
                ? 'Place Rate Target Order'
                : 'Schedule Treasury Tranche'}
            </span>
          </button>
        </div>
      </div>

      {/* 5 Columns: Live Mid-Market Chart & Liquidity Depth */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <RateChart pair={currentPairDisplay} currentRate={currentRate} />

        {/* Real-time Settlement Guarantee Card */}
        <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">
              Fiduciary Clearing Guarantee
            </span>
            <span className="text-xs font-mono text-[#00875A]">MAS Regulated</span>
          </div>

          <div className="space-y-2.5 text-xs text-[#0A2540]">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
              <span>
                <strong>Zero Concealed Spreads:</strong> Execution locks strictly against wholesale Singapore interbank quote feeds.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
              <span>
                <strong>Sub-2s FAST Settlement:</strong> SGD debits clear through Banking Computer Services (BCS) immediate rails.
              </span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#00875A] shrink-0 mt-0.5" />
              <span>
                <strong>Segregated Client Funds:</strong> Custodied under Section 23 of the Payment Services Act in Singapore.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
