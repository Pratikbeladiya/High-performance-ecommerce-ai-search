import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart, Star, Eye, Check, Zap, Package } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatPrice } from "../../utils/userHelpers";

/**
 * ProductCard — used in both Home (trending) and Catalog pages.
 * Props:
 *   product        — product object from localStorage
 *   aiScore        — optional number 0-100 (AI relevance), shown as badge
 *   showAIScore    — boolean, whether to display the AI score overlay
 */
export default function ProductCard({ product, aiScore, showAIScore = false }) {
  const { addToCart, isInCart } = useCart();
  const [added, setAdded] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!product) return null;

  const inCart = isInCart(product.id);
  const isOutOfStock = product.stock === 0 || product.status === "Out of Stock";
  const isLowStock = !isOutOfStock && (product.stock <= 5 || product.status === "Low Stock");

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock || inCart) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // AI relevance color
  const aiScoreColor =
    aiScore >= 70
      ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
      : aiScore >= 40
      ? "text-cyan-400 bg-cyan-500/10 border-cyan-500/30"
      : "text-slate-400 bg-slate-700/30 border-slate-700/40";

  // Stock badge
  const stockBadge = isOutOfStock
    ? { label: "Out of Stock", cls: "bg-rose-500/10 text-rose-400 border-rose-500/25" }
    : isLowStock
    ? { label: `Low Stock · ${product.stock} left`, cls: "bg-amber-500/10 text-amber-400 border-amber-500/25" }
    : null;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group relative flex flex-col bg-slate-900/50 backdrop-blur-sm border border-slate-800/60 rounded-2xl overflow-hidden hover:border-indigo-500/40 hover:shadow-xl hover:shadow-indigo-950/30 transition-all duration-300"
    >
      {/* Image container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-800/40">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-600" />
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {/* Category pill */}
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm border border-slate-700/60 text-slate-300">
          {product.category}
        </span>

        {/* AI Score badge */}
        {showAIScore && typeof aiScore === "number" && (
          <div
            className={`absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full border text-[10px] font-bold backdrop-blur-sm ${aiScoreColor}`}
          >
            <Zap className="w-3 h-3" />
            {aiScore}% match
          </div>
        )}

        {/* Hover quick-add overlay */}
        <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg transition-all duration-200 cursor-pointer transform translate-y-2 group-hover:translate-y-0 ${
              isOutOfStock
                ? "bg-slate-700/80 text-slate-400 cursor-not-allowed"
                : added || inCart
                ? "bg-emerald-600 text-white"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-900/50"
            }`}
          >
            {added || inCart ? (
              <>
                <Check className="w-4 h-4" />
                {inCart && !added ? "In Cart" : "Added!"}
              </>
            ) : isOutOfStock ? (
              <>
                <Package className="w-4 h-4" />
                Out of Stock
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product info */}
      <div className="flex flex-col flex-1 p-4 gap-2.5">
        {/* Name */}
        <h3 className="text-sm font-bold text-slate-100 leading-snug line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed flex-1">
          {product.description}
        </p>

        {/* Tags */}
        {Array.isArray(product.tags) && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Stock badge */}
        {stockBadge && (
          <span
            className={`self-start text-[10px] font-semibold px-2 py-0.5 rounded-full border ${stockBadge.cls}`}
          >
            {stockBadge.label}
          </span>
        )}

        {/* Price + action row */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-800/60">
          <div>
            <span className="text-lg font-black text-white">
              {formatPrice(product.price)}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            aria-label={isOutOfStock ? "Out of stock" : "Add to cart"}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
              isOutOfStock
                ? "bg-slate-800/60 text-slate-500 cursor-not-allowed"
                : added || inCart
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-500/30"
                : "bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 hover:text-white border border-indigo-500/30"
            }`}
          >
            {added ? (
              <Check className="w-3.5 h-3.5" />
            ) : inCart ? (
              <Check className="w-3.5 h-3.5" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5" />
            )}
            {isOutOfStock ? "Unavailable" : added ? "Added" : inCart ? "In Cart" : "Add"}
          </button>
        </div>
      </div>

      {/* AI score bar at bottom if showing */}
      {showAIScore && typeof aiScore === "number" && aiScore > 0 && (
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-wide">
              AI Relevance
            </span>
            <span className="text-[10px] font-bold text-cyan-400">{aiScore}%</span>
          </div>
          <div className="h-1 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${aiScore}%` }}
            />
          </div>
        </div>
      )}
    </Link>
  );
}
