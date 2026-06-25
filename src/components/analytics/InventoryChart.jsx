import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  ResponsiveContainer
} from "recharts";

export default function InventoryChart({ products = [] }) {
  // Map products for bar chart visualization
  const chartData = products.map((p) => ({
    name: p.name.length > 15 ? p.name.substring(0, 12) + "..." : p.name,
    fullName: p.name,
    stock: p.stock
  }));

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-200">Stock Level by Product</h3>
        <p className="text-xs text-slate-500 mt-0.5">Stock quantities across catalog items</p>
      </div>

      <div className="flex-1 min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 5, left: -25, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="name" stroke="#475569" fontSize={9} tickLine={false} axisLine={false} />
            <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0f172a",
                borderColor: "#334155",
                borderRadius: "12px",
                color: "#e2e8f0",
                fontSize: "11px"
              }}
              formatter={(value) => [value, "Stock Level"]}
              labelFormatter={(label, items) => {
                if (items[0]) return items[0].payload.fullName;
                return label;
              }}
            />
            <Bar dataKey="stock" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => {
                // Return orange if low stock, otherwise teal
                const color = entry.stock <= 5 ? "#f59e0b" : "#14b8a6";
                return <Cell key={`cell-${index}`} fill={color} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart Color Key Legends */}
      <div className="flex items-center gap-4 mt-4 text-[10px] text-slate-500 font-semibold uppercase tracking-wide">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-teal-500 rounded-md" />
          <span>Healthy Stock</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 bg-amber-500 rounded-md" />
          <span>Low/Critical Stock (≤ 5)</span>
        </div>
      </div>
    </div>
  );
}
