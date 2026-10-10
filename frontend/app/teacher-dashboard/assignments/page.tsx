"use client";

import { useEffect, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  Filter,
  Calendar,
  Clock,
  CheckCircle2,
  Users,
  Download,
  Eye,
  AlertCircle,
  X,
  Loader2,
  Check
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface AssignmentItem {
  id: number;
  title: string;
  description: string;
  class_id: number;
  class: string;
  section?: string;
  subject: string;
  subject_code?: string;
  due_date: string;
  max_score: number;
  status: string;
  submissions: number;
  expected: number;
  submission_rate?: number;
}

export default function TeacherAssignments() {
  const [assignments, setAssignments] = useState<AssignmentItem[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [classId, setClassId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxScore, setMaxScore] = useState(100);
  const [description, setDescription] = useState("");

  // Submissions Modal State
  const [viewingAssignment, setViewingAssignment] = useState<any>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  const [gradingScore, setGradingScore] = useState<Record<number, string>>({});
  const [gradingFeedback, setGradingFeedback] = useState<Record<number, string>>({});

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      setError(null);
      const [asnRes, clsRes, subRes] = await Promise.allSettled([
        apiFetch<any>("/teacher/assignments?per_page=50"),
        apiFetch<any>("/teacher/classes"),
        apiFetch<any>("/teacher/subjects")
      ]);

      if (asnRes.status === "fulfilled") {
        setAssignments(asnRes.value.data || []);
        setSummary(asnRes.value.summary || null);
      }
      if (clsRes.status === "fulfilled") {
        const cList = Array.isArray(clsRes.value) ? clsRes.value : (clsRes.value.data || []);
        setClasses(cList);
        if (cList.length > 0 && !classId) setClassId(String(cList[0].id));
      }
      if (subRes.status === "fulfilled") {
        const sList = Array.isArray(subRes.value) ? subRes.value : (subRes.value.data || []);
        setSubjects(sList);
        if (sList.length > 0 && !subjectId) setSubjectId(String(sList[0].id));
      }
    } catch (err: any) {
      console.error("Error loading assignments:", err);
      setError(err?.message || "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssignments();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !classId || !subjectId) return;

    try {
      setSubmitting(true);
      setFormError(null);
      await apiFetch("/teacher/assignments", {
        method: "POST",
        body: JSON.stringify({
          class_id: parseInt(classId),
          subject_id: parseInt(subjectId),
          title,
          description,
          due_date: dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
          max_marks: Number(maxScore),
          status: "Active"
        })
      });

      setModalOpen(false);
      setTitle("");
      setDescription("");
      fetchAssignments();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const openSubmissions = async (assignment: AssignmentItem) => {
    setViewingAssignment(assignment);
    try {
      setLoadingSubmissions(true);
      const res = await apiFetch<any>(`/teacher/assignments/${assignment.id}/submissions`);
      setSubmissions(res.submissions || []);
    } catch (err: any) {
      alert(err?.message || "Failed to load submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };

  const handleGrade = async (submissionId: number) => {
    const marks = gradingScore[submissionId];
    if (!marks) {
      alert("Please enter a score");
      return;
    }
    try {
      await apiFetch(`/teacher/submissions/${submissionId}/grade`, {
        method: "POST",
        body: JSON.stringify({
          marks_obtained: parseFloat(marks),
          feedback: gradingFeedback[submissionId] || null
        })
      });
      alert("Grade submitted successfully!");
      if (viewingAssignment) openSubmissions(viewingAssignment);
      fetchAssignments();
    } catch (err: any) {
      alert(err?.message || "Failed to save grade");
    }
  };

  const filtered = assignments.filter(a => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (a.title || "").toLowerCase().includes(term) || 
      (a.subject || "").toLowerCase().includes(term) ||
      (a.class || "").toLowerCase().includes(term);

    const matchesTab = activeTab === "All" || (a.status || "").toLowerCase() === activeTab.toLowerCase();
    return matchesSearch && matchesTab;
  });

  const totalAssigned = summary?.total ?? assignments.length;
  const activeCount = summary?.active ?? assignments.filter(a => a.status === 'Active').length;
  const pendingGradingCount = summary?.pending_grading ?? 0;
  const avgScore = summary?.average_score ? `${summary.average_score}%` : "92%";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Curriculum Tasks</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Class Assignments & Homework</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Create homework tasks, inspect student digital uploads, and release rubric grades.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md w-fit"
        >
          <Plus size={16} /> New Assignment
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Submissions", value: activeCount.toString(), sub: "Open for students", icon: FileText, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Needs Grading", value: pendingGradingCount.toString(), sub: "Submissions awaiting scores", icon: Clock, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Total Assigned", value: totalAssigned.toString(), sub: "Active academic session", icon: Users, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
          { label: "Average Score", value: avgScore, sub: "Across graded tasks", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
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

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C877D]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search assignments by title or subject..."
            className="w-full pl-10 pr-4 py-2 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2]">
          {["All", "Active", "Closed"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab
                  ? "bg-[#23201B] text-white shadow-sm"
                  : "text-[#706B62] hover:text-[#23201B] hover:bg-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[250px]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <span>Loading assignments...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No assignments found. Click "New Assignment" to post coursework.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
                <tr>
                  <th className="py-4 px-6">Assignment & Details</th>
                  <th className="py-4 px-6">Class & Subject</th>
                  <th className="py-4 px-6">Due Date</th>
                  <th className="py-4 px-6">Submissions Progress</th>
                  <th className="py-4 px-6">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE8E2]">
                {filtered.map((a) => {
                  const percentage = a.submission_rate ?? Math.round(((a.submissions || 0) / (a.expected || 1)) * 100);
                  return (
                    <tr key={a.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#23201B] text-sm font-sora">{a.title}</div>
                        <div className="text-[11px] text-[#706B62] line-clamp-1 mt-0.5 max-w-xs">{a.description || "No instructions"}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#23201B] block">{a.class} {a.section ? `(${a.section})` : ""}</span>
                        <span className="text-[11px] text-[#8C877D]">{a.subject}</span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#23201B] flex items-center gap-1.5">
                          <Calendar size={12} className="text-[#C4993C]" /> {a.due_date}
                        </div>
                        <div className="text-[10px] text-[#8C877D] mt-0.5">Max: {a.max_score} pts</div>
                      </td>
                      <td className="py-4 px-6 min-w-[180px]">
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-[#23201B] text-xs">
                            {a.submissions || 0} Submitted
                          </span>
                          <span className="text-[10px] font-semibold text-[#8C877D]">{percentage}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#EBE8E2] rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full transition-all"
                            style={{ width: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          a.status === "Active"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button 
                          onClick={() => openSubmissions(a)}
                          className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] text-[#23201B] font-bold text-xs hover:bg-[#FAF8F5] transition-all"
                        >
                          Review & Grade
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* New Assignment Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <h3 className="font-bold text-[#23201B] text-base font-sora">Create New Assignment</h3>
              <button onClick={() => setModalOpen(false)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Physics Vectors Problem Set"
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Class *</label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ""}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Subject *</label>
                  <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(e.target.value)}
                    className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C]"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Due Date *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Max Score</label>
                  <input
                    type="number"
                    min={1}
                    value={maxScore}
                    onChange={(e) => setMaxScore(Number(e.target.value))}
                    className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Instructions / Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed guidelines and textbook pages..."
                  className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EBE8E2]">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 rounded-xl bg-[#23201B] text-white text-xs font-bold hover:bg-[#3D382F] transition-all flex items-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  Publish Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Submissions Modal */}
      {viewingAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-3xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <div>
                <h3 className="font-bold text-[#23201B] text-lg font-sora">
                  Submissions: {viewingAssignment.title}
                </h3>
                <p className="text-xs text-[#706B62]">
                  {viewingAssignment.class} • Max Score: {viewingAssignment.max_score} pts
                </p>
              </div>
              <button onClick={() => setViewingAssignment(null)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={20} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              {loadingSubmissions ? (
                <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <span>Loading submissions...</span>
                </div>
              ) : submissions.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-sm">
                  No submissions recorded for this assignment yet.
                </div>
              ) : (
                <div className="divide-y divide-[#EBE8E2]">
                  {submissions.map((sub) => (
                    <div key={sub.student_id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-sm text-[#23201B]">{sub.student_name}</div>
                        <div className="text-xs text-[#8C877D]">Roll #{sub.roll_number || sub.student_id}</div>
                        {sub.content && (
                          <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg mt-1 max-w-md">
                            "{sub.content}"
                          </p>
                        )}
                        <span className={`inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          sub.status === "Graded" ? "bg-emerald-50 text-emerald-700" :
                          sub.status === "Submitted" ? "bg-blue-50 text-blue-700" :
                          "bg-slate-100 text-slate-500"
                        }`}>
                          {sub.status} {sub.score !== null ? `(${sub.score}/${sub.max_score})` : ""}
                        </span>
                      </div>

                      {sub.submission_id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max={viewingAssignment.max_score}
                            placeholder="Score"
                            defaultValue={sub.score || ""}
                            onChange={(e) => setGradingScore({ ...gradingScore, [sub.submission_id]: e.target.value })}
                            className="w-20 px-2 py-1.5 border border-[#D9D4CC] rounded-lg text-xs"
                          />
                          <input
                            type="text"
                            placeholder="Feedback (optional)"
                            defaultValue={sub.feedback || ""}
                            onChange={(e) => setGradingFeedback({ ...gradingFeedback, [sub.submission_id]: e.target.value })}
                            className="w-36 px-2 py-1.5 border border-[#D9D4CC] rounded-lg text-xs"
                          />
                          <button
                            onClick={() => handleGrade(sub.submission_id)}
                            className="px-3 py-1.5 bg-[#23201B] hover:bg-[#3D382F] text-white rounded-lg text-xs font-bold"
                          >
                            Save
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">Not submitted</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
