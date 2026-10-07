/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { TreasuryOverview } from './components/TreasuryOverview';
import { FxConverterDesk } from './components/FxConverterDesk';
import { MultiCurrencyVault } from './components/MultiCurrencyVault';
import { LiveRatesBoard } from './components/LiveRatesBoard';
import { DomesticBankingRails } from './components/DomesticBankingRails';
import { SettlementLedger } from './components/SettlementLedger';

import { ExecutionModal } from './components/modals/ExecutionModal';
import { DepositModal } from './components/modals/DepositModal';
import { ReceiptModal } from './components/modals/ReceiptModal';
import { LimitOrderModal } from './components/modals/LimitOrderModal';
import { ProfileModal } from './components/modals/ProfileModal';

import {
  AccountBalance,
  CurrencyCode,
  DomesticBank,
  FxRate,
  LimitOrder,
  OrderType,
  TransactionRecord,
} from './types/treasury';
import {
  CONNECTED_BANKS,
  INITIAL_BALANCES,
  INITIAL_LIMIT_ORDERS,
  INITIAL_RATES,
  INITIAL_TRANSACTIONS,
  SUPPORTED_CURRENCIES,
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState<'converter' | 'rates' | 'accounts' | 'banks' | 'ledger'>('converter');
  const [rates, setRates] = useState<FxRate[]>(INITIAL_RATES);
  const [balances, setBalances] = useState<AccountBalance[]>(INITIAL_BALANCES);
  const [banks, setBanks] = useState<DomesticBank[]>(CONNECTED_BANKS);
  const [transactions, setTransactions] = useState<TransactionRecord[]>(INITIAL_TRANSACTIONS);
  const [limitOrders, setLimitOrders] = useState<LimitOrder[]>(INITIAL_LIMIT_ORDERS);

  // Ticking highlights
  const [lastTickPair, setLastTickPair] = useState<string | undefined>(undefined);
  const [lastTickDirection, setLastTickDirection] = useState<'up' | 'down' | undefined>(undefined);

  // Modals state
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [depositCurrency, setDepositCurrency] = useState<CurrencyCode>('SGD');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [pendingExecutionOrder, setPendingExecutionOrder] = useState<{
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
  } | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<TransactionRecord | null>(null);
  const [limitModalData, setLimitModalData] = useState<{ pair: string; currentRate: number } | null>(null);

  // Realistic live interbank mid-market tick stream
  useEffect(() => {
    const tickInterval = setInterval(() => {
      setRates((prevRates) => {
        const randomIndex = Math.floor(Math.random() * prevRates.length);
        const targetRate = prevRates[randomIndex];
        const isUp = Math.random() > 0.48;
        const delta = (isUp ? 1 : -1) * (targetRate.rate * 0.00015);
        const newRate = Number((targetRate.rate + delta).toFixed(4));
        const newBid = Number((targetRate.bid + delta).toFixed(4));
        const newAsk = Number((targetRate.ask + delta).toFixed(4));

        setLastTickPair(targetRate.pair);
        setLastTickDirection(isUp ? 'up' : 'down');

        const updated = [...prevRates];
        updated[randomIndex] = {
          ...targetRate,
          rate: newRate,
          bid: newBid,
          ask: newAsk,
          dayHigh: Math.max(targetRate.dayHigh, newRate),
          dayLow: Math.min(targetRate.dayLow, newRate),
          lastUpdated: new Date().toLocaleTimeString('en-SG', { timeZone: 'Asia/Singapore' }) + ' SGT',
        };
        return updated;
      });
    }, 4500);

    return () => clearInterval(tickInterval);
  }, []);

  // Handle order execution
  const handleExecuteOrderRequest = (orderData: {
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
  }) => {
    setPendingExecutionOrder(orderData);
  };

  const handleExecutionSuccess = () => {
    if (!pendingExecutionOrder) return;

    const refNo = `${pendingExecutionOrder.clearingRail}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}-SG`;
    const newTx: TransactionRecord = {
      id: `tx-${Date.now()}`,
      referenceNo: refNo,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' SGT',
      type: pendingExecutionOrder.type,
      sellCurrency: pendingExecutionOrder.sellCurrency,
      sellAmount: pendingExecutionOrder.sellAmount,
      buyCurrency: pendingExecutionOrder.buyCurrency,
      buyAmount: pendingExecutionOrder.buyAmount,
      rate: pendingExecutionOrder.rate,
      clearingRail: pendingExecutionOrder.clearingRail,
      fundingBank: pendingExecutionOrder.fundingBank,
      status: 'Settled',
      beneficiaryAccount: 'Segregated Treasury Omnibus',
      feeSGD: pendingExecutionOrder.feeSGD,
      savingsSGD: pendingExecutionOrder.savingsSGD,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Update balances: deduct sold, add bought
    setBalances((prev) => {
      return prev.map((bal) => {
        if (bal.currency === pendingExecutionOrder.sellCurrency) {
          const newAmt = Math.max(0, bal.amount - pendingExecutionOrder.sellAmount);
          return {
            ...bal,
            amount: newAmt,
            sgdEquivalent:
              bal.currency === 'SGD'
                ? newAmt
                : newAmt * (rates.find((r) => r.quote === bal.currency)?.rate || 1.33),
          };
        }
        if (bal.currency === pendingExecutionOrder.buyCurrency) {
          const newAmt = bal.amount + pendingExecutionOrder.buyAmount;
          return {
            ...bal,
            amount: newAmt,
            sgdEquivalent:
              bal.currency === 'SGD'
                ? newAmt
                : newAmt * (rates.find((r) => r.quote === bal.currency)?.rate || 1.33),
          };
        }
        return bal;
      });
    });

    setPendingExecutionOrder(null);
  };

  // Handle inbound deposit
  const handleDepositSuccess = (
    amount: number,
    rail: 'FAST' | 'PayNow' | 'MEPS',
    bank: string
  ) => {
    const refCode = `${rail}-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}-SG`;
    const newTx: TransactionRecord = {
      id: `tx-dep-${Date.now()}`,
      referenceNo: refCode,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' SGT',
      type: 'SPOT',
      sellCurrency: 'SGD',
      sellAmount: amount,
      buyCurrency: 'SGD',
      buyAmount: amount,
      rate: 1.0,
      clearingRail: rail,
      fundingBank: bank,
      status: 'Settled',
      beneficiaryAccount: 'SG65-FAST-8812-9014',
      feeSGD: 0.0,
      savingsSGD: 0.0,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Credit SGD balance
    setBalances((prev) =>
      prev.map((b) =>
        b.currency === 'SGD'
          ? {
              ...b,
              amount: b.amount + amount,
              sgdEquivalent: b.amount + amount,
            }
          : b
      )
    );
  };

  const handleCreateLimitOrder = (orderData: Partial<LimitOrder>) => {
    const newOrder: LimitOrder = {
      id: `lmt-${Date.now()}`,
      pair: orderData.pair || 'SGD/USD',
      direction: orderData.direction || 'BUY',
      targetRate: orderData.targetRate || 0.75,
      currentRate: orderData.currentRate || 0.7484,
      amount: orderData.amount || 100000,
      currency: 'SGD',
      expiresAt: orderData.expiresAt || '14 days from now',
      clearingRail: 'FAST',
      status: 'ACTIVE',
    };
    setLimitOrders((prev) => [newOrder, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#F7FAFC] flex flex-col text-[#0F172A]">
      {/* Top Bar matching Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenDeposit={() => {
          setDepositCurrency('SGD');
          setIsDepositOpen(true);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Treasury Overview Header (Always visible or on Treasury/FX) */}
        <TreasuryOverview
          balances={balances}
          connectedBanks={banks}
          onOpenDeposit={() => {
            setDepositCurrency('SGD');
            setIsDepositOpen(true);
          }}
          onOpenPayNowQr={() => {
            setDepositCurrency('SGD');
            setIsDepositOpen(true);
          }}
          onSelectConverter={() => setActiveTab('converter')}
        />

        {/* View Routing */}
        {activeTab === 'converter' && (
          <div className="space-y-6">
            <FxConverterDesk
              rates={rates}
              onExecuteOrder={handleExecuteOrderRequest}
              onOpenLimitModal={(pair, currentRate) => {
                setLimitModalData({ pair, currentRate });
              }}
            />

            {/* Quick Liquidity Vault view underneath converter */}
            <MultiCurrencyVault
              balances={balances}
              onSelectConvert={() => setActiveTab('converter')}
              onOpenDeposit={(curr) => {
                setDepositCurrency(curr);
                setIsDepositOpen(true);
              }}
              onOpenPayNowQr={() => {
                setDepositCurrency('SGD');
                setIsDepositOpen(true);
              }}
            />
          </div>
        )}

        {activeTab === 'rates' && (
          <div className="space-y-6">
            <LiveRatesBoard
              rates={rates}
              onSelectPair={(pair) => {
                setActiveTab('converter');
              }}
              lastTickPair={lastTickPair}
              lastTickDirection={lastTickDirection}
            />

            {/* Active Limit Orders List */}
            <div className="bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-sm font-bold text-[#0A2540]">
                  Active Treasury Rate Target Tranches
                </h3>
                <span className="text-xs font-mono text-[#0052FF]">
                  {limitOrders.length} Monitoring Orders
                </span>
              </div>

              <div className="divide-y divide-[#E2E8F0]">
                {limitOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-sm text-[#0A2540]">{ord.pair}</span>
                      <span className="font-mono text-[#64748B]">
                        Target: <strong className="text-[#0052FF]">{ord.targetRate.toFixed(4)}</strong> (Current: {ord.currentRate.toFixed(4)})
                      </span>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="font-mono font-bold text-[#0A2540]">
                        S$ {ord.amount.toLocaleString('en-SG')}
                      </span>
                      <span className="font-mono text-[11px] text-[#00875A] bg-[#E8F8F0] px-2 py-0.5 rounded">
                        {ord.clearingRail} Auto-Trigger
                      </span>
                      <span className="text-[#64748B] text-[11px]">{ord.expiresAt}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'accounts' && (
          <MultiCurrencyVault
            balances={balances}
            onSelectConvert={() => setActiveTab('converter')}
            onOpenDeposit={(curr) => {
              setDepositCurrency(curr);
              setIsDepositOpen(true);
            }}
            onOpenPayNowQr={() => {
              setDepositCurrency('SGD');
              setIsDepositOpen(true);
            }}
          />
        )}

        {activeTab === 'banks' && (
          <DomesticBankingRails
            banks={banks}
            onOpenDeposit={() => {
              setDepositCurrency('SGD');
              setIsDepositOpen(true);
            }}
          />
        )}

        {activeTab === 'ledger' && (
          <SettlementLedger
            transactions={transactions}
            onViewReceipt={(tx) => setSelectedReceipt(tx)}
          />
        )}
      </main>

      {/* Regulatory & Institutional Footer */}
      <footer className="border-t border-[#E2E8F0] bg-white py-6 mt-auto">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#64748B]">
          <div className="flex items-center gap-2">
            <span className="font-display font-bold text-[#0A2540]">Monetary Straits</span>
            <span>·</span>
            <span>Regulated Major Payment Institution (License PS20194821)</span>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span>Clearing: Banking Computer Services Pte Ltd (BCS)</span>
            <span>·</span>
            <span>FAST 24/7 Rail Direct</span>
            <span>·</span>
            <span>ISO 20022 Compliant</span>
          </div>
        </div>
      </footer>

      {/* Execution Modal */}
      <ExecutionModal
        isOpen={!!pendingExecutionOrder}
        onClose={() => setPendingExecutionOrder(null)}
        orderData={pendingExecutionOrder}
        onConfirmSuccess={handleExecutionSuccess}
      />

      {/* Inbound Deposit / Fund Modal */}
      <DepositModal
        isOpen={isDepositOpen}
        onClose={() => setIsDepositOpen(false)}
        currency={depositCurrency}
        onDepositSuccess={handleDepositSuccess}
      />

      {/* Settlement Advice Receipt Modal */}
      <ReceiptModal
        transaction={selectedReceipt}
        onClose={() => setSelectedReceipt(null)}
      />

      {/* Limit Order Target Modal */}
      {limitModalData && (
        <LimitOrderModal
          isOpen={!!limitModalData}
          onClose={() => setLimitModalData(null)}
          pair={limitModalData.pair}
          currentRate={limitModalData.currentRate}
          onCreateLimitOrder={handleCreateLimitOrder}
        />
      )}

      {/* Institutional Profile Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </div>
  );
}
