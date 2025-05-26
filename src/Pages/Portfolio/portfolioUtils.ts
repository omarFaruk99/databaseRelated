import { Holding, Portfolio, Transaction } from "./types/portfolio";

// Calculate average buy price for a holding
export const calculateAvgBuyPrice = (transactions: Transaction[]): number => {
  const buyTransactions = transactions.filter((txn) => txn.type === "BUY");
  if (buyTransactions.length === 0) return 0;

  const totalCost = buyTransactions.reduce(
    (sum, txn) => sum + txn.quantity * txn.price,
    0
  );
  const totalQuantity = buyTransactions.reduce(
    (sum, txn) => sum + txn.quantity,
    0
  );

  return totalCost / totalQuantity;
};

// Calculate remaining quantity of shares
export const calculateRemainingQuantity = (
  transactions: Transaction[]
): number => {
  return transactions.reduce((sum, txn) => {
    return txn.type === "BUY" ? sum + txn.quantity : sum - txn.quantity;
  }, 0);
};

// 1. Total Cost Basis = Σ(BUY quantity × price) + fees
export const calculateTotalCostBasis = (
  transactions: Transaction[]
): number => {
  return transactions
    .filter((txn) => txn.type === "BUY")
    .reduce((sum, txn) => sum + txn.quantity * txn.price + txn.fee, 0);
};

// 2. Realized P/L = Σ(SELL (price - avg_buy_price) × quantity) - fees
export const calculateRealizedPL = (transactions: Transaction[]): number => {
  const avgBuyPrice = calculateAvgBuyPrice(transactions);
  return transactions
    .filter((txn) => txn.type === "SELL")
    .reduce((sum, txn) => {
      const profit = (txn.price - avgBuyPrice) * txn.quantity;
      return sum + profit - txn.fee;
    }, 0);
};

// 3. Unrealized P/L = (current_price × remaining_qty) - (avg_buy_price × remaining_qty)
export const calculateUnrealizedPL = (holding: Holding): number => {
  const remainingQty = calculateRemainingQuantity(holding.transactions);
  const avgBuyPrice = calculateAvgBuyPrice(holding.transactions);
  return holding.current_price * remainingQty - avgBuyPrice * remainingQty;
};

// 4. Sharpe Ratio = (Return - risk_free_rate) / Volatility
export const calculateSharpeRatio = (
  returnValue: number,
  riskFreeRate: number,
  volatility: number
): number => {
  if (volatility === 0) return 0; // Prevent division by zero
  return (returnValue - riskFreeRate) / volatility;
};

// Calculate daily change percentage
export const calculateDailyChange = (holding: Holding): number => {
  // For demonstration, we'll use a simulated previous day price
  // In a real application, this would come from historical price data
  const previousDayPrice =
    holding.current_price * (1 - (Math.random() * 0.02 - 0.01)); // Simulated ±1% change
  return ((holding.current_price - previousDayPrice) / previousDayPrice) * 100;
};

// Calculate all metrics for a holding
export const calculateHoldingMetrics = (
  holding: Holding,
  benchmarks: Portfolio["benchmarks"]
) => {
  const remainingQty = calculateRemainingQuantity(holding.transactions);
  const avgBuyPrice = calculateAvgBuyPrice(holding.transactions);
  const currentValue = holding.current_price * remainingQty;
  const costBasis = calculateTotalCostBasis(holding.transactions);
  const realizedPL = calculateRealizedPL(holding.transactions);
  const unrealizedPL = calculateUnrealizedPL(holding);

  // Calculate total return including both realized and unrealized P/L
  const totalReturn = ((realizedPL + unrealizedPL) / costBasis) * 100;

  return {
    symbol: holding.symbol,
    currentValue,
    costBasis,
    remainingQty,
    avgBuyPrice,
    realizedPL,
    unrealizedPL,
    totalReturn,
    sharpeRatio: calculateSharpeRatio(
      totalReturn,
      benchmarks.risk_free_rate,
      benchmarks.volatility
    ),
    dailyChange: calculateDailyChange(holding),
  };
};
