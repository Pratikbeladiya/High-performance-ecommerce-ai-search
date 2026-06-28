import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Sparkles, ArrowRight, ShoppingBag } from "lucide-react";

const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: 1 + Math.random() * 2,
  delay: Math.random() * 4,
  dur: 3 + Math.random() * 4,
}));

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}&mode=ai`);
    } else {
      navigate("/catalog");
    }
  };

  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#030712]">
      {/* Deep gradient backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#030712] to-purple-950/30 pointer-events-none" />

      {/* Radial glow center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/4 w-[300px] h-[300px] bg-purple-700/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] h-[250px] bg-cyan-700/8 rounded-full blur-3xl pointer-events-none" />

      {/* Animated SVG particles */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p) => (
          <circle
            key={p.id}
            cx={`${p.x}%`}
            cy={`${p.y}%`}
            r={p.size}
            fill="rgba(139,92,246,0.35)"
            style={{
              animation: `pulse ${p.dur}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}
      </svg>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1.5 mb-8">
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">
            AI-Powered Shopping Experience
          </span>
          <span className="flex w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
          <span className="text-white">Find exactly</span>
          <br />
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            what you need
          </span>
          <br />
          <span className="text-slate-400 text-4xl sm:text-5xl lg:text-6xl font-bold">
            with AI Search
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Describe what you&apos;re looking for in plain English. Our vector-based semantic engine
          understands your intent — not just keywords.
        </p>

        {/* Search form */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-8">
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl opacity-30 group-hover:opacity-60 blur transition duration-500" />
            <div className="relative flex items-center bg-slate-900/90 backdrop-blur-md rounded-2xl border border-slate-700/60 overflow-hidden shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-5 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g. wireless headphones for travel, comfortable shoes for running…"
                className="flex-1 bg-transparent px-4 py-5 text-sm text-slate-200 placeholder:text-slate-500 outline-none"
              />
              <button
                type="submit"
                className="mr-2 px-5 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold rounded-xl transition-all duration-200 flex items-center gap-2 shadow-lg shadow-indigo-900/40 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                AI Search
              </button>
            </div>
          </div>

          {/* Sample queries */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
            <span className="text-xs text-slate-500">Try:</span>
            {[
              "noise-canceling headphones",
              "fitness tracker",
              "coffee maker",
              "leather wallet",
            ].map((sample) => (
              <button
                key={sample}
                type="button"
                onClick={() => {
                  setQuery(sample);
                  navigate(`/catalog?q=${encodeURIComponent(sample)}&mode=ai`);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/50 bg-indigo-500/5 hover:bg-indigo-500/10 px-3 py-1 rounded-full transition-all duration-200 cursor-pointer"
              >
                {sample}
              </button>
            ))}
          </div>
        </form>

        {/* CTA links */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/catalog"
            className="flex items-center gap-2 px-7 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white font-semibold rounded-xl transition-all duration-200 text-sm"
          >
            <ShoppingBag className="w-4 h-4" />
            Browse All Products
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Stats strip */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-10 text-center">
          {[
            { label: "Products", value: "500+" },
            { label: "AI Relevance", value: "98%" },
            { label: "Happy Customers", value: "12k+" },
            { label: "Avg. Delivery", value: "2 days" },
          ].map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-black text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0% { opacity: 0.1; transform: scale(1); }
          100% { opacity: 0.6; transform: scale(1.5); }
        }
      `}</style>
    </section>
  );
}
