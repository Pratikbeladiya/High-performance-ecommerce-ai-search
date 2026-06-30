import { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search, SlidersHorizontal, X, Sparkles, Zap,
  Grid3X3, List, Package, ChevronLeft, ChevronRight,
  Filter, Star
} from "lucide-react";
import ProductCard from "../../components/user/ProductCard";
import { useCart } from "../../context/CartContext";
import { getPublicProducts } from "../../utils/userHelpers";
import { initialProducts } from "../../data/products";

const ITEMS_PER_PAGE = 12;

function scoreProductAI(product, query) {
  const q = query.toLowerCase();
  const tokens = q.split(/\s+/).filter(t => t.length > 2);
  let score = 0;
  let reasons = [];

  const name = (product.name || "").toLowerCase();
  const desc = (product.description || "").toLowerCase();
  const tags = (product.tags || []).join(" ").toLowerCase();
  const context = (product.aiEmbeddingsContext || "").toLowerCase();
  const cat = (product.category || "").toLowerCase();

  const allText = `${name} ${desc} ${tags} ${context} ${cat}`;

  // Exact name match: high score
  if (name.includes(q)) { score += 80; reasons.push("Name match"); }

  // Category semantic
  if ((q.includes("electronic") || q.includes("gadget") || q.includes("tech")) && cat === "electronics") { score += 40; reasons.push("Category: Electronics"); }
  if ((q.includes("apparel") || q.includes("cloth") || q.includes("wear") || q.includes("fashion")) && cat === "apparel") { score += 40; reasons.push("Category: Apparel"); }
  if ((q.includes("home") || q.includes("living") || q.includes("kitchen") || q.includes("decor")) && cat === "home & living") { score += 40; reasons.push("Category: Home"); }

  // Audio semantic
  if ((q.includes("listen") || q.includes("music") || q.includes("audio") || q.includes("sound") || q.includes("song")) && (tags.includes("audio") || tags.includes("headphone"))) { score += 60; reasons.push("Audio semantic match"); }

  // Fitness semantic
  if ((q.includes("jog") || q.includes("run") || q.includes("sport") || q.includes("fit") || q.includes("workout") || q.includes("exercise")) && (tags.includes("fitness") || tags.includes("running") || tags.includes("sport"))) { score += 55; reasons.push("Fitness semantic match"); }

  // Office semantic
  if ((q.includes("office") || q.includes("desk") || q.includes("work") || q.includes("typ")) && (tags.includes("keyboard") || tags.includes("desk") || name.includes("keyboard") || name.includes("lamp"))) { score += 50; reasons.push("Office/work match"); }

  // Hydration semantic
  if ((q.includes("water") || q.includes("drink") || q.includes("cold") || q.includes("hot") || q.includes("bottle") || q.includes("flask")) && tags.includes("bottle")) { score += 55; reasons.push("Hydration match"); }

  // Coffee semantic
  if ((q.includes("coffee") || q.includes("espresso") || q.includes("latte") || q.includes("brew")) && tags.includes("coffee")) { score += 55; reasons.push("Coffee match"); }

  // Token hits
  tokens.forEach(token => {
    if (allText.includes(token)) { score += 15; }
  });

  return { score: Math.min(score, 99), reasons };
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const initialQ = searchParams.get("q") || "";
  const initialCat = searchParams.get("category") || "All";
  const initialMode = searchParams.get("mode") === "ai" ? "ai" : "traditional";

  const [allProducts, setAllProducts] = useState([]);
  const [query, setQuery] = useState(initialQ);
  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [searchMode, setSearchMode] = useState(initialMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchProducts = async () => {
      let loaded = await getPublicProducts();
      if (!loaded || loaded.length === 0) loaded = initialProducts;
      setAllProducts(loaded);
    };
    fetchProducts();
  }, []);

  // Sync URL params with state
  useEffect(() => {
    const q = searchParams.get("q") || "";
    const cat = searchParams.get("category") || "All";
    const mode = searchParams.get("mode") === "ai" ? "ai" : "traditional";
    setQuery(q);
    setSelectedCategory(cat);
    setSearchMode(mode);
  }, [searchParams]);

  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map(p => p.category))];
    return ["All", ...cats];
  }, [allProducts]);

  const filteredAndScored = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Status filter
    if (selectedStatus !== "All") {
      result = result.filter(p => p.status === selectedStatus);
    }

    // Price range
    if (minPrice !== "") result = result.filter(p => p.price >= parseFloat(minPrice));
    if (maxPrice !== "") result = result.filter(p => p.price <= parseFloat(maxPrice));

    if (query.trim()) {
      if (searchMode === "ai") {
        // AI semantic mode
        result = result
          .map(p => {
            const { score, reasons } = scoreProductAI(p, query);
            return { ...p, _aiScore: score, _aiReasons: reasons };
          })
          .filter(p => p._aiScore > 0)
          .sort((a, b) => b._aiScore - a._aiScore);
      } else {
        // Traditional keyword mode
        const q = query.toLowerCase().trim();
        const tokens = q.split(/\s+/).filter(t => t.length > 2);
        result = result.filter(p => {
          const allText = `${p.name} ${p.description} ${p.category} ${(p.tags || []).join(" ")}`.toLowerCase();
          return tokens.some(t => allText.includes(t)) || allText.includes(q);
        });
      }
    }

    return result;
  }, [allProducts, query, selectedCategory, selectedStatus, minPrice, maxPrice, searchMode]);

  const totalPages = Math.max(1, Math.ceil(filteredAndScored.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filteredAndScored.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleSearch = (val) => {
    setQuery(val);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (val) params.set("q", val); else params.delete("q");
    setSearchParams(params);
  };

  const handleCategory = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (cat !== "All") params.set("category", cat); else params.delete("category");
    setSearchParams(params);
  };

  const handleModeToggle = (mode) => {
    setSearchMode(mode);
    setCurrentPage(1);
    const params = new URLSearchParams(searchParams);
    if (mode === "ai") params.set("mode", "ai"); else params.delete("mode");
    setSearchParams(params);
  };

  const clearAllFilters = () => {
    setQuery(""); setSelectedCategory("All"); setSelectedStatus("All");
    setMinPrice(""); setMaxPrice(""); setCurrentPage(1);
    setSearchParams({});
  };

  const hasActiveFilters = query || selectedCategory !== "All" || selectedStatus !== "All" || minPrice || maxPrice;

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="hover:text-slate-300 cursor-pointer" onClick={() => window.location.href = "/"}>Home</span>
          <span>/</span>
          <span className="text-slate-300">Shop</span>
          {selectedCategory !== "All" && <><span>/</span><span className="text-indigo-400">{selectedCategory}</span></>}
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white">
          {selectedCategory !== "All" ? selectedCategory : "All Products"}
        </h1>
        <p className="text-slate-400 text-sm mt-1">{filteredAndScored.length} products found</p>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Overlay (mobile) */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:relative top-0 left-0 h-full md:h-auto z-50 md:z-auto
          w-72 md:w-64 flex-shrink-0
          transform transition-transform duration-300 md:transform-none
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
          bg-[#030712] md:bg-transparent overflow-y-auto md:overflow-visible
          p-6 md:p-0
        `}>
          {/* Mobile Close */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <span className="font-bold text-white">Filters</span>
            <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-xl hover:bg-slate-800 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
              {query && (
                <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-slate-500 hover:text-white" />
                </button>
              )}
            </div>

            {/* Search Mode */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Search Mode</p>
              <div className="flex flex-col gap-2">
                {[
                  { mode: "traditional", label: "Traditional Keyword", icon: Search, color: "slate" },
                  { mode: "ai", label: "AI Semantic Search", icon: Sparkles, color: "indigo" }
                ].map(({ mode, label, icon: Icon, color }) => (
                  <button
                    key={mode}
                    onClick={() => handleModeToggle(mode)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-left transition-all border ${
                      searchMode === mode
                        ? mode === "ai"
                          ? "bg-indigo-600/20 border-indigo-500/40 text-indigo-300"
                          : "bg-slate-700/60 border-slate-600 text-white"
                        : "border-slate-800 text-slate-500 hover:text-slate-300 hover:bg-slate-800/40"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${searchMode === mode && mode === "ai" ? "text-indigo-400 animate-pulse" : ""}`} />
                    {label}
                    {mode === "ai" && (
                      <span className="ml-auto text-[10px] bg-indigo-600/30 text-indigo-400 px-1.5 py-0.5 rounded-md font-bold">AI</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</p>
              <div className="space-y-1">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => handleCategory(cat)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? "bg-indigo-600/20 border border-indigo-500/40 text-indigo-300"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {cat}
                    <span className="text-xs text-slate-600">
                      {cat === "All" ? allProducts.length : allProducts.filter(p => p.category === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Availability</p>
              <div className="space-y-1">
                {["All", "In Stock", "Low Stock"].map(status => (
                  <button
                    key={status}
                    onClick={() => { setSelectedStatus(status); setCurrentPage(1); }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      selectedStatus === status
                        ? "bg-indigo-600/20 border border-indigo-500/40 text-indigo-300"
                        : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Range (USD)</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={e => { setMinPrice(e.target.value); setCurrentPage(1); }}
                  className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={e => { setMaxPrice(e.target.value); setCurrentPage(1); }}
                  className="w-1/2 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="w-full py-2.5 rounded-xl border border-rose-500/30 text-rose-400 text-sm font-semibold hover:bg-rose-500/10 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-4 h-4" /> Clear All Filters
              </button>
            )}
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="md:hidden flex items-center gap-2 px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-300 text-sm font-semibold"
              >
                <Filter className="w-4 h-4" /> Filters
              </button>

              {searchMode === "ai" && query && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/15 border border-indigo-500/30 rounded-xl text-indigo-400 text-xs font-bold">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  AI Mode Active – Results ranked by relevance
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 rounded-lg transition-all ${viewMode === "grid" ? "bg-indigo-600/20 text-indigo-400" : "text-slate-500 hover:text-white"}`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${viewMode === "list" ? "bg-indigo-600/20 text-indigo-400" : "text-slate-500 hover:text-white"}`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {paginated.length === 0 ? (
            <div className="text-center py-20">
              <Package className="w-14 h-14 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-300 mb-2">No products found</h3>
              <p className="text-slate-500 text-sm mb-5">Try different keywords or clear your filters</p>
              <button onClick={clearAllFilters} className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold transition-all">
                Clear Filters
              </button>
            </div>
          ) : (
            <div className={`grid gap-5 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3"
                : "grid-cols-1"
            }`}>
              {paginated.map(product => (
                <div key={product.id} className="relative">
                  {searchMode === "ai" && product._aiScore > 0 && query && (
                    <div className="absolute top-3 left-3 z-20 flex items-center gap-1 px-2 py-1 bg-indigo-900/80 backdrop-blur-sm border border-indigo-500/40 rounded-lg">
                      <Star className="w-3 h-3 text-indigo-400" />
                      <span className="text-[10px] font-bold text-indigo-300">
                        {product._aiScore}% match
                      </span>
                    </div>
                  )}
                  <ProductCard
                    product={product}
                    onAddToCart={addToCart}
                    compact={viewMode === "list"}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-10 py-4 border-t border-slate-800">
              <span className="text-xs text-slate-500">
                Page {safePage} of {totalPages} · {filteredAndScored.length} results
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={safePage === 1}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 rounded-lg text-sm font-bold transition-all ${
                      safePage === page
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30"
                        : "text-slate-400 hover:text-white hover:bg-slate-800"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={safePage === totalPages}
                  className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
