import React, { useState } from 'react';

export default function ProductDetails({ product, setView, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No product selected.</p>
        <button onClick={() => setView('shop')} className="text-indigo-600 font-bold underline mt-2">Back to shop</button>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
      <nav className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 flex gap-2 items-center">
        <span onClick={() => setView('home')} className="hover:text-indigo-600 cursor-pointer">Home</span>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span onClick={() => setView('shop')} className="hover:text-indigo-600 cursor-pointer">{product.category}</span>
        <i className="fa-solid fa-chevron-right text-[10px]"></i>
        <span className="text-slate-600">Product Details</span>
      </nav>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-sm">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Image Block */}
          <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
          </div>

          {/* Info Block */}
          <div className="flex flex-col h-full justify-between">
            <div>
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">In Stock</span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">{product.name}</h1>
              
              <div className="flex items-center gap-2 mb-6">
                <span className="text-amber-400 text-sm flex gap-0.5">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star-half-stroke"></i>
                </span>
                <span className="text-xs font-medium text-slate-500">({product.rating} out of 5 from {product.reviews} reviews)</span>
              </div>

              <div className="text-3xl font-black text-indigo-600 mb-6">${product.price.toFixed(2)}</div>

              <div className="border-t border-slate-100 pt-6">
                <h3 className="text-sm font-bold text-slate-900 mb-2">Product Description</h3>
                <p className="text-slate-600 leading-relaxed text-sm">{product.description}</p>
              </div>
            </div>

            {/* Quantity and Cart Addition CTAs */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-32 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between p-1">
                  <button 
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded transition"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-slate-800">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(prev => prev + 1)}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded transition"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-slate-400">Only premium stock items remain.</span>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold py-4 px-6 rounded-xl block transition shadow-lg shadow-indigo-100 cursor-pointer"
              >
                <i className="fa-solid fa-bag-shopping mr-2"></i> Add To Cart
              </button>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}