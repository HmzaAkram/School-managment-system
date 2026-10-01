"use client";

import { useState } from "react";
import {
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle,
  FileText,
  AlertCircle
} from "lucide-react";

interface ExamEntry {
  id: string;
  subject: string;
  code: string;
  grade: string;
  date: string;
  time: string;
  hall: string;
  invigilator: string;
  registeredStudents: number;
  status: "Scheduled" | "In Progress" | "Completed" | "Grading";
}

const initialExams: ExamEntry[] = [
  { id: "EX-101", subject: "Advanced Mathematics", code: "MATH-301", grade: "Grade 10-A & B", date: "Oct 28, 2026", time: "09:00 - 11:30 AM", hall: "Main Examination Hall A", invigilator: "Dr. Angela Merkel", registeredStudents: 88, status: "Scheduled" },
  { id: "EX-102", subject: "Physics & Thermodynamics", code: "PHYS-204", grade: "Grade 10-A", date: "Oct 30, 2026", time: "09:00 - 11:00 AM", hall: "Science Block Hall 2", invigilator: "Elena Rostova", registeredStudents: 45, status: "Scheduled" },
  { id: "EX-103", subject: "English Literature & Essay", code: "ENG-102", grade: "Grade 9 & 10", date: "Nov 02, 2026", time: "10:00 - 12:00 PM", hall: "Auditorium West Wing", invigilator: "Clara Oswald", registeredStudents: 96, status: "Scheduled" },
  { id: "EX-104", subject: "Chemistry & Organic Analysis", code: "CHEM-202", grade: "Grade 10-B", date: "Oct 22, 2026", time: "09:00 - 11:00 AM", hall: "Chemistry Lab A", invigilator: "David Kim", registeredStudents: 43, status: "Grading" },
  { id: "EX-105", subject: "Computer Science Practicum", code: "CS-105", grade: "Grade 10-A", date: "Oct 18, 2026", time: "08:30 - 10:30 AM", hall: "Computer Lab 1 & 2", invigilator: "David Kim", registeredStudents: 45, status: "Completed" },
];

export default function AdminExaminations() {
  const [exams, setExams] = useState<ExamEntry[]>(initialExams);
  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  const filteredExams = exams.filter(e => {
    const matchesSearch = e.subject.toLowerCase().includes(search.toLowerCase()) || e.code.toLowerCase().includes(search.toLowerCase()) || e.grade.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || e.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Administration</span>
            <span>/</span>
            <span className="text-[#C4993C]">Examinations & Grading</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Mid-Term Examination Portal</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Coordinate exam hall seatings, invigilation duty rosters, date sheets, and result publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm">
            <FileText size={14} /> Print Date Sheets
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md">
            <Plus size={14} /> Schedule New Exam
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Exam Term", value: "Term 2 Mid-Terms", sub: "2025-2026 Academic Session", icon: ClipboardList, color: "text-[#C4993C]" },
          { label: "Papers Scheduled", value: "24", sub: "Across 6 grade tiers", icon: Calendar, color: "text-blue-600" },
          { label: "Total Candidates", value: "520", sub: "Roll numbers allocated", icon: Users, color: "text-emerald-600" },
          { label: "Results Published", value: "8 / 24", sub: "Verified by academic head", icon: Award, color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#EBE8E2] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-[#FAF8F5] ${stat.color} border border-[#EBE8E2]`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#8C877D] mt-1 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Table & Filter Card */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C877D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, code, or grade..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {["All", "Scheduled", "Grading", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === st
                    ? "bg-[#23201B] text-white"
                    : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
              <tr>
                <th className="py-4 px-6">Subject & Code</th>
                <th className="py-4 px-6">Target Grade</th>
                <th className="py-4 px-6">Date & Time</th>
                <th className="py-4 px-6">Hall & Invigilator</th>
                <th className="py-4 px-6">Candidates</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8E2]">
              {filteredExams.map((ex) => (
                <tr key={ex.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#23201B] text-sm font-sora">{ex.subject}</div>
                    <div className="text-[11px] font-mono text-[#8C877D] mt-0.5">{ex.code}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#4A453E]">
                    {ex.grade}
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-[#23201B] flex items-center gap-1">
                      <Calendar size={12} className="text-[#C4993C]" /> {ex.date}
                    </div>
                    <div className="text-[11px] text-[#8C877D] flex items-center gap-1 mt-0.5">
                      <Clock size={11} /> {ex.time}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-[#23201B] flex items-center gap-1">
                      <MapPin size={12} className="text-[#C4993C]" /> {ex.hall}
                    </div>
                    <div className="text-[11px] text-[#706B62] mt-0.5">Invigilator: {ex.invigilator}</div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-[#23201B] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#EBE8E2]">
                      {ex.registeredStudents} Students
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      ex.status === "Scheduled"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : ex.status === "Grading"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {ex.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] text-[#23201B] font-bold text-xs hover:bg-[#FAF8F5] transition-all">
                      Manage
                    </button>
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
