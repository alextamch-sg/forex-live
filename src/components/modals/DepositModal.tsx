import React, { useState } from 'react';
import { X, QrCode, Zap, Building2, Check, ArrowDownLeft, Copy } from 'lucide-react';
import { CurrencyCode } from '../../types/treasury';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onDepositSuccess: (amount: number, rail: 'FAST' | 'PayNow' | 'MEPS', bank: string) => void;
}

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  currency,
  onDepositSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'FAST' | 'PayNow' | 'MEPS'>('FAST');
  const [depositAmount, setDepositAmount] = useState('25000');
  const [selectedBank, setSelectedBank] = useState('DBS Bank Ltd');
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDirectDebit = () => {
    const amt = parseFloat(depositAmount) || 0;
    if (amt <= 0) return;
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      onDepositSuccess(amt, activeTab, selectedBank);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-[#CBD5E1] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFCFF]">
          <div>
            <h3 className="font-display font-bold text-sm text-[#0A2540]">
              Inbound Liquidity · Fund {currency} Account
            </h3>
            <p className="text-[11px] text-[#64748B]">
              Direct clearing into Monetary Straits segregated omnibus rail
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0A2540] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 border-b border-[#E2E8F0] flex items-center gap-2">
          <button
            onClick={() => setActiveTab('FAST')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'FAST'
                ? 'border-[#0052FF] text-[#0052FF]'
                : 'border-transparent text-[#64748B] hover:text-[#0A2540]'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>FAST Direct Debit</span>
          </button>

          <button
            onClick={() => setActiveTab('PayNow')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'PayNow'
                ? 'border-[#0052FF] text-[#0052FF]'
                : 'border-transparent text-[#64748B] hover:text-[#0A2540]'
            }`}
          >
            <QrCode className="w-3.5 h-3.5" />
            <span>PayNow Corporate QR</span>
          </button>

          <button
            onClick={() => setActiveTab('MEPS')}
            className={`pb-3 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'MEPS'
                ? 'border-[#0052FF] text-[#0052FF]'
                : 'border-transparent text-[#64748B] hover:text-[#0A2540]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>MEPS+ Wire</span>
          </button>
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'FAST' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Linked Corporate Debit Source
                </label>
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs font-medium text-[#0A2540] focus:outline-none focus:border-[#0052FF]"
                >
                  <option value="DBS Bank Ltd">DBS Ideal (003-902481-8) · Available S$ 1.85M</option>
                  <option value="OCBC Velocity">OCBC Velocity (581-229410-001) · Available S$ 1.45M</option>
                  <option value="UOB Infinity">UOB Infinity (301-102948-2) · Available S$ 5.00M</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#64748B] mb-1">
                  Tranche Amount ({currency})
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 font-mono text-sm font-bold text-[#64748B]">
                    S$
                  </span>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md font-mono text-lg font-bold text-[#0A2540] focus:outline-none focus:border-[#0052FF]"
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  {[10000, 25000, 50000, 100000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDepositAmount(amt.toString())}
                      className="px-2 py-1 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[11px] font-mono text-[#0A2540] rounded transition-colors"
                    >
                      +S${(amt / 1000).toFixed(0)}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-[#FAFCFF] border border-[#E2E8F0] rounded-md text-xs text-[#64748B] space-y-1">
                <div className="flex justify-between">
                  <span>Settlement Speed:</span>
                  <span className="font-mono text-[#00875A] font-semibold">Immediate (&lt; 2 seconds)</span>
                </div>
                <div className="flex justify-between">
                  <span>Clearing Network:</span>
                  <span className="font-mono text-[#0A2540]">Banking Computer Services (BCS)</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDirectDebit}
                disabled={isProcessing}
                className="w-full py-2.5 bg-[#0052FF] hover:bg-[#0043D6] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ArrowDownLeft className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Authorizing FAST Direct Debit...' : 'Authorize Instant FAST Debit'}
                </span>
              </button>
            </div>
          )}

          {activeTab === 'PayNow' && (
            <div className="space-y-4 text-center">
              {/* Dynamic SGQR Interactive Render */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl inline-block mx-auto shadow-inner">
                <div className="w-44 h-44 bg-white p-2 border border-slate-200 rounded-lg flex flex-col items-center justify-center relative">
                  {/* Clean SVG QR pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    {/* Corner Position Markers */}
                    <rect x="5" y="5" width="25" height="25" fill="#0A2540" />
                    <rect x="9" y="9" width="17" height="17" fill="#ffffff" />
                    <rect x="13" y="13" width="9" height="9" fill="#0A2540" />

                    <rect x="70" y="5" width="25" height="25" fill="#0A2540" />
                    <rect x="74" y="9" width="17" height="17" fill="#ffffff" />
                    <rect x="78" y="13" width="9" height="9" fill="#0A2540" />

                    <rect x="5" y="70" width="25" height="25" fill="#0A2540" />
                    <rect x="9" y="74" width="17" height="17" fill="#ffffff" />
                    <rect x="13" y="78" width="9" height="9" fill="#0A2540" />

                    {/* Inner QR Matrix simulated dots */}
                    <rect x="35" y="10" width="5" height="5" fill="#0A2540" />
                    <rect x="45" y="15" width="10" height="5" fill="#0A2540" />
                    <rect x="40" y="25" width="5" height="10" fill="#0A2540" />
                    <rect x="55" y="20" width="5" height="5" fill="#0A2540" />
                    <rect x="15" y="35" width="10" height="5" fill="#0A2540" />
                    <rect x="25" y="45" width="5" height="10" fill="#0A2540" />
                    <rect x="35" y="40" width="10" height="10" fill="#DE350B" />
                    <rect x="50" y="35" width="15" height="5" fill="#0A2540" />
                    <rect x="70" y="40" width="5" height="10" fill="#0A2540" />
                    <rect x="80" y="50" width="10" height="5" fill="#0A2540" />
                    <rect x="35" y="60" width="5" height="15" fill="#0A2540" />
                    <rect x="50" y="55" width="10" height="10" fill="#0A2540" />
                    <rect x="65" y="65" width="15" height="5" fill="#0A2540" />
                    <rect x="45" y="75" width="5" height="10" fill="#0A2540" />
                    <rect x="75" y="75" width="10" height="10" fill="#0A2540" />
                  </svg>
                  <div className="absolute inset-x-0 bottom-1 text-[9px] font-mono font-bold text-[#DE350B]">
                    SGQR · PAYNOW CORPORATE
                  </div>
                </div>
              </div>

              <div className="text-left bg-[#FAFCFF] border border-[#E2E8F0] p-3 rounded-lg text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Corporate UEN:</span>
                  <button
                    onClick={() => handleCopy('201948210D')}
                    className="font-mono font-bold text-[#0A2540] flex items-center gap-1 hover:text-[#0052FF]"
                  >
                    <span>201948210D</span>
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Entity Name:</span>
                  <span className="font-semibold text-[#0A2540]">TEMASEK STRAITS PTE LTD</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Inbound Ref:</span>
                  <span className="font-mono text-[#0052FF]">TR-8841-DEPOSIT</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onDepositSuccess(25000, 'PayNow', 'Corporate PayNow UEN');
                  onClose();
                }}
                className="w-full py-2 bg-[#0052FF] hover:bg-[#0043D6] text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Simulate QR Payment Received (S$ 25,000)
              </button>
            </div>
          )}

          {activeTab === 'MEPS' && (
            <div className="space-y-4">
              <p className="text-xs text-[#64748B]">
                For institutional transfers exceeding S$ 2,000,000, use MAS Electronic Payment System (MEPS+).
              </p>

              <div className="bg-[#FAFCFF] border border-[#E2E8F0] p-4 rounded-lg text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Beneficiary Bank:</span>
                  <span className="font-semibold text-[#0A2540]">Monetary Authority of Singapore (MAS)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">SWIFT / BIC:</span>
                  <span className="font-mono font-bold text-[#0A2540]">MASGSGSG</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Account Number:</span>
                  <span className="font-mono font-bold text-[#0052FF]">SG-MEPS-889104-991</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Beneficiary Name:</span>
                  <span className="font-medium text-[#0A2540]">Monetary Straits Client Asset Segregation A/C</span>
                </div>
              </div>

              <div className="p-3 bg-[#E8F8F0] border border-[#B3E5CD] rounded-md text-[11px] text-[#00875A]">
                Same-day RTGS credit is guaranteed within 15 minutes of MAS clearing confirmation.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
