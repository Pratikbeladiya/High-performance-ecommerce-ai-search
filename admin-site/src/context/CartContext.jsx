import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useAuth } from "./AuthContext";

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
  const { user, token } = useAuth();
  const [cart, setCart] = useState(loadCart);
  const [cartOpen, setCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch cart from API for authenticated users
  const fetchCartFromAPI = useCallback(async () => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const res = await fetch("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const cartData = await res.json();
        // Transform API response to match our cart structure
        const formattedCart = (cartData.items || []).map((item) => ({
          product: {
            ...item.product,
            id: item.product._id,
          },
          quantity: item.quantity,
        }));
        setCart(formattedCart);
        // Don't save to localStorage for authenticated users - API is source of truth
      }
    } catch (err) {
      console.error("Error fetching cart from API:", err);
      // Fall back to localStorage on error
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  // Fetch cart when user logs in
  useEffect(() => {
    if (token && user) {
      fetchCartFromAPI();
    }
  }, [token, user, fetchCartFromAPI]);

  // Persist cart to localStorage only when not authenticated
  useEffect(() => {
    if (!token) {
      saveCart(cart);
    }
  }, [cart, token]);

  const addToCart = useCallback(
    async (product, qty = 1) => {
      if (token) {
        // Use API for authenticated users
        try {
          const res = await fetch("http://localhost:5000/api/cart/items", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              productId: product._id || product.id,
              quantity: qty,
            }),
          });

          if (res.ok) {
            const cartData = await res.json();
            const formattedCart = (cartData.items || []).map((item) => ({
              product: {
                ...item.product,
                id: item.product._id,
              },
              quantity: item.quantity,
            }));
            setCart(formattedCart);
            setCartOpen(true);
          }
        } catch (err) {
          console.error("Error adding to cart via API:", err);
        }
      } else {
        // Use localStorage for guest users
        setCart((prev) => {
          const existing = prev.find((item) => item.product.id === product.id);
          if (existing) {
            return prev.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + qty }
                : item
            );
          }
          return [...prev, { product, quantity: qty }];
        });
        setCartOpen(true);
      }
    },
    [token]
  );

  const removeFromCart = useCallback(
    async (productId) => {
      if (token) {
        // Use API for authenticated users
        try {
          const res = await fetch(
            `http://localhost:5000/api/cart/items/${productId}`,
            {
              method: "DELETE",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (res.ok) {
            const cartData = await res.json();
            const formattedCart = (cartData.items || []).map((item) => ({
              product: {
                ...item.product,
                id: item.product._id,
              },
              quantity: item.quantity,
            }));
            setCart(formattedCart);
          }
        } catch (err) {
          console.error("Error removing from cart via API:", err);
        }
      } else {
        // Use localStorage for guest users
        setCart((prev) => prev.filter((item) => item.product.id !== productId));
      }
    },
    [token]
  );

  const updateQty = useCallback(
    async (productId, quantity) => {
      if (quantity <= 0) {
        removeFromCart(productId);
        return;
      }

      if (token) {
        // Use API for authenticated users
        try {
          const res = await fetch(
            `http://localhost:5000/api/cart/items/${productId}`,
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ quantity }),
            }
          );

          if (res.ok) {
            const cartData = await res.json();
            const formattedCart = (cartData.items || []).map((item) => ({
              product: {
                ...item.product,
                id: item.product._id,
              },
              quantity: item.quantity,
            }));
            setCart(formattedCart);
          }
        } catch (err) {
          console.error("Error updating cart quantity via API:", err);
        }
      } else {
        // Use localStorage for guest users
        setCart((prev) =>
          prev.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        );
      }
    },
    [token, removeFromCart]
  );

  // Legacy alias for updateQuantity
  const updateQuantity = updateQty;

  const clearCart = useCallback(async () => {
    if (token) {
      // Use API for authenticated users
      try {
        await fetch("http://localhost:5000/api/cart", {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart([]);
      } catch (err) {
        console.error("Error clearing cart via API:", err);
      }
    } else {
      // Use localStorage for guest users
      setCart([]);
      localStorage.setItem(CART_KEY, "[]");
    }
  }, [token]);

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
    (productId) => cart.some((item) => item.product.id === productId),
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
        isLoading,
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
