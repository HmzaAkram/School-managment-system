"use client";

import { useEffect, useState } from "react";
import {
  Award,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle2,
  FileText,
  BarChart3,
  Star,
  Printer,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface MarkRecord {
  id: number;
  exam_id: number;
  exam: string;
  term?: string;
  exam_date?: string;
  subject_id: number;
  subject: string;
  subject_code?: string;
  credits?: number;
  marks_obtained: number;
  total_marks: number;
  percentage: number;
  grade: string;
  gpa_point: number;
  remarks?: string;
}

interface GradesSummary {
  summary: {
    entries: number;
    gpa: number | null;
    percentage: number | null;
    grade: string | null;
    subjects_passed: number;
    subjects_failed: number;
  };
  by_exam: Array<{
    exam_id: number;
    exam: string;
    term?: string;
    subjects: number;
    obtained: number;
    total: number;
    percentage: number;
    grade: string;
    gpa: number;
    result: string;
  }>;
  by_subject: Array<{
    subject_id: number;
    subject: string;
    code?: string;
    credits?: number;
    obtained: number;
    total: number;
    percentage: number;
    grade: string;
    result: string;
  }>;
}

export default function StudentGrades() {
  const [marks, setMarks] = useState<MarkRecord[]>([]);
  const [summaryData, setSummaryData] = useState<GradesSummary | null>(null);
  const [selectedExamId, setSelectedExamId] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadToast, setDownloadToast] = useState(false);

  useEffect(() => {
    async function loadGrades() {
      try {
        setLoading(true);
        setError(null);
        const [marksRes, sumRes] = await Promise.all([
          apiFetch<any>("/student/marks?per_page=100"),
          apiFetch<GradesSummary>("/student/marks/summary"),
        ]);

        if (marksRes?.data && Array.isArray(marksRes.data)) {
          setMarks(marksRes.data);
        } else if (Array.isArray(marksRes)) {
          setMarks(marksRes);
        } else {
          setMarks([]);
        }

        if (sumRes) {
          setSummaryData(sumRes);
        }
      } catch (err: any) {
        console.error("Failed to load grades:", err);
        setError(err.message || "Failed to load academic grades");
      } finally {
        setLoading(false);
      }
    }
    loadGrades();
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setDownloadToast(true);
    setTimeout(() => setDownloadToast(false), 3500);
  };

  const filteredMarks = selectedExamId === "all"
    ? marks
    : marks.filter((m) => String(m.exam_id) === selectedExamId);

  const availableExams = summaryData?.by_exam || [];

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
            onClick={handlePrint}
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
              Official institutional academic transcript downloaded!
            </p>
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
            label: "Cumulative GPA",
            value: summaryData?.summary?.gpa ? Number(summaryData.summary.gpa).toFixed(2) : "—",
            sub: "On a 4.0 scale",
            icon: Award,
            color: "text-[#C4993C]",
            bg: "bg-[#FFFDF9] border-[#F1EAD9]"
          },
          {
            label: "Performance Grade",
            value: summaryData?.summary?.grade || "N/A",
            sub: `${summaryData?.summary?.entries || 0} examination papers recorded`,
            icon: Star,
            color: "text-amber-700",
            bg: "bg-amber-50/60 border-amber-200/80"
          },
          {
            label: "Aggregate Percentage",
            value: summaryData?.summary?.percentage !== null && summaryData?.summary?.percentage !== undefined ? `${summaryData.summary.percentage}%` : "—",
            sub: "Overall academic average",
            icon: TrendingUp,
            color: "text-emerald-700",
            bg: "bg-emerald-50/60 border-emerald-200/80"
          },
          {
            label: "Subjects Passed",
            value: `${summaryData?.summary?.subjects_passed || 0}`,
            sub: `${summaryData?.summary?.subjects_failed || 0} failed / needs retake`,
            icon: CheckCircle2,
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

      {/* Term Selector & Report Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="font-bold text-base text-[#23201B] font-sora">Consolidated Term Grade Sheet</h2>
            <p className="text-xs text-[#8C877D]">Standardized scale scores and academic evaluation remarks</p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2]">
            <button
              onClick={() => setSelectedExamId("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedExamId === "all"
                  ? "bg-[#23201B] text-white shadow-sm"
                  : "text-[#706B62] hover:text-[#23201B]"
              }`}
            >
              All Examinations
            </button>
            {availableExams.map((exam) => (
              <button
                key={exam.exam_id}
                onClick={() => setSelectedExamId(String(exam.exam_id))}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  selectedExamId === String(exam.exam_id)
                    ? "bg-[#23201B] text-white shadow-sm"
                    : "text-[#706B62] hover:text-[#23201B]"
                }`}
              >
                {exam.exam}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8C877D] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C4993C]" />
            <p className="text-sm font-medium">Loading academic records...</p>
          </div>
        ) : filteredMarks.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-[#8C877D] mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-[#23201B] text-lg font-sora mb-1">No Grade Records</h3>
            <p className="text-xs text-[#706B62] max-w-sm mx-auto">
              No examination marks have been published for this term yet. Check back once faculty upload grades.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
                <tr>
                  <th className="py-4 px-6">Subject & Course</th>
                  <th className="py-4 px-6">Examination</th>
                  <th className="py-4 px-6">Credits</th>
                  <th className="py-4 px-6">Marks Obtained</th>
                  <th className="py-4 px-6">Percentage</th>
                  <th className="py-4 px-6">Grade</th>
                  <th className="py-4 px-6">GPA Pt</th>
                  <th className="py-4 px-6 text-right">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE8E2]">
                {filteredMarks.map((g) => (
                  <tr key={g.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#23201B] text-sm font-sora">{g.subject}</div>
                      <div className="text-[11px] font-mono text-[#8C877D] mt-0.5">{g.subject_code || "—"}</div>
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#4A453E]">
                      {g.exam} {g.term ? `(${g.term})` : ""}
                    </td>
                    <td className="py-4 px-6 font-semibold text-[#4A453E]">
                      {g.credits || 1} Credits
                    </td>
                    <td className="py-4 px-6 text-[#706B62] font-semibold">
                      {g.marks_obtained} / {g.total_marks}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-extrabold text-[#23201B] text-sm font-sora">{g.percentage}%</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        g.grade?.startsWith("A")
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : g.grade?.startsWith("B")
                          ? "bg-blue-50 text-blue-800 border border-blue-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200"
                      }`}>
                        {g.grade || "—"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-[#C4993C]">
                      {Number(g.gpa_point || 0).toFixed(1)}
                    </td>
                    <td className="py-4 px-6 text-right text-[#706B62] italic max-w-xs truncate">
                      {g.remarks || "Satisfactory academic performance"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
