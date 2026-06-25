import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Zap, Package, Sparkles, ArrowRight, ShoppingBag,
  Star, Cpu, Shield, Truck, RotateCcw, ChevronRight,
  TrendingUp, Grid3X3
} from "lucide-react";
import HeroSection from "../../components/user/HeroSection";
import ProductCard from "../../components/user/ProductCard";
import { useCart } from "../../context/CartContext";
import { getPublicProducts } from "../../utils/userHelpers";
import { initialProducts } from "../../data/products";

const CATEGORY_CONFIG = [
  {
    key: "Electronics",
    icon: Zap,
    gradient: "from-indigo-500 to-blue-600",
    glow: "shadow-indigo-500/20",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20",
    desc: "Gadgets, audio, wearables & more"
  },
  {
    key: "Apparel",
    icon: ShoppingBag,
    gradient: "from-purple-500 to-pink-600",
    glow: "shadow-purple-500/20",
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    desc: "Fashion, shoes, accessories & bags"
  },
  {
    key: "Home & Living",
    icon: Package,
    gradient: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    desc: "Decor, kitchen, plants & lifestyle"
  }
];

export default function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState({});

  useEffect(() => {
    let loaded = getPublicProducts();
    if (!loaded || loaded.length === 0) {
      loaded = initialProducts;
    }
    setProducts(loaded);
    const counts = {};
    loaded.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    setCategoryCounts(counts);
  }, []);

  const trending = products.slice(0, 8);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <HeroSection />

      {/* Categories Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Grid3X3 className="w-3.5 h-3.5" />
            Shop by Category
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
            Find What You <span className="gradient-text">Love</span>
          </h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">
            Explore our curated collections across every lifestyle
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {CATEGORY_CONFIG.map(({ key, icon: Icon, gradient, glow, bg, border, desc }) => (
            <Link
              key={key}
              to={`/catalog?category=${encodeURIComponent(key)}`}
              className={`group relative overflow-hidden rounded-2xl border ${border} ${bg} p-8 transition-all duration-300 hover:shadow-2xl hover:${glow} hover:-translate-y-1`}
            >
              {/* Background gradient blob */}
              <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />

              <div className={`inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} items-center justify-center mb-5 shadow-lg shadow-indigo-500/20`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1">{key}</h3>
              <p className="text-slate-400 text-sm mb-4">{desc}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">
                  {categoryCounts[key] || 0} products
                </span>
                <div className="flex items-center gap-1 text-sm font-semibold text-indigo-400 group-hover:gap-2 transition-all">
                  Browse <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
              <TrendingUp className="w-3.5 h-3.5" />
              Trending Now
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white">
              Top <span className="gradient-text">Picks</span> This Week
            </h2>
          </div>
          <Link
            to="/catalog"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-sm font-semibold transition-all"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {trending.length === 0 ? (
          <div className="text-center py-20">
            <Package className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500">No products available yet. Add some from the admin panel!</p>
            <Link to="/admin/products" className="mt-4 inline-block text-indigo-400 hover:text-indigo-300 text-sm">
              Go to Admin →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trending.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* AI Showcase Banner */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-purple-950 border border-indigo-800/40 p-8 md:p-12">
          {/* Background orbs */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-5">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                AI-Powered Search
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 leading-tight">
                Search Smarter with{" "}
                <span className="gradient-text-ai">Vector AI</span>
              </h2>
              <p className="text-slate-300 text-base leading-relaxed mb-6 max-w-lg">
                Our semantic search understands what you <em>mean</em>, not just what you type.
                Try <strong className="text-indigo-300">"something to listen to music while jogging"</strong> and
                discover AI-matched results beyond simple keyword matching.
              </p>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => navigate("/catalog?mode=ai&q=noise+canceling+headphones")}
                  className="btn-gradient px-6 py-3 rounded-xl text-sm flex items-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  Try AI Search
                  <ArrowRight className="w-4 h-4" />
                </button>
                <Link
                  to="/catalog"
                  className="px-6 py-3 rounded-xl bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-sm font-semibold transition-all"
                >
                  Browse All Products
                </Link>
              </div>
            </div>

            {/* AI Stats */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto md:min-w-[260px]">
              {[
                { label: "Faster Discovery", value: "10x", color: "text-indigo-400" },
                { label: "Accuracy Rate", value: "97%", color: "text-cyan-400" },
                { label: "Products Indexed", value: `${products.length}+`, color: "text-purple-400" },
                { label: "Happy Shoppers", value: "50K+", color: "text-emerald-400" },
              ].map(({ label, value, color }) => (
                <div key={label} className="text-center p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50">
                  <div className={`text-2xl font-black ${color} mb-1`}>{value}</div>
                  <div className="text-xs text-slate-500 font-medium">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Secure & Safe",
              desc: "Every transaction is protected with 256-bit SSL encryption and fraud detection.",
              gradient: "from-indigo-500 to-blue-600",
              color: "indigo"
            },
            {
              icon: Truck,
              title: "Fast Delivery",
              desc: "Free shipping on orders over $50. Most items arrive within 2–4 business days.",
              gradient: "from-emerald-500 to-teal-600",
              color: "emerald"
            },
            {
              icon: RotateCcw,
              title: "Easy Returns",
              desc: "Not happy? Return any item within 30 days for a full refund, no questions asked.",
              gradient: "from-purple-500 to-pink-600",
              color: "purple"
            }
          ].map(({ icon: Icon, title, desc, gradient, color }) => (
            <div key={title}
              className="group p-6 rounded-2xl bg-slate-900/50 border border-slate-800/60 hover:border-slate-700 hover:-translate-y-1 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-indigo-900/60 border border-indigo-800/30 p-10">
          <div className="absolute inset-0 hero-grid opacity-30" />
          <div className="relative z-10">
            <Star className="w-8 h-8 text-amber-400 mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-black text-white mb-3">
              Stay in the Loop
            </h2>
            <p className="text-slate-400 mb-6 text-sm max-w-md mx-auto">
              Get early access to new drops, exclusive deals, and AI-curated picks delivered to your inbox.
            </p>
            <div className="flex gap-3 max-w-sm mx-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all"
              />
              <button className="btn-gradient px-5 py-3 rounded-xl text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
