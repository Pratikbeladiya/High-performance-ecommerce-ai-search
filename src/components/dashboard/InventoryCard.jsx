import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, AlertCircle, CheckCircle, PackageSearch } from "lucide-react";

export default function InventoryCard({ products = [] }) {
  // Filter for low stock or out of stock items
  const alertProducts = products
    .filter((p) => p.stock <= 5)
    .slice(0, 5); // display top 5 alerts

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Inventory Alerts</h3>
          <p className="text-xs text-slate-500 mt-0.5">Products requiring immediate attention</p>
        </div>
        <Link
          to="/admin/products"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors cursor-pointer"
        >
          Manage Stock
        </Link>
      </div>

      <div className="flex-1 space-y-4">
        {alertProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center bg-slate-950/20 rounded-xl border border-slate-800/60 p-4">
            <CheckCircle className="w-8 h-8 text-emerald-500 mb-2" />
            <h4 className="text-xs font-semibold text-slate-300">All Stock Healthy</h4>
            <p className="text-[10px] text-slate-500 max-w-xs mt-1">
              No products are currently low or out of stock.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/60">
            {alertProducts.map((product) => {
              const isOutOfStock = product.stock === 0;
              return (
                <div
                  key={product.id}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-10 h-10 rounded-lg object-cover border border-slate-800/80"
                    />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-200 leading-none">
                        {product.name}
                      </h4>
                      <span className="text-[10px] text-slate-500 font-medium mt-1 inline-block">
                        {product.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isOutOfStock
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/10"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/10"
                      }`}
                    >
                      {isOutOfStock ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <AlertTriangle className="w-3 h-3" />
                      )}
                      {isOutOfStock ? "Out of Stock" : `${product.stock} Left`}
                    </span>
                    
                    {/* Visual stock progress bar */}
                    <div className="w-20 bg-slate-800 h-1 rounded-full mt-2 ml-auto overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isOutOfStock ? "bg-rose-500" : "bg-amber-500"
                        }`}
                        style={{ width: `${Math.max(product.stock * 20, 5)}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
