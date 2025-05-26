import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useMemo, useState } from "react";
import { calculateHoldingMetrics } from "./portfolioUtils";
import { HoldingWithMetrics, Portfolio } from "./types/portfolio";

const PortfolioTable = ({ portfolioData }: { portfolioData: Portfolio }) => {
  // Log to debug data changes
  console.log("Portfolio data reference:", portfolioData);

  // State for expanded rows
  const [expandedRows, setExpandedRows] = useState<HoldingWithMetrics[]>([]);

  // Memoize data with stable dependencies
  const holdingsWithMetrics = useMemo(
    () =>
      portfolioData.holdings.map((holding) => ({
        ...holding,
        ...calculateHoldingMetrics(holding, portfolioData.benchmarks),
      })) as HoldingWithMetrics[],
    [portfolioData.holdings, portfolioData.benchmarks]
  );

  // Memoize color function with primitive dependency
  const getReturnColor = useMemo(
    () => (returnValue: number) => {
      const benchmark = portfolioData.benchmarks.sp500_return;
      if (returnValue > benchmark) return "success";
      if (returnValue < benchmark) return "danger";
      return "warning";
    },
    [portfolioData.benchmarks.sp500_return]
  );

  // Transaction template with correct typing
  const transactionTemplate = (holding: HoldingWithMetrics) => {
    let cumulativeShares = 0;
    return (
      <div className="p-3">
        <h4 className="font-medium mb-2">Transactions & Position Sizing</h4>
        <div className="text-sm mb-2">
          <div>Total Cost Basis: ${holding.costBasis.toFixed(2)}</div>
          <div>Realized P/L: ${holding.realizedPL.toFixed(2)}</div>
          <div>Unrealized P/L: ${holding.unrealizedPL.toFixed(2)}</div>
        </div>
        <div className="text-xs">
          {holding.transactions.map((txn, i) => {
            cumulativeShares +=
              txn.type === "BUY" ? txn.quantity : -txn.quantity;
            return (
              <div key={i} className="flex justify-between py-1">
                <span>
                  {txn.date}: {txn.type} {txn.quantity} @ ${txn.price}
                </span>
                <span>Position: {cumulativeShares} shares</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const totalPortfolioValue = holdingsWithMetrics.reduce(
    (sum, holding) => sum + holding.currentValue,
    0
  );

  const [showHighConviction, setShowHighConviction] = useState(false);

  const filteredHoldings = showHighConviction
    ? holdingsWithMetrics.filter(
        (holding) => holding.currentValue / totalPortfolioValue > 0.05
      )
    : holdingsWithMetrics;

  console.log("Holdings:", portfolioData.holdings);
  console.log("Metrics data:", holdingsWithMetrics);

  // Add state for global filtering:
  // const [globalFilter, setGlobalFilter] = useState<string>("");

  // Toggle row expansion
  const toggleRowExpansion = (rowData: HoldingWithMetrics) => {
    const isExpanded = expandedRows.some(
      (row) => row.symbol === rowData.symbol
    );
    if (isExpanded) {
      setExpandedRows(
        expandedRows.filter((row) => row.symbol !== rowData.symbol)
      );
    } else {
      setExpandedRows([...expandedRows, rowData]);
    }
  };

  return (
    <div className="card p-4">
      <div className="flex justify-content-between mb-4">
        <Button
          label={showHighConviction ? "Show All" : "Show High Conviction (>5%)"}
          onClick={() => setShowHighConviction(!showHighConviction)}
          className="p-button-outlined"
        />
        {/* <InputText
          placeholder="Global Search..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
        /> */}
      </div>
      <DataTable
        value={filteredHoldings}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as HoldingWithMetrics[])}
        rowExpansionTemplate={transactionTemplate}
        dataKey="symbol"
        // globalFilter={globalFilter}
        className="p-datatable-sm"
      >
        <Column
          expander
          style={{ width: "3rem" }}
          body={(rowData: HoldingWithMetrics) => (
            <Button
              icon={
                expandedRows.some((r) => r.symbol === rowData.symbol)
                  ? "pi pi-chevron-down"
                  : "pi pi-chevron-right"
              }
              className="p-button-text p-button-rounded"
              onClick={() => toggleRowExpansion(rowData)}
            />
          )}
        />
        <Column field="symbol" header="Symbol" sortable />
        <Column
          field="currentValue"
          header="Current Value"
          body={(row: HoldingWithMetrics) => `$${row.currentValue.toFixed(2)}`}
          sortable
        />
        <Column
          field="dailyChange"
          header="Daily Δ%"
          body={(row: HoldingWithMetrics) => (
            <Tag
              value={`${row.dailyChange.toFixed(2)}%`}
              severity={row.dailyChange >= 0 ? "success" : "danger"}
            />
          )}
          sortable
        />
        <Column
          field="sharpeRatio"
          header="Sharpe Ratio"
          body={(row: HoldingWithMetrics) => row.sharpeRatio.toFixed(3)}
          sortable
        />
        <Column
          field="totalReturn"
          header="Return vs S&P"
          body={(row: HoldingWithMetrics) => (
            <Tag
              value={`${row.totalReturn.toFixed(2)}%`}
              severity={getReturnColor(row.totalReturn)}
            />
          )}
          sortable
        />
      </DataTable>
    </div>
  );
};

export default PortfolioTable;
