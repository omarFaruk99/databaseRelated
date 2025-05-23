import { Badge } from "primereact/badge";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Tag } from "primereact/tag";

interface Variant {
  color: string;
  price: number;
  stock: number;
  discount: { type: string; value: number } | null;
}

interface VariantTableProps {
  variants: Variant[];
}

const VariantTable = ({ variants }: VariantTableProps) => {
  // Calculate discounted price
  const calculateDiscountedPrice = (
    price: number,
    discount: Variant["discount"]
  ) => {
    if (!discount) return price;
    return discount.type === "percentage"
      ? price * (1 - discount.value / 100)
      : price - discount.value;
  };

  // Stock status badge
  const stockTemplate = (stock: number) => (
    <Tag
      severity={stock < 30 ? "danger" : "success"}
      value={`${stock} units`}
    />
  );

  return (
    <div className="p-3">
      <DataTable value={variants} size="small">
        <Column field="color" header="Color" />
        <Column
          header="Original Price"
          body={(variant: Variant) => `$${variant.price.toFixed(2)}`}
        />
        <Column
          header="Discounted Price"
          body={(variant: Variant) => (
            <div className="flex align-items-center">
              {variant.discount ? (
                <>
                  <span className="line-through mr-2 text-500">
                    ${variant.price.toFixed(2)}
                  </span>
                  <Badge
                    value={`$${calculateDiscountedPrice(
                      variant.price,
                      variant.discount
                    ).toFixed(2)}`}
                    severity="info"
                  />
                </>
              ) : (
                `$${variant.price.toFixed(2)}`
              )}
            </div>
          )}
        />
        <Column
          header="Stock"
          body={(variant: Variant) => stockTemplate(variant.stock)}
        />
      </DataTable>
    </div>
  );
};

export default VariantTable;
