"use client";

import { useState } from "react";
import {
  FileText,
  Upload,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Download,
  X,
  FileCheck
} from "lucide-react";

interface StudentAssignment {
  id: string;
  title: string;
  subject: string;
  teacher: string;
  dueDate: string;
  status: "Pending" | "Submitted" | "Graded";
  maxScore: number;
  obtainedScore?: number;
  feedback?: string;
}

const initialAssignments: StudentAssignment[] = [
  { id: "ASN-01", title: "Quadratic Equations Problem Set 4", subject: "Mathematics", teacher: "Dr. Robert Vance", dueDate: "Oct 25, 2026", status: "Pending", maxScore: 100 },
  { id: "ASN-02", title: "Newtonian Mechanics Lab Experiment Report", subject: "Physics", teacher: "Elena Rostova", dueDate: "Oct 22, 2026", status: "Submitted", maxScore: 50 },
  { id: "ASN-03", title: "Essay: The Themes of Betrayal in Hamlet", subject: "English Literature", teacher: "Clara Oswald", dueDate: "Oct 15, 2026", status: "Graded", maxScore: 100, obtainedScore: 94, feedback: "Superb thesis statement and insightful character breakdown." },
  { id: "ASN-04", title: "Chemical Reactions & Ionic Bonding Chart", subject: "Chemistry", teacher: "Dr. Angela Merkel", dueDate: "Oct 10, 2026", status: "Graded", maxScore: 50, obtainedScore: 48, feedback: "Accurate stoichiometric balancing. Well formatted." },
  { id: "ASN-05", title: "Robotics Kinematics Algorithm Code", subject: "Computer Science", teacher: "David Kim", dueDate: "Oct 05, 2026", status: "Graded", maxScore: 100, obtainedScore: 98, feedback: "Clean Python syntax and robust edge-case handling." },
];

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>(initialAssignments);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [submitModal, setSubmitModal] = useState<StudentAssignment | null>(null);
  const [fileAttached, setFileAttached] = useState(false);
  const [comments, setComments] = useState("");
  const [toast, setToast] = useState(false);

  const handleSubmitModalConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModal) return;

    const updated = assignments.map(a => {
      if (a.id === submitModal.id) {
        return { ...a, status: "Submitted" as const };
      }
      return a;
    });

    setAssignments(updated);
    setSubmitModal(null);
    setFileAttached(false);
    setComments("");
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  const filtered = assignments.filter(a => {
    const matchesSearch = a.title.toLowerCase().includes(search.toLowerCase()) || a.subject.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || a.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Student Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Coursework</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">My Homework & Assignments</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Submit coursework, track submission deadlines, and review teacher feedback.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-semibold text-[#706B62]">
            Active Academic Term 2
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Assignment successfully uploaded and delivered to your course instructor!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pending Tasks", value: "1", sub: "Due in 3 days", icon: Clock, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Submitted", value: "1", sub: "Under teacher review", icon: FileCheck, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
          { label: "Completed & Graded", value: "3", sub: "All scores finalized", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Average Score", value: "95.2%", sub: "Top 5% in cohort", icon: FileText, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
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

      {/* Filter and Search */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C877D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments or subjects..."
            className="w-full pl-9 pr-3 py-2 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2]">
          {["All", "Pending", "Submitted", "Graded"].map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === t
                  ? "bg-[#23201B] text-white shadow-sm"
                  : "text-[#706B62] hover:text-[#23201B] hover:bg-white"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Assignments Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
              <tr>
                <th className="py-4 px-6">Assignment Title</th>
                <th className="py-4 px-6">Subject & Instructor</th>
                <th className="py-4 px-6">Due Date</th>
                <th className="py-4 px-6">Score</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8E2]">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-bold text-[#23201B] text-sm font-sora">{a.title}</div>
                    {a.feedback && (
                      <div className="text-[11px] text-[#706B62] mt-1 bg-[#FAF8F5] p-2 rounded-lg border border-[#EBE8E2] max-w-md">
                        <span className="font-bold text-[#4A453E]">Instructor Note:</span> "{a.feedback}"
                      </div>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-[#23201B] block">{a.subject}</span>
                    <span className="text-[11px] text-[#8C877D]">{a.teacher}</span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-semibold text-[#23201B] flex items-center gap-1.5">
                      <Calendar size={12} className="text-[#C4993C]" /> {a.dueDate}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    {a.status === "Graded" ? (
                      <div className="font-extrabold text-[#23201B] text-sm font-sora">
                        {a.obtainedScore} / <span className="text-xs text-[#8C877D] font-normal">{a.maxScore} pts</span>
                      </div>
                    ) : (
                      <span className="text-[#8C877D] font-mono">Max: {a.maxScore} pts</span>
                    )}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      a.status === "Pending"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : a.status === "Submitted"
                        ? "bg-blue-50 text-blue-700 border border-blue-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {a.status === "Pending" ? (
                      <button
                        onClick={() => setSubmitModal(a)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] text-white font-bold text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                      >
                        <Upload size={13} /> Submit Work
                      </button>
                    ) : (
                      <button className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] text-[#23201B] font-bold text-xs hover:bg-[#FAF8F5] transition-all">
                        View Submission
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Submission Modal */}
      {submitModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <div>
                <h3 className="font-bold text-[#23201B] text-base font-sora">Submit Assignment</h3>
                <p className="text-xs text-[#8C877D] mt-0.5">{submitModal.title} • {submitModal.subject}</p>
              </div>
              <button onClick={() => setSubmitModal(null)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitModalConfirm} className="space-y-4">
              <div
                onClick={() => setFileAttached(true)}
                className={`p-6 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors ${
                  fileAttached
                    ? "border-emerald-500 bg-emerald-50/40 text-emerald-800"
                    : "border-[#D9D4CC] bg-[#FAF8F5] hover:bg-white text-[#706B62]"
                }`}
              >
                <Upload size={28} className={`mx-auto mb-2 ${fileAttached ? "text-emerald-600" : "text-[#C4993C]"}`} />
                {fileAttached ? (
                  <div>
                    <span className="font-bold text-xs text-emerald-800 block">quadratics_homework_final.pdf</span>
                    <span className="text-[10px] text-emerald-600">Attached (1.8 MB) — Click to replace</span>
                  </div>
                ) : (
                  <div>
                    <span className="font-bold text-xs text-[#23201B] block">Click to upload document or PDF</span>
                    <span className="text-[10px] text-[#8C877D]">Supports PDF, DOCX, ZIP up to 25MB</span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">
                  Submission Comments / Questions for Teacher
                </label>
                <textarea
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Optional note for Dr. Robert Vance..."
                  rows={3}
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C] resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSubmitModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!fileAttached}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                    fileAttached
                      ? "bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white hover:from-[#B3882B] hover:to-[#C4993C]"
                      : "bg-[#EBE8E2] text-[#8C877D] cursor-not-allowed"
                  }`}
                >
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
