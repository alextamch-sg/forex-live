import React from 'react';
import { X, Printer, ShieldCheck, Download } from 'lucide-react';
import { TransactionRecord } from '../../types/treasury';
import { SUPPORTED_CURRENCIES } from '../../data/mockData';

interface ReceiptModalProps {
  transaction: TransactionRecord | null;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  onClose,
}) => {
  if (!transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white border border-[#CBD5E1] rounded-xl max-w-xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="px-6 py-3 border-b border-[#E2E8F0] flex items-center justify-between bg-[#FAFCFF]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00875A]" />
            <span className="text-xs font-mono font-bold text-[#0A2540]">
              Official Settlement Advice (Form MAS-PSN01)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 text-[#64748B] hover:text-[#0A2540] hover:bg-slate-100 rounded transition-colors"
              title="Print Advice"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#64748B] hover:text-[#0A2540] hover:bg-slate-100 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Certificate / Receipt Canvas */}
        <div className="p-6 sm:p-8 space-y-6 print:p-0">
          {/* Institution Header */}
          <div className="flex items-start justify-between border-b border-[#E2E8F0] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#0052FF] text-white flex items-center justify-center font-bold text-xs">
                  S$
                </div>
                <h2 className="font-display text-lg font-bold text-[#0A2540]">
                  Monetary Straits
                </h2>
              </div>
              <p className="text-[11px] text-[#64748B] mt-0.5">
                Wholesale Treasury & Foreign Exchange Clearing Rail
              </p>
              <p className="text-[10px] text-[#94A3B8] font-mono">
                Regulated under Monetary Authority of Singapore (License PS20194821)
              </p>
            </div>

            <div className="text-right">
              <span className="font-mono text-xs font-bold text-[#00875A] bg-[#E8F8F0] px-2 py-0.5 rounded">
                SETTLED
              </span>
              <div className="text-[11px] font-mono text-[#64748B] mt-1">
                Rail: <strong className="text-[#0A2540]">{transaction.clearingRail}</strong>
              </div>
            </div>
          </div>

          {/* Core Reference Details */}
          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <span className="text-[#64748B] block text-[11px]">BCS Reference Number</span>
              <span className="font-bold text-[#0052FF]">{transaction.referenceNo}</span>
            </div>
            <div className="text-right">
              <span className="text-[#64748B] block text-[11px]">Settlement Timestamp</span>
              <span className="font-bold text-[#0A2540]">{transaction.timestamp}</span>
            </div>
          </div>

          {/* Execution Financial Breakdown */}
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Debit Account ({transaction.fundingBank}):</span>
              <span className="font-mono font-bold text-[#0A2540]">
                {SUPPORTED_CURRENCIES[transaction.sellCurrency].symbol}{' '}
                {transaction.sellAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                {transaction.sellCurrency}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Credit Destination Account:</span>
              <span className="font-mono font-bold text-[#00875A]">
                {SUPPORTED_CURRENCIES[transaction.buyCurrency].symbol}{' '}
                {transaction.buyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                {transaction.buyCurrency}
              </span>
            </div>

            <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center text-xs">
              <span className="text-[#64748B]">Interbank Executed Rate:</span>
              <span className="font-mono font-bold text-[#0052FF]">
                1 {transaction.sellCurrency} = {transaction.rate.toFixed(4)} {transaction.buyCurrency}
              </span>
            </div>
          </div>

          {/* Fee & Transparent Spread Table */}
          <div className="text-xs space-y-2 border-t border-[#E2E8F0] pt-3">
            <div className="flex justify-between text-[#64748B]">
              <span>Clearing Fee (0.08% Flat Wholesale):</span>
              <span className="font-mono text-[#0A2540]">S$ {transaction.feeSGD.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[#00875A] font-semibold">
              <span>Savings vs Retail Bank FX Markup:</span>
              <span className="font-mono">S$ {transaction.savingsSGD.toFixed(2)}</span>
            </div>
          </div>

          {/* Digital Signature & Footer */}
          <div className="border-t border-[#E2E8F0] pt-4 flex items-center justify-between text-[11px] text-[#64748B]">
            <div>
              <div>Corporate Beneficiary: Temasek Straits Ltd</div>
              <div className="font-mono text-[10px]">ECDSA-P256 Cryptographic Clearing Signature: VERIFIED</div>
            </div>
            <div className="text-right">
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-[#0A2540] text-white rounded text-xs font-semibold hover:bg-[#1E293B] transition-colors"
              >
                Close Advice
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
