import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  Package,
  Tag,
  CheckCircle2,
  AlertCircle,
  Minus,
  Plus,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

function RelatedCard({ product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all duration-300 hover:-translate-y-1"
    >
      <div className="aspect-square bg-slate-700/40 overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-600" />
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-slate-200 text-sm font-medium truncate group-hover:text-indigo-400 transition-colors">
          {product.name}
        </p>
        <p className="text-indigo-400 font-bold mt-1">${parseFloat(product.price).toFixed(2)}</p>
      </div>
    </Link>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    try {
      const all = JSON.parse(localStorage.getItem('admin_products') || '[]');
      const found = all.find((p) => String(p.id) === String(id));
      setProduct(found || null);
      if (found) {
        const rel = all
          .filter((p) => p.category === found.category && String(p.id) !== String(id))
          .slice(0, 4);
        setRelated(rel);
      }
    } catch {
      setProduct(null);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const decrementQty = () => setQuantity((q) => Math.max(1, q - 1));
  const incrementQty = () => {
    const max = product?.stock ?? 99;
    setQuantity((q) => Math.min(max, q + 1));
  };

  if (product === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-6 py-20">
        <div className="w-20 h-20 rounded-full bg-slate-800 flex items-center justify-center">
          <Package className="w-10 h-10 text-slate-500" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-200 mb-2">Product Not Found</h2>
          <p className="text-slate-400">
            This product doesn't exist or may have been removed.
          </p>
        </div>
        <Link
          to="/catalog"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Catalog
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0 && product.status !== 'Out of Stock';
  const images = product.images?.length ? product.images : product.image ? [product.image] : [];
  const rating = product.rating || (4 + Math.random()).toFixed(1);
  const reviewCount = product.reviewCount || Math.floor(Math.random() * 200 + 20);
  const tags = Array.isArray(product.tags) ? product.tags : product.tags ? product.tags.split(',').map(t => t.trim()) : [];

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <Link
        to="/catalog"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-sm mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Back to Catalog
      </Link>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Left: Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden">
            {images[activeImage] ? (
              <img
                src={images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                <Package className="w-20 h-20 text-slate-600" />
                <p className="text-slate-500 text-sm">No image available</p>
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i
                      ? 'border-indigo-500'
                      : 'border-slate-700/50 hover:border-slate-500'
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info */}
        <div className="flex flex-col gap-5">
          {/* Category Badge */}
          {product.category && (
            <span className="inline-flex items-center gap-1.5 w-fit px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              <Tag className="w-3 h-3" />
              {product.category}
            </span>
          )}

          {/* Product Name */}
          <h1 className="text-3xl md:text-4xl font-bold text-slate-100 leading-tight">
            {product.name}
          </h1>

          {/* Rating */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Math.round(rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-300 text-sm font-medium">{rating}</span>
            <span className="text-slate-500 text-sm">({reviewCount} reviews)</span>
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-4xl font-black text-white">
              ${parseFloat(product.price || 0).toFixed(2)}
            </span>
            {product.originalPrice && parseFloat(product.originalPrice) > parseFloat(product.price) && (
              <span className="text-slate-500 line-through text-xl mb-1">
                ${parseFloat(product.originalPrice).toFixed(2)}
              </span>
            )}
          </div>

          {/* Stock Badge */}
          <div>
            {inStock ? (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm font-medium">
                <CheckCircle2 className="w-4 h-4" />
                In Stock
                {product.stock && (
                  <span className="text-emerald-500/70">({product.stock} left)</span>
                )}
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm font-medium">
                <AlertCircle className="w-4 h-4" />
                Out of Stock
              </span>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <div className="border-t border-slate-700/50 pt-4">
              <p className="text-slate-400 leading-relaxed">{product.description}</p>
            </div>
          )}

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 bg-slate-700/50 border border-slate-600/50 rounded-full text-slate-300 text-xs"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Quantity Selector + Add to Cart */}
          {inStock && (
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              {/* Quantity */}
              <div className="flex items-center gap-0 bg-slate-800 border border-slate-700 rounded-xl overflow-hidden">
                <button
                  onClick={decrementQty}
                  disabled={quantity <= 1}
                  className="px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-5 py-3 text-white font-semibold min-w-[48px] text-center select-none">
                  {quantity}
                </span>
                <button
                  onClick={incrementQty}
                  disabled={quantity >= (product.stock ?? 99)}
                  className="px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className={`flex-1 flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl font-semibold text-base transition-all duration-300 ${
                  added
                    ? 'bg-emerald-600 text-white scale-95'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-lg hover:shadow-indigo-500/25 hover:-translate-y-0.5'
                }`}
              >
                {added ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Added to Cart!
                  </>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Add to Cart
                  </>
                )}
              </button>
            </div>
          )}

          {/* Product Meta */}
          <div className="mt-4 p-4 bg-slate-800/30 border border-slate-700/30 rounded-xl space-y-2.5">
            {product.sku && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">SKU</span>
                <span className="text-slate-300 font-mono">{product.sku}</span>
              </div>
            )}
            {product.brand && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Brand</span>
                <span className="text-slate-300">{product.brand}</span>
              </div>
            )}
            {product.category && (
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Category</span>
                <span className="text-slate-300">{product.category}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-6 bg-indigo-500 rounded-full" />
            <h2 className="text-xl font-bold text-slate-200">Related Products</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map((p) => (
              <RelatedCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
