
  
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
