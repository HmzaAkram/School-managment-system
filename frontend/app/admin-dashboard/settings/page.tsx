"use client";

import { useEffect, useState } from "react";
import {
  Settings,
  Building,
  Calendar,
  Bell,
  Shield,
  Save,
  CheckCircle,
  Mail,
  Phone,
  Globe,
  Upload,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [schoolName, setSchoolName] = useState("");
  const [tagline, setTagline] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [website, setWebsite] = useState("");
  const [academicSession, setAcademicSession] = useState("2025 - 2026");
  const [gradingSystem, setGradingSystem] = useState("letter");
  const [smsGateway, setSmsGateway] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError(null);
        const [profileRes, settingsRes] = await Promise.allSettled([
          apiFetch<any>("/admin/profile"),
          apiFetch<any>("/admin/settings")
        ]);

        if (profileRes.status === "fulfilled") {
          const p = profileRes.value;
          setSchoolName(p.name || "");
          setTagline(p.tagline || "");
          setEmail(p.email || "");
          setPhone(p.phone || "");
          setAddress(p.address || "");
          setCity(p.city || "");
          setWebsite(p.website || "");
        }

        if (settingsRes.status === "fulfilled") {
          const s = settingsRes.value.settings || {};
          if (s.academic_session) setAcademicSession(s.academic_session);
          if (s.grading_system) setGradingSystem(s.grading_system);
          if (s.sms_gateway !== undefined) setSmsGateway(s.sms_gateway === "true" || s.sms_gateway === true);
          if (s.email_alerts !== undefined) setEmailAlerts(s.email_alerts === "true" || s.email_alerts === true);
        }
      } catch (err: any) {
        console.error("Failed to load settings:", err);
        setError(err?.message || "Failed to load school settings");
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);

      await Promise.all([
        apiFetch("/admin/profile", {
          method: "PUT",
          body: JSON.stringify({
            name: schoolName,
            tagline,
            email,
            phone,
            address,
            city,
            website
          })
        }),
        apiFetch("/admin/settings", {
          method: "PUT",
          body: JSON.stringify({
            settings: {
              academic_session: academicSession,
              grading_system: gradingSystem,
              sms_gateway: smsGateway ? "true" : "false",
              email_alerts: emailAlerts ? "true" : "false"
            }
          })
        })
      ]);

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setError(err?.message || "Failed to save settings");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <span>Loading institutional configuration...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Administration</span>
            <span>/</span>
            <span className="text-[#C4993C]">System Preferences</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">School Configuration & Settings</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Manage institutional profile, academic grading thresholds, and communication channels.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold animate-in fade-in">
            <CheckCircle size={15} /> Preferences Saved Successfully
          </div>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EBE8E2] pb-2 overflow-x-auto">
        {[
          { id: "general", label: "Institutional Profile", icon: Building },
          { id: "academic", label: "Academic Terms", icon: Calendar },
          { id: "notifications", label: "Alert Gateways", icon: Bell },
          { id: "security", label: "Security & Roles", icon: Shield },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#23201B] text-white shadow-sm"
                : "text-[#706B62] hover:bg-[#FAF8F5] hover:text-[#23201B]"
            }`}
          >
            <tab.icon size={15} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Form */}
      <form onSubmit={handleSave} className="bg-white rounded-2xl border border-[#EBE8E2] p-8 shadow-sm space-y-6">
        {activeTab === "general" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  School Name *
                </label>
                <input
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Official Motto / Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Official Contact Email
                </label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877D]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Office Phone Line
                </label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877D]" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-sm pl-9 pr-3 border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Physical Campus Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "academic" && (
          <div className="space-y-6 animate-in fade-in">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Current Academic Session
                </label>
                <select
                  value={academicSession}
                  onChange={(e) => setAcademicSession(e.target.value)}
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                >
                  <option value="2025 - 2026">2025 - 2026</option>
                  <option value="2026 - 2027">2026 - 2027</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Grading Scale Model
                </label>
                <select
                  value={gradingSystem}
                  onChange={(e) => setGradingSystem(e.target.value)}
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                >
                  <option value="letter">Letter Grades (A+, A, B, C, F) + 4.0 GPA</option>
                  <option value="percentage">Pure Percentage (0 - 100%)</option>
                  <option value="ib">International Baccalaureate (1 - 7 Scale)</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#EBE8E2] bg-[#FAF8F5]">
              <div>
                <h4 className="font-bold text-sm text-[#23201B]">SMS Notification Dispatch</h4>
                <p className="text-xs text-[#8C877D]">Instant SMS alerts for absences, fees, and closures.</p>
              </div>
              <input
                type="checkbox"
                checked={smsGateway}
                onChange={(e) => setSmsGateway(e.target.checked)}
                className="h-5 w-5 text-[#C4993C] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-[#EBE8E2] bg-[#FAF8F5]">
              <div>
                <h4 className="font-bold text-sm text-[#23201B]">Daily Email Summary Digest</h4>
                <p className="text-xs text-[#8C877D]">Dispatches report cards, payment receipts, and memos.</p>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="h-5 w-5 text-[#C4993C] rounded cursor-pointer"
              />
            </div>
          </div>
        )}

        {activeTab === "security" && (
          <div className="space-y-4 animate-in fade-in">
            <div className="p-4 rounded-xl border border-[#EBE8E2] bg-[#FAF8F5]">
              <h4 className="font-bold text-sm text-[#23201B] mb-1">Two-Factor Authentication (2FA) for Staff</h4>
              <p className="text-xs text-[#8C877D] mb-3">Enforce credentials protection for all teachers and admins.</p>
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                Active & Enforced
              </span>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-[#EBE8E2] flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
          >
            {submitting ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>Save Changes</span>
          </button>
        </div>
      </form>
    </div>
  );
}
