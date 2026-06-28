import { useState } from "react";
import { Menu, Bell, Search, User, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export default function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const displayUser = user || { name: "Super Admin", email: "admin@vectorcommerce.io", role: "admin" };
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Low stock alert: Smartwatch", unread: true },
    { id: 2, text: "New order #10892 received", unread: true }
  ]);
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  const hasUnread = notifications.some(n => n.unread);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-slate-900/80 backdrop-blur-md border-b border-slate-800/80">
      {/* Mobile Hamburger & Desktop Page Header Spacer */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden cursor-pointer"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Local Search bar inside Navbar */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search dashboard command..."
            className="w-full pl-10 pr-4 py-1.5 bg-slate-950 border border-slate-800/80 rounded-full text-xs text-slate-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-all"
          />
        </div>
      </div>

      {/* Right Navbar Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Button & Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setShowNotifMenu(!showNotifMenu);
              if (hasUnread) markAllRead();
            }}
            className="relative p-2 text-slate-400 hover:text-slate-200 rounded-full hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <Bell className="w-5 h-5" />
            {hasUnread && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full ring-2 ring-slate-900" />
            )}
          </button>

          {showNotifMenu && (
            <div className="absolute right-0 mt-2.5 w-72 p-2 bg-slate-900 border border-slate-800 rounded-xl shadow-xl z-50">
              <div className="flex justify-between items-center px-3 py-1.5 border-b border-slate-800 mb-1">
                <span className="text-xs font-bold text-slate-300">Notifications</span>
                <span className="text-[10px] text-indigo-400 cursor-pointer hover:underline" onClick={markAllRead}>
                  Mark all as read
                </span>
              </div>
              <div className="space-y-1">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-2.5 rounded-lg text-xs transition-colors ${
                      notif.unread ? "bg-slate-800/40 text-slate-200" : "text-slate-400"
                    }`}
                  >
                    {notif.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Vertical divider */}
        <div className="h-6 w-px bg-slate-800" />

        {/* User Profile Info */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-semibold text-slate-200">{displayUser.email.split("@")[0]}</p>
            <div className="flex items-center justify-end gap-1 text-[10px] text-slate-500 font-medium">
              <ShieldCheck className="w-3 h-3 text-indigo-400" />
              <span>{displayUser.role}</span>
            </div>
          </div>
          <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700/80 flex items-center justify-center text-slate-300 font-semibold shadow-inner text-sm">
            <User className="w-4.5 h-4.5 text-slate-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
