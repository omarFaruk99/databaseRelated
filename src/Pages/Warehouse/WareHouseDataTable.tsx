import { Button } from "primereact/button";
import { Column } from "primereact/column";
import {
  DataTable,
  DataTableExpandedRows,
  DataTableValueArray,
} from "primereact/datatable";
import { Toast } from "primereact/toast";
import { useEffect, useRef, useState } from "react";
import { Order } from "./type";

interface Response {
  warehouse: {
    orders: Order[];
    inventory: {
      [key: string]: number;
    };
  };
}

export default function WarehouseDataTable() {
  const [data, setData] = useState<Response | null>(null);
  const [expandedRows, setExpandedRows] = useState<
    DataTableExpandedRows | DataTableValueArray | undefined
  >(undefined);
  const toast = useRef<Toast>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("/demo/data/dataProblemFive.json");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        setError(
          error instanceof Error ? error.message : "Failed to fetch data"
        );
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const itemCountTemplate = (rowData: Order) => {
    return rowData.items.reduce((total, item) => total + item.quantity, 0);
  };

  const totalValueTemplate = (rowData: Order) => {
    const total = rowData.items.reduce(
      (sum, item) => sum + item.quantity * item.unit_price,
      0
    );
    return `$${total.toFixed(2)}`;
  };

  const calculateOrderTotals = (order: Order) => {
    let subtotal = order.items.reduce((sum, item) => {
      const discountValue =
        item.discount?.type === "percentage"
          ? item.unit_price * (item.discount.value / 100)
          : item.discount?.value || 0;
      let itemTotal = (item.unit_price - discountValue) * item.quantity;

      // Apply bulk discount if subtotal > $500
      if (itemTotal > 500) {
        itemTotal *= 0.95; // 5% discount
        order.bulk_discount_applied = true;
      }

      return sum + itemTotal;
    }, 0);

    const tax =
      (subtotal + order.shipping.cost) * (order.shipping.tax_rate / 100);
    const grandTotal =
      subtotal +
      order.shipping.cost +
      tax -
      (order.shipping.discount_value || 0);

    // Calculate profit margin (30% COGS)
    const cogs = subtotal * 0.3;
    const profitMargin = ((grandTotal - cogs) / grandTotal) * 100;

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      tax: parseFloat(tax.toFixed(2)),
      grandTotal: parseFloat(grandTotal.toFixed(2)),
      profitMargin: parseFloat(profitMargin.toFixed(2)),
    };
  };

  const rowClassName = (rowData: Order) => {
    const hasLowInventory = rowData.items.some((item) => {
      const inventory = data?.warehouse?.inventory?.[item.sku] || 0;
      return inventory < item.quantity;
    });
    return hasLowInventory ? "bg-red-100" : "";
  };

  const profitMarginTemplate = (rowData: Order) => {
    const { subtotal, grandTotal } = calculateOrderTotals(rowData);
    const cogs = subtotal * 0.3; // 30% cost of goods sold
    const profitMargin = ((grandTotal - cogs) / grandTotal) * 100;
    return `${profitMargin.toFixed(2)}%`;
  };

  const bulkDiscountTemplate = (rowData: Order) => {
    const { subtotal } = calculateOrderTotals(rowData);
    return subtotal > 500 ? "5% Applied" : "-";
  };

  const rowExpansionTemplate = (order: Order) => {
    const { subtotal, tax, grandTotal } = calculateOrderTotals(order);
    return (
      <div className="p-3">
        <div className="grid">
          <div className="col-12 md:col-6">
            <h4>Order Summary</h4>
            <div className="grid">
              <div className="col-4 font-medium">Subtotal:</div>
              <div className="col-8">${subtotal.toFixed(2)}</div>
              <div className="col-4 font-medium">Shipping:</div>
              <div className="col-8">
                <span
                  className={order.shipping.promo_code ? "line-through" : ""}
                >
                  ${order.shipping.cost.toFixed(2)}
                </span>
                {order.shipping.promo_code && (
                  <span className="text-green-500 ml-2">
                    (Promo: {order.shipping.promo_code})
                  </span>
                )}
              </div>
              <div className="col-4 font-medium">Tax:</div>
              <div className="col-8">${tax.toFixed(2)}</div>
              <div className="col-4 font-medium">Total:</div>
              <div className="col-8">${grandTotal.toFixed(2)}</div>
            </div>
          </div>
          <div className="col-12 md:col-6">
            <h4>Items</h4>
            <DataTable value={order.items} size="small">
              <Column field="name" header="Name" />
              <Column field="quantity" header="Qty" />
              <Column
                field="unit_price"
                header="Price"
                body={(item) => `$${item.unit_price.toFixed(2)}`}
              />
              <Column
                header="Discount"
                body={(item) =>
                  item.discount?.type === "percentage"
                    ? `${item.discount.value}%`
                    : `$${item.discount?.value || 0}`
                }
              />
            </DataTable>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div
        className="card flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <i className="pi pi-spinner pi-spin" style={{ fontSize: "2rem" }}></i>
        <p className="mt-3">Loading warehouse data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="card flex flex-column justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <i
          className="pi pi-exclamation-triangle text-red-500"
          style={{ fontSize: "2rem" }}
        ></i>
        <p className="mt-3 text-red-500">{error}</p>
        <Button
          label="Retry"
          icon="pi pi-refresh"
          className="p-button-outlined mt-3"
          onClick={() => window.location.reload()}
        />
      </div>
    );
  }

  return (
    <div className="card p-4">
      <Toast ref={toast} />
      <DataTable
        value={data?.warehouse?.orders}
        dataKey="order_id"
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data)}
        rowExpansionTemplate={rowExpansionTemplate}
        rowClassName={rowClassName}
        paginator
        rows={10}
        rowsPerPageOptions={[5, 10, 25]}
        emptyMessage="No orders found"
      >
        <Column expander style={{ width: "3rem" }} />
        <Column field="order_id" header="Order ID" sortable />
        <Column header="Items" body={itemCountTemplate} />
        <Column header="Total Value" body={totalValueTemplate} />
        <Column header="Profit Margin" body={profitMarginTemplate} />
        <Column header="Bulk Discount" body={bulkDiscountTemplate} />
      </DataTable>
    </div>
  );
}
