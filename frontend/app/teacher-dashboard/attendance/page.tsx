"use client";

import { useState } from "react";
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
  Filter
} from "lucide-react";

interface StudentAttendance {
  id: number;
  rollNo: string;
  name: string;
  avatar: string;
  status: "Present" | "Absent" | "Late" | "Leave";
  streak: number;
  notes?: string;
}

const initialStudents: StudentAttendance[] = [
  { id: 1, rollNo: "10A-01", name: "Ali Hassan", avatar: "AH", status: "Present", streak: 18 },
  { id: 2, rollNo: "10A-02", name: "Sara Ahmed", avatar: "SA", status: "Present", streak: 12 },
  { id: 3, rollNo: "10A-03", name: "Omar Sheikh", avatar: "OS", status: "Absent", streak: 0, notes: "Medical appointment" },
  { id: 4, rollNo: "10A-04", name: "Zara Qureshi", avatar: "ZQ", status: "Late", streak: 4 },
  { id: 5, rollNo: "10A-05", name: "Bilal Nawaz", avatar: "BN", status: "Present", streak: 25 },
  { id: 6, rollNo: "10A-06", name: "Fatima Noor", avatar: "FN", status: "Present", streak: 9 },
  { id: 7, rollNo: "10A-07", name: "Hamza Tariq", avatar: "HT", status: "Leave", streak: 0, notes: "Authorized family leave" },
  { id: 8, rollNo: "10A-08", name: "Ayesha Malik", avatar: "AM", status: "Present", streak: 14 },
];

export default function TeacherAttendance() {
  const [students, setStudents] = useState<StudentAttendance[]>(initialStudents);
  const [selectedClass, setSelectedClass] = useState("Grade 10-A (Mathematics)");
  const [date, setDate] = useState("2026-10-01");
  const [search, setSearch] = useState("");
  const [savedToast, setSavedToast] = useState(false);

  const setAllStatus = (status: "Present" | "Absent") => {
    setStudents(students.map(s => ({ ...s, status })));
  };

  const setStudentStatus = (id: number, status: "Present" | "Absent" | "Late" | "Leave") => {
    setStudents(students.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3500);
  };

  const presentCount = students.filter(s => s.status === "Present").length;
  const absentCount = students.filter(s => s.status === "Absent").length;
  const lateCount = students.filter(s => s.status === "Late").length;
  const leaveCount = students.filter(s => s.status === "Leave").length;
  const attendanceRate = Math.round((presentCount / students.length) * 100);

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

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
            Mark daily presence, track chronic absentees, and log excuse notes.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md"
          >
            <Save size={15} /> Save Attendance Roster
          </button>
        </div>
      </div>

      {/* Toast */}
      {savedToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Attendance records for {selectedClass} successfully saved and synced to cloud!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-[#EBE8E2] shadow-sm">
          <span className="text-[11px] font-bold text-[#8C877D] uppercase tracking-wider block mb-1">Total Enrolled</span>
          <div className="text-2xl font-extrabold text-[#23201B] font-sora">{students.length}</div>
          <span className="text-[11px] text-[#8C877D]">100% active</span>
        </div>

        <div className="bg-emerald-50/60 p-4 rounded-2xl border border-emerald-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block mb-1">Present</span>
          <div className="text-2xl font-extrabold text-emerald-900 font-sora">{presentCount}</div>
          <span className="text-[11px] text-emerald-700 font-semibold">{attendanceRate}% Rate</span>
        </div>

        <div className="bg-red-50/60 p-4 rounded-2xl border border-red-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-red-800 uppercase tracking-wider block mb-1">Absent</span>
          <div className="text-2xl font-extrabold text-red-900 font-sora">{absentCount}</div>
          <span className="text-[11px] text-red-700 font-medium">Unexcused</span>
        </div>

        <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200/80 shadow-sm">
          <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block mb-1">Late Arrival</span>
          <div className="text-2xl font-extrabold text-amber-900 font-sora">{lateCount}</div>
          <span className="text-[11px] text-amber-700 font-medium">Flagged</span>
        </div>

        <div className="bg-blue-50/60 p-4 rounded-2xl border border-blue-200/80 shadow-sm col-span-2 sm:col-span-1">
          <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider block mb-1">On Leave</span>
          <div className="text-2xl font-extrabold text-blue-900 font-sora">{leaveCount}</div>
          <span className="text-[11px] text-blue-700 font-medium">Authorized</span>
        </div>
      </div>

      {/* Control Bar: Class, Date, Quick Mark, Search */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-5 flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <div>
            <label className="block text-[10px] font-bold text-[#8C877D] uppercase tracking-wider mb-1">Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-2 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl outline-none focus:border-[#C4993C]"
            >
              <option>Grade 10-A (Mathematics)</option>
              <option>Grade 10-B (Mathematics)</option>
              <option>Grade 9-A (Mathematics)</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-[#8C877D] uppercase tracking-wider mb-1">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-2 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl outline-none focus:border-[#C4993C]"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-between lg:justify-end">
          <div className="relative w-full sm:w-56">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setAllStatus("Present")}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={() => setAllStatus("Absent")}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] text-[#706B62] border border-[#D9D4CC] hover:bg-[#EBE8E2] transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
              <tr>
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Streak</th>
                <th className="py-4 px-6">Mark Attendance Status</th>
                <th className="py-4 px-6 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8E2]">
              {filteredStudents.map((s) => (
                <tr key={s.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#8C877D]">
                    {s.rollNo}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4993C] to-[#D4A843] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                        {s.avatar}
                      </div>
                      <div className="font-bold text-[#23201B] text-sm font-sora">{s.name}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {s.streak > 5 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                        <Flame size={12} className="text-amber-500 fill-amber-500" /> {s.streak} Days
                      </span>
                    ) : (
                      <span className="text-[11px] text-[#8C877D]">{s.streak} Days</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-1.5">
                      {(["Present", "Absent", "Late", "Leave"] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setStudentStatus(s.id, st)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                            s.status === st
                              ? st === "Present"
                                ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                                : st === "Absent"
                                ? "bg-red-600 text-white border-red-600 shadow-sm"
                                : st === "Late"
                                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                                : "bg-blue-600 text-white border-blue-600 shadow-sm"
                              : "bg-[#FAF8F5] text-[#706B62] border-[#EBE8E2] hover:bg-white hover:text-[#23201B]"
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <span className="text-xs text-[#8C877D] italic">
                      {s.notes || "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
