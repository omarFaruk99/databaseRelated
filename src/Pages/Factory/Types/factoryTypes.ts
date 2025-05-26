export interface FactoryData {
  factory: {
    products: Product[];
    resources: Record<string, Resource>;
    orders: Order[];
  };
}

export interface Product {
  product_id: string;
  materials: Material[];
  labor: Labor;
}

export interface Material {
  material_id: string;
  units_required: number;
  waste_factor: number;
}

export interface Labor {
  hours: number;
  cost_per_hour: number;
}

export interface Resource {
  stock: number;
  unit_cost: number;
  lead_time: number;
}

export interface Order {
  order_qty: number;
  due_date: string; // ISO format (e.g., "2024-05-30")
}
