"use client";

import { useState } from "react";
import {
  MessageSquare,
  Search,
  Send,
  Star,
  CheckCircle2,
  Users,
  Award,
  Clock,
  Sparkles,
  AlertCircle
} from "lucide-react";

interface StudentReview {
  id: number;
  rollNo: string;
  name: string;
  className: string;
  avatar: string;
  rating: "Exceptional" | "Satisfactory" | "Needs Attention";
  lastReviewDate: string;
  remarks: string;
  strengths: string[];
}

const mockStudents: StudentReview[] = [
  { id: 1, rollNo: "10A-01", name: "Ali Hassan", className: "Grade 10-A", avatar: "AH", rating: "Exceptional", lastReviewDate: "Sep 25, 2026", remarks: "Demonstrates exceptional analytical skills in problem sets. Regularly mentors peers during group algebra workshops.", strengths: ["Leadership", "Analytical Thinking", "Discipline"] },
  { id: 2, rollNo: "10A-04", name: "Zara Qureshi", className: "Grade 10-A", avatar: "ZQ", rating: "Exceptional", lastReviewDate: "Sep 20, 2026", remarks: "Thorough understanding of geometrical proofs. Actively asks clarifying questions and contributes to class discussions.", strengths: ["Curiosity", "Participation", "Consistent"] },
  { id: 3, rollNo: "10A-02", name: "Sara Ahmed", className: "Grade 10-A", avatar: "SA", rating: "Satisfactory", lastReviewDate: "Sep 15, 2026", remarks: "Consistent worker. With continued practice on trigonometric identity proofs, will easily achieve A+ tier.", strengths: ["Hardworking", "Punctual"] },
  { id: 4, rollNo: "10A-03", name: "Omar Sheikh", className: "Grade 10-A", avatar: "OS", rating: "Needs Attention", lastReviewDate: "Sep 10, 2026", remarks: "Frequently misses homework submission deadlines due to absenteeism. Recommend after-school tutorial.", strengths: ["Creative"] },
];

export default function TeacherReviews() {
  const [students, setStudents] = useState<StudentReview[]>(mockStudents);
  const [selectedStudent, setSelectedStudent] = useState<StudentReview>(mockStudents[0]);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<"Exceptional" | "Satisfactory" | "Needs Attention">("Exceptional");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    const updated = students.map(s => {
      if (s.id === selectedStudent.id) {
        return {
          ...s,
          rating,
          remarks: reviewText,
          lastReviewDate: "Today",
        };
      }
      return s;
    });

    setStudents(updated);
    setSelectedStudent({ ...selectedStudent, rating, remarks: reviewText, lastReviewDate: "Today" });
    setReviewText("");
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  const filtered = students.filter(s =>
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
            <span className="text-[#C4993C]">Behavior & Remarks</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Student Remarks & Progress Reviews</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Publish qualitative feedback, report card comments, and behavioral observations to guardians.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8C877D] px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2]">
            Remarks Synchronized with Report Cards
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Evaluation for {selectedStudent.name} successfully updated and notified to parents!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* 2-column layout: Student Selector on left, Feedback Form & History on right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left: Students List (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden flex flex-col h-[640px]">
          <div className="p-4 border-b border-[#EBE8E2] bg-[#FAF8F5]">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877D]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search student..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-[#D9D4CC] rounded-xl bg-white outline-none focus:border-[#C4993C]"
              />
            </div>
          </div>

          <div className="overflow-y-auto flex-1 divide-y divide-[#EBE8E2]">
            {filtered.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedStudent(s)}
                className={`w-full text-left p-4 flex items-center gap-3 transition-colors ${
                  selectedStudent.id === s.id
                    ? "bg-[#FFFDF9] border-l-4 border-l-[#C4993C]"
                    : "hover:bg-[#FAF8F5] border-l-4 border-l-transparent"
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C4993C] to-[#D4A843] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
                  {s.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#23201B] font-sora truncate">{s.name}</span>
                    <span className="text-[10px] font-mono text-[#8C877D]">{s.rollNo}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-[#706B62]">{s.className}</span>
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      s.rating === "Exceptional"
                        ? "bg-emerald-50 text-emerald-800"
                        : s.rating === "Satisfactory"
                        ? "bg-blue-50 text-blue-800"
                        : "bg-amber-50 text-amber-800"
                    }`}>
                      {s.rating}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Review Details & Form (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Student Profile Header */}
          <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EBE8E2]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#C4993C] to-[#D4A843] flex items-center justify-center text-white text-lg font-bold shadow-md">
                  {selectedStudent.avatar}
                </div>
                <div>
                  <h2 className="font-bold text-xl text-[#23201B] font-sora">{selectedStudent.name}</h2>
                  <div className="flex items-center gap-3 text-xs text-[#706B62] mt-0.5">
                    <span>Roll No: <strong>{selectedStudent.rollNo}</strong></span>
                    <span>•</span>
                    <span>Class: <strong>{selectedStudent.className}</strong></span>
                  </div>
                </div>
              </div>

              <span className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider self-start sm:self-center ${
                selectedStudent.rating === "Exceptional"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : selectedStudent.rating === "Satisfactory"
                  ? "bg-blue-50 text-blue-800 border border-blue-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}>
                Current Status: {selectedStudent.rating}
              </span>
            </div>

            {/* Current Active Remark */}
            <div className="pt-5">
              <span className="text-[11px] font-bold text-[#8C877D] uppercase tracking-wider block mb-1">
                Latest Published Evaluation ({selectedStudent.lastReviewDate})
              </span>
              <p className="text-xs text-[#4A453E] leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE8E2]">
                "{selectedStudent.remarks}"
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[11px] font-bold text-[#706B62]">Recognized Strengths:</span>
                {selectedStudent.strengths.map((str, i) => (
                  <span key={i} className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FFFDF9] border border-[#F1EAD9] text-[#C4993C]">
                    ★ {str}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Form to submit new review */}
          <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-[#EBE8E2]">
              <Sparkles size={18} className="text-[#C4993C]" />
              <h3 className="font-bold text-base text-[#23201B] font-sora">Append New Term Remark</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Performance Classification
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Exceptional", "Satisfactory", "Needs Attention"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRating(r)}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                        rating === r
                          ? "bg-[#23201B] text-white border-[#23201B] shadow-sm"
                          : "bg-[#FAF8F5] text-[#706B62] border-[#EBE8E2] hover:bg-white"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Detailed Teacher Remarks & Notes *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Detail academic strengths, behavioral development, and parental guidance tips..."
                  rows={4}
                  required
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3.5 outline-none bg-[#FAF8F5] focus:border-[#C4993C] focus:bg-white resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="py-3 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md transition-all flex items-center gap-2"
                >
                  <Send size={14} /> Submit & Notify Guardian
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
