import { useState } from 'react';
import Home from './Home';
import ProductListing from './ProductListing';
import ProductDetails from './ProductDetails';
import Search from './Search';
import Cart from './Cart';
import Login from './Login';

export default function App() {
  // Initializing authorization state directly from localStorage to satisfy strict rules
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("user_auth") === "true";
  });

  // Navigation & Core States: Force 'login' view on initial load if user is not authorized
  const [view, setView] = useState(() => {
    const authStatus = localStorage.getItem("user_auth") === "true";
    return authStatus ? 'home' : 'login';
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Shopping Cart State Engine
  const [cart, setCart] = useState([]);

  // Cart Handler: Add Item
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  // Cart Handler: Update Item Quantity
  const updateQuantity = (productId, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.id === productId ? { ...item, quantity: item.quantity + amount } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Cart Handler: Remove Item entirely
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Calculate total badge count for the cart icon
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Handle Logout Action
  const handleLogout = () => {
    localStorage.removeItem("user_auth");
    localStorage.removeItem("user_profile");
    setIsLoggedIn(false);
    setView('login'); // Redirect back to login wall immediately
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50 font-sans text-slate-800 antialiased m-0 p-0 overflow-x-hidden">
      
      {/* GLOBAL NAVBAR */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="w-full max-w-[100vw] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => isLoggedIn && setView('home')} 
            className={`flex items-center gap-2 font-black text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${isLoggedIn ? 'cursor-pointer' : 'cursor-not-allowed'}`}
          >
            <i className="fa-solid fa-bag-shopping text-indigo-600"></i>
            ShopSphere
          </div>

          {/* Core Navigation Links - Hidden completely until authorized */}
          {isLoggedIn && (
            <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
              <button onClick={() => setView('home')} className={`hover:text-indigo-600 transition cursor-pointer ${view === 'home' ? 'text-indigo-600 font-bold' : ''}`}>Home</button>
              <button onClick={() => setView('catalog')} className={`hover:text-indigo-600 transition cursor-pointer ${view === 'catalog' ? 'text-indigo-600 font-bold' : ''}`}>Catalog</button>
              <button onClick={() => { setSearchQuery(''); setView('search'); }} className={`hover:text-indigo-600 transition cursor-pointer ${view === 'search' ? 'text-indigo-600 font-bold' : ''}`}>Search</button>
            </div>
          )}

          {/* Utility Right Actions */}
          <div className="flex items-center gap-4">
            
            {/* Interactive Shopping Cart Icon Counter - Hidden until authorized */}
            {isLoggedIn && (
              <button 
                onClick={() => setView('cart')} 
                className="relative p-2 text-slate-500 hover:text-indigo-600 transition cursor-pointer"
              >
                <i className="fa-solid fa-cart-shopping text-lg"></i>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-scaleIn">
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Auth Button Account Link Switch */}
            {isLoggedIn ? (
              <button 
                onClick={handleLogout} 
                className="text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl transition cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <button 
                onClick={() => setView('login')} 
                className={`text-xs font-semibold px-4 py-2 rounded-xl transition cursor-pointer ${view === 'login' ? 'bg-indigo-600 text-white' : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-600'}`}
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* DYNAMIC VIEW WORKSPACE PANEL */}
      <main className="w-full flex-1 flex flex-col items-center justify-start m-0 p-0">
        {view === 'login' && (
          <div className="w-full min-h-[calc(100vh-64px)] flex items-center justify-center">
            <Login setView={setView} setIsLoggedIn={setIsLoggedIn} />
          </div>
        )}
        
        {/* Guard checks protecting subsequent application view states */}
        {isLoggedIn && view === 'home' && (
          <div className="w-full">
            <Home setView={setView} setSelectedProduct={setSelectedProduct} addToCart={addToCart} />
          </div>
        )}
        
        {isLoggedIn && view === 'catalog' && (
          <div className="w-full">
            <ProductListing setView={setView} setSelectedProduct={setSelectedProduct} addToCart={addToCart} />
          </div>
        )}
        
        {isLoggedIn && view === 'details' && (
          <div className="w-full">
            <ProductDetails setView={setView} product={selectedProduct} setSelectedProduct={setSelectedProduct} addToCart={addToCart} />
          </div>
        )}
        
        {isLoggedIn && view === 'search' && (
          <div className="w-full">
            <Search defaultQuery={searchQuery} setView={setView} setSelectedProduct={setSelectedProduct} addToCart={addToCart} />
          </div>
        )}
        
        {isLoggedIn && view === 'cart' && (
          <div className="w-full">
            <Cart cartItems={cart} setView={setView} updateQuantity={updateQuantity} removeFromCart={removeFromCart} />
          </div>
        )}
      </main>

      {/* FULL WIDTH SIMPLE COMPACT FOOTER */}
      <footer className="w-full bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 mt-auto">
        <p>&copy; {new Date().getFullYear()} ShopSphere Market Ecosystem. Powered by high-performance React client engine.</p>
      </footer>

    </div>
  );
}