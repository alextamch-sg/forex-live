export type CurrencyCode =
  | 'SGD'
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'JPY'
  | 'AUD'
  | 'CHF'
  | 'HKD'
  | 'CNH'
  | 'MYR'
  | 'NZD';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  decimals: number;
}

export interface FxRate {
  pair: string; // e.g. "SGD/USD"
  base: CurrencyCode;
  quote: CurrencyCode;
  rate: number; // Mid-market rate
  bid: number; // Institutional bid
  ask: number; // Institutional ask
  spreadPips: number;
  change24h: number; // percentage e.g. +0.28
  dayHigh: number;
  dayLow: number;
  lastUpdated: string;
}

export interface AccountBalance {
  currency: CurrencyCode;
  amount: number;
  sgdEquivalent: number;
  accountNumber: string;
  bankBranch: string;
  clearingRail: 'FAST' | 'MEPS' | 'SWIFT' | 'Fedwire' | 'SEPA';
  change24hPercent: number;
}

export type ClearingRailType = 'FAST' | 'PayNow' | 'MEPS';

export interface DomesticBank {
  id: string;
  name: string;
  shortName: 'DBS' | 'OCBC' | 'UOB';
  accountNo: string;
  accountType: string;
  status: 'Connected' | 'Standby' | 'Verifying';
  fastLimitDaily: number;
  fastLimitUsed: number;
  paynowProxy: string;
  color: string;
}

export type OrderType = 'SPOT' | 'LIMIT' | 'RECURRING';

export interface TransactionRecord {
  id: string;
  referenceNo: string; // e.g. "FAST-20261007-8841-SG"
  timestamp: string;
  type: OrderType;
  sellCurrency: CurrencyCode;
  sellAmount: number;
  buyCurrency: CurrencyCode;
  buyAmount: number;
  rate: number;
  clearingRail: ClearingRailType;
  fundingBank: string;
  status: 'Settled' | 'Executing' | 'Scheduled' | 'Pending Approval';
  beneficiaryAccount: string;
  feeSGD: number;
  savingsSGD: number;
}

export interface LimitOrder {
  id: string;
  pair: string;
  direction: 'BUY' | 'SELL';
  targetRate: number;
  currentRate: number;
  amount: number;
  currency: CurrencyCode;
  expiresAt: string;
  clearingRail: ClearingRailType;
  status: 'ACTIVE' | 'FILLED' | 'CANCELLED';
}
