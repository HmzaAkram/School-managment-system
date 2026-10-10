"use client";

import { useEffect, useState } from "react";
import {
  CheckSquare,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Send,
  Flame,
  Loader2,
  XCircle,
  Clock3
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface AttendanceRecord {
  id: number;
  date: string;
  status: "Present" | "Absent" | "Late" | "Half-Day" | "Excused";
  remarks?: string;
  class?: string;
  section?: string;
}

interface AttendanceSummary {
  summary: {
    total: number;
    present: number;
    absent: number;
    late: number;
    half_day: number;
    excused: number;
    rate: number | null;
  };
  monthly: Array<{
    month: string;
    total: number;
    present: number;
    absent: number;
    rate: number | null;
  }>;
}

interface StudentLeaveRecord {
  id: number;
  leave_type: string;
  from_date: string;
  to_date?: string;
  days: number;
  reason?: string;
  status: string;
  remarks?: string;
}

export default function StudentAttendance() {
  const [summary, setSummary] = useState<AttendanceSummary | null>(null);
  const [logs, setLogs] = useState<AttendanceRecord[]>([]);
  const [leaves, setLeaves] = useState<StudentLeaveRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [leaveType, setLeaveType] = useState("Sick");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [sumRes, attRes, leavesRes] = await Promise.all([
        apiFetch<AttendanceSummary>("/student/attendance/summary"),
        apiFetch<any>("/student/attendance?per_page=50"),
        apiFetch<StudentLeaveRecord[]>("/student/leaves"),
      ]);

      if (sumRes) setSummary(sumRes);
      if (attRes?.data) setLogs(attRes.data);
      else if (Array.isArray(attRes)) setLogs(attRes);
      if (Array.isArray(leavesRes)) setLeaves(leavesRes);
    } catch (err: any) {
      console.error("Failed to load attendance:", err);
      setError(err.message || "Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExcuseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate) return;

    try {
      setSubmitting(true);
      await apiFetch("/student/leaves", {
        method: "POST",
        body: JSON.stringify({
          leave_type: leaveType,
          from_date: fromDate,
          to_date: toDate || fromDate,
          reason,
        }),
      });

      setToast("Absence excuse petition submitted successfully to school administration!");
      setReason("");
      setFromDate("");
      setToDate("");
      loadData();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to submit leave petition");
    } finally {
      setSubmitting(false);
    }
  };

  const attendanceRate = summary?.summary?.rate !== null && summary?.summary?.rate !== undefined
    ? `${summary.summary.rate}%`
    : "—";

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
            Track daily lecture presence, view attendance logs, and submit medical absence leaves.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 size={14} className="text-emerald-600" /> Attendance: {attendanceRate}
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">{toast}</p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Overall Presence Rate",
            value: attendanceRate,
            sub: summary?.summary?.rate && summary.summary.rate >= 75 ? "Meets institutional requirement" : "Warning: below 75%",
            icon: CheckCircle2,
            color: "text-emerald-700",
            bg: "bg-emerald-50/60 border-emerald-200/80"
          },
          {
            label: "Days Present",
            value: `${summary?.summary?.present || 0} / ${summary?.summary?.total || 0}`,
            sub: `${summary?.summary?.late || 0} sessions marked late`,
            icon: Calendar,
            color: "text-[#C4993C]",
            bg: "bg-[#FFFDF9] border-[#F1EAD9]"
          },
          {
            label: "Absences Recorded",
            value: `${summary?.summary?.absent || 0}`,
            sub: `${summary?.summary?.excused || 0} approved excused days`,
            icon: AlertCircle,
            color: "text-rose-700",
            bg: "bg-rose-50/60 border-rose-200/80"
          },
          {
            label: "Leave Applications",
            value: `${leaves.length}`,
            sub: `${leaves.filter(l => l.status === "Approved").length} approved • ${leaves.filter(l => l.status === "Pending").length} pending`,
            icon: FileText,
            color: "text-blue-700",
            bg: "bg-blue-50/60 border-blue-200/80"
          },
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

      {/* Main Grid: Attendance Logs on Left (8 cols), Leave Request on Right (4 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Attendance Logs Table */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#EBE8E2] flex items-center justify-between">
            <div>
              <h2 className="font-bold text-base text-[#23201B] font-sora">Attendance Log History</h2>
              <p className="text-xs text-[#8C877D]">Recent daily roll-call recordings from class instructors</p>
            </div>
            <span className="text-xs font-mono font-bold text-[#8C877D] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EBE8E2]">
              {logs.length} Recorded Days
            </span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#8C877D] space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#C4993C]" />
              <p className="text-sm font-medium">Loading attendance history...</p>
            </div>
          ) : logs.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 text-[#8C877D] mx-auto mb-3 opacity-40" />
              <h3 className="font-bold text-[#23201B] text-lg font-sora mb-1">No Attendance Records Yet</h3>
              <p className="text-xs text-[#706B62] max-w-sm mx-auto">
                No attendance logs have been recorded for your profile during this academic session.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto max-h-[460px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2] sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Status</th>
                    <th className="py-3 px-5">Class / Section</th>
                    <th className="py-3 px-5 text-right">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE8E2]">
                  {logs.map((record) => {
                    const isPresent = record.status === "Present";
                    const isLate = record.status === "Late";
                    const isAbsent = record.status === "Absent";

                    return (
                      <tr key={record.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3.5 px-5 font-semibold text-[#23201B]">
                          {record.date}
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            isPresent
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : isLate
                              ? "bg-amber-50 text-amber-800 border border-amber-200"
                              : isAbsent
                              ? "bg-rose-50 text-rose-800 border border-rose-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}>
                            {isPresent && <CheckCircle2 size={12} />}
                            {isLate && <Clock3 size={12} />}
                            {isAbsent && <XCircle size={12} />}
                            {record.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-[#706B62]">
                          {record.class ? `${record.class} ${record.section ? `(${record.section})` : ""}` : "Standard Roll"}
                        </td>
                        <td className="py-3.5 px-5 text-right text-[#8C877D] italic">
                          {record.remarks || "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Past Leaves Section */}
          {leaves.length > 0 && (
            <div className="border-t border-[#EBE8E2] p-5 bg-[#FFFDF9]">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C877D] mb-3">Submitted Absence Applications</h3>
              <div className="space-y-2">
                {leaves.map((l) => (
                  <div key={l.id} className="p-3 bg-white rounded-xl border border-[#EBE8E2] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[#23201B]">
                        {l.leave_type} Leave ({l.from_date} {l.to_date && l.to_date !== l.from_date ? `to ${l.to_date}` : ""})
                      </div>
                      <div className="text-[#706B62] text-[11px] mt-0.5">{l.reason || "No reason specified"}</div>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${
                      l.status === "Approved"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : l.status === "Rejected"
                        ? "bg-rose-50 text-rose-800 border border-rose-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      {l.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                Leave Category *
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
              >
                <option value="Sick">Sick / Medical Leave</option>
                <option value="Casual">Casual / Family Event</option>
                <option value="Emergency">Urgent Emergency</option>
                <option value="Official">Official School Duty</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  From Date *
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  required
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  To Date
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Reason / Explanation *
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="State reason for absence. Attach doctor consultation or details..."
                rows={4}
                required
                className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              Submit Absence Leave
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
