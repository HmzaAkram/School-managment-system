"use client";

import { useState } from "react";
import {
  Award,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  BarChart3,
  Star,
  Printer
} from "lucide-react";

interface SubjectGrade {
  subject: string;
  code: string;
  credits: number;
  coursework: number;
  midterm: number;
  finalExam: number;
  totalScore: number;
  grade: string;
  gpaPoint: number;
  remarks: string;
}

const reportGrades: SubjectGrade[] = [
  { subject: "Advanced Mathematics", code: "MATH-301", credits: 4, coursework: 98, midterm: 95, finalExam: 96, totalScore: 96, grade: "A+", gpaPoint: 4.0, remarks: "Top percentile. Mastered complex polynomials." },
  { subject: "Physics & Mechanics", code: "PHYS-204", credits: 4, coursework: 92, midterm: 90, finalExam: 94, totalScore: 92, grade: "A", gpaPoint: 3.9, remarks: "Excellent lab synthesis and vector calculations." },
  { subject: "English Literature", code: "ENG-102", credits: 3, coursework: 88, midterm: 92, finalExam: 90, totalScore: 90, grade: "A", gpaPoint: 3.8, remarks: "Eloquent essays with compelling textual arguments." },
  { subject: "Chemistry & Organic Analysis", code: "CHEM-202", credits: 3, coursework: 90, midterm: 86, finalExam: 88, totalScore: 88, grade: "A-", gpaPoint: 3.7, remarks: "Solid understanding of chemical structures." },
  { subject: "Computer Science & AI", code: "CS-105", credits: 3, coursework: 99, midterm: 96, finalExam: 98, totalScore: 98, grade: "A+", gpaPoint: 4.0, remarks: "Exceptional algorithmic logic and code architecture." },
  { subject: "World History & Civics", code: "HIST-101", credits: 2, coursework: 84, midterm: 82, finalExam: 86, totalScore: 84, grade: "B+", gpaPoint: 3.3, remarks: "Well-researched historiography projects." },
];

export default function StudentGrades() {
  const [selectedTerm, setSelectedTerm] = useState("Term 2 (Current)");
  const [downloadToast, setDownloadToast] = useState(false);

  const handleDownload = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Student Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Academic Records</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Grades & Term Report Cards</h1>
          <p className="text-sm text-[#706B62] mt-1">
            View course GPA calculations, cumulative credit hours, and certified term transcripts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm"
          >
            <Printer size={14} /> Print Report Sheet
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md"
          >
            <Download size={14} /> Download PDF Transcript
          </button>
        </div>
      </div>

      {downloadToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Official institutional PDF transcript for Term 2 downloaded!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Semester GPA", value: "3.92", sub: "Out of 4.0 scale", icon: Award, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Cohort Standing", value: "Rank #1", sub: "Top of Grade 10-A", icon: Star, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Aggregate Percentage", value: "92.4%", sub: "+2.1% from Term 1", icon: TrendingUp, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Total Earned Credits", value: "19 / 19", sub: "All prerequisites met", icon: CheckCircle2, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
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

      {/* Term Selector & Report Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base text-[#23201B] font-sora">Consolidated Term Grade Sheet</h2>
            <p className="text-xs text-[#8C877D]">Grading weights: 20% Coursework, 40% Mid-Term, 40% Final Exam</p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2]">
            {["Term 1 (Finalized)", "Term 2 (Current)"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTerm(t)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedTerm === t
                    ? "bg-[#23201B] text-white shadow-sm"
                    : "text-[#706B62] hover:text-[#23201B]"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
              <tr>
                <th className="py-4 px-6">Subject & Course</th>
                <th className="py-4 px-6">Credits</th>
                <th className="py-4 px-6">Coursework</th>
                <th className="py-4 px-6">Midterm</th>
                <th className="py-4 px-6">Final Exam</th>
                <th className="py-4 px-6">Weighted Score</th>
                <th className="py-4 px-6">Grade</th>
                <th className="py-4 px-6">GPA Pt</th>
                <th className="py-4 px-6 text-right">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8E2]">
              {reportGrades.map((g, i) => (
                <tr key={i} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#23201B] text-sm font-sora">{g.subject}</div>
                    <div className="text-[11px] font-mono text-[#8C877D] mt-0.5">{g.code}</div>
                  </td>
                  <td className="py-4 px-6 font-semibold text-[#4A453E]">
                    {g.credits} Credits
                  </td>
                  <td className="py-4 px-6 text-[#706B62] font-medium">
                    {g.coursework}%
                  </td>
                  <td className="py-4 px-6 text-[#706B62] font-medium">
                    {g.midterm}%
                  </td>
                  <td className="py-4 px-6 text-[#706B62] font-medium">
                    {g.finalExam}%
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-extrabold text-[#23201B] text-sm font-sora">{g.totalScore}%</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      g.grade.startsWith("A")
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-blue-50 text-blue-800 border border-blue-200"
                    }`}>
                      {g.grade}
                    </span>
                  </td>
                  <td className="py-4 px-6 font-mono font-bold text-[#C4993C]">
                    {g.gpaPoint.toFixed(1)}
                  </td>
                  <td className="py-4 px-6 text-right text-[#706B62] italic max-w-xs truncate">
                    {g.remarks}
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
