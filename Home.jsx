import React, { useState } from 'react';
import { DUMMY_PRODUCTS } from './productsData';

export default function Home({ setView, setSelectedProduct, handleSearchSubmit, addToCart }) {
  const [searchQuery, setSearchQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    handleSearchSubmit(searchQuery);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">Elevate Your Everyday Style</h1>
          <p className="text-lg sm:text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
            Discover premium curated collections designed for modern living. Quality materials meets timeless design.
          </p>
          
          {/* Search Bar */}
          <form onSubmit={onSearch} className="max-w-md mx-auto flex items-center bg-white p-2 rounded-xl shadow-lg">
            <i className="fa-solid fa-magnifying-glass text-slate-400 ml-3 mr-2"></i>
            <input 
              type="text" 
              placeholder="Search products, brands, categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 text-slate-800 focus:outline-none placeholder-slate-400 text-sm py-2"
            />
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap">
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Browse by Category</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {[
            { name: 'Electronics', icon: 'fa-laptop', count: '120+' },
            { name: 'Apparel', icon: 'fa-shirt', count: '450+' },
            { name: 'Home Living', icon: 'fa-couch', count: '85+' },
            { name: 'Fitness', icon: 'fa-dumbbell', count: '60+' }
          ].map((cat) => (
            <div 
              key={cat.name}
              onClick={() => setView('shop')}
              className="group relative bg-white border border-slate-200 rounded-xl p-6 text-center hover:shadow-md transition cursor-pointer"
            >
              <div className="w-12 h-12 bg-indigo-50 rounded-lg flex items-center justify-center text-indigo-600 text-xl mx-auto mb-4 group-hover:bg-indigo-600 group-hover:text-white transition">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <h3 className="font-semibold text-slate-800">{cat.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{cat.count} Products</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-16 w-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Featured Products</h2>
            <p className="text-sm text-slate-500 mt-1">Our top trending picks this week.</p>
          </div>
          <button onClick={() => setView('shop')} className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer">
            View all <i class="fa-solid fa-arrow-right text-xs"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DUMMY_PRODUCTS.map((product) => (
            <div key={product.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden group hover:shadow-lg transition">
              <div 
                onClick={() => { setSelectedProduct(product); setView('details'); }}
                className="block aspect-square w-full bg-slate-100 relative cursor-pointer"
              >
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                {product.tag && (
                  <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-bold px-2.5 py-1 rounded-md">{product.tag}</span>
                )}
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
                  <span class="text-xl font-extrabold text-slate-900">${product.price.toFixed(2)}</span>
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
      </section>
    </div>
  );
}