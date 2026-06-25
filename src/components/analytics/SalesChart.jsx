import { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { DollarSign, ShoppingCart } from "lucide-react";

export default function SalesChart({ data = [] }) {
  const [activeMetric, setActiveMetric] = useState("all"); // all, sales, orders

  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Revenue & Volume Trends</h3>
          <p className="text-xs text-slate-500 mt-0.5">Track your overall sales growth and purchase frequencies</p>
        </div>
        
        {/* Toggle Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 border border-slate-800 rounded-xl self-start">
          <button
            onClick={() => setActiveMetric("all")}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              activeMetric === "all" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All Metrics
          </button>
          <button
            onClick={() => setActiveMetric("sales")}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              activeMetric === "sales" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Revenue
          </button>
          <button
            onClick={() => setActiveMetric("orders")}
            className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
              activeMetric === "orders" ? "bg-indigo-650 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Orders
          </button>
        </div>
      </div>

      {/* Mini metric preview stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/15">
            <DollarSign className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 block uppercase">Period Revenue</span>
            <span className="text-sm font-bold text-white">
              {formatCurrency(data.reduce((sum, item) => sum + item.sales, 0))}
            </span>
          </div>
        </div>

        <div className="p-3 bg-slate-900/30 border border-slate-900 rounded-xl flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-pink-500/10 text-pink-400 flex items-center justify-center border border-pink-500/15">
            <ShoppingCart className="w-4.5 h-4.5" />
          </div>
          <div>
            <span className="text-[10px] font-semibold text-slate-500 block uppercase">Period Orders</span>
            <span className="text-sm font-bold text-white">
              {data.reduce((sum, item) => sum + item.orders, 0)} items
            </span>
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="flex-1 min-h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="salesColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="ordersColor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ec4899" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="month" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#e2e8f0",
                fontSize: "11px"
              }}
              formatter={(value, name) => {
                if (name === "sales") return [formatCurrency(value), "Revenue"];
                return [value, "Orders"];
              }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconSize={8}
              iconType="circle"
              wrapperStyle={{ fontSize: "11px", color: "#94a3b8", paddingTop: "10px" }}
            />
            
            {(activeMetric === "all" || activeMetric === "sales") && (
              <Area
                type="monotone"
                dataKey="sales"
                name="sales"
                stroke="#6366f1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#salesColor)"
              />
            )}
            
            {(activeMetric === "all" || activeMetric === "orders") && (
              <Area
                type="monotone"
                dataKey="orders"
                name="orders"
                stroke="#ec4899"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#ordersColor)"
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
