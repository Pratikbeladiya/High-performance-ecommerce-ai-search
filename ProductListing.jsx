import { useState, useMemo, useEffect } from 'react';
import { DUMMY_PRODUCTS } from './productsData';

export default function ProductListing({ setView, setSelectedProduct, addToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  // Secondary state to handle debouncing without stuttering the user's typing
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Most Popular');

  // Debounce logic for structural text processing
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  // Dynamically extract all available unique categories from data
  const dynamicCategories = useMemo(() => {
    const categories = new Set(DUMMY_PRODUCTS.map((p) => p.category).filter(Boolean));
    return ['All', ...Array.from(categories)];
  }, []);

  // Filter & Sort Processing Logic (Refactored to avoid source mutations)
  const filteredProducts = useMemo(() => {
    let result = [...DUMMY_PRODUCTS];

    if (debouncedSearch.trim()) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(p => p.name?.toLowerCase().includes(query));
    }
    
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    
    if (priceRange !== 'All') {
      if (priceRange === 'under-50') result = result.filter(p => p.price < 50);
      if (priceRange === '50-150') result = result.filter(p => p.price >= 50 && p.price <= 150);
      if (priceRange === 'over-150') result = result.filter(p => p.price > 150);
    }

    // Created shallow copies here before sorting to prevent mutating the underlying dummy data array
    if (sortBy === 'Price: Low to High') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Price: High to Low') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [debouncedSearch, selectedCategory, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setPriceRange('All');
    setSortBy('Most Popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      
      {/* Search Bar Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Search matching items..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <label htmlFor="sort-select" className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort By:</label>
          <select 
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-700 font-medium cursor-pointer transition-all"
          >
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-slate-200 rounded-xl p-6 h-fit sticky top-24 shadow-sm">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-indigo-600"></i> Filters
            </h3>
            <button 
              onClick={clearAllFilters} 
              className="text-xs text-indigo-600 font-semibold hover:text-indigo-800 transition cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h4>
            <div className="space-y-2.5">
              {dynamicCategories.map((cat) => (
                <label key={cat} className="flex items-center text-sm font-medium text-slate-600 cursor-pointer select-none group">
                  <input 
                    type="radio" 
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2.5 transition" 
                  /> 
                  <span className="group-hover:text-slate-900 transition-colors">
                    {cat === 'All' ? 'All Categories' : cat}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Price Range</h4>
            <div className="space-y-2.5">
              {[
                { label: 'All Prices', value: 'All' },
                { label: 'Under $50', value: 'under-50' },
                { label: '$50 to $150', value: '50-150' },
                { label: 'Over $150', value: 'over-150' }
              ].map((range) => (
                <label key={range.value} className="flex items-center text-sm font-medium text-slate-600 cursor-pointer select-none group">
                  <input 
                    type="radio" 
                    name="price-range"
                    checked={priceRange === range.value}
                    onChange={() => setPriceRange(range.value)}
                    className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2.5 transition" 
                  /> 
                  <span className="group-hover:text-slate-900 transition-colors">{range.label}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-xl border border-slate-200 shadow-sm">
              <i className="fa-solid fa-box-open text-slate-300 text-4xl mb-3"></i>
              <p className="text-slate-500 font-medium">No products match your filter settings.</p>
              <button 
                onClick={clearAllFilters} 
                className="mt-3 text-sm text-indigo-600 font-bold underline hover:text-indigo-800"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
                  <div>
                    <div 
                      onClick={() => { setSelectedProduct(product); setView('details'); }}
                      className="block aspect-square w-full bg-slate-100 cursor-pointer overflow-hidden relative"
                    >
                      <img 
                        src={product.image || 'https://via.placeholder.com/400'} 
                        alt={product.name} 
                        loading="lazy"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400?text=No+Image'; }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                      />
                    </div>
                    <div className="p-5 pb-0">
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mb-1">{product.category}</p>
                      <h3 
                        onClick={() => { setSelectedProduct(product); setView('details'); }}
                        className="font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-2 block text-sm sm:text-base cursor-pointer"
                      >
                        {product.name}
                      </h3>
                    </div>
                  </div>

                  <div className="p-5 pt-4 mt-auto">
                    {/* Fixed 'class' syntax error to 'className' here */}
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-slate-900">${product.price?.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                        className="p-2.5 bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-400"
                      >
                        <i className="fa-solid fa-cart-plus"></i>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
