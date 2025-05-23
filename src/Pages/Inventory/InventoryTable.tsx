import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Rating } from "primereact/rating";
import { Tag } from "primereact/tag";
import { useEffect, useState } from "react";
import VariantTable from "./components/VariantTable";

// Define TypeScript interfaces
interface Discount {
  type: "percentage" | "fixed";
  value: number;
}

interface Variant {
  color: string;
  price: number;
  stock: number;
  discount: Discount | null;
}

interface Supplier {
  id: string;
  name: string;
  rating: number;
}

interface Reviews {
  average: number;
  count: number;
}

interface Product {
  sku: string;
  name: string;
  category: string;
  supplier: Supplier;
  variants: Variant[];
  reviews: Reviews;
  status: string;
}

const InventoryTable = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedRows, setExpandedRows] = useState<Product[]>([]);

  useEffect(() => {
    fetch("/demo/data/dataProblemOne.json")
      .then((response) => response.json())
      .then((data: { inventory: { products: Product[] } }) => {
        setProducts(data.inventory.products);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Toggle row expansion
  const onRowToggle = (e: { data: Product[] }) => {
    setExpandedRows(e.data);
  };

  // Stock status template
  const stockStatusTemplate = (rowData: Product) => {
    const isLowStock = rowData.variants.some((variant) => variant.stock < 30);
    return (
      <Tag
        severity={isLowStock ? "danger" : "success"}
        value={isLowStock ? "Low Stock" : "In Stock"}
      />
    );
  };

  // Supplier template (name + rating)
  const supplierTemplate = (rowData: Product) => {
    return (
      <div>
        <span className="font-semibold">{rowData.supplier.name}</span>
        <Rating
          value={rowData.supplier.rating}
          readOnly
          stars={5}
          cancel={false}
          className="ml-2"
        />
      </div>
    );
  };

  // Reviews template (stars + count)
  const reviewsTemplate = (rowData: Product) => {
    return (
      <div className="flex align-items-center">
        <Rating
          value={rowData.reviews.average}
          readOnly
          stars={5}
          cancel={false}
        />
        <span className="ml-2">({rowData.reviews.count})</span>
      </div>
    );
  };

  // Row expansion template
  const rowExpansionTemplate = (rowData: Product) => {
    return <VariantTable variants={rowData.variants} />;
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="card p-4">
      <DataTable
        value={products}
        tableStyle={{ minWidth: "60rem" }}
        rowExpansionTemplate={rowExpansionTemplate}
        expandedRows={expandedRows}
        onRowToggle={onRowToggle}
      >
        {/* Expander column (LEFT SIDE) */}
        <Column expander style={{ width: "3rem" }} />

        {/* Other columns */}
        <Column field="name" header="Product Name" />
        <Column field="category" header="Category" />
        <Column header="Supplier" body={supplierTemplate} />
        <Column
          header="Total Variants"
          body={(rowData: Product) => rowData.variants.length}
        />
        <Column header="Stock Status" body={stockStatusTemplate} />
        <Column header="Reviews" body={reviewsTemplate} />
      </DataTable>
    </div>
  );
};

export default InventoryTable;
