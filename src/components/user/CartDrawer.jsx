import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  Package,
} from "lucide-react";
import { useCart } from "../../context/CartContext";

export default function CartDrawer() {
  const navigate = useNavigate();
  const { cartOpen, setCartOpen, cart, updateQuantity, removeFromCart } =
    useCart();

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (cartOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  const subtotal = cart.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );
  const shipping = subtotal >= 50 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    setCartOpen(false);
    navigate("/checkout");
  };

  const handleContinueShopping = () => {
    setCartOpen(false);
    navigate("/catalog");
  };

  return (
    <>
      {/* ── Backdrop ─────────────────────────────────────────────── */}
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          cartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* ── Drawer Panel ─────────────────────────────────────────── */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full max-w-md flex flex-col
          bg-gradient-to-b from-slate-900/95 to-slate-950/98
          border-l border-white/10 shadow-2xl
          backdrop-blur-xl
          transform transition-transform duration-300 ease-in-out
          ${cartOpen ? "translate-x-0" : "translate-x-full"}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-white/5 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 ring-1 ring-indigo-500/30">
              <ShoppingCart className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Your Cart
              </h2>
              <p className="text-xs text-slate-400">
                {cart.length === 0
                  ? "No items"
                  : `${cart.reduce((s, i) => s + i.quantity, 0)} item${
                      cart.reduce((s, i) => s + i.quantity, 0) !== 1
                        ? "s"
                        : ""
                    }`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-200 active:scale-95"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* ── Body ───────────────────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {cart.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center h-full py-20 text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-indigo-500/20 blur-2xl scale-150" />
                <div className="relative p-6 rounded-2xl bg-white/5 ring-1 ring-white/10">
                  <ShoppingCart className="w-14 h-14 text-slate-500" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-slate-400 max-w-xs mb-8 leading-relaxed">
                Looks like you haven&apos;t added anything yet. Explore our catalog
                and find something you love!
              </p>
              <button
                onClick={handleContinueShopping}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all duration-200 active:scale-95"
              >
                <Package className="w-4 h-4" />
                Browse Products
              </button>
            </div>
          ) : (
            /* Cart Items */
            cart.map((item) => (
              <div
                key={item.product.id}
                className="group flex gap-4 p-4 rounded-2xl bg-white/5 ring-1 ring-white/10 hover:ring-indigo-500/30 hover:bg-white/8 transition-all duration-200"
              >
                {/* Image */}
                <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-slate-800 ring-1 ring-white/10">
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-white truncate leading-snug mb-1">
                    {item.product.name}
                  </h4>
                  {item.product.category && (
                    <span className="inline-block text-[10px] font-medium text-indigo-400 bg-indigo-500/15 px-2 py-0.5 rounded-full mb-2">
                      {item.product.category}
                    </span>
                  )}
                  <p className="text-base font-bold text-indigo-300">
                    ${((item.product?.price || 0) * item.quantity).toFixed(2)}
                  </p>
                  <p className="text-xs text-slate-500">
                    ${(item.product?.price || 0).toFixed(2)} each
                  </p>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-end justify-between gap-2">
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/15 transition-all duration-200 opacity-0 group-hover:opacity-100"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-1 bg-white/10 rounded-xl p-1 ring-1 ring-white/10">
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, Math.max(0, item.quantity - 1))
                      }
                      className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm font-bold text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="p-1 rounded-lg text-slate-300 hover:text-white hover:bg-white/15 transition-all duration-150 active:scale-90"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Footer ─────────────────────────────────────────────── */}
        {cart.length > 0 && (
          <div className="flex-shrink-0 border-t border-white/10 bg-white/5 backdrop-blur-sm px-6 py-5 space-y-4">
            {/* Order Summary */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-white font-medium">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Estimated Shipping</span>
                <span
                  className={`font-medium ${
                    shipping === 0 ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-slate-500 bg-amber-500/10 text-amber-400 rounded-lg px-3 py-2">
                  Add ${(50 - subtotal).toFixed(2)} more for free shipping!
                </p>
              )}
              <div className="border-t border-white/10 pt-2 flex justify-between">
                <span className="text-base font-semibold text-white">
                  Total
                </span>
                <span className="text-xl font-bold text-indigo-300">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Actions */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl
                bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
                text-white font-semibold text-sm tracking-wide shadow-lg shadow-indigo-500/25
                transition-all duration-200 active:scale-[0.98] hover:shadow-indigo-500/40 hover:shadow-xl"
            >
              Proceed to Checkout
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleContinueShopping}
              className="w-full text-sm text-slate-400 hover:text-indigo-300 transition-colors duration-200 py-1"
            >
              ← Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
