"use client";

import { useState } from "react";
import {
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Flame
} from "lucide-react";

interface SubjectAttendance {
  subject: string;
  code: string;
  instructor: string;
  attended: number;
  total: number;
  pct: number;
}

const subjectsList: SubjectAttendance[] = [
  { subject: "Advanced Mathematics", code: "MATH-301", instructor: "Dr. Robert Vance", attended: 36, total: 38, pct: 95 },
  { subject: "Physics & Mechanics", code: "PHYS-204", instructor: "Elena Rostova", attended: 29, total: 30, pct: 97 },
  { subject: "English Literature", code: "ENG-102", instructor: "Clara Oswald", attended: 26, total: 28, pct: 93 },
  { subject: "Chemistry & Organic Analysis", code: "CHEM-202", instructor: "Dr. Angela Merkel", attended: 28, total: 30, pct: 93 },
  { subject: "Computer Science & AI", code: "CS-105", instructor: "David Kim", attended: 24, total: 24, pct: 100 },
  { subject: "Physical Education", code: "PE-001", instructor: "Coach Miller", attended: 15, total: 16, pct: 94 },
];

export default function StudentAttendance() {
  const [excuseText, setExcuseText] = useState("");
  const [excuseDate, setExcuseDate] = useState("");
  const [toast, setToast] = useState(false);

  const handleExcuseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!excuseText.trim()) return;
    setToast(true);
    setExcuseText("");
    setExcuseDate("");
    setTimeout(() => setToast(false), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Student Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Campus Presence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Attendance Record & Roll Logs</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Track subject-wise lecture presence, view attendance streaks, and submit medical absence leaves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <Flame size={14} className="text-amber-500 fill-amber-500" /> 18-Day Attendance Streak
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Absence excuse petition submitted to the administrative attendance coordinator!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Overall Attendance", value: "95.2%", sub: "Well above 75% requirement", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Total Lectures Attended", value: "158 / 166", sub: "Only 8 sessions missed", icon: Calendar, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Unexcused Absences", value: "2", sub: "Disciplinary standing clean", icon: AlertCircle, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
          { label: "Medical Leaves Granted", value: "6", sub: "Certificates verified", icon: FileText, color: "text-purple-700", bg: "bg-purple-50/60 border-purple-200/80" },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.bg} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#706B62] mt-1 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Main Grid: Subject Breakdown on Left (8 cols), Leave Request on Right (4 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Subject-Wise Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EBE8E2]">
            <h2 className="font-bold text-base text-[#23201B] font-sora">Subject-by-Subject Attendance Breakdown</h2>
            <p className="text-xs text-[#8C877D]">Minimum institutional requirement is 75% to sit for final examinations.</p>
          </div>

          <div className="divide-y divide-[#EBE8E2]">
            {subjectsList.map((s, i) => (
              <div key={i} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#FAF8F5]/80 transition-colors">
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-bold text-sm text-[#23201B] font-sora">{s.subject}</h3>
                    <span className="text-[10px] font-mono text-[#8C877D]">{s.code}</span>
                  </div>
                  <p className="text-xs text-[#706B62]">Instructor: {s.instructor}</p>
                </div>

                <div className="flex items-center gap-6 min-w-[240px]">
                  <div className="flex-1">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-bold text-[#23201B]">{s.attended} / {s.total} Lectures</span>
                      <span className="font-extrabold text-[#C4993C] font-mono">{s.pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-[#EBE8E2] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>
                  </div>

                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Eligible
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Leave / Excuse Form */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-5">
          <div className="border-b border-[#EBE8E2] pb-4">
            <h3 className="font-bold text-base text-[#23201B] font-sora">Submit Leave Petition</h3>
            <p className="text-xs text-[#8C877D] mt-0.5">Pre-notify faculty for medical or emergency absences.</p>
          </div>

          <form onSubmit={handleExcuseSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Absence Date *
              </label>
              <input
                type="date"
                value={excuseDate}
                onChange={(e) => setExcuseDate(e.target.value)}
                required
                className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Reason / Note *
              </label>
              <textarea
                value={excuseText}
                onChange={(e) => setExcuseText(e.target.value)}
                placeholder="State medical or personal reason. Attach doctor note if applicable..."
                rows={4}
                required
                className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C] resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send size={14} /> Submit Absence Leave
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
