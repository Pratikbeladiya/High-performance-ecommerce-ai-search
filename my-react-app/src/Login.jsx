import { useState, useEffect } from "react";

export default function Login({ setView, setIsLoggedIn }) {
  const [email, setEmail] = useState("user@shopsphere.com");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If the customer is already logged in, send them straight home
    const isAuth = localStorage.getItem("user_auth");
    if (isAuth === "true") {
      setView("home");
    }
  }, [setView]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulated network authorization latency
    setTimeout(() => {
      if (email.trim() === "" || password.trim() === "") {
        setError("Please fill in all input fields.");
        setIsLoading(false);
        return;
      }

      // Customer account credentials check
      if (email === "user@shopsphere.com" && password === "password123") {
        localStorage.setItem("user_auth", "true");
        localStorage.setItem("user_profile", JSON.stringify({ email, name: "Alex Customer" }));
        
        setIsLoggedIn(true);
        setIsLoading(false);
        setView("home"); // Redirect back to store dashboard homepage
      } else {
        setError("Invalid email or password. Hint: user@shopsphere.com / password123");
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden font-sans w-full">
      {/* Background radial glowing ambient blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />

      {/* Main Glassmorphic Login Container Card */}
      <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800 shadow-2xl mx-4">
        
        {/* Header Logo & Branding */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 mb-4">
            <i className="fa-solid fa-bag-shopping text-white text-xl"></i>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mb-1">
            ShopSphere Account
          </h1>
          <p className="text-sm text-slate-400 text-center">
            Sign in to check out items and view tracking options
          </p>
        </div>

        {/* Input Submission Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3.5 text-xs text-rose-400 bg-rose-950/30 border border-rose-900/50 rounded-lg">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              EMAIL ADDRESS
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-envelope absolute left-3.5 text-slate-500 text-sm"></i>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="user@shopsphere.com"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition-all text-sm"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 tracking-wide block">
              PASSWORD
            </label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-lock absolute left-3.5 text-slate-500 text-sm"></i>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/25 transition-all text-sm"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all shadow-md shadow-indigo-600/10 hover:shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Sign In
                <i className="fa-solid fa-arrow-right transition-transform group-hover:translate-x-0.5 text-xs"></i>
              </>
            )}
          </button>
        </form>

        {/* Guest access details tip */}
        <div className="mt-8 pt-6 border-t border-slate-950 text-center">
          <p className="text-xs text-slate-500">
            Testing credentials:{" "}
            <span className="text-slate-400 font-mono">user@shopsphere.com</span> /{" "}
            <span className="text-slate-400 font-mono">password123</span>
          </p>
          <button 
            onClick={() => setView('home')} 
            className="text-xs text-indigo-400 hover:underline mt-3 block mx-auto cursor-pointer"
          >
            Continue as Guest Vendor
          </button>
        </div>
      </div>
    </div>
  );
}