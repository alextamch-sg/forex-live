import React, { useState } from 'react';
import { Download, Search, FileText, CheckCircle2, Clock, Filter } from 'lucide-react';
import { ClearingRailType, TransactionRecord } from '../types/treasury';
import { SUPPORTED_CURRENCIES } from '../data/mockData';

interface SettlementLedgerProps {
  transactions: TransactionRecord[];
  onViewReceipt: (tx: TransactionRecord) => void;
}

export const SettlementLedger: React.FC<SettlementLedgerProps> = ({
  transactions,
  onViewReceipt,
}) => {
  const [railFilter, setRailFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');

  const filtered = transactions.filter((tx) => {
    const matchesRail = railFilter === 'ALL' || tx.clearingRail === railFilter;
    const matchesSearch =
      tx.referenceNo.toLowerCase().includes(search.toLowerCase()) ||
      tx.sellCurrency.toLowerCase().includes(search.toLowerCase()) ||
      tx.buyCurrency.toLowerCase().includes(search.toLowerCase()) ||
      tx.fundingBank.toLowerCase().includes(search.toLowerCase());
    return matchesRail && matchesSearch;
  });

  const exportCSV = () => {
    const headers = [
      'Reference No',
      'Timestamp',
      'Type',
      'Sell Currency',
      'Sell Amount',
      'Buy Currency',
      'Buy Amount',
      'Rate',
      'Clearing Rail',
      'Funding Bank',
      'Status',
      'Fee SGD',
      'Savings SGD',
    ];

    const rows = filtered.map((tx) => [
      tx.referenceNo,
      tx.timestamp,
      tx.type,
      tx.sellCurrency,
      tx.sellAmount,
      tx.buyCurrency,
      tx.buyAmount,
      tx.rate,
      tx.clearingRail,
      `"${tx.fundingBank}"`,
      tx.status,
      tx.feeSGD,
      tx.savingsSGD,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Monetary_Straits_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl shadow-xs overflow-hidden mb-8">
      {/* Header, Filters & CSV Export */}
      <div className="p-5 sm:p-6 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-lg font-bold text-[#0A2540]">
            Clearing Ledger & Audit Trail
          </h2>
          <p className="text-xs text-[#64748B] mt-0.5">
            Cryptographically signed transaction logs compliant with MAS PSN01 record-retention requirements.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Rail Filter Buttons */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-md text-xs font-mono">
            {['ALL', 'FAST', 'PayNow', 'MEPS'].map((r) => (
              <button
                key={r}
                onClick={() => setRailFilter(r)}
                className={`px-2.5 py-1 rounded transition-colors ${
                  railFilter === r
                    ? 'bg-white text-[#0052FF] font-bold shadow-xs'
                    : 'text-[#49607E] hover:text-[#0A2540]'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative w-48 sm:w-56">
            <Search className="w-3.5 h-3.5 text-[#64748B] absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Filter Ref / Currency..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#F8FAFC] border border-[#CBD5E1] rounded-md text-xs text-[#0A2540] focus:outline-none focus:border-[#0052FF]"
            />
          </div>

          {/* Export CSV */}
          <button
            onClick={exportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-[#CBD5E1] hover:border-[#0052FF] hover:text-[#0052FF] text-[#0A2540] text-xs font-semibold rounded-md transition-colors shadow-2xs whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] uppercase font-bold text-[#64748B] tracking-wider">
              <th className="py-3 px-4 sm:px-6">Reference ID</th>
              <th className="py-3 px-4">Date & Time</th>
              <th className="py-3 px-4">Direction / Pair</th>
              <th className="py-3 px-4 text-right">Debit (Sold)</th>
              <th className="py-3 px-4 text-right">Credit (Bought)</th>
              <th className="py-3 px-4 text-right">Effective Rate</th>
              <th className="py-3 px-4 text-center">Rail</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 sm:px-6 text-right">Settlement Advice</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0] text-xs">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-xs text-[#64748B]">
                  No clearing transactions match the specified filter.
                </td>
              </tr>
            ) : (
              filtered.map((tx) => (
                <tr key={tx.id} className="h-[52px] hover:bg-[#F8FAFC] transition-colors">
                  {/* Reference ID */}
                  <td className="py-3 px-4 sm:px-6 font-mono font-bold text-[#0052FF]">
                    {tx.referenceNo}
                  </td>

                  {/* Timestamp */}
                  <td className="py-3 px-4 text-[#64748B] font-mono text-[11px] whitespace-nowrap">
                    {tx.timestamp}
                  </td>

                  {/* Pair */}
                  <td className="py-3 px-4 font-mono font-bold text-[#0A2540]">
                    {tx.sellCurrency} → {tx.buyCurrency}
                  </td>

                  {/* Debit */}
                  <td className="py-3 px-4 text-right font-mono text-[#0A2540]">
                    {SUPPORTED_CURRENCIES[tx.sellCurrency]?.symbol}{' '}
                    {tx.sellAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Credit */}
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#00875A]">
                    {SUPPORTED_CURRENCIES[tx.buyCurrency]?.symbol}{' '}
                    {tx.buyAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </td>

                  {/* Rate */}
                  <td className="py-3 px-4 text-right font-mono text-[#49607E]">
                    {tx.rate.toFixed(4)}
                  </td>

                  {/* Rail */}
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono text-[11px] px-2 py-0.5 rounded font-semibold bg-[#F1F5F9] text-[#0A2540]">
                      {tx.clearingRail}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded font-medium ${
                        tx.status === 'Settled'
                          ? 'bg-[#E8F8F0] text-[#00875A]'
                          : 'bg-[#FFF7ED] text-[#FF8B00]'
                      }`}
                    >
                      {tx.status === 'Settled' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      <span>{tx.status}</span>
                    </span>
                  </td>

                  {/* View Advice */}
                  <td className="py-3 px-4 sm:px-6 text-right">
                    <button
                      onClick={() => onViewReceipt(tx)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#0052FF] hover:text-[#0043D6] hover:bg-[#F0F5FF] rounded transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Advice</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
