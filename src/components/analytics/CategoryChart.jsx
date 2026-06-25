import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

export default function CategoryChart({ data = [] }) {
  const formatCurrency = (val) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0
    }).format(val);
  };

  // Calculate total category worth
  const totalValue = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full">
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-200">Category Distribution</h3>
        <p className="text-xs text-slate-500 mt-0.5">Share of sales value across categories</p>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row items-center justify-center gap-6">
        {/* Donut Chart */}
        <div className="w-44 h-44 flex-shrink-0 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                contentStyle={{
                  backgroundColor: "#0f172a",
                  borderColor: "#334155",
                  borderRadius: "12px",
                  color: "#e2e8f0",
                  fontSize: "11px"
                }}
                formatter={(value) => [formatCurrency(value), "Value"]}
              />
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          {/* Central absolute statistics */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Total Value</span>
            <span className="text-sm font-bold text-white mt-0.5">
              {formatCurrency(totalValue / 1000)}k
            </span>
          </div>
        </div>

        {/* Legend listing */}
        <div className="flex-1 space-y-3 w-full">
          {data.map((item) => {
            const percentage = ((item.value / totalValue) * 100).toFixed(1);
            return (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-slate-300">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="font-bold text-slate-200 block">
                    {formatCurrency(item.value)}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {percentage}% share ({item.count} items)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
