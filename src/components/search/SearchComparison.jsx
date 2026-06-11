import React from "react";
import TraditionalSearch from "./TraditionalSearch";
import AISearch from "./AISearch";
import { Search, Info } from "lucide-react";

export default function SearchComparison({
  searchQuery,
  setSearchQuery,
  traditionalData,
  aiData,
  suggestedQueries = [],
  onSuggestionClick
}) {
  return (
    <div className="space-y-6">
      {/* Search Bar Input Container */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Type a conceptual search query (e.g. 'something to listen to music while jogging' or 'office desk clicky typing')..."
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none transition-all"
          />
        </div>

        {/* Suggested Queries Chips */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
            Suggested Queries:
          </span>
          {suggestedQueries.map((query) => (
            <button
              key={query}
              onClick={() => onSuggestionClick(query)}
              className={`px-3 py-1 rounded-full text-xs transition-all border cursor-pointer font-medium ${
                searchQuery === query
                  ? "bg-indigo-600/10 text-indigo-400 border-indigo-500/30 shadow-sm"
                  : "bg-slate-900/40 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              "{query}"
            </button>
          ))}
        </div>

        {/* Informative Note */}
        <div className="p-3 bg-indigo-950/20 border border-indigo-900/30 rounded-xl flex items-start gap-2.5">
          <Info className="w-4.5 h-4.5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-[10px] text-slate-400 leading-normal">
            <span className="font-semibold text-slate-300 block mb-0.5">Vector Search Concept Demonstration:</span>
            Traditional database queries require exact matches on characters. AI Vector search analyzes semantics (context, synonyms, related concepts), allowing it to retrieve relevant products even if no exact keywords are shared with the description!
          </p>
        </div>
      </div>

      {/* Side-by-Side Comparison Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TraditionalSearch
          results={traditionalData.results}
          latency={traditionalData.latency}
          queryType={traditionalData.queryType}
          matchedTokens={traditionalData.matchedTokens}
        />
        <AISearch
          results={aiData.results}
          latency={aiData.latency}
          queryType={aiData.queryType}
          dimensions={1536}
        />
      </div>
    </div>
  );
}
