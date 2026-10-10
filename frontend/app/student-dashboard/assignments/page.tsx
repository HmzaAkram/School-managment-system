"use client";

import { useEffect, useState } from "react";
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
  FileCheck,
  Loader2
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface StudentAssignment {
  id: number;
  title: string;
  subject?: string;
  teacher?: string;
  due_date: string;
  status: "Pending" | "Submitted" | "Graded";
  max_score: number;
  obtained_score?: number | null;
  feedback?: string | null;
  file_url?: string | null;
  submission_content?: string | null;
  submitted_at?: string | null;
}

interface AssignmentResponse {
  data: StudentAssignment[];
  total: number;
  summary: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
  };
}

export default function StudentAssignments() {
  const [assignments, setAssignments] = useState<StudentAssignment[]>([]);
  const [summary, setSummary] = useState<{ total: number; submitted: number; graded: number; pending: number } | null>(null);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Submit Modal
  const [submitModal, setSubmitModal] = useState<StudentAssignment | null>(null);
  const [content, setContent] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // View Modal
  const [viewModal, setViewModal] = useState<StudentAssignment | null>(null);

  const loadAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<AssignmentResponse>("/student/assignments?per_page=100");
      if (res?.data) {
        setAssignments(res.data);
        if (res.summary) setSummary(res.summary);
      } else if (Array.isArray(res)) {
        setAssignments(res);
      }
    } catch (err: any) {
      console.error("Failed to load assignments:", err);
      setError(err.message || "Failed to load coursework assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAssignments();
  }, []);

  const handleSubmitModalConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitModal) return;
    if (!content.trim()) {
      alert("Please enter submission content or coursework response.");
      return;
    }

    try {
      setSubmitting(true);
      await apiFetch(`/student/assignments/${submitModal.id}/submit`, {
        method: "POST",
        body: JSON.stringify({
          content: content.trim(),
          file_url: fileUrl.trim() || undefined,
        }),
      });

      setToast("Assignment successfully uploaded and delivered to your course instructor!");
      setSubmitModal(null);
      setContent("");
      setFileUrl("");
      loadAssignments();
      setTimeout(() => setToast(null), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to submit assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = assignments.filter((a) => {
    const matchesSearch =
      a.title?.toLowerCase().includes(search.toLowerCase()) ||
      (a.subject || "").toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || a.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const gradedCount = summary?.graded ?? assignments.filter((a) => a.status === "Graded").length;
  const pendingCount = summary?.pending ?? assignments.filter((a) => a.status === "Pending").length;
  const submittedCount = summary?.submitted ?? assignments.filter((a) => a.status === "Submitted").length;
  const totalCount = summary?.total ?? assignments.length;

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
            {totalCount} Total Assigned Tasks
          </div>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">{toast}</p>
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
            label: "Pending Tasks",
            value: `${pendingCount}`,
            sub: "Requires student completion",
            icon: Clock,
            color: "text-amber-700",
            bg: "bg-amber-50/60 border-amber-200/80"
          },
          {
            label: "Submitted",
            value: `${submittedCount}`,
            sub: "Under teacher review",
            icon: FileCheck,
            color: "text-blue-700",
            bg: "bg-blue-50/60 border-blue-200/80"
          },
          {
            label: "Completed & Graded",
            value: `${gradedCount}`,
            sub: "Marks & feedback returned",
            icon: CheckCircle2,
            color: "text-emerald-700",
            bg: "bg-emerald-50/60 border-emerald-200/80"
          },
          {
            label: "Total Coursework",
            value: `${totalCount}`,
            sub: "Assigned across all subjects",
            icon: FileText,
            color: "text-[#C4993C]",
            bg: "bg-[#FFFDF9] border-[#F1EAD9]"
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
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8C877D] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C4993C]" />
            <p className="text-sm font-medium">Loading coursework assignments...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-[#8C877D] mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-[#23201B] text-lg font-sora mb-1">No Assignments Found</h3>
            <p className="text-xs text-[#706B62] max-w-sm mx-auto">
              {search || activeTab !== "All"
                ? "No coursework matching the active search or status filters."
                : "No homework or assignments have been issued for your class yet."}
            </p>
          </div>
        ) : (
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
                          <span className="font-bold text-[#4A453E]">Instructor Note:</span> &quot;{a.feedback}&quot;
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-bold text-[#23201B] block">{a.subject || "General"}</span>
                      <span className="text-[11px] text-[#8C877D]">{a.teacher || "Faculty"}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-semibold text-[#23201B] flex items-center gap-1.5">
                        <Calendar size={12} className="text-[#C4993C]" /> {a.due_date}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {a.status === "Graded" ? (
                        <div className="font-extrabold text-[#23201B] text-sm font-sora">
                          {a.obtained_score ?? "—"} / <span className="text-xs text-[#8C877D] font-normal">{a.max_score} pts</span>
                        </div>
                      ) : (
                        <span className="text-[#8C877D] font-mono">Max: {a.max_score} pts</span>
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
                        <button
                          onClick={() => setViewModal(a)}
                          className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] text-[#23201B] font-bold text-xs hover:bg-[#FAF8F5] transition-all"
                        >
                          View Submission
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
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
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Coursework Submission / Response *
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Provide your written solution, assignment text, or answers..."
                  rows={4}
                  required
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C] resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                  Document / Attachment URL (Optional)
                </label>
                <input
                  type="url"
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  placeholder="https://drive.google.com/... or uploaded document link"
                  className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
                />
                <span className="text-[10px] text-[#8C877D] mt-1 block">Cloud file link, GitHub repo, or document URI</span>
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
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white hover:from-[#B3882B] hover:to-[#C4993C] disabled:opacity-50 flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  Confirm & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Submission Modal */}
      {viewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <div>
                <h3 className="font-bold text-[#23201B] text-base font-sora">Coursework Submission Record</h3>
                <p className="text-xs text-[#8C877D] mt-0.5">{viewModal.title}</p>
              </div>
              <button onClick={() => setViewModal(null)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2]">
                <div className="font-bold text-[#4A453E] mb-1">Status & Grading</div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-[#23201B]">Status: {viewModal.status}</span>
                  {viewModal.obtained_score !== null && viewModal.obtained_score !== undefined && (
                    <span className="font-bold text-[#C4993C]">
                      Score: {viewModal.obtained_score} / {viewModal.max_score} pts
                    </span>
                  )}
                </div>
              </div>

              {viewModal.feedback && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-900">
                  <div className="font-bold mb-1">Teacher Feedback</div>
                  <div>&quot;{viewModal.feedback}&quot;</div>
                </div>
              )}

              {viewModal.submission_content && (
                <div>
                  <div className="font-bold text-[#4A453E] mb-1">Submitted Response Content:</div>
                  <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2] text-[#23201B] whitespace-pre-wrap">
                    {viewModal.submission_content}
                  </div>
                </div>
              )}

              {viewModal.file_url && (
                <div>
                  <div className="font-bold text-[#4A453E] mb-1">Attached Document:</div>
                  <a
                    href={viewModal.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#C4993C] underline font-medium break-all"
                  >
                    {viewModal.file_url}
                  </a>
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setViewModal(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-[#23201B] hover:bg-[#3D382F]"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
