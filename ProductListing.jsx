import { useState, useMemo } from 'react';
import { DUMMY_PRODUCTS } from './productsData';

export default function ProductListing({ setView, setSelectedProduct, addToCart }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Most Popular');

  // Filter & Sort Processing Logic
  const filteredProducts = useMemo(() => {
    let result = [...DUMMY_PRODUCTS];

    if (searchTerm) {
      result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (selectedCategory !== 'All') {
      result = result.filter(p => p.category === selectedCategory);
    }
    if (priceRange !== 'All') {
      if (priceRange === 'under-50') result = result.filter(p => p.price < 50);
      if (priceRange === '50-150') result = result.filter(p => p.price >= 50 && p.price <= 150);
      if (priceRange === 'over-150') result = result.filter(p => p.price > 150);
    }

    if (sortBy === 'Price: Low to High') result.sort((a, b) => a.price - b.price);
    if (sortBy === 'Price: High to Low') result.sort((a, b) => b.price - a.price);

    return result;
  }, [searchTerm, selectedCategory, priceRange, sortBy]);

  const clearAllFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setPriceRange('All');
    setSortBy('Most Popular');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-grow">
      {/* Search Bar Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-sm"></i>
          <input 
            type="text" 
            placeholder="Filter current results..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="flex items-center gap-3 self-end md:self-auto">
          <label className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort By:</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg text-sm py-2 px-3 focus:outline-none focus:border-indigo-500 text-slate-700 font-medium cursor-pointer"
          >
            <option>Most Popular</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-64 flex-shrink-0 bg-white border border-slate-200 rounded-xl p-6 h-fit sticky top-24">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <i className="fa-solid fa-sliders text-indigo-600"></i> Filters
            </h3>
            <button onClick={clearAllFilters} className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer">
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Categories</h4>
            <div className="space-y-2.5">
              {['All', 'Electronics', 'Apparel', 'Accessories', 'Home Living', 'Fitness'].map((cat) => (
                <label key={cat} className="flex items-center text-sm font-medium text-slate-600 cursor-pointer">
                  <input 
                    type="radio" 
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2.5" 
                  /> 
                  {cat === 'All' ? 'All Categories' : cat}
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
                <label key={range.value} className="flex items-center text-sm font-medium text-slate-600 cursor-pointer">
                  <input 
                    type="radio" 
                    name="price-range"
                    checked={priceRange === range.value}
                    onChange={() => setPriceRange(range.value)}
                    className="rounded-full border-slate-300 text-indigo-600 focus:ring-indigo-500 mr-2.5" 
                  /> 
                  {range.label}
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards Grid */}
        <main className="flex-1">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
              <p className="text-slate-400 font-medium">No products match your filter settings.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:shadow-lg transition">
                  <div 
                    onClick={() => { setSelectedProduct(product); setView('details'); }}
                    className="block aspect-square w-full bg-slate-100 cursor-pointer"
                  >
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                  </div>
                  <div className="p-5">
                    <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">{product.category}</p>
                    <h3 
                      onClick={() => { setSelectedProduct(product); setView('details'); }}
                      className="font-bold text-slate-800 hover:text-indigo-600 transition line-clamp-1 block mb-2 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center justify-between mt-4">
                      <span className="text-xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => addToCart(product)}
                        className="p-2.5 bg-indigo-50 group-hover:bg-indigo-600 text-indigo-600 group-hover:text-white rounded-lg transition cursor-pointer"
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
