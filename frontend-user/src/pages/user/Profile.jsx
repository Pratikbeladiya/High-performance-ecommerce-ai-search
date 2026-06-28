import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, MapPin, Save, CheckCircle2,
  Package, Settings, Bell, ShoppingBag, Edit3,
  ArrowRight, Star, Shield, Globe
} from "lucide-react";
import { getProfile, setProfile, getOrders } from "../../utils/userHelpers";
import { useAuth } from "../../context/AuthContext";

function ToggleSwitch({ checked, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 cursor-pointer ${
        checked ? "bg-indigo-600" : "bg-slate-700"
      }`}
    >
      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${
        checked ? "left-5" : "left-0.5"
      }`} />
    </button>
  );
}

function Toast({ message, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 bg-emerald-900/90 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl animate-slide-up">
      <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
      <span className="text-sm font-semibold text-emerald-200">{message}</span>
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, updateProfile, isLoading: authLoading } = useAuth();
  const [profile, setProfileState] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "United States"
  });
  const [orders, setOrders] = useState([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [settings, setSettings] = useState({
    notifications: true,
    newsletter: false,
    smsAlerts: true,
  });

  // Sync profile state with context when loaded
  useEffect(() => {
    if (user) {
      setProfileState({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        zip: user.zip || "",
        country: user.country || "United States"
      });
    } else {
      setProfileState(getProfile());
    }
  }, [user]);

  // Load orders asynchronously using token
  useEffect(() => {
    if (!authLoading) {
      getOrders(token).then((data) => setOrders(data));
    }
  }, [token, authLoading]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileState(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (user) {
        await updateProfile(profile);
      } else {
        setProfile(profile);
      }
      setToast("Profile saved successfully!");
    } catch (err) {
      console.error(err);
      setToast("Error saving profile settings");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5";

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-10">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
          <span className="hover:text-slate-300 cursor-pointer" onClick={() => navigate("/")}>Home</span>
          <span>/</span>
          <span className="text-slate-300">Profile</span>
        </div>
        <h1 className="text-3xl font-black text-white">My Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your account details and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Profile Avatar + Stats */}
        <div className="space-y-5">
          {/* Avatar Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center">
            <div className="relative inline-block mb-4">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-black shadow-xl shadow-indigo-500/20 mx-auto">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-xl bg-emerald-500 flex items-center justify-center border-2 border-slate-900">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
            </div>
            <h2 className="text-lg font-bold text-white mb-0.5">{profile.name || "Guest User"}</h2>
            <p className="text-sm text-slate-400 mb-4">{profile.email || "—"}</p>
            <div className="flex items-center justify-center gap-1 px-3 py-1.5 bg-indigo-600/15 border border-indigo-500/20 rounded-xl w-fit mx-auto">
              <Shield className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-400">Verified Member</span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Account Stats</h3>
            {[
              { icon: Package, label: "Total Orders", value: orders.length, color: "text-indigo-400" },
              { icon: Star, label: "Total Spent", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSpent), color: "text-amber-400" },
              { icon: CheckCircle2, label: "Delivered", value: orders.filter(o => o.status === "Delivered").length, color: "text-emerald-400" },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${color}`} />
                  <span className="text-sm text-slate-400">{label}</span>
                </div>
                <span className={`text-sm font-bold ${color}`}>{value}</span>
              </div>
            ))}
          </div>

          {/* Recent Orders */}
          {recentOrders.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Recent Orders</h3>
                <Link to="/orders" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
                  View All <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div className="space-y-3">
                {recentOrders.map(order => (
                  <div key={order.orderId} className="flex items-center justify-between p-3 bg-slate-800/40 rounded-xl">
                    <div>
                      <p className="text-xs font-bold text-white">#{order.orderId}</p>
                      <p className="text-[10px] text-slate-500">{(order.items || []).length} items</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">
                        {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(order.total || 0)}
                      </p>
                      <span className={`text-[10px] font-semibold ${
                        order.status === "Delivered" ? "text-emerald-400" :
                        order.status === "Shipped" ? "text-blue-400" : "text-amber-400"
                      }`}>{order.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Form + Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Form */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Edit3 className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Personal Information</h2>
                <p className="text-xs text-slate-500">Update your contact and delivery details</p>
              </div>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>
                    <User className="w-3 h-3 inline mr-1" />Full Name
                  </label>
                  <input type="text" name="name" value={profile.name || ""} onChange={handleChange} placeholder="John Doe" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    <Mail className="w-3 h-3 inline mr-1" />Email Address
                  </label>
                  <input type="email" name="email" value={profile.email || ""} onChange={handleChange} placeholder="john@email.com" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    <Phone className="w-3 h-3 inline mr-1" />Phone Number
                  </label>
                  <input type="tel" name="phone" value={profile.phone || ""} onChange={handleChange} placeholder="+1 (555) 123-4567" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>
                    <Globe className="w-3 h-3 inline mr-1" />Country
                  </label>
                  <input type="text" name="country" value={profile.country || ""} onChange={handleChange} placeholder="United States" className={inputClass} />
                </div>
              </div>

              <div>
                <label className={labelClass}>
                  <MapPin className="w-3 h-3 inline mr-1" />Street Address
                </label>
                <input type="text" name="address" value={profile.address || ""} onChange={handleChange} placeholder="123 Main Street, Apt 4B" className={inputClass} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" name="city" value={profile.city || ""} onChange={handleChange} placeholder="San Francisco" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>ZIP Code</label>
                  <input type="text" name="zip" value={profile.zip || ""} onChange={handleChange} placeholder="94102" className={inputClass} />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 btn-gradient rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Account Settings */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Settings className="w-4.5 h-4.5 text-purple-400" />
              </div>
              <div>
                <h2 className="text-base font-bold text-white">Account Settings</h2>
                <p className="text-xs text-slate-500">Manage your notification preferences</p>
              </div>
            </div>

            <div className="space-y-4">
              {[
                { key: "notifications", label: "Order Notifications", desc: "Get notified when your order status changes", icon: Bell },
                { key: "newsletter", label: "Newsletter", desc: "Receive deals, new arrivals and promotions", icon: Mail },
                { key: "smsAlerts", label: "SMS Alerts", desc: "Receive SMS updates for delivery tracking", icon: Phone },
              ].map(({ key, label, desc, icon: Icon }) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-slate-800 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${settings[key] ? "bg-indigo-500/10 border border-indigo-500/20" : "bg-slate-800 border border-slate-700"}`}>
                      <Icon className={`w-4 h-4 ${settings[key] ? "text-indigo-400" : "text-slate-500"}`} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{label}</p>
                      <p className="text-xs text-slate-500">{desc}</p>
                    </div>
                  </div>
                  <ToggleSwitch
                    checked={settings[key]}
                    onChange={val => setSettings(prev => ({ ...prev, [key]: val }))}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-2xl p-5">
            <h3 className="text-sm font-bold text-rose-400 mb-3">Danger Zone</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-white font-semibold">Clear Order History</p>
                <p className="text-xs text-slate-500">This will permanently remove all your orders from local storage.</p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm("Are you sure? This will delete all your orders.")) {
                    localStorage.removeItem("user_orders");
                    setOrders([]);
                    setToast("Order history cleared.");
                  }
                }}
                className="px-4 py-2 border border-rose-700/60 text-rose-400 hover:bg-rose-500/10 rounded-xl text-xs font-semibold transition-all whitespace-nowrap"
              >
                Clear History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
