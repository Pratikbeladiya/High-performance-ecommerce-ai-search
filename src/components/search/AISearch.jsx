import React from "react";
import { Cpu, Zap, Clock, Info, Check } from "lucide-react";

export default function AISearch({
  results = [],
  latency = "0ms",
  queryType = "Vector Search (Cosine Similarity)",
  dimensions = 1536
}) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col h-full bg-slate-900/40 border-cyan-950/40 relative overflow-hidden">
      {/* Decorative top-right cyan glow blob */}
      <div className="absolute -top-12 -right-12 w-24 h-24 bg-cyan-500/5 rounded-full blur-xl pointer-events-none" />

      {/* Column Header */}
      <div className="flex items-center gap-3 pb-4 border-b border-slate-800/80 mb-5 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-teal-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30 shadow-inner shadow-cyan-500/10">
          <Cpu className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            AI Semantic Search
            <span className="flex w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          </h3>
          <p className="text-[10px] text-cyan-400/85 font-semibold uppercase tracking-wider mt-0.5">
            Vector Similarity & Contextual Intent
          </p>
        </div>
      </div>

      {/* Execution Diagnostics */}
      <div className="bg-slate-950/80 rounded-xl p-3.5 border border-slate-850 space-y-2.5 mb-5 font-mono text-[10px] text-slate-400 leading-normal relative z-10">
        <div className="flex items-center justify-between">
          <span className="text-slate-500 flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-slate-600" /> Vector Latency</span>
          <span className="text-cyan-400 font-bold">{latency}</span>
        </div>
        <div className="flex items-start justify-between gap-4">
          <span className="text-slate-500 flex-shrink-0 flex items-center gap-1"><Zap className="w-3.5 h-3.5 text-slate-600" /> Distance Logic</span>
          <span className="text-slate-300 text-right font-medium break-all">{queryType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-slate-500">Dimensions Index</span>
          <span className="text-slate-400 font-semibold">{dimensions} floats</span>
        </div>
      </div>

      {/* Results Section */}
      <div className="flex-1 space-y-4 relative z-10">
        {results.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center rounded-xl bg-slate-950/20 border border-dashed border-slate-850">
            <Info className="w-8 h-8 text-slate-600 mb-3" />
            <h4 className="text-xs font-semibold text-slate-400">Index Ready</h4>
            <p className="text-[10px] text-slate-650 max-w-xs mt-1.5 leading-relaxed">
              Enter a search query to simulate vector lookup.
            </p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {results.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-xl bg-slate-950/40 border border-slate-900 hover:border-cyan-900/60 hover:bg-slate-950/70 transition-all duration-200"
              >
                {/* Product Info Row */}
                <div className="flex items-start gap-3.5 mb-2.5">
                  <img
                    src={item.imageUrl || "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=100"}
                    alt={item.name}
                    className="w-11 h-11 rounded-lg object-cover border border-slate-800/80 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-slate-200 truncate leading-none">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-bold text-cyan-400">
                        ${item.price}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-500 font-semibold mt-1 inline-block uppercase">
                      {item.category}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-1 leading-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* AI Relevancy & Reason */}
                <div className="pt-2 border-t border-slate-900 flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[9px] font-bold">
                    <span className="text-slate-500 uppercase tracking-wide">Semantic Relevancy</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-400 border border-cyan-800/40">
                      {item.relevancy}% MATCH
                    </span>
                  </div>
                  <p className="text-[10px] text-cyan-300/80 italic mt-0.5 leading-normal flex items-start gap-1">
                    <Check className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span>{item.reason}</span>
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
