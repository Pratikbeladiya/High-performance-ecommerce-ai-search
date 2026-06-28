import { Terminal, Database, Clock, Ban } from "lucide-react";

export default function TraditionalSearch({
  results = [],
  latency = "0ms",
  queryType = "SQL SELECT",
  matchedTokens = []
}) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full bg-slate-900/40">
      {/* Column Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80 mb-5">
        <div className="w-10 h-10 rounded-xl bg-slate-950 flex items-center justify-center text-slate-400 border border-slate-800">
          <Database className="w-5 h-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-200">Traditional Search</h3>
          <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Strict Substring / Keyword Match
          </p>
        </div>
      </div>

      {/* Execution Diagnostics */}
      <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-850 space-y-2.5 mb-5 font-mono text-[10px] text-slate-400 leading-normal">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-600" /> Latency</span>
          <span className="text-amber-400 font-bold">{latency}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-slate-500 flex-shrink-0 flex items-center gap-1"><Terminal className="w-3.5 h-3.5 text-slate-600" /> Query Type</span>
          <span className="text-slate-300 text-right font-medium break-all">{queryType}</span>
        </div>
        {matchedTokens.length > 0 && (
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Tokens Matched</span>
            <div className="flex flex-wrap gap-1 justify-end">
              {matchedTokens.map((tok) => (
                <span key={tok} className="px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 font-semibold text-[9px] border border-slate-800">
                  {tok}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="flex-1 space-y-4">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl bg-slate-950/20 border border-dashed border-slate-800/80">
            <Ban className="w-8 h-8 text-slate-600 mb-3" />
            <h4 className="text-xs font-semibold text-slate-400">0 Products Found</h4>
            <p className="text-[10px] text-slate-600 max-w-xs mt-1.5 leading-relaxed">
              Keyword matching failed because none of the search terms match product names, descriptions, or tags exactly.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((product) => (
              <div
                key={product.id}
                className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 flex items-center gap-3.5 hover:border-slate-800/80 transition-all duration-200"
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-11 h-11 rounded-lg object-cover border border-slate-800/80"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-200 truncate leading-none">
                      {product.name}
                    </h4>
                    <span className="text-[10px] font-bold text-indigo-400">
                      ${product.price}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 font-semibold mt-1 inline-block uppercase">
                    {product.category}
                  </span>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 leading-normal">
                    {product.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
