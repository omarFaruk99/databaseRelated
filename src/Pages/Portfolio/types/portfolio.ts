export interface Transaction {
  date: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  fee: number;
}

export interface Holding {
  asset_id: string;
  symbol: string;
  sector?: string;
  transactions: Transaction[];
  current_price: number;
}

export interface HoldingWithMetrics extends Holding {
  costBasis: number;
  realizedPL: number;
  unrealizedPL: number;
  currentValue: number;
  remainingQty: number;
  avgBuyPrice: number;
  totalReturn: number;
  sharpeRatio: number;
  dailyChange: number;
}

export interface Portfolio {
  investor_id: string;
  holdings: Holding[];
  benchmarks: {
    sp500_return: number;
    risk_free_rate: number;
    volatility: number;
  };
}
