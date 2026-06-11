import React, { useState, useEffect } from "react";
import PageHeader from "../components/common/PageHeader";
import StatsCard from "../components/dashboard/StatsCard";
import InventoryCard from "../components/dashboard/InventoryCard";
import AnalyticsCard from "../components/dashboard/AnalyticsCard";
import { initialProducts } from "../data/products";
import { salesTrends, recentActivities } from "../data/analytics";
import {
  Package,
  Layers,
  CircleDollarSign,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Activity
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    inventoryValue: 0,
    lowStockCount: 0
  });

  useEffect(() => {
    // Read products from localStorage first to capture any additions/edits
    const stored = localStorage.getItem("admin_products");
    let productList = initialProducts;
    if (stored) {
      try {
        productList = JSON.parse(stored);
      } catch (e) {
        // use default
      }
    } else {
      localStorage.setItem("admin_products", JSON.stringify(initialProducts));
    }
    setProducts(productList);

    // Compute stats dynamically
    const total = productList.length;
    const categories = [...new Set(productList.map((p) => p.category))].length;
    const value = productList.reduce((sum, p) => sum + p.price * p.stock, 0);
    const lowStock = productList.filter((p) => p.stock <= 5).length;

    setStats({
      totalProducts: total,
      totalCategories: categories,
      inventoryValue: value,
      lowStockCount: lowStock
    });
  }, []);

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(val);
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "warning":
        return "bg-amber-500";
      case "success":
        return "bg-emerald-500";
      case "danger":
        return "bg-rose-500";
      case "info":
      default:
        return "bg-sky-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your store's catalog, AI search performance, and stock levels."
      >
        <Link
          to="/admin/search-testing"
          className="py-2 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 active:from-indigo-700 active:to-purple-700 text-white font-medium rounded-xl text-xs shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5" />
          Test AI Search
        </Link>
      </PageHeader>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          change="+8.3%"
          isPositive={true}
          icon={Package}
          gradientClass="from-indigo-500/10 to-indigo-500/10 text-indigo-400"
        />
        <StatsCard
          title="Total Categories"
          value={stats.totalCategories}
          change="0.0%"
          isPositive={true}
          icon={Layers}
          gradientClass="from-teal-500/10 to-teal-500/10 text-teal-400"
        />
        <StatsCard
          title="Inventory Value"
          value={formatCurrency(stats.inventoryValue)}
          change="+12.4%"
          isPositive={true}
          icon={CircleDollarSign}
          gradientClass="from-purple-500/10 to-purple-500/10 text-purple-400"
        />
        <StatsCard
          title="Low Stock Products"
          value={stats.lowStockCount}
          change={stats.lowStockCount > 3 ? "+2 new" : "-1 resolved"}
          isPositive={stats.lowStockCount <= 3}
          icon={AlertTriangle}
          gradientClass="from-amber-500/10 to-amber-500/10 text-amber-400"
        />
      </div>

      {/* Analytics & Inventory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsCard data={salesTrends} />
        </div>
        <div>
          <InventoryCard products={products} />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="glass-panel p-6 rounded-2xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Recent Activity Log</h3>
            <p className="text-xs text-slate-500 mt-0.5">Real-time system, inventory, and order operations</p>
          </div>
          <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700/80 px-2 py-0.5 rounded-full font-medium">
            Live Stream
          </span>
        </div>

        <div className="space-y-4">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="flex items-start gap-4 p-3.5 rounded-xl bg-slate-900/30 border border-slate-900/80 hover:border-slate-800/80 hover:bg-slate-900/50 transition-all duration-200"
            >
              <div className="mt-1 flex-shrink-0">
                <span className={`flex w-2.5 h-2.5 rounded-full ${getStatusDotColor(act.status)} shadow-md ring-4 ring-slate-950`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-300 leading-snug">
                  {act.description}
                </p>
                <span className="text-[10px] text-slate-500 font-medium mt-1.5 inline-block">
                  {act.time}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
