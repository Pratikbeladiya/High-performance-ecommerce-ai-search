import { useState } from 'react';
import { DUMMY_PRODUCTS } from './productsData';

export default function Home({ setView, setSelectedProduct, handleSearchSubmit, addToCart }) {
  const [searchQuery, setSearchQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    handleSearchSubmit(searchQuery);
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-800 selection:bg-indigo-200 selection:text-indigo-900">
      {/* Hero Section */}
      <header className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-3/4 bg-indigo-500/20 blur-[120px] rounded-full pointer-events-none"></div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-slate-300">
            Elevate Your Everyday Style
          </h1>
          <p className="text-lg sm:text-xl text-slate-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Discover premium curated collections designed for modern living. Quality materials meet timeless design.
          </p>
          
          {/* Search Bar */}
          <form 
            onSubmit={onSearch} 
            className="max-w-xl mx-auto flex items-center bg-white/95 backdrop-blur-sm p-2 rounded-2xl shadow-2xl shadow-indigo-900/20 border border-white/10 focus-within:ring-4 focus-within:ring-indigo-500/30 transition-all duration-300"
          >
            <i className="fa-solid fa-magnifying-glass text-indigo-400 ml-4 mr-2 text-lg"></i>
            <input 
              type="text" 
              placeholder="Search products, brands, categories..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-0 text-slate-800 focus:outline-none placeholder-slate-400 text-base py-3 px-2"
            />
            <button 
              type="submit" 
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-500/40 transition-all duration-300 whitespace-nowrap active:scale-95"
            >
              Search
            </button>
          </form>
        </div>
      </header>

      {/* Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Browse by Category</h2>
            <div className="h-1 w-12 bg-indigo-600 rounded-full mt-3"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {[
            { name: 'Electronics', icon: 'fa-laptop', count: '120+' },
            { name: 'Apparel', icon: 'fa-shirt', count: '450+' },
            { name: 'Home Living', icon: 'fa-couch', count: '85+' },
            { name: 'Fitness', icon: 'fa-dumbbell', count: '60+' }
          ].map((cat) => (
            <div 
              key={cat.name}
              onClick={() => setView('shop')}
              className="group relative bg-white border border-slate-100 rounded-2xl p-6 sm:p-8 text-center hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-100/50 hover:border-indigo-100 transition-all duration-300 cursor-pointer"
            >
              <div className="w-16 h-16 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-indigo-600 text-2xl mx-auto mb-5 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white group-hover:scale-110 transition-all duration-300 shadow-sm">
                <i className={`fa-solid ${cat.icon}`}></i>
              </div>
              <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
              <p className="text-sm font-medium text-slate-400 mt-1">{cat.count} Products</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 w-full">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Featured Products</h2>
            <p className="text-base text-slate-500 mt-2 font-medium">Our top trending picks this week.</p>
          </div>
          <button 
            onClick={() => setView('shop')} 
            className="group text-sm font-bold text-indigo-600 hover:text-indigo-500 flex items-center gap-2 transition-colors cursor-pointer"
          >
            View all 
            <i className="fa-solid fa-arrow-right text-xs group-hover:translate-x-1 transition-transform duration-300"></i>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {DUMMY_PRODUCTS.map((product) => (
            <div 
              key={product.id} 
              className="bg-white border border-slate-100 rounded-2xl overflow-hidden group hover:shadow-2xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div 
                onClick={() => { setSelectedProduct(product); setView('details'); }}
                className="block aspect-square w-full bg-slate-100 relative cursor-pointer overflow-hidden"
              >
                {/* Subtle gradient overlay for better image presentation */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out" 
                />
                
                {product.tag && (
                  <span className="absolute top-4 left-4 z-20 backdrop-blur-md bg-indigo-600/95 text-white text-[10px] uppercase tracking-wider font-bold px-3 py-1.5 rounded-lg shadow-sm">
                    {product.tag}
                  </span>
                )}
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-xs text-indigo-500 uppercase tracking-widest font-bold mb-2">
                  {product.category}
                </p>
                <h3 
                  onClick={() => { setSelectedProduct(product); setView('details'); }}
                  className="text-lg font-bold text-slate-800 hover:text-indigo-600 transition-colors line-clamp-1 mb-1 cursor-pointer"
                >
                  {product.name}
                </h3>
                
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
                    ${product.price.toFixed(2)}
                  </span>
                  <button 
                    onClick={() => addToCart(product)}
                    className="w-11 h-11 flex items-center justify-center bg-slate-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white hover:shadow-lg hover:shadow-indigo-200 transition-all duration-300 active:scale-90 cursor-pointer"
                    aria-label="Add to cart"
                  >
                    <i className="fa-solid fa-cart-plus text-lg"></i>
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
