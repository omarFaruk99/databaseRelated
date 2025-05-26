import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";
import { useState } from "react";
import { FactoryData, Product } from "./Types/factoryTypes";

interface ProductionMetrics {
  product: Product;
  materialShortfall: number;
  productionCost: number;
  margin: number;
  maxPossibleProduction: number;
}

const FactoryTable = ({ factoryData }: { factoryData: FactoryData }) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  // Calculate metrics for each product
  const calculateMetrics = (): ProductionMetrics[] => {
    return factoryData.factory.products.map((product) => {
      // Calculate total material needed across all orders
      const totalMaterialNeeded = product.materials.reduce((acc, material) => {
        const totalOrders = factoryData.factory.orders.reduce(
          (sum, order) => sum + order.order_qty,
          0
        );
        return (
          acc +
          totalOrders * material.units_required * (1 + material.waste_factor)
        );
      }, 0);

      // Calculate material shortfall (needed - stock)
      const materialShortfall = product.materials.reduce((acc, material) => {
        const resource = factoryData.factory.resources[material.material_id];
        const needed = factoryData.factory.orders.reduce(
          (sum, order) =>
            sum +
            order.order_qty *
              material.units_required *
              (1 + material.waste_factor),
          0
        );
        return acc + Math.max(0, needed - resource.stock);
      }, 0);

      // Calculate production cost (material + labor)
      const materialCost = product.materials.reduce((acc, material) => {
        const resource = factoryData.factory.resources[material.material_id];
        const neededPerUnit =
          material.units_required * (1 + material.waste_factor);
        return acc + neededPerUnit * resource.unit_cost;
      }, 0);

      const laborCost = product.labor.hours * product.labor.cost_per_hour;
      const productionCost = materialCost + laborCost;

      // Calculate margin (25% markup)
      const margin = productionCost * 0.25;

      // Calculate max possible production based on bottleneck material
      const maxPossibleProduction = Math.min(
        ...product.materials.map((material) => {
          const resource = factoryData.factory.resources[material.material_id];
          return Math.floor(
            resource.stock /
              (material.units_required * (1 + material.waste_factor))
          );
        })
      );

      return {
        product,
        materialShortfall,
        productionCost,
        margin,
        maxPossibleProduction,
      };
    });
  };

  const metrics = calculateMetrics();

  // Add this helper function to calculate days until due date
  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Row expansion template for material breakdown
  const rowExpansionTemplate = (rowData: ProductionMetrics) => {
    return (
      <div className="p-3">
        <h4>Material Breakdown</h4>
        <table className="w-full">
          <thead>
            <tr>
              <th>Material ID</th>
              <th>Units Required</th>
              <th>Waste Factor</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Reorder Alert</th>
            </tr>
          </thead>
          <tbody>
            {rowData.product.materials.map((material) => {
              const resource =
                factoryData.factory.resources[material.material_id];
              const needed = factoryData.factory.orders.reduce(
                (sum, order) =>
                  sum +
                  order.order_qty *
                    material.units_required *
                    (1 + material.waste_factor),
                0
              );
              const status =
                resource.stock > needed * 1.1
                  ? "success"
                  : resource.stock >= needed * 0.9
                  ? "warning"
                  : "danger";

              // Reorder alert (if lead_time > days_until_due_date)
              const needsReorder = factoryData.factory.orders.some((order) => {
                const daysUntilDue = getDaysUntilDue(order.due_date);
                return resource.lead_time > daysUntilDue;
              });

              return (
                <tr key={material.material_id}>
                  <td>{material.material_id}</td>
                  <td>{material.units_required}</td>
                  <td>{material.waste_factor * 100}%</td>
                  <td>{resource.stock}</td>
                  <td>
                    <Tag value={status.toUpperCase()} severity={status} />
                  </td>
                  <td>
                    {needsReorder ? (
                      <Tag
                        value="REORDER NOW"
                        severity="danger"
                        icon="pi pi-exclamation-triangle"
                      />
                    ) : (
                      <Tag value="OK" severity="success" />
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="card p-4">
      <DataTable
        value={metrics}
        expandedRows={expandedRows}
        onRowToggle={(e) => setExpandedRows(e.data as Record<string, boolean>)}
        rowExpansionTemplate={rowExpansionTemplate}
        dataKey="product.product_id"
      >
        <Column expander style={{ width: "3rem" }} />
        <Column field="product.product_id" header="Product ID" />
        <Column
          header="Material Shortfall"
          body={(rowData) => (
            <Tag
              value={rowData.materialShortfall.toFixed(2)}
              severity={rowData.materialShortfall > 0 ? "danger" : "success"}
            />
          )}
        />
        <Column
          header="Production Cost"
          body={(rowData) => `$${rowData.productionCost.toFixed(2)}`}
        />
        <Column
          header="Margin (25%)"
          body={(rowData) => `$${rowData.margin.toFixed(2)}`}
        />
        <Column
          header="Max Possible Production"
          body={(rowData) => rowData.maxPossibleProduction}
        />
      </DataTable>
    </div>
  );
};

export default FactoryTable;
