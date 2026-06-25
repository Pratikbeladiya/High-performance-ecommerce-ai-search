import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CreditCard,
  Shield,
  CheckCircle2,
  Lock,
  Package,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { getProfile, addOrder, getCart } from '../../utils/userHelpers';

/* ─────────────────────────────────────────
   Payment Modal (inline)
───────────────────────────────────────── */
function PaymentModal({ onClose, onSuccess }) {
  const [phase, setPhase] = useState('processing'); // 'processing' | 'success'

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('success'), 2000);
    return () => clearTimeout(t1);
  }, []);

  useEffect(() => {
    if (phase === 'success') {
      const t2 = setTimeout(onSuccess, 1500);
      return () => clearTimeout(t2);
    }
  }, [phase, onSuccess]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 bg-slate-900 border border-slate-700/50 rounded-2xl p-10 w-full max-w-sm text-center shadow-2xl shadow-black/60">
        {phase === 'processing' ? (
          <div className="flex flex-col items-center gap-5">
            {/* Animated Spinner */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 rounded-full border-4 border-slate-700/50" />
              <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 border-r-indigo-400 animate-spin" />
              <div className="absolute inset-2 rounded-full bg-slate-800 flex items-center justify-center">
                <Lock className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Securing payment...</p>
              <p className="text-slate-400 text-sm mt-1">Please do not close this window</p>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Shield className="w-3.5 h-3.5" />
              256-bit SSL encrypted
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-5">
            {/* Success Animation */}
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center animate-[scale-in_0.3s_ease-out]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <div>
              <p className="text-white font-bold text-xl">Payment Successful!</p>
              <p className="text-slate-400 text-sm mt-2">Your order has been confirmed.</p>
            </div>
            <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full animate-[grow_1.4s_ease-out_forwards]" style={{ width: '100%' }} />
            </div>
            <p className="text-slate-500 text-xs">Redirecting to your orders...</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   Checkout Page
───────────────────────────────────────── */
export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart, cartTotal } = useCart();

  const profile = getProfile();
  const [form, setForm] = useState({
    name: profile.name || '',
    email: profile.email || '',
    phone: profile.phone || '',
    address: profile.address || '',
    city: profile.city || '',
    zip: profile.zip || '',
    country: profile.country || 'United States',
  });
  const [paymentMethod, setPaymentMethod] = useState('visa');
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  // Redirect if cart is empty
  useEffect(() => {
    if (cart.length === 0) {
      navigate('/catalog', { replace: true });
    }
  }, [cart, navigate]);

  const SHIPPING = cartTotal > 100 ? 0 : 9.99;
  const TAX = cartTotal * 0.08;
  const TOTAL = cartTotal + SHIPPING + TAX;

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email.trim()) e.email = 'Email is required';
    if (!form.address.trim()) e.address = 'Address is required';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.zip.trim()) e.zip = 'ZIP code is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowModal(true);
  };

  const handlePaymentSuccess = () => {
    // Build order object
    const orderId =
      'ORD-' +
      Math.random().toString(36).substring(2, 8).toUpperCase();
    const order = {
      id: orderId,
      date: new Date().toISOString(),
      status: 'Processing',
      items: cart.map((i) => ({ ...i })),
      subtotal: cartTotal,
      shipping: SHIPPING,
      tax: TAX,
      total: TOTAL,
      deliveryAddress: { ...form },
      paymentMethod,
    };
    addOrder(order);
    clearCart();
    navigate('/orders', { replace: true });
  };

  if (cart.length === 0) return null;

  return (
    <>
      {showModal && (
        <PaymentModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePaymentSuccess}
        />
      )}

      <div className="py-6 px-4 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            to="/catalog"
            className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-400 transition-colors text-sm group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-slate-100 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          {/* ── Left: Delivery + Payment Form ── */}
          <form onSubmit={handlePlaceOrder} className="space-y-8">
            {/* Delivery Section */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-400" />
                Delivery Information
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-sm mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      errors.name ? 'border-red-500/60' : 'border-slate-700'
                    }`}
                  />
                  {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="you@example.com"
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      errors.email ? 'border-red-500/60' : 'border-slate-700'
                    }`}
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>

                {/* Street Address */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-sm mb-1.5">Street Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="123 Main Street, Apt 4B"
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      errors.address ? 'border-red-500/60' : 'border-slate-700'
                    }`}
                  />
                  {errors.address && <p className="text-red-400 text-xs mt-1">{errors.address}</p>}
                </div>

                {/* City */}
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">City *</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="New York"
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      errors.city ? 'border-red-500/60' : 'border-slate-700'
                    }`}
                  />
                  {errors.city && <p className="text-red-400 text-xs mt-1">{errors.city}</p>}
                </div>

                {/* ZIP */}
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">ZIP Code *</label>
                  <input
                    type="text"
                    value={form.zip}
                    onChange={(e) => setForm({ ...form, zip: e.target.value })}
                    placeholder="10001"
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all ${
                      errors.zip ? 'border-red-500/60' : 'border-slate-700'
                    }`}
                  />
                  {errors.zip && <p className="text-red-400 text-xs mt-1">{errors.zip}</p>}
                </div>

                {/* Country */}
                <div className="sm:col-span-2">
                  <label className="block text-slate-400 text-sm mb-1.5">Country</label>
                  <select
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  >
                    <option>United States</option>
                    <option>Canada</option>
                    <option>United Kingdom</option>
                    <option>Australia</option>
                    <option>Germany</option>
                    <option>France</option>
                    <option>India</option>
                    <option>Japan</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Section */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 space-y-5">
              <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                Payment Method
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: 'visa', label: 'VISA', sub: 'Credit / Debit' },
                  { id: 'mastercard', label: 'MC', sub: 'Mastercard' },
                  { id: 'paypal', label: 'PayPal', sub: 'Express Pay' },
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id)}
                    className={`flex flex-col items-center gap-1.5 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-slate-700 bg-slate-800/40 hover:border-slate-500'
                    }`}
                  >
                    <span
                      className={`text-lg font-black tracking-tight ${
                        pm.id === 'visa'
                          ? 'text-blue-400'
                          : pm.id === 'mastercard'
                          ? 'text-orange-400'
                          : 'text-sky-400'
                      }`}
                    >
                      {pm.label}
                    </span>
                    <span className="text-slate-500 text-xs">{pm.sub}</span>
                  </button>
                ))}
              </div>

              {/* Card Number Mock */}
              <div className="space-y-3">
                <div>
                  <label className="block text-slate-400 text-sm mb-1.5">Card Number</label>
                  <input
                    type="text"
                    placeholder="•••• •••• •••• ••••"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono tracking-widest"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-1.5">CVV</label>
                    <input
                      type="text"
                      placeholder="•••"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-slate-500 text-xs">
                <Shield className="w-3.5 h-3.5 text-emerald-500" />
                Your payment is secured with 256-bit SSL encryption
              </div>
            </div>

            {/* Place Order Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-lg rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5"
            >
              <Lock className="w-5 h-5" />
              Place Order — ${TOTAL.toFixed(2)}
            </button>
          </form>

          {/* ── Right: Order Summary ── */}
          <div className="space-y-4">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-slate-200 mb-5">Order Summary</h2>

              {/* Items List */}
              <div className="space-y-3 mb-5 max-h-72 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 rounded-lg bg-slate-800 overflow-hidden flex-shrink-0 border border-slate-700/50">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-slate-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-300 text-sm font-medium truncate">
                        {item.product.name}
                      </p>
                      <p className="text-slate-500 text-xs">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-slate-200 text-sm font-semibold flex-shrink-0">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="border-t border-slate-700/50 pt-4 space-y-2.5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-slate-200">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Shipping</span>
                  <span className={SHIPPING === 0 ? 'text-emerald-400' : 'text-slate-200'}>
                    {SHIPPING === 0 ? 'FREE' : `$${SHIPPING.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax (8%)</span>
                  <span className="text-slate-200">${TAX.toFixed(2)}</span>
                </div>

                {cartTotal > 100 && (
                  <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
                    🎉 Free shipping on orders over $100!
                  </div>
                )}

                <div className="border-t border-slate-700/50 pt-3 flex justify-between">
                  <span className="text-slate-200 font-semibold">Total</span>
                  <span className="text-white font-black text-lg">${TOTAL.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
