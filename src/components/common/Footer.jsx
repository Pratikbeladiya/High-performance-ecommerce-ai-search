
export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-4 px-6 bg-slate-950/20 border-t border-slate-900/60 mt-auto text-center sm:text-left">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-slate-500">
          &copy; {currentYear} VectorCommerce Engine. All rights reserved.
        </p>
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            <span>AI Vector Engine Online</span>
          </div>
          <span className="hidden sm:inline text-slate-800">|</span>
          <span className="hover:text-slate-400 cursor-pointer">Documentation</span>
          <span className="hidden sm:inline text-slate-800">|</span>
          <span className="hover:text-slate-400 cursor-pointer">API Status</span>
        </div>
      </div>
    </footer>
  );
}
