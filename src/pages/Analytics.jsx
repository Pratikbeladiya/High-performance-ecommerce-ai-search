import React, { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader";
import SalesChart from "../components/analytics/SalesChart";
import CategoryChart from "../components/analytics/CategoryChart";
import InventoryChart from "../components/analytics/InventoryChart";
import { salesTrends, categoryDistribution } from "../data/analytics";
import { initialProducts } from "../data/products";
import { Zap, HelpCircle, RefreshCw } from "lucide-react";

export default function Analytics() {
  const [products, setProducts] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("admin_products");
    if (stored) {
      try {
        setProducts(JSON.parse(stored));
      } catch (e) {
        setProducts(initialProducts);
      }
    } else {
      setProducts(initialProducts);
    }
  }, []);

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 800);
  };

  const performanceMetrics = [
    {
      title: "Avg. Conversion Rate",
      value: "3.24%",
      sub: "+0.45% vs last month",
      color: "text-indigo-400"
    },
    {
      title: "AI Search Relevancy",
      value: "94.8%",
      sub: "+12.3% over Keyword Match",
      color: "text-cyan-400"
    },
    {
      title: "Shopping Cart Abandonment",
      value: "64.2%",
      sub: "-3.10% optimization drop",
      color: "text-pink-400"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Analytics Report"
        subtitle="Perform deep sales audits, review stock distribution, and track system operations."
      >
        <button
          onClick={handleRefreshData}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 py-2 px-4 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all cursor-pointer disabled:opacity-55"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin" : ""}`} />
          Refresh Charts
        </button>
      </PageHeader>

      {/* Mini Performance Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {performanceMetrics.map((item, idx) => (
          <div key={idx} className="glass-panel p-5 rounded-2xl flex flex-col justify-between">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              {item.title}
            </span>
            <div className="mt-4">
              <span className={`text-2xl font-extrabold ${item.color} tracking-tight`}>
                {item.value}
              </span>
              <p className="text-[10px] text-slate-500 font-semibold mt-1">
                {item.sub}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Primary Analytics Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SalesChart data={salesTrends} />
        </div>
        <div>
          <CategoryChart data={categoryDistribution} />
        </div>
      </div>

      {/* Secondary Analytics Charts Row */}
      <div className="grid grid-cols-1 gap-6">
        <InventoryChart products={products} />
      </div>

      {/* AI Vector Optimization Card */}
      <div className="glass-panel p-6 rounded-2xl bg-gradient-to-r from-indigo-950/20 via-slate-900/50 to-cyan-950/20 border-indigo-950/50 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl text-center md:text-left">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 uppercase tracking-wider">
            <Zap className="w-3 h-3" />
            AI Vector Engine Status
          </span>
          <h3 className="text-base font-bold text-white leading-tight">
            High-Performance Vector Indexing is Active
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your e-commerce engine converts catalog metadata, tags, and product descriptions into 1536-dimensional vector embeddings, delivering precise contextual match accuracy.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs font-semibold text-slate-400">Index status: <span className="text-emerald-400 font-bold">100% Synced</span></span>
        </div>
      </div>
    </div>
  );
}
