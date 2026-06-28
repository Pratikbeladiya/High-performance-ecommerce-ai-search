import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function StatsCard({
  title,
  value,
  change,
  isPositive = true,
  icon: Icon,
  gradientClass = "from-indigo-500/10 to-purple-500/10 text-indigo-400"
}) {
  return (
    <div className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between relative overflow-hidden group">
      {/* Background radial accent on hover */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all duration-300" />
      
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${gradientClass} flex items-center justify-center border border-slate-800`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">
          {value}
        </h3>
        
        {change && (
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/10"
                  : "bg-rose-500/10 text-rose-400 border border-rose-500/10"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {change}
            </span>
            <span className="text-[10px] text-slate-500 font-medium">vs last month</span>
          </div>
        )}
      </div>
    </div>
  );
}
