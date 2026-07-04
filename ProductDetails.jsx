import { useState } from 'react';

export default function ProductDetails({ product, setView, addToCart }) {
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-500">No product selected.</p>
        <button 
          onClick={() => setView('shop')} 
          className="text-indigo-600 font-bold underline mt-2 hover:text-indigo-700 transition"
        >
          Back to shop
        </button>
      </div>
    );
  }

  // Helper to dynamically render star ratings
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      if (rating >= starValue) {
        return <i key={index} className="fa-solid fa-star"></i>;
      } else if (rating >= starValue - 0.5) {
        return <i key={index} className="fa-solid fa-star-half-stroke"></i>;
      } else {
        return <i key={index} className="fa-regular fa-star"></i>;
      }
    });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
      
      {/* Breadcrumb Navigation */}
      <nav aria-label="Breadcrumb" className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-6 flex gap-2 items-center">
        <button onClick={() => setView('home')} className="hover:text-indigo-600 focus:outline-none focus:underline">
          Home
        </button>
        <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
        <button onClick={() => setView('shop')} className="hover:text-indigo-600 focus:outline-none focus:underline">
          {product.category}
        </button>
        <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true"></i>
        <span className="text-slate-600" aria-current="page">Product Details</span>
      </nav>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 lg:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Image Block */}
          <div className="aspect-square w-full rounded-xl bg-slate-100 overflow-hidden border border-slate-200">
            <img 
              src={product.image} 
              alt={`Image of ${product.name}`} 
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
            />
          </div>

          {/* Info Block */}
          <div className="flex flex-col h-full justify-between">
            <div>
              {/* Product Badges & Title */}
              <span className="bg-emerald-50 text-emerald-600 text-xs font-bold px-3 py-1 rounded-md uppercase tracking-wider">
                In Stock
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3 mb-2">
                {product.name}
              </h1>
              
              {/* Ratings */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-amber-400 text-sm flex gap-0.5" aria-label={`Rating: ${product.rating} out of 5 stars`}>
                  {renderStars(product.rating)}
                </span>
                <span className="text-xs font-medium text-slate-500">
                  ({product.rating} out of 5 from {product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="text-3xl font-black text-indigo-600 mb-6">
                ${product.price.toFixed(2)}
              </div>

              {/* Description */}
              <div className="border-t border-slate-100 pt-6">
                <h2 className="text-sm font-bold text-slate-900 mb-2">Product Description</h2>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {product.description}
                </p>
              </div>
            </div>

            {/* Quantity and Cart Addition CTAs */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-32 bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between p-1">
                  <button 
                    aria-label="Decrease quantity"
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    -
                  </button>
                  <span className="text-sm font-bold text-slate-800" aria-live="polite">
                    {quantity}
                  </span>
                  <button 
                    aria-label="Increase quantity"
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
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-center font-bold py-4 px-6 rounded-xl block transition shadow-lg shadow-indigo-100 cursor-pointer active:scale-[0.98]"
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
