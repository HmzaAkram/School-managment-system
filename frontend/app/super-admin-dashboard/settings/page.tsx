"use client";

import { useEffect, useState } from "react";
import { User, Lock, Bell, Globe, Save, Loader2, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"profile" | "security" | "notifications" | "system">("profile");
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");

  // Profile fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await api.get("/me");
        setUser(data.user || data);
        setName(data.user?.name || data.name || "");
        setEmail(data.user?.email || data.email || "");
        setPhone(data.user?.phone || data.phone || "");
      } catch (err: any) {
        console.error("Failed to load user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setToast("");
    try {
      const res = await api.put("/me", { name, email, phone });
      const updated = res.user || res;
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      setToast("Profile settings saved successfully!");
      setTimeout(() => setToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match.");
      return;
    }
    setSaving(true);
    try {
      await api.post("/me/password", {
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setToast("Password updated successfully!");
      setTimeout(() => setToast(""), 4000);
    } catch (err: any) {
      alert(err?.message || "Failed to update password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Platform Settings</h1>
        <p className="text-slate-500 text-sm">Manage your Super Administrator credentials and system preferences stored in database.</p>
      </div>

      {toast && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{toast}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Settings Sidebar */}
          <div className="w-full md:w-64 bg-slate-50/50 border-b md:border-b-0 md:border-r border-slate-100 p-4 space-y-1">
            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "profile"
                  ? "bg-white text-primary shadow-sm border border-slate-100"
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
              }`}
            >
              <User size={16} /> Account Profile
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "security"
                  ? "bg-white text-primary shadow-sm border border-slate-100"
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
              }`}
            >
              <Lock size={16} /> Security & Password
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "notifications"
                  ? "bg-white text-primary shadow-sm border border-slate-100"
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
              }`}
            >
              <Bell size={16} /> Notifications
            </button>
            <button
              onClick={() => setActiveTab("system")}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                activeTab === "system"
                  ? "bg-white text-primary shadow-sm border border-slate-100"
                  : "text-slate-600 hover:bg-slate-100/50 hover:text-slate-900"
              }`}
            >
              <Globe size={16} /> System Preferences
            </button>
          </div>

          {/* Settings Content */}
          <div className="flex-1 p-6 md:p-8">
            {loading ? (
              <div className="py-16 text-center text-slate-500">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#D4A843]" />
                <p className="text-xs">Loading user profile from MySQL...</p>
              </div>
            ) : activeTab === "profile" ? (
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <h2 className="font-sora font-bold text-lg text-slate-900 mb-4">Profile Information</h2>
                
                <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2D2823] to-[#4A453F] flex items-center justify-center text-white text-xl font-bold shadow-md">
                    {(name || "SA").slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-bold text-slate-800 text-sm">{name}</div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{email}</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+92 300 0000000"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Role</label>
                    <input
                      type="text"
                      value="Super Administrator"
                      disabled
                      className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-gradient-to-r from-[#2D2823] to-[#4A453F] text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    <span>Save Profile</span>
                  </button>
                </div>
              </form>
            ) : activeTab === "security" ? (
              <form onSubmit={handleChangePassword} className="space-y-5">
                <h2 className="font-sora font-bold text-lg text-slate-900 mb-4">Security & Password</h2>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Current Password</label>
                    <input
                      type="password"
                      required
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">New Password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-slate-700">Confirm New Password</label>
                    <input
                      type="password"
                      required
                      minLength={8}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary text-slate-900"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:bg-slate-800 transition-all flex items-center gap-2 disabled:opacity-60"
                  >
                    {saving && <Loader2 size={16} className="animate-spin" />}
                    <span>Update Password</span>
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-4 text-xs text-slate-600">
                <h2 className="font-sora font-bold text-lg text-slate-900 mb-2">Preferences</h2>
                <p>System timezone: Asia/Karachi (PKT - UTC+5)</p>
                <p>Multi-tenancy isolation mode: Database level tenant key filtering</p>
                <p>API Authentication: Laravel Sanctum HTTP Bearer Token</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
