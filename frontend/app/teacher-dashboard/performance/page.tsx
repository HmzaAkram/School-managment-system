"use client";

import { useState } from "react";
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
  BarChart2
} from "lucide-react";

interface StudentScore {
  id: number;
  rollNo: string;
  name: string;
  avatar: string;
  previousScore: number;
  currentScore: number;
  grade: string;
  rank: number;
}

const mockScores: StudentScore[] = [
  { id: 1, rollNo: "10A-01", name: "Ali Hassan", avatar: "AH", previousScore: 92, currentScore: 96, grade: "A+", rank: 1 },
  { id: 2, rollNo: "10A-04", name: "Zara Qureshi", avatar: "ZQ", previousScore: 89, currentScore: 94, grade: "A+", rank: 2 },
  { id: 3, rollNo: "10A-02", name: "Sara Ahmed", avatar: "SA", previousScore: 85, currentScore: 91, grade: "A", rank: 3 },
  { id: 4, rollNo: "10A-05", name: "Bilal Nawaz", avatar: "BN", previousScore: 82, currentScore: 87, grade: "A", rank: 4 },
  { id: 5, rollNo: "10A-06", name: "Fatima Noor", avatar: "FN", previousScore: 80, currentScore: 84, grade: "B+", rank: 5 },
  { id: 6, rollNo: "10A-03", name: "Omar Sheikh", avatar: "OS", previousScore: 78, currentScore: 76, grade: "B", rank: 6 },
  { id: 7, rollNo: "10A-08", name: "Ayesha Malik", avatar: "AM", previousScore: 70, currentScore: 75, grade: "B", rank: 7 },
  { id: 8, rollNo: "10A-07", name: "Hamza Tariq", avatar: "HT", previousScore: 68, currentScore: 72, grade: "C+", rank: 8 },
];

export default function TeacherPerformance() {
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");
  const [search, setSearch] = useState("");

  const filtered = mockScores.filter(s =>
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
            <span className="text-[#C4993C]">Student Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Class Academic Performance</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Analyze grade trajectories, identify at-risk students, and track subject mastery.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm">
            <Download size={14} /> Export Marks Ledger
          </button>
        </div>
      </div>

      {/* Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Class Average", value: "85.6%", change: "+3.2% vs Term 1", icon: TrendingUp, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Top Score", value: "96.0%", change: "Ali Hassan (Rank #1)", icon: Award, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Pass Rate", value: "100%", change: "0 failing candidates", icon: BarChart2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Students Evaluated", value: "45 / 45", change: "Full cohort assessed", icon: Users, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
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
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-3 py-1.5 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl outline-none"
            >
              <option>Grade 10-A</option>
              <option>Grade 10-B</option>
              <option>Grade 9-A</option>
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C877D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search student or roll no..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
              <tr>
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Roll No</th>
                <th className="py-4 px-6">Student</th>
                <th className="py-4 px-6">Previous Term</th>
                <th className="py-4 px-6">Current Score</th>
                <th className="py-4 px-6">Grade Tier</th>
                <th className="py-4 px-6 text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8E2]">
              {filtered.map((s) => {
                const diff = s.currentScore - s.previousScore;
                return (
                  <tr key={s.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-[#23201B]">
                      {s.rank === 1 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                          🥇
                        </span>
                      ) : s.rank === 2 ? (
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                          🥈
                        </span>
                      ) : s.rank === 3 ? (
                        <span className="w-6 h-6 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs">
                          🥉
                        </span>
                      ) : (
                        <span className="text-[#8C877D] font-mono pl-2">#{s.rank}</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-[#8C877D] font-bold">
                      {s.rollNo}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#C4993C] to-[#D4A843] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                          {s.avatar}
                        </div>
                        <span className="font-bold text-[#23201B] text-sm font-sora">{s.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-[#706B62] font-semibold">
                      {s.previousScore}%
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-[#23201B] text-sm font-sora">{s.currentScore}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.grade.startsWith("A")
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : s.grade.startsWith("B")
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {s.grade}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {diff >= 0 ? (
                        <span className="text-emerald-700 font-bold inline-flex items-center gap-0.5">
                          <ArrowUpRight size={13} /> +{diff}%
                        </span>
                      ) : (
                        <span className="text-red-600 font-bold inline-flex items-center gap-0.5">
                          <ArrowDownRight size={13} /> {diff}%
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
