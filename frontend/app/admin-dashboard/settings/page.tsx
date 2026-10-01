"use client";

import { useState } from "react";
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
  Upload
} from "lucide-react";

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  // Form State
  const [schoolName, setSchoolName] = useState("Oakridge International Academy");
  const [tagline, setTagline] = useState("Excellence in Global Holistic Education");
  const [email, setEmail] = useState("admissions@oakridge.skoolms.edu");
  const [phone, setPhone] = useState("+1 (555) 349-8201");
  const [address, setAddress] = useState("742 Evergreen Terrace, Springfield");
  const [academicSession, setAcademicSession] = useState("2025 - 2026");
  const [gradingSystem, setGradingSystem] = useState("letter");
  const [smsGateway, setSmsGateway] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

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
            <div className="flex items-center gap-6 pb-6 border-b border-[#EBE8E2]">
              <div className="w-20 h-20 rounded-2xl bg-[#FAF8F5] border-2 border-dashed border-[#D9D4CC] flex flex-col items-center justify-center text-[#8C877D] text-xs">
                <Upload size={20} className="mb-1 text-[#C4993C]" />
                Logo
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#23201B] font-sora">Institutional Crest & Emblem</h3>
                <p className="text-xs text-[#8C877D] mt-0.5">Recommended 400x400 PNG or SVG transparent background.</p>
                <button type="button" className="mt-2 px-3 py-1.5 rounded-lg border border-[#D9D4CC] text-xs font-semibold text-[#4A453E] hover:bg-[#FAF8F5]">
                  Upload New Crest
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  School Name
                </label>
                <input
                  type="text"
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
                  <option>2025 - 2026</option>
                  <option>2026 - 2027</option>
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

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
              <h4 className="font-bold text-xs text-[#23201B] uppercase tracking-wider mb-1">
                Attendance Defaulter Warning Threshold
              </h4>
              <p className="text-xs text-[#706B62] mb-3">
                Students dropping below this percentage automatically trigger parental SMS notifications.
              </p>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  defaultValue={75}
                  min={50}
                  max={90}
                  className="w-24 text-sm font-bold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-white p-2.5 outline-none text-center"
                />
                <span className="text-xs font-bold text-[#4A453E]">% Minimum Attendance</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between p-4 rounded-xl border border-[#EBE8E2] bg-[#FAF8F5]">
              <div>
                <h4 className="font-bold text-sm text-[#23201B]">Direct Twilio SMS Dispatch</h4>
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
                <p className="text-xs text-[#8C877D]">Dispatches report cards, payment receipts, and principal letters.</p>
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
              <p className="text-xs text-[#8C877D] mb-3">Enforce Google Authenticator or SMS 2FA for all teachers and admins.</p>
              <span className="px-3 py-1 rounded-md text-xs font-bold bg-emerald-100 text-emerald-800">
                Enforced by Super Admin
              </span>
            </div>
          </div>
        )}

        {/* Submit */}
        <div className="pt-4 border-t border-[#EBE8E2] flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Save size={15} /> Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
