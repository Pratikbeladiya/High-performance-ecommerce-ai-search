
import ProductRow from "./ProductRow";
import EmptyState from "../common/EmptyState";
import { PackageOpen } from "lucide-react";

const TABLE_HEADERS = [
  { label: "Image", align: "left" },
  { label: "Product Info", align: "left" },
  { label: "Category", align: "left" },
  { label: "Price", align: "left" },
  { label: "Stock", align: "left" },
  { label: "Status", align: "left" },
  { label: "Actions", align: "right" }
];

export default function ProductTable({ products = [], onEdit, onDelete }) {
  if (products.length === 0) {
    return (
      <div className="py-12">
        <EmptyState
          title="No products match your filters"
          description="Try changing the category or status filter, or clear your query."
          icon={PackageOpen}
        />
      </div>
    );
  }



  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800/80">
          <thead className="bg-slate-900/60">
            <tr>
              {TABLE_HEADERS.map((header, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4.5 text-xs font-bold text-slate-400 uppercase tracking-wider ${
                    header.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-800/60 bg-slate-950/10">
            {products.map((product) => (
              <ProductRow
                key={product.id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
