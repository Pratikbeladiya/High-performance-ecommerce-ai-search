import { useState } from 'react';
import { DUMMY_PRODUCTS } from './productsData';

export default function Search({ defaultQuery, setView, setSelectedProduct, addToCart }) {
  const [searchQuery, setSearchQuery] = useState(defaultQuery || '');
  const [submittedQuery, setSubmittedQuery] = useState(defaultQuery || '');

  const handleSearch = (e) => {
    e.preventDefault();
    setSubmittedQuery(searchQuery);
  };

  const results = DUMMY_PRODUCTS.filter(p => 
    p.name.toLowerCase().includes(submittedQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(submittedQuery.toLowerCase())
  );

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
      <div className="max-w-2xl mx-auto text-center mb-12">
        <h1 className="text-2xl font-bold mb-4 text-slate-900">Search Our Catalog</h1>
        <form onSubmit={handleSearch} className="relative flex items-center bg-white border border-slate-200 rounded-xl shadow-sm p-2">
          <i className="fa-solid fa-magnifying-glass text-slate-400 ml-3 mr-2"></i>
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent border-0 text-slate-800 focus:outline-none placeholder-slate-400 text-sm py-2"
            placeholder="Type your target keywords..."
          />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
            Search
          </button>
        </form>
        {submittedQuery && (
          <p className="text-xs text-slate-400 mt-3 text-left pl-2">
            Found {results.length} results matching <span className="font-bold text-slate-600">"{submittedQuery}"</span>
          </p>
        )}
      </div>

      <hr className="border-slate-200 mb-10" />

      <section>
        {results.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-slate-400">No products found matching your search term criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {results.map((product) => (
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
                      className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg transition cursor-pointer"
                    >
                      <i className="fa-solid fa-cart-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}