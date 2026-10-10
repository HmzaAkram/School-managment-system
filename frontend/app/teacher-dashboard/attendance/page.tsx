"use client";

import { useEffect, useState } from "react";
import {
  CheckSquare,
  Calendar,
  Clock,
  Users,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flame,
  Save,
  Check,
  Filter,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TeacherAttendance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | number>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [records, setRecords] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedToast, setSavedToast] = useState(false);
  const [search, setSearch] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      params.append("date", date);
      if (selectedClassId) params.append("class_id", String(selectedClassId));

      const res = await apiFetch<any>(`/teacher/attendance?${params.toString()}`);
      if (res.classes && res.classes.length > 0) {
        setClasses(res.classes);
        if (!selectedClassId) {
          setSelectedClassId(res.classes[0].id);
        }
      }
      setRecords(res.records || []);
    } catch (err: any) {
      console.error("Error loading attendance:", err);
      setError(err?.message || "Failed to load classroom attendance register");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [date, selectedClassId]);

  const setAllStatus = (status: "Present" | "Absent") => {
    setRecords(records.map(r => ({ ...r, status })));
  };

  const setStudentStatus = (studentId: number, status: string) => {
    setRecords(records.map(r => r.student_id === studentId ? { ...r, status } : r));
  };

  const handleSave = async () => {
    if (!selectedClassId || records.length === 0) return;
    try {
      setSaving(true);
      setError(null);
      await apiFetch("/teacher/attendance", {
        method: "POST",
        body: JSON.stringify({
          class_id: parseInt(String(selectedClassId)),
          date: date,
          attendances: records.map(r => ({
            student_id: r.student_id,
            status: r.status || "Present",
            remarks: r.remarks || null
          }))
        })
      });

      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 3500);
      fetchAttendance();
    } catch (err: any) {
      alert(err?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const presentCount = records.filter(s => s.status === "Present").length;
  const absentCount = records.filter(s => s.status === "Absent").length;
  const lateCount = records.filter(s => s.status === "Late" || s.status === "Half-Day").length;
  const leaveCount = records.filter(s => s.status === "Excused").length;
  const totalCount = records.length;
  const attendanceRate = totalCount > 0 ? Math.round((presentCount / totalCount) * 100) : 100;

  const filteredStudents = records.filter(s => {
    const term = search.toLowerCase();
    return (
      (s.student_name || "").toLowerCase().includes(term) ||
      (s.roll_number || "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Daily Roll Call</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Classroom Attendance Register</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Mark daily presence, track chronic absentees, and log excuse notes directly to MySQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saving || records.length === 0}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
          >
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            <span>Save Attendance Roster</span>
          </button>
        </div>
      </div>

      {/* Toast */}
      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Attendance records successfully synchronized and committed to database!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Present Rate", value: `${attendanceRate}%`, sub: `${presentCount} of ${totalCount} attendees`, icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Absent Students", value: absentCount.toString(), sub: "Unverified absences", icon: XCircle, color: "text-red-700", bg: "bg-red-50/60 border-red-200/80" },
          { label: "Late Arrivals", value: lateCount.toString(), sub: "Tardy roll calls", icon: Clock, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Excused Leaves", value: leaveCount.toString(), sub: "Sanctioned requests", icon: AlertTriangle, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
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

      {/* Control Bar */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#8C877D] uppercase tracking-wider">Class:</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl outline-none"
            >
              {classes.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.section ? `(${c.section})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs font-bold text-[#8C877D] uppercase tracking-wider">Date:</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl outline-none"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <button
            onClick={() => setAllStatus("Present")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors"
          >
            Mark All Present
          </button>
          <button
            onClick={() => setAllStatus("Absent")}
            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 transition-colors"
          >
            Mark All Absent
          </button>
        </div>
      </div>

      {/* Student Attendance Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[250px]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <span>Loading student roll call register...</span>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No students enrolled in this section roster.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
                <tr>
                  <th className="py-3.5 px-6">Roll No</th>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Current Status</th>
                  <th className="py-3.5 px-6 text-right">Quick Mark Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE8E2]">
                {filteredStudents.map((s) => (
                  <tr key={s.student_id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#8C877D]">
                      {s.roll_number || `#${s.student_id}`}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#23201B] font-sora text-sm">{s.student_name}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        s.status === "Present" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                        s.status === "Absent" ? "bg-red-50 text-red-700 border border-red-200" :
                        s.status === "Late" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                        "bg-slate-100 text-slate-700"
                      }`}>
                        {s.status || "Unmarked"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {["Present", "Absent", "Late", "Excused"].map((st) => (
                          <button
                            key={st}
                            onClick={() => setStudentStatus(s.student_id, st)}
                            className={`px-2.5 py-1 text-xs rounded-lg font-bold transition-all ${
                              s.status === st
                                ? st === "Present"
                                  ? "bg-emerald-600 text-white"
                                  : st === "Absent"
                                  ? "bg-red-600 text-white"
                                  : "bg-amber-600 text-white"
                                : "bg-[#FAF8F5] text-[#706B62] border border-[#EBE8E2] hover:bg-[#EBE8E2]"
                            }`}
                          >
                            {st}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
