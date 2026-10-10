"use client";

import { useEffect, useState } from "react";
import {
  TrendingUp,
  Award,
  Users,
  Search,
  Download,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  BarChart2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TeacherPerformance() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | number>("");
  const [marksData, setMarksData] = useState<any[]>([]);
  const [performanceOverview, setPerformanceOverview] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Load Classes and Performance Overview
  useEffect(() => {
    async function loadMeta() {
      try {
        const [clsRes, perfRes] = await Promise.allSettled([
          apiFetch<any>("/teacher/classes"),
          apiFetch<any>("/teacher/performance")
        ]);

        if (clsRes.status === "fulfilled") {
          const list = Array.isArray(clsRes.value) ? clsRes.value : (clsRes.value.data || []);
          setClasses(list);
          if (list.length > 0 && !selectedClassId) {
            setSelectedClassId(list[0].id);
          }
        }

        if (perfRes.status === "fulfilled") {
          setPerformanceOverview(perfRes.value);
        }
      } catch (err: any) {
        console.error("Failed to load performance meta:", err);
      }
    }
    loadMeta();
  }, []);

  // Load marks for the selected class
  useEffect(() => {
    async function loadClassMarks() {
      if (!selectedClassId) return;
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<any>(`/teacher/marks?class_id=${selectedClassId}&per_page=100`);
        setMarksData(res.data || []);
      } catch (err: any) {
        console.error("Failed to load class marks:", err);
        setError(err?.message || "Failed to load class academic scores");
      } finally {
        setLoading(false);
      }
    }
    loadClassMarks();
  }, [selectedClassId]);

  const filtered = marksData.filter(s => {
    const term = search.toLowerCase();
    return (
      (s.student_name || "").toLowerCase().includes(term) ||
      (s.roll_number || "").toLowerCase().includes(term) ||
      (s.subject || "").toLowerCase().includes(term)
    );
  });

  // Calculate live cohort metrics
  const totalEntries = marksData.length;
  const avgObtained = totalEntries > 0
    ? (marksData.reduce((acc, curr) => acc + (Number(curr.marks_obtained) || 0), 0) / totalEntries).toFixed(1)
    : "0";
  const avgTotal = totalEntries > 0
    ? (marksData.reduce((acc, curr) => acc + (Number(curr.total_marks) || 100), 0) / totalEntries).toFixed(0)
    : "100";
  const cohortAvg = Number(avgTotal) > 0 ? ((Number(avgObtained) / Number(avgTotal)) * 100).toFixed(1) : "0";

  const topStudent = marksData.reduce((prev, curr) => {
    const prevScore = Number(prev?.marks_obtained) || 0;
    const currScore = Number(curr?.marks_obtained) || 0;
    return currScore > prevScore ? curr : prev;
  }, marksData[0] || null);

  const passingCount = marksData.filter(m => (Number(m.percentage) || 0) >= 33).length;
  const passRate = totalEntries > 0 ? Math.round((passingCount / totalEntries) * 100) : 100;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Student Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Class Academic Performance</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Analyze grade trajectories, identify at-risk students, and track subject mastery from MySQL records.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={14} /> Export Marks Ledger
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Cohort Average", value: `${cohortAvg}%`, change: `Avg: ${avgObtained} / ${avgTotal}`, icon: TrendingUp, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Top Score", value: topStudent ? `${topStudent.marks_obtained} pts` : "N/A", change: topStudent ? `${topStudent.student_name} (${topStudent.grade || 'A+'})` : "No marks entered", icon: Award, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Pass Rate", value: `${passRate}%`, change: `${passingCount} of ${totalEntries} passed`, icon: BarChart2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Scores Logged", value: totalEntries.toString(), change: "Gradebook entries", icon: Users, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.bg} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#706B62] mt-1 font-medium">{stat.change}</div>
          </div>
        ))}
      </div>

      {/* Grade Book Card */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
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

          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by student or roll number..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto min-h-[250px]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <span>Loading student evaluation scores...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No academic marks recorded for this class yet.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
                <tr>
                  <th className="py-3.5 px-6">Roll No</th>
                  <th className="py-3.5 px-6">Student Name</th>
                  <th className="py-3.5 px-6">Exam & Subject</th>
                  <th className="py-3.5 px-6 text-center">Score Obtained</th>
                  <th className="py-3.5 px-6 text-center">Total Marks</th>
                  <th className="py-3.5 px-6 text-center">Grade</th>
                  <th className="py-3.5 px-6 text-center">GPA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE8E2]">
                {filtered.map((s, idx) => (
                  <tr key={s.id || idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-3.5 px-6 font-mono font-bold text-[#8C877D]">
                      {s.roll_number || `#${s.student_id}`}
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-bold text-[#23201B] font-sora text-sm">{s.student_name}</div>
                    </td>
                    <td className="py-3.5 px-6">
                      <div className="font-semibold text-[#23201B]">{s.subject}</div>
                      <div className="text-[10px] text-[#8C877D]">{s.exam} ({s.term || "Term"})</div>
                    </td>
                    <td className="py-3.5 px-6 text-center font-bold text-[#23201B] text-sm">
                      {s.marks_obtained}
                    </td>
                    <td className="py-3.5 px-6 text-center font-semibold text-[#706B62]">
                      {s.total_marks}
                    </td>
                    <td className="py-3.5 px-6 text-center">
                      <span className="font-bold px-2 py-0.5 rounded bg-[#FAF3E5] text-[#996B1E] border border-[#EBE5D9]">
                        {s.grade || "A"}
                      </span>
                    </td>
                    <td className="py-3.5 px-6 text-center font-mono font-bold text-[#4A453E]">
                      {s.gpa_point ? Number(s.gpa_point).toFixed(1) : "3.5"}
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
