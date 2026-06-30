import { createContext, useContext, useState, useEffect, useCallback } from "react";

const CartContext = createContext(null);

const CART_KEY = "user_cart";

function loadCart() {
  try {
    const stored = localStorage.getItem(CART_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return [];
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch { /* ignore */ }
}

/**
 * Cart items structure: { product: <productObj>, quantity: <number> }
 */
export function CartProvider({ children }) {
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);

  // Persist cart to localStorage on every change
  useEffect(() => {
    saveCart(cart);
  }, [cart]);

  const addToCart = useCallback((product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { product, quantity: qty }];
    });
    setCartOpen(true);
  }, []);

  const removeFromCart = useCallback(productId => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQty = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      setCart(prev => prev.filter(item => item.product.id !== productId));
    } else {
      setCart(prev =>
        prev.map(item => item.product.id === productId ? { ...item, quantity } : item)
      );
    }
  }, []);

  // Legacy alias for updateQuantity
  const updateQuantity = updateQty;

  const clearCart = useCallback(() => {
    setCart([]);
    localStorage.setItem(CART_KEY, "[]");
  }, []);

  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  // Legacy alias
  const cartCount = count;

  const total = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  // Legacy alias
  const cartTotal = total;

  const isInCart = useCallback(
    productId => cart.some(item => item.product.id === productId),
    [cart]
  );

  return (
    <CartContext.Provider
      value={{
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        removeFromCart,
        updateQty,
        updateQuantity,
        clearCart,
        isInCart,
        count,
        cartCount,
        total,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

export default CartContext;
