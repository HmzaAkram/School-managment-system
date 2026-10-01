"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Plus,
  CheckCircle2,
  FileText,
  Award,
  ChevronRight
} from "lucide-react";

interface Exam {
  id: string;
  title: string;
  className: string;
  subject: string;
  date: string;
  time: string;
  room: string;
  candidates: number;
  status: "Scheduled" | "Grading Ready" | "Published";
  topics: string;
}

const mockExams: Exam[] = [
  { id: "EX-01", title: "Term 2 Mid-Term Mathematics Assessment", className: "Grade 10-A", subject: "Advanced Mathematics", date: "Oct 28, 2026", time: "09:00 - 11:30 AM", room: "Examination Hall A", candidates: 45, status: "Scheduled", topics: "Quadratic Equations, Complex Numbers, Trigonometry" },
  { id: "EX-02", title: "Term 2 Mid-Term Mathematics Assessment", className: "Grade 10-B", subject: "Advanced Mathematics", date: "Oct 29, 2026", time: "09:00 - 11:30 AM", room: "Examination Hall B", candidates: 42, status: "Scheduled", topics: "Quadratic Equations, Complex Numbers, Trigonometry" },
  { id: "EX-03", title: "Diagnostic Geometry & Circle Theorems Quiz", className: "Grade 9-A", subject: "Pure Mathematics", date: "Oct 20, 2026", time: "10:00 - 11:00 AM", room: "Room 103", candidates: 48, status: "Grading Ready", topics: "Angles, Tangents, Chord Properties" },
  { id: "EX-04", title: "Monthly Algebra Speed Test 3", className: "Grade 10-A", subject: "Advanced Mathematics", date: "Oct 12, 2026", time: "08:45 - 09:30 AM", room: "Room 101", candidates: 45, status: "Published", topics: "Polynomial Division & Roots Factorization" },
];

export default function TeacherExams() {
  const [filter, setFilter] = useState("All");

  const filteredExams = mockExams.filter(e => filter === "All" || e.status === filter);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Assessments</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Exams & Assessment Schedule</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Track midterm testing schedules, enter rubric scores, and download candidate seating roll sheets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm">
            <Download size={14} /> Download Question Papers
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EBE8E2] pb-2">
        {["All", "Scheduled", "Grading Ready", "Published"].map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              filter === t
                ? "bg-[#23201B] text-white shadow-sm"
                : "text-[#706B62] hover:bg-[#FAF8F5] hover:text-[#23201B]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredExams.map((ex) => (
          <div
            key={ex.id}
            className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  ex.status === "Scheduled"
                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                    : ex.status === "Grading Ready"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}>
                  {ex.status}
                </span>

                <span className="text-xs font-bold text-[#4A453E] bg-[#FAF8F5] px-2.5 py-1 rounded-lg border border-[#EBE8E2]">
                  {ex.className}
                </span>
              </div>

              <h2 className="font-bold text-lg text-[#23201B] font-sora mb-1">{ex.title}</h2>
              <p className="text-xs text-[#C4993C] font-semibold mb-4">{ex.subject}</p>

              <div className="grid grid-cols-2 gap-2 text-xs mb-4">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                  <Calendar size={13} className="text-[#C4993C]" />
                  <span className="font-semibold">{ex.date}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                  <Clock size={13} className="text-[#C4993C]" />
                  <span className="font-medium">{ex.time}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                  <MapPin size={13} className="text-[#C4993C]" />
                  <span className="font-medium">{ex.room}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                  <Users size={13} className="text-[#C4993C]" />
                  <span className="font-medium">{ex.candidates} Candidates</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#FFFDF9] border border-[#F1EAD9] text-xs text-[#706B62] mb-5">
                <span className="font-bold text-[#4A453E] block mb-0.5">Tested Syllabus:</span>
                {ex.topics}
              </div>
            </div>

            <div className="pt-4 border-t border-[#EBE8E2] flex items-center justify-between gap-3">
              {ex.status === "Grading Ready" ? (
                <button className="w-full py-2.5 px-4 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm">
                  <Award size={14} /> Enter Candidate Marks
                </button>
              ) : ex.status === "Published" ? (
                <button className="w-full py-2.5 px-4 rounded-xl border border-[#D9D4CC] text-[#23201B] hover:bg-[#FAF8F5] text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" /> View Published Gradebook
                </button>
              ) : (
                <button className="w-full py-2.5 px-4 rounded-xl border border-[#D9D4CC] text-[#23201B] hover:bg-[#FAF8F5] text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                  <FileText size={14} /> Candidate Roll List
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
