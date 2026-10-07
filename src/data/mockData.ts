import { AccountBalance, CurrencyCode, CurrencyInfo, DomesticBank, FxRate, LimitOrder, TransactionRecord } from '../types/treasury';

export const SUPPORTED_CURRENCIES: Record<CurrencyCode, CurrencyInfo> = {
  SGD: { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬', decimals: 2 },
  USD: { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸', decimals: 2 },
  EUR: { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺', decimals: 2 },
  GBP: { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧', decimals: 2 },
  JPY: { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵', decimals: 0 },
  AUD: { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺', decimals: 2 },
  CHF: { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF', flag: '🇨🇭', decimals: 2 },
  HKD: { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$', flag: '🇭🇰', decimals: 2 },
  CNH: { code: 'CNH', name: 'Chinese Yuan (Offshore)', symbol: '¥', flag: '🇨🇳', decimals: 2 },
  MYR: { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', flag: '🇲🇾', decimals: 2 },
  NZD: { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿', decimals: 2 },
};

// Rates relative to 1 SGD base (and cross calculations)
export const INITIAL_RATES: FxRate[] = [
  {
    pair: 'SGD/USD',
    base: 'SGD',
    quote: 'USD',
    rate: 0.7484,
    bid: 0.7483,
    ask: 0.7485,
    spreadPips: 2.0,
    change24h: 0.28,
    dayHigh: 0.7512,
    dayLow: 0.7468,
    lastUpdated: '10:48:20 SGT',
  },
  {
    pair: 'USD/SGD',
    base: 'USD',
    quote: 'SGD',
    rate: 1.3362,
    bid: 1.3360,
    ask: 1.3364,
    spreadPips: 4.0,
    change24h: -0.28,
    dayHigh: 1.3391,
    dayLow: 1.3312,
    lastUpdated: '10:48:21 SGT',
  },
  {
    pair: 'EUR/SGD',
    base: 'EUR',
    quote: 'SGD',
    rate: 1.4520,
    bid: 1.4517,
    ask: 1.4523,
    spreadPips: 6.0,
    change24h: 0.14,
    dayHigh: 1.4550,
    dayLow: 1.4490,
    lastUpdated: '10:48:19 SGT',
  },
  {
    pair: 'GBP/SGD',
    base: 'GBP',
    quote: 'SGD',
    rate: 1.7142,
    bid: 1.7138,
    ask: 1.7146,
    spreadPips: 8.0,
    change24h: -0.42,
    dayHigh: 1.7210,
    dayLow: 1.7115,
    lastUpdated: '10:48:22 SGT',
  },
  {
    pair: 'SGD/JPY',
    base: 'SGD',
    quote: 'JPY',
    rate: 114.28,
    bid: 114.22,
    ask: 114.34,
    spreadPips: 12.0,
    change24h: 0.52,
    dayHigh: 114.60,
    dayLow: 113.80,
    lastUpdated: '10:48:18 SGT',
  },
  {
    pair: 'AUD/SGD',
    base: 'AUD',
    quote: 'SGD',
    rate: 0.8842,
    bid: 0.8839,
    ask: 0.8845,
    spreadPips: 6.0,
    change24h: 0.31,
    dayHigh: 0.8880,
    dayLow: 0.8810,
    lastUpdated: '10:48:24 SGT',
  },
  {
    pair: 'CHF/SGD',
    base: 'CHF',
    quote: 'SGD',
    rate: 1.5120,
    bid: 1.5115,
    ask: 1.5125,
    spreadPips: 10.0,
    change24h: -0.08,
    dayHigh: 1.5160,
    dayLow: 1.5090,
    lastUpdated: '10:48:17 SGT',
  },
  {
    pair: 'SGD/HKD',
    base: 'SGD',
    quote: 'HKD',
    rate: 5.8240,
    bid: 5.8225,
    ask: 5.8255,
    spreadPips: 30.0,
    change24h: 0.05,
    dayHigh: 5.8310,
    dayLow: 5.8190,
    lastUpdated: '10:48:25 SGT',
  },
  {
    pair: 'SGD/CNH',
    base: 'SGD',
    quote: 'CNH',
    rate: 5.4180,
    bid: 5.4160,
    ask: 5.4200,
    spreadPips: 40.0,
    change24h: -0.19,
    dayHigh: 5.4310,
    dayLow: 5.4090,
    lastUpdated: '10:48:23 SGT',
  },
  {
    pair: 'SGD/MYR',
    base: 'SGD',
    quote: 'MYR',
    rate: 3.4850,
    bid: 3.4835,
    ask: 3.4865,
    spreadPips: 30.0,
    change24h: 0.12,
    dayHigh: 3.4910,
    dayLow: 3.4790,
    lastUpdated: '10:48:21 SGT',
  },
];

export const INITIAL_BALANCES: AccountBalance[] = [
  {
    currency: 'SGD',
    amount: 842150.80,
    sgdEquivalent: 842150.80,
    accountNumber: 'SG65-FAST-8812-9014',
    bankBranch: 'MAS Clearing Rail / MEPS Primary',
    clearingRail: 'FAST',
    change24hPercent: 0.0,
  },
  {
    currency: 'USD',
    amount: 320400.00,
    sgdEquivalent: 428118.48, // 320,400 * 1.3362
    accountNumber: 'US89-NYFED-1048-2231',
    bankBranch: 'New York Fedwire Custody',
    clearingRail: 'Fedwire',
    change24hPercent: -0.28,
  },
  {
    currency: 'EUR',
    amount: 78500.00,
    sgdEquivalent: 113982.00, // 78,500 * 1.4520
    accountNumber: 'DE33-SEPA-9481-0021',
    bankBranch: 'Frankfurt Direct SEPA Rail',
    clearingRail: 'SEPA',
    change24hPercent: 0.14,
  },
  {
    currency: 'GBP',
    amount: 36200.00,
    sgdEquivalent: 62054.04, // 36,200 * 1.7142
    accountNumber: 'GB11-CHAPS-7734-1109',
    bankBranch: 'London Faster Payments RTGS',
    clearingRail: 'SWIFT',
    change24hPercent: -0.42,
  },
  {
    currency: 'JPY',
    amount: 4180000,
    sgdEquivalent: 36576.83, // 4,180,000 / 114.28
    accountNumber: 'JP80-BOJ-4491-0329',
    bankBranch: 'Tokyo Zengin Network Link',
    clearingRail: 'SWIFT',
    change24hPercent: 0.52,
  },
];

export const CONNECTED_BANKS: DomesticBank[] = [
  {
    id: 'bank-dbs',
    name: 'DBS Bank Ltd (Singapore)',
    shortName: 'DBS',
    accountNo: '003-902481-8',
    accountType: 'Corporate Treasury Multi-Currency',
    status: 'Connected',
    fastLimitDaily: 2000000,
    fastLimitUsed: 145000,
    paynowProxy: 'UEN: 201948210D',
    color: '#DE350B', // DBS Red
  },
  {
    id: 'bank-ocbc',
    name: 'Oversea-Chinese Banking Corp',
    shortName: 'OCBC',
    accountNo: '581-229410-001',
    accountType: 'Velocity Business Core',
    status: 'Connected',
    fastLimitDaily: 1500000,
    fastLimitUsed: 42000,
    paynowProxy: 'UEN: 201948210D-OCBC',
    color: '#E02020', // OCBC Red
  },
  {
    id: 'bank-uob',
    name: 'United Overseas Bank Ltd',
    shortName: 'UOB',
    accountNo: '301-102948-2',
    accountType: 'Infinity Institutional Clearing',
    status: 'Standby',
    fastLimitDaily: 5000000,
    fastLimitUsed: 0,
    paynowProxy: 'UEN: 201948210D-UOB',
    color: '#0038B6', // UOB Blue
  },
];

export const INITIAL_TRANSACTIONS: TransactionRecord[] = [
  {
    id: 'tx-101',
    referenceNo: 'FAST-20261007-9941-SG',
    timestamp: '2026-10-07 00:32:15 SGT',
    type: 'SPOT',
    sellCurrency: 'SGD',
    sellAmount: 85000,
    buyCurrency: 'USD',
    buyAmount: 63614.00,
    rate: 0.7484,
    clearingRail: 'FAST',
    fundingBank: 'DBS Bank Ltd',
    status: 'Settled',
    beneficiaryAccount: 'US89-NYFED-1048-2231',
    feeSGD: 68.00,
    savingsSGD: 1445.00,
  },
  {
    id: 'tx-102',
    referenceNo: 'FAST-20261006-8812-SG',
    timestamp: '2026-10-06 17:14:02 SGT',
    type: 'SPOT',
    sellCurrency: 'USD',
    sellAmount: 40000,
    buyCurrency: 'SGD',
    buyAmount: 53448.00,
    rate: 1.3362,
    clearingRail: 'FAST',
    fundingBank: 'OCBC Velocity',
    status: 'Settled',
    beneficiaryAccount: 'SG65-FAST-8812-9014',
    feeSGD: 42.75,
    savingsSGD: 980.20,
  },
  {
    id: 'tx-103',
    referenceNo: 'MEPS-20261006-4401-SG',
    timestamp: '2026-10-06 14:05:49 SGT',
    type: 'SPOT',
    sellCurrency: 'EUR',
    sellAmount: 25000,
    buyCurrency: 'SGD',
    buyAmount: 36300.00,
    rate: 1.4520,
    clearingRail: 'MEPS',
    fundingBank: 'DBS Bank Ltd',
    status: 'Settled',
    beneficiaryAccount: 'SG65-FAST-8812-9014',
    feeSGD: 36.30,
    savingsSGD: 726.00,
  },
  {
    id: 'tx-104',
    referenceNo: 'PNOW-20261005-2290-SG',
    timestamp: '2026-10-05 11:20:10 SGT',
    type: 'SPOT',
    sellCurrency: 'SGD',
    sellAmount: 18400,
    buyCurrency: 'GBP',
    buyAmount: 10733.87,
    rate: 0.5834,
    clearingRail: 'PayNow',
    fundingBank: 'OCBC Velocity',
    status: 'Settled',
    beneficiaryAccount: 'GB11-CHAPS-7734-1109',
    feeSGD: 14.72,
    savingsSGD: 368.00,
  },
  {
    id: 'tx-105',
    referenceNo: 'FAST-20261004-1188-SG',
    timestamp: '2026-10-04 09:45:33 SGT',
    type: 'SPOT',
    sellCurrency: 'SGD',
    sellAmount: 120000,
    buyCurrency: 'USD',
    buyAmount: 89808.00,
    rate: 0.7484,
    clearingRail: 'FAST',
    fundingBank: 'UOB Infinity',
    status: 'Settled',
    beneficiaryAccount: 'US89-NYFED-1048-2231',
    feeSGD: 96.00,
    savingsSGD: 2040.00,
  },
];

export const INITIAL_LIMIT_ORDERS: LimitOrder[] = [
  {
    id: 'lmt-01',
    pair: 'SGD/USD',
    direction: 'BUY',
    targetRate: 0.7550,
    currentRate: 0.7484,
    amount: 150000,
    currency: 'SGD',
    expiresAt: '2026-10-14 23:59 SGT',
    clearingRail: 'FAST',
    status: 'ACTIVE',
  },
  {
    id: 'lmt-02',
    pair: 'USD/SGD',
    direction: 'BUY',
    targetRate: 1.3450,
    currentRate: 1.3362,
    amount: 50000,
    currency: 'USD',
    expiresAt: '2026-10-21 23:59 SGT',
    clearingRail: 'FAST',
    status: 'ACTIVE',
  },
];

// Generate deterministic historical rates for interactive SVG charting
export function getChartPoints(pair: string, timeframe: '1D' | '1W' | '1M' | '1Y' | '5Y'): { time: string; value: number }[] {
  let baseVal = 0.7484;
  if (pair === 'USD/SGD') baseVal = 1.3362;
  else if (pair === 'EUR/SGD') baseVal = 1.4520;
  else if (pair === 'GBP/SGD') baseVal = 1.7142;
  else if (pair === 'SGD/JPY') baseVal = 114.28;
  else if (pair === 'AUD/SGD') baseVal = 0.8842;
  else if (pair === 'CHF/SGD') baseVal = 1.5120;

  const count = timeframe === '1D' ? 24 : timeframe === '1W' ? 28 : timeframe === '1M' ? 30 : timeframe === '1Y' ? 36 : 40;
  const variance = baseVal * 0.015;

  const points: { time: string; value: number }[] = [];
  let current = baseVal * (1 - 0.005);

  for (let i = 0; i < count; i++) {
    const sinFactor = Math.sin((i / count) * Math.PI * 3);
    const noise = (Math.sin(i * 1.7) * 0.4 + Math.cos(i * 2.3) * 0.3) * variance * 0.4;
    current = baseVal + sinFactor * variance * 0.5 + noise;

    let timeLabel = '';
    if (timeframe === '1D') {
      const hour = (i + 1).toString().padStart(2, '0');
      timeLabel = `${hour}:00`;
    } else if (timeframe === '1W') {
      const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      timeLabel = `${days[i % 7]} ${Math.floor(i / 7) + 1}`;
    } else if (timeframe === '1M') {
      timeLabel = `Oct ${i + 1}`;
    } else if (timeframe === '1Y') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      timeLabel = months[i % 12];
    } else {
      timeLabel = `202${Math.floor(i / 8) + 2}`;
    }

    // Force the last point to be the current actual rate
    if (i === count - 1) {
      current = baseVal;
    }

    points.push({
      time: timeLabel,
      value: Number(current.toFixed(4)),
    });
  }

  return points;
}
