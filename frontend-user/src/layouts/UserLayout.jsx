import { useState, useEffect, useRef } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Zap, ChevronDown, Heart, Package, Home, Grid3X3, Star, ArrowRight, Mail, Phone, MapPin, Shield, Truck, RotateCcw, Headphones, ExternalLink } from 'lucide-react';
const Twitter = ExternalLink;
const Instagram = ExternalLink;
const Facebook = ExternalLink;
const Youtube = ExternalLink;
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/user/CartDrawer';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/user/AuthModal';

function UserNavbar() {
  const { count, cartOpen, setCartOpen } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/catalog', label: 'Shop', icon: Grid3X3 },
    { to: '/orders', label: 'Orders', icon: Package },
    { to: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-slate-950/95 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-black/30' : 'bg-transparent'
      }`}>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-between h-16 md:h-20'>
            {/* Logo */}
            <Link to='/' className='flex items-center gap-2.5 group'>
              <div className='relative w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/60 transition-all'>
                <Zap className='w-5 h-5 text-white' />
              </div>
              <div>
                <span className='text-lg font-black tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent'>Vector</span>
                <span className='text-lg font-black tracking-tight bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>Shop</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className='hidden md:flex items-center gap-1'>
              {navLinks.map(({ to, label }) => (
                <Link key={to} to={to}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === to
                      ? 'text-white bg-indigo-600/20 border border-indigo-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >{label}</Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className='flex items-center gap-2'>
              {/* Search */}
              <button onClick={() => setSearchOpen(!searchOpen)}
                className='p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all'>
                <Search className='w-5 h-5' />
              </button>

              {/* Cart */}
              <button onClick={() => setCartOpen(true)}
                className='relative p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all'>
                <ShoppingCart className='w-5 h-5' />
                {count > 0 && (
                  <span className='absolute -top-0.5 -right-0.5 w-5 h-5 bg-indigo-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-bounce'>{count > 9 ? '9+' : count}</span>
                )}
              </button>

              {/* Profile */}
              {isAuthenticated ? (
                <div ref={profileMenuRef} className='relative hidden sm:block'>
                  <button
                    onClick={() => setProfileMenuOpen(prev => !prev)}
                    className='flex items-center gap-1.5 p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all'
                  >
                    <User className='w-5 h-5' />
                    <span className='text-xs font-semibold max-w-[80px] truncate hidden md:inline'>{user.name}</span>
                    <ChevronDown className={`w-3.5 h-3.5 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {profileMenuOpen && (
                    <div className='absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-2xl z-50'>
                      <Link to='/profile' onClick={() => setProfileMenuOpen(false)} className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors'>
                        <User className='w-4 h-4' /> My Profile
                      </Link>
                      <Link to='/orders' onClick={() => setProfileMenuOpen(false)} className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors'>
                        <Package className='w-4 h-4' /> My Orders
                      </Link>
                      {user.role === 'admin' && (
                        <Link to='/admin/dashboard' onClick={() => setProfileMenuOpen(false)} className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors'>
                          <Shield className='w-4 h-4' /> Admin Console
                        </Link>
                      )}
                      <div className='h-px bg-slate-800 my-1' />
                      <button onClick={() => { logout(); setProfileMenuOpen(false); }} className='w-full flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors text-left bg-transparent border-none cursor-pointer'>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setAuthModalOpen(true)} className='hidden sm:flex items-center gap-1 px-4.5 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-indigo-600/15 cursor-pointer'>
                  Sign In
                </button>
              )}

              {/* Mobile Menu */}
              <button onClick={() => setMenuOpen(!menuOpen)}
                className='md:hidden p-2.5 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800/60 transition-all'>
                {menuOpen ? <X className='w-5 h-5' /> : <Menu className='w-5 h-5' />}
              </button>
            </div>
          </div>

          {/* Search Bar Drop-down */}
          {searchOpen && (
            <div className='pb-4 animate-in slide-in-from-top-2 duration-200'>
              <form onSubmit={handleSearch} className='relative'>
                <Search className='absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500' />
                <input ref={searchRef} type='text' value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search for products, categories...'
                  className='w-full pl-12 pr-20 py-3.5 bg-slate-900 border border-slate-700 rounded-2xl text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all text-sm' />
                <button type='submit'
                  className='absolute right-3 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-500 transition-all'>Search</button>
              </form>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className='md:hidden border-t border-slate-800 bg-slate-950/98 backdrop-blur-xl'>
            <div className='max-w-7xl mx-auto px-4 py-4 space-y-1'>
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link key={to} to={to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    location.pathname === to ? 'text-white bg-indigo-600/20 border border-indigo-500/30' : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}>
                  <Icon className='w-4 h-4' />{label}
                </Link>
              ))}
              <div className='h-px bg-slate-800 my-2' />
              {isAuthenticated ? (
                <>
                  <p className='px-4 py-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wider'>Account: {user.name}</p>
                  {user.role === 'admin' && (
                    <Link to='/admin/dashboard' className='flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all'>
                      <Shield className='w-4 h-4' />Admin Console
                    </Link>
                  )}
                  <button onClick={() => { logout(); setMenuOpen(false); }} className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 transition-all text-left bg-transparent border-none cursor-pointer'>
                    <X className='w-4 h-4' />Logout
                  </button>
                </>
              ) : (
                <button onClick={() => { setAuthModalOpen(true); setMenuOpen(false); }} className='w-full flex items-center gap-3 px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all text-center justify-center cursor-pointer'>
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Cart Drawer */}
      <CartDrawer />

      {/* Auth Modal */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
}

function UserFooter() {
  return (
    <footer className='bg-slate-950 border-t border-slate-800/60 mt-24'>
      {/* Feature Bar */}
      <div className='border-b border-slate-800/40'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {[
              { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
              { icon: Shield, title: 'Secure Payments', desc: '256-bit SSL encrypted' },
              { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
              { icon: Headphones, title: '24/7 Support', desc: 'Expert assistance' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0'>
                  <Icon className='w-5 h-5 text-indigo-400' />
                </div>
                <div>
                  <p className='text-sm font-bold text-white'>{title}</p>
                  <p className='text-xs text-slate-500'>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-10'>
          <div className='md:col-span-1'>
            <Link to='/' className='flex items-center gap-2 mb-4'>
              <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center'>
                <Zap className='w-4 h-4 text-white' />
              </div>
              <span className='text-lg font-black'>
                <span className='text-white'>Vector</span>
                <span className='bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent'>Shop</span>
              </span>
            </Link>
            <p className='text-slate-500 text-sm leading-relaxed mb-5'>Premium products curated with AI-powered discovery for the modern shopper.</p>
            <div className='flex items-center gap-3'>
              {[Twitter, Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href='#' className='w-9 h-9 rounded-xl bg-slate-800 hover:bg-indigo-600 flex items-center justify-center text-slate-400 hover:text-white transition-all'>
                  <Icon className='w-4 h-4' />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className='text-sm font-bold text-white mb-4 uppercase tracking-wider'>Shop</h4>
            <ul className='space-y-3'>
              {['All Products', 'Electronics', 'Home & Living', 'Apparel', 'New Arrivals', 'Sale Items'].map(l => (
                <li key={l}><Link to='/catalog' className='text-slate-500 hover:text-indigo-400 text-sm transition-colors'>{l}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='text-sm font-bold text-white mb-4 uppercase tracking-wider'>Account</h4>
            <ul className='space-y-3'>
              {[{ label: 'My Profile', to: '/profile' }, { label: 'My Orders', to: '/orders' }, { label: 'Shopping Cart', to: '/catalog' }].map(l => (
                <li key={l.label}><Link to={l.to} className='text-slate-500 hover:text-indigo-400 text-sm transition-colors'>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className='text-sm font-bold text-white mb-4 uppercase tracking-wider'>Newsletter</h4>
            <p className='text-slate-500 text-sm mb-4'>Get exclusive deals and early access to new collections.</p>
            <div className='flex gap-2'>
              <input type='email' placeholder='Your email' className='flex-1 px-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all' />
              <button className='px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all'>
                <Mail className='w-4 h-4' />
              </button>
            </div>
            <div className='mt-5 space-y-2'>
              <div className='flex items-center gap-2 text-xs text-slate-500'><Phone className='w-3.5 h-3.5' /><span>+1 (555) 123-4567</span></div>
              <div className='flex items-center gap-2 text-xs text-slate-500'><Mail className='w-3.5 h-3.5' /><span>support@vectorshop.io</span></div>
              <div className='flex items-center gap-2 text-xs text-slate-500'><MapPin className='w-3.5 h-3.5' /><span>San Francisco, CA 94102</span></div>
            </div>
          </div>
        </div>

        <div className='border-t border-slate-800/60 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-slate-600'>© 2026 VectorShop. All rights reserved. Powered by AI semantic search.</p>
          <div className='flex items-center gap-4'>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(l => (
              <a key={l} href='#' className='text-xs text-slate-600 hover:text-slate-400 transition-colors'>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function UserLayout() {
  return (
    <div className='min-h-screen bg-[#030712] text-slate-200 font-sans'>
      <UserNavbar />
      <main className='pt-16 md:pt-20'>
        <Outlet />
      </main>
      <UserFooter />
    </div>
  );
}
