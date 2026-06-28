import SearchBar from "../common/SearchBar";
import { Filter, RotateCcw } from "lucide-react";

export default function ProductFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedStatus,
  setSelectedStatus,
  categories = []
}) {
  const statuses = ["In Stock", "Low Stock", "Out of Stock"];
  
  const hasActiveFilters = searchQuery || selectedCategory || selectedStatus;

  const handleClearAll = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedStatus("");
  };

  return (
    <div className="glass-panel p-4 rounded-2xl space-y-4 md:space-y-0 md:flex md:items-center md:gap-4">
      {/* Search Bar Input */}
      <div className="flex-1">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search products by name, description, tags..."
        />
      </div>

      {/* Select Filters Column */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Category Select Dropdown */}
        <div className="relative min-w-[140px]">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          {/* Custom chevron indicator */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <Filter className="w-3 h-3" />
          </div>
        </div>

        {/* Status Select Dropdown */}
        <div className="relative min-w-[130px]">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer appearance-none"
          >
            <option value="">All Statuses</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
            <Filter className="w-3 h-3" />
          </div>
        </div>

        {/* Clear Filters Link */}
        {hasActiveFilters && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl border border-slate-800 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>
        )}
      </div>
    </div>
  );
}
