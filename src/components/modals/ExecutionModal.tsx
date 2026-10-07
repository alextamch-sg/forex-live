import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Zap, ArrowRight, Loader2 } from 'lucide-react';
import { CurrencyCode, OrderType } from '../../types/treasury';
import { SUPPORTED_CURRENCIES } from '../../data/mockData';

interface ExecutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderData: {
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
  } | null;
  onConfirmSuccess: () => void;
}

export const ExecutionModal: React.FC<ExecutionModalProps> = ({
  isOpen,
  onClose,
  orderData,
  onConfirmSuccess,
}) => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [generatedRef, setGeneratedRef] = useState('');

  if (!isOpen || !orderData) return null;

  const handleConfirm = () => {
    setIsExecuting(true);
    const refCode = `${orderData.clearingRail}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}-SG`;
    setGeneratedRef(refCode);

    setTimeout(() => {
      setIsExecuting(false);
      setIsCompleted(true);
    }, 1200);
  };

  const handleFinalDone = () => {
    setIsCompleted(false);
    onConfirmSuccess();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-[#CBD5E1] rounded-xl max-w-lg w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFCFF]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-[#0052FF] flex items-center justify-center text-white font-bold text-xs">
              S$
            </div>
            <div>
              <h3 className="font-display font-bold text-sm text-[#0A2540]">
                {isCompleted ? 'Clearing Advice Confirmed' : 'Confirm FX Execution'}
              </h3>
              <p className="text-[11px] text-[#64748B]">
                {orderData.clearingRail} Rail · Direct Singapore Settlement
              </p>
            </div>
          </div>

          {!isExecuting && (
            <button
              onClick={onClose}
              className="text-[#64748B] hover:text-[#0A2540] p-1 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Body Content */}
        <div className="p-6">
          {isCompleted ? (
            <div className="text-center py-2 space-y-4">
              <div className="w-14 h-14 bg-[#E8F8F0] text-[#00875A] rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h4 className="font-display text-lg font-bold text-[#0A2540]">
                  Trade Settled Successfully
                </h4>
                <p className="text-xs text-[#64748B] mt-1 font-mono">
                  Ref: <span className="text-[#0052FF] font-bold">{generatedRef}</span>
                </p>
              </div>

              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Debit Dispatched:</span>
                  <span className="font-mono font-bold text-[#0A2540]">
                    {SUPPORTED_CURRENCIES[orderData.sellCurrency].symbol}{' '}
                    {orderData.sellAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Credit Settled:</span>
                  <span className="font-mono font-bold text-[#00875A]">
                    {SUPPORTED_CURRENCIES[orderData.buyCurrency].symbol}{' '}
                    {orderData.buyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#64748B]">Clearing Latency:</span>
                  <span className="font-mono text-[#00875A]">1.08 seconds (FAST)</span>
                </div>
              </div>

              <button
                onClick={handleFinalDone}
                className="w-full py-2.5 bg-[#0052FF] hover:bg-[#0043D6] text-white font-semibold text-xs rounded-lg transition-colors"
              >
                Return to Treasury Desk
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Amounts summary */}
              <div className="p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">You Sell</span>
                    <span className="font-mono text-xl font-bold text-[#0A2540]">
                      {SUPPORTED_CURRENCIES[orderData.sellCurrency].symbol}{' '}
                      {orderData.sellAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="text-xl">{SUPPORTED_CURRENCIES[orderData.sellCurrency].flag}</span>
                </div>

                <div className="border-t border-[#E2E8F0] pt-2 flex items-center justify-between text-xs">
                  <span className="text-[#64748B]">Execution Rate:</span>
                  <span className="font-mono font-bold text-[#0052FF]">
                    1 {orderData.sellCurrency} = {orderData.rate.toFixed(4)} {orderData.buyCurrency}
                  </span>
                </div>

                <div className="border-t border-[#E2E8F0] pt-2 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-[#64748B] block">You Receive</span>
                    <span className="font-mono text-xl font-bold text-[#00875A]">
                      {SUPPORTED_CURRENCIES[orderData.buyCurrency].symbol}{' '}
                      {orderData.buyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <span className="text-xl">{SUPPORTED_CURRENCIES[orderData.buyCurrency].flag}</span>
                </div>
              </div>

              {/* Rails and Bank Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Funding Domestic Source:</span>
                  <span className="font-medium text-[#0A2540]">{orderData.fundingBank}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Clearing Rail:</span>
                  <span className="font-mono font-bold text-[#0052FF]">{orderData.clearingRail} Immediate</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#64748B]">Monetary Straits Flat Fee:</span>
                  <span className="font-mono font-medium text-[#0A2540]">S$ {orderData.feeSGD.toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#F1F5F9]">
                  <span className="text-[#00875A] font-medium">Estimated Bank Spread Savings:</span>
                  <span className="font-mono font-bold text-[#00875A]">S$ {orderData.savingsSGD.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-3 bg-[#E8F8F0] border border-[#B3E5CD] rounded-md text-[11px] text-[#00875A] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>Rate locked. Funds will settle immediately upon authorization.</span>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isExecuting}
                  className="w-1/3 py-2.5 border border-[#CBD5E1] text-[#0A2540] font-semibold text-xs rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isExecuting}
                  className="w-2/3 py-2.5 bg-[#0052FF] hover:bg-[#0043D6] text-white font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Clearing via {orderData.clearingRail}...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Authorize Execution</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
