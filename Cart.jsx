import React from 'react';

export default function Cart({ cart, updateQuantity, removeFromCart, setView }) {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-8">Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center shadow-sm">
          <i className="fa-solid fa-basket-shopping text-slate-300 text-5xl mb-4"></i>
          <p className="text-slate-500 font-medium mb-4">Your shopping cart is currently completely empty.</p>
          <button onClick={() => setView('shop')} className="bg-indigo-600 text-white font-semibold px-6 py-2 rounded-xl text-sm transition hover:bg-indigo-700">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Cart Item Cards Block Column */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 sm:p-6 flex items-center gap-4 sm:gap-6 relative">
                <div className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-lg overflow-hidden flex-shrink-0 border border-slate-200">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-slate-800 text-base sm:text-lg line-clamp-1">{item.name}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Category: {item.category}</p>
                    <p className="text-sm font-extrabold text-indigo-600 mt-2">${item.price.toFixed(2)}</p>
                  </div>
                  
                  {/* Item Quantities Controller Container */}
                  <div className="flex items-center gap-6 self-start sm:self-auto">
                    <div className="bg-slate-100 border border-slate-200 rounded-lg flex items-center justify-between p-1 w-28">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-500 hover:bg-white rounded transition"
                      >
                        -
                      </button>
                      <span className="text-xs font-bold text-slate-800">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-slate-500 hover:bg-white rounded transition"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-400 hover:text-rose-500 text-sm transition cursor-pointer"
                    >
                      <i className="fa-regular fa-trash-can"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary Sidebar Breakdown Panel */}
          <aside className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-4 mb-4">Order Summary</h3>
            
            <div className="space-y-3 text-sm font-medium mb-6">
              <div className="flex justify-between text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-800">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Shipping</span>
                <span className="text-emerald-600 font-semibold">Free</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Estimated Tax</span>
                <span className="text-slate-800">$0.00</span>
              </div>
              <hr className="border-slate-100 my-2" />
              <div className="flex justify-between text-base font-extrabold text-slate-900">
                <span>Total Amount</span>
                <span className="text-indigo-600 text-lg">${subtotal.toFixed(2)}</span>
              </div>
            </div>

            <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 px-4 rounded-xl text-center transition block cursor-pointer">
              Proceed to Checkout
            </button>
            <button onClick={() => setView('shop')} className="w-full text-center text-xs font-bold text-slate-400 hover:text-indigo-600 mt-4 block transition cursor-pointer">
              Continue Shopping
            </button>
          </aside>
        </div>
      )}
    </main>
  );
}