import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, CheckCircle2, Truck, MapPin, ChevronDown,
  ChevronUp, Download, ShoppingBag, Clock, ArrowRight,
  Star, RotateCcw, AlertCircle
} from "lucide-react";
import { getOrders } from "../../utils/userHelpers";
import { useAuth } from "../../context/AuthContext";

const STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

const STATUS_STEP = {
  "Processing": 1,
  "Shipped": 2,
  "Delivered": 3,
};

function OrderStatus({ status }) {
  const badges = {
    Processing: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    Shipped: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    Delivered: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badges[status] || "bg-slate-700 text-slate-300 border-slate-600"}`}>
      {status === "Delivered" ? <CheckCircle2 className="w-3.5 h-3.5" /> :
       status === "Shipped" ? <Truck className="w-3.5 h-3.5" /> :
       <Clock className="w-3.5 h-3.5" />}
      {status}
    </span>
  );
}

function StepIndicator({ status }) {
  const currentStep = STATUS_STEP[status] ?? 0;
  return (
    <div className="flex items-center w-full">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        const isPending = idx > currentStep;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                isCompleted ? "step-completed" :
                isActive ? "step-active" :
                "step-pending"
              }`}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              <span className={`text-[10px] font-semibold mt-1.5 text-center whitespace-nowrap ${
                isCompleted ? "text-emerald-400" :
                isActive ? "text-indigo-400" :
                "text-slate-600"
              }`}>{step}</span>
            </div>
            {idx < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-4 rounded-full transition-all ${
                idx < currentStep ? "bg-emerald-500" : "bg-slate-800"
              }`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);

  const formatDate = (ts) => {
    try {
      return new Date(ts).toLocaleDateString("en-US", {
        year: "numeric", month: "short", day: "numeric"
      });
    } catch { return "—"; }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(val || 0);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      {/* Order Header */}
      <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-sm font-bold text-white">#{order.orderId}</span>
              <OrderStatus status={order.status} />
            </div>
            <p className="text-xs text-slate-500">
              Placed on {formatDate(order.createdAt)} · {(order.items || []).length} item(s)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-lg font-black text-white">{formatCurrency(order.total)}</div>
            <div className="text-xs text-slate-500">Total paid</div>
          </div>
          <button
            onClick={() => {
              const blob = new Blob([`Order #${order.orderId}\nDate: ${formatDate(order.createdAt)}\nStatus: ${order.status}\nTotal: ${formatCurrency(order.total)}`], { type: "text/plain" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a"); a.href = url; a.download = `receipt-${order.orderId}.txt`; a.click();
              URL.revokeObjectURL(url);
            }}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
            title="Download Receipt"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="px-5 pb-5">
        <StepIndicator status={order.status} />
      </div>

      {/* Expand/Collapse Items */}
      <div className="border-t border-slate-800">
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full px-5 py-3 flex items-center justify-between text-sm text-slate-400 hover:text-white hover:bg-slate-800/40 transition-all"
        >
          <span className="font-semibold">Order Items</span>
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {expanded && (
          <div className="px-5 pb-5 space-y-3">
            {(order.items || []).map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl">
                <img
                  src={item.product?.imageUrl || ""}
                  alt={item.product?.name || "Product"}
                  className="w-12 h-12 rounded-xl object-cover border border-slate-700 bg-slate-900"
                  onError={e => { e.target.style.display = "none"; }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{item.product?.name || "Product"}</p>
                  <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                </div>
                <div className="text-sm font-bold text-white whitespace-nowrap">
                  {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format((item.product?.price || 0) * item.quantity)}
                </div>
              </div>
            ))}

            {/* Shipping address */}
            {order.address && (
              <div className="flex items-start gap-2 mt-3 px-1 text-xs text-slate-500">
                <MapPin className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-indigo-400" />
                <span>{order.address}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      getOrders(token).then((data) => setOrders(data));
    }
  }, [token, isLoading]);

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
            <span className="hover:text-slate-300 cursor-pointer" onClick={() => navigate("/")}>Home</span>
            <span>/</span>
            <span className="text-slate-300">My Orders</span>
          </div>
          <h1 className="text-3xl font-black text-white">My Orders</h1>
          <p className="text-slate-400 text-sm mt-1">{orders.length} orders · {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSpent)} total spent</p>
        </div>
        <button
          onClick={() => navigate("/catalog")}
          className="flex items-center gap-2 px-5 py-2.5 btn-gradient rounded-xl text-sm"
        >
          <ShoppingBag className="w-4 h-4" /> Continue Shopping
        </button>
      </div>

      {/* Summary Stats */}
      {orders.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Total Orders", value: orders.length, icon: Package, color: "text-indigo-400" },
            { label: "Total Spent", value: new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalSpent), icon: Star, color: "text-amber-400" },
            { label: "Delivered", value: orders.filter(o => o.status === "Delivered").length, icon: CheckCircle2, color: "text-emerald-400" },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="text-center p-4 bg-slate-900/50 border border-slate-800 rounded-2xl">
              <Icon className={`w-5 h-5 ${color} mx-auto mb-2`} />
              <div className="text-xl font-black text-white">{value}</div>
              <div className="text-xs text-slate-500 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Orders List */}
      {orders.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center mx-auto mb-5">
            <Package className="w-10 h-10 text-slate-600" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">No Orders Yet</h2>
          <p className="text-slate-500 text-sm mb-6">
            Looks like you haven't placed any orders yet. Start shopping to see your orders here!
          </p>
          <button
            onClick={() => navigate("/catalog")}
            className="px-8 py-3 btn-gradient rounded-xl text-sm flex items-center gap-2 mx-auto"
          >
            <ShoppingBag className="w-4 h-4" />
            Start Shopping
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map(order => (
            <OrderCard key={order.orderId} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
