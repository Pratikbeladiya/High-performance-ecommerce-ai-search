import { useState } from 'react';
import Home from './Home';
import ProductListing from './ProductListing';
import ProductDetails from './ProductDetails';
import Search from './Search';
import Cart from './Cart';

export default function App() {
  const [view, setView] = useState('home'); // Accepts: 'home' | 'shop' | 'details' | 'search' | 'cart'
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  // Global State Cart Actions
  const addToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existing = prevCart.find(item => item.id === product.id);
      if (existing) {
        return prevCart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + qty } : item);
      }
      return [...prevCart, { ...product, quantity: qty }];
    });
  };

  const updateQuantity = (id, targetQuantity) => {
    if (targetQuantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart(prev => prev.map(item => item.id === id ? { ...item, quantity: targetQuantity } : item));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleSearchSubmit = (query) => {
    setSearchQuery(query);
    setView('search');
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Global Navigation Wrapper */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-8">
              <button onClick={() => setView('home')} className="text-xl font-bold text-indigo-600 tracking-tight flex items-center gap-2 cursor-pointer">
                <i className="fa-solid fa-bag-shopping"></i> ShopSphere
              </button>
              <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
                <button onClick={() => setView('home')} className={`cursor-pointer ${view === 'home' ? 'text-indigo-600' : 'hover:text-indigo-600'}`}>Home</button>
                <button onClick={() => setView('shop')} className={`cursor-pointer ${view === 'shop' ? 'text-indigo-600' : 'hover:text-indigo-600'}`}>Shop</button>
                <button onClick={() => setView('search')} className={`cursor-pointer ${view === 'search' ? 'text-indigo-600' : 'hover:text-indigo-600'}`}>Search</button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button onClick={() => setView('cart')} className="relative p-2 text-slate-600 hover:text-indigo-600 transition cursor-pointer">
                <i className="fa-solid fa-cart-shopping text-xl"></i>
                {totalCartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-indigo-600 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dynamic Render Pipeline */}
      <div className="flex-grow flex flex-col">
        {view === 'home' && (
          <Home 
            setView={setView} 
            setSelectedProduct={setSelectedProduct} 
            handleSearchSubmit={handleSearchSubmit} 
            addToCart={addToCart} 
          />
        )}
        {view === 'shop' && (
          <ProductListing 
            setView={setView} 
            setSelectedProduct={setSelectedProduct} 
            addToCart={addToCart} 
          />
        )}
        {view === 'details' && (
          <ProductDetails 
            product={selectedProduct} 
            setView={setView} 
            addToCart={addToCart} 
          />
        )}
        {view === 'search' && (
          <Search 
            defaultQuery={searchQuery} 
            setView={setView} 
            setSelectedProduct={setSelectedProduct} 
            addToCart={addToCart} 
          />
        )}
        {view === 'cart' && (
          <Cart 
            cart={cart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            setView={setView} 
          />
        )}
      </div>

      {/* Global Footer Layout */}
      <footer className="bg-slate-900 text-slate-400 text-sm mt-auto border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-xs text-slate-500">
          &copy; 2026 ShopSphere Inc. Powered via modular React component structures.
        </div>
      </footer>
    </div>
  );
}




































