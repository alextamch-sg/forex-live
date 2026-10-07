import React, { useState } from 'react';
import { X, Bell, Target, ArrowRight } from 'lucide-react';
import { LimitOrder } from '../../types/treasury';

interface LimitOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  pair: string;
  currentRate: number;
  onCreateLimitOrder: (order: Partial<LimitOrder>) => void;
}

export const LimitOrderModal: React.FC<LimitOrderModalProps> = ({
  isOpen,
  onClose,
  pair,
  currentRate,
  onCreateLimitOrder,
}) => {
  const [targetRate, setTargetRate] = useState<string>((currentRate * 1.01).toFixed(4));
  const [direction, setDirection] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState<string>('100000');
  const [expiryDays, setExpiryDays] = useState<'7' | '14' | '30'>('14');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rateNum = parseFloat(targetRate) || currentRate;
    const amtNum = parseFloat(amount) || 0;

    onCreateLimitOrder({
      pair,
      direction,
      targetRate: rateNum,
      currentRate,
      amount: amtNum,
      expiresAt: `${expiryDays} days from now`,
      clearingRail: 'FAST',
      status: 'ACTIVE',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-[#CBD5E1] rounded-xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFCFF]">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-[#0052FF]" />
            <h3 className="font-display font-bold text-sm text-[#0A2540]">
              Create Interbank Rate Target / Limit
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-[#64748B] hover:text-[#0A2540] p-1 rounded-md transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Target Currency Pair
            </label>
            <div className="p-2.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md font-mono font-bold text-sm text-[#0A2540] flex justify-between">
              <span>{pair}</span>
              <span className="text-xs text-[#0052FF]">Current: {currentRate.toFixed(4)}</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Execution Trigger Rate
            </label>
            <input
              type="number"
              step="0.0001"
              value={targetRate}
              onChange={(e) => setTargetRate(e.target.value)}
              className="w-full px-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md font-mono text-base font-bold text-[#0A2540] focus:outline-none focus:border-[#0052FF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Tranche Execution Size (SGD)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 font-mono text-sm text-[#64748B]">S$</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md font-mono text-base font-bold text-[#0A2540] focus:outline-none focus:border-[#0052FF]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Order Duration
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['7', '14', '30'] as const).map((days) => (
                <button
                  type="button"
                  key={days}
                  onClick={() => setExpiryDays(days)}
                  className={`py-1.5 text-xs font-medium rounded border transition-colors ${
                    expiryDays === days
                      ? 'border-[#0052FF] bg-[#F0F5FF] text-[#0052FF] font-bold'
                      : 'border-[#CBD5E1] text-[#49607E]'
                  }`}
                >
                  {days} Days
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#E8F8F0] border border-[#B3E5CD] rounded-md text-[11px] text-[#00875A] flex items-start gap-2">
            <Bell className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              When wholesale quote hits target, order executes immediately via FAST direct debit and notifies your treasury desk.
            </span>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2 border border-[#CBD5E1] text-[#0A2540] text-xs font-semibold rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-2/3 py-2 bg-[#0052FF] hover:bg-[#0043D6] text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Place Target Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
