import React from "react";
import { Edit3, Trash2, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";

export default function ProductRow({ product, onEdit, onDelete }) {
  const getStatusBadge = (status) => {
    switch (status) {
      case "Low Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/10">
            <AlertCircle className="w-3 h-3" />
            Low Stock
          </span>
        );
      case "Out of Stock":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/10">
            <AlertCircle className="w-3 h-3" />
            Out of Stock
          </span>
        );
      case "In Stock":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/10">
            <CheckCircle2 className="w-3 h-3" />
            In Stock
          </span>
        );
    }
  };

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(val);
  };

  return (
    <tr className="hover:bg-slate-900/35 border-b border-slate-800/60 last:border-0 transition-colors">
      {/* Product Image */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <img
            src={product.imageUrl || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100"}
            alt={product.name}
            className="w-12 h-12 rounded-xl object-cover border border-slate-800/80 bg-slate-900 shadow-sm"
          />
        </div>
      </td>

      {/* Product Name & Description */}
      <td className="px-6 py-4">
        <div className="max-w-xs md:max-w-sm">
          <h4 className="text-sm font-bold text-slate-100 truncate">
            {product.name}
          </h4>
          <p className="text-xs text-slate-500 mt-1 line-clamp-1 leading-normal">
            {product.description}
          </p>
        </div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap text-xs font-medium text-slate-400">
        {product.category}
      </td>

      {/* Price */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-200">
        {formatCurrency(product.price)}
      </td>

      {/* Stock level */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="text-sm font-medium text-slate-300">
          {product.stock}
        </span>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4 whitespace-nowrap">
        {getStatusBadge(product.status)}
      </td>

      {/* Row Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-xs">
        <div className="flex items-center justify-end gap-2.5">
          <button
            onClick={() => onEdit(product.id)}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/60 rounded-lg border border-transparent hover:border-slate-800 transition-all cursor-pointer"
            title="Edit Product"
          >
            <Edit3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(product.id)}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-lg border border-transparent hover:border-slate-800 transition-all cursor-pointer"
            title="Delete Product"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}
