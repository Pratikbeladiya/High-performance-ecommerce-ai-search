import { useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function RevenuePerformanceCard({ data = [] }) {
  const formatCurrency = useCallback((val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  }, []);

  const { previewData, totalSales } = useMemo(() => {
    const slicedData = data.slice(-6);
    const sales = slicedData.reduce((sum, item) => sum + item.sales, 0);
    return { previewData: slicedData, totalSales: sales };
  }, [data]);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-sm font-semibold text-slate-200">Revenue Performance</h3>
          <p className="text-xs text-slate-500 mt-0.5">Monthly revenue trends for the last 6 months</p>
        </div>
        <Link
          to="/admin/analytics"
          className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center gap-1 cursor-pointer"
        >
          View Report
          <TrendingUp className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="mb-4">
        <h4 className="text-2xl font-extrabold text-white tracking-tight">
          {formatCurrency(totalSales)}
        </h4>
        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1 mt-1">
          +14.2% Growth <span className="text-slate-500 font-medium">this period</span>
        </span>
      </div>

      {/* Recharts Area Chart */}
      <div className="flex-1 min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={previewData} margin={{ top: 10, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="dashboardSalesGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="month"
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              dy={10}
            />
            <YAxis
              stroke="#475569"
              fontSize={10}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#e2e8f0",
                fontSize: "11px"
              }}
              formatter={(value) => [formatCurrency(value), "Revenue"]}
            />
            <Area
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#dashboardSalesGrad)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
