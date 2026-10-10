"use client";

import { useEffect, useState } from "react";
import {
  Book,
  Send,
  Calendar,
  CheckCircle2,
  Users,
  Search,
  Tag,
  Clock,
  MessageSquare,
  Sparkles,
  Paperclip,
  Trash2,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface DiaryItem {
  id: number;
  class: string;
  section?: string;
  subject: string;
  type: string;
  date: string;
  task: string;
  notes?: string;
  completed?: boolean;
}

export default function TeacherDiaries() {
  const [diaries, setDiaries] = useState<DiaryItem[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [type, setType] = useState<"Homework" | "Notice" | "Exam Prep">("Homework");
  const [task, setTask] = useState("");
  const [notes, setNotes] = useState("");
  const [entryDate, setEntryDate] = useState(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState(false);
  const [filterClass, setFilterClass] = useState("All");

  const fetchDiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const [diariesRes, clsRes, subRes] = await Promise.allSettled([
        apiFetch<any>("/teacher/diaries?per_page=50"),
        apiFetch<any>("/teacher/classes"),
        apiFetch<any>("/teacher/subjects")
      ]);

      if (diariesRes.status === "fulfilled") {
        setDiaries(diariesRes.value.data || []);
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
      console.error("Error loading diaries:", err);
      setError(err?.message || "Failed to load student diaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiaries();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim() || !classId || !subjectId) return;

    try {
      setSubmitting(true);
      await apiFetch("/teacher/diaries", {
        method: "POST",
        body: JSON.stringify({
          class_id: parseInt(classId),
          subject_id: parseInt(subjectId),
          date: entryDate,
          task,
          notes,
          type
        })
      });

      setTask("");
      setNotes("");
      setToast(true);
      setTimeout(() => setToast(false), 3500);
      fetchDiaries();
    } catch (err: any) {
      alert(err?.message || "Failed to broadcast diary entry");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this diary entry?")) return;
    try {
      await apiFetch(`/teacher/diaries/${id}`, { method: "DELETE" });
      fetchDiaries();
    } catch (err: any) {
      alert(err?.message || "Failed to delete diary entry");
    }
  };

  const filteredDiaries = diaries.filter(d => {
    if (filterClass === "All") return true;
    return d.class === filterClass;
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Student Communication</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Daily Digital Student Diary</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Broadcast daily homework assignments, class activity updates, and reminders directly to guardian devices.
          </p>
        </div>

        <div className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-semibold text-[#706B62]">
          <span className="font-bold text-[#23201B]">{diaries.length}</span> Active Broadcasts
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Diary entry broadcasted and saved to MySQL!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Post Form (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-6">
          <div className="flex items-center gap-2 border-b border-[#EBE8E2] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#C4993C]/10 text-[#C4993C] flex items-center justify-center">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="font-bold text-[#23201B] text-base font-sora">Broadcast Diary Task</h2>
              <p className="text-xs text-[#8C877D]">Instant notification sent to parents via student diary.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">Class *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C]"
                >
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ""}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">Subject *</label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C]"
                >
                  {subjects.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">Date</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={e => setEntryDate(e.target.value)}
                  className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C4993C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">Entry Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full text-xs font-semibold border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-2.5 outline-none focus:border-[#C4993C]"
                >
                  <option value="Homework">Homework</option>
                  <option value="Notice">Notice</option>
                  <option value="Exam Prep">Exam Prep</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Task / Instructions *
              </label>
              <textarea
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="e.g. Complete Exercise 5.2 problems 1-14 on page 142..."
                rows={3}
                required
                className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3.5 outline-none focus:border-[#C4993C] focus:bg-white transition-all placeholder:text-[#A8A298] resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1.5">
                Additional Notes / Materials
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Bring geometry box tomorrow"
                className="w-full text-xs border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3 outline-none focus:border-[#C4993C] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
              <span>Post to Student Diaries</span>
            </button>
          </form>
        </div>

        {/* Right Column: Diary Feed (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-4 flex items-center justify-between">
            <span className="text-xs font-bold text-[#4A453E] uppercase tracking-wider">Recent Diary Posts</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-[#8C877D]">Filter Class:</span>
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="px-2.5 py-1 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-lg outline-none"
              >
                <option value="All">All Classes</option>
                {classes.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 min-h-[300px]">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <span>Loading digital diary feed...</span>
              </div>
            ) : filteredDiaries.length === 0 ? (
              <div className="p-12 text-center bg-white rounded-2xl border border-[#EBE8E2] text-slate-500 text-xs">
                No diary entries posted yet for this selection.
              </div>
            ) : (
              filteredDiaries.map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm hover:shadow-md transition-all p-5"
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-bold text-sm text-[#23201B] font-sora">
                        {post.class} {post.section ? `(${post.section})` : ""}
                      </span>
                      <span className="text-xs font-semibold text-[#C4993C]">
                        • {post.subject}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        post.type === "Homework" ? "bg-purple-100 text-purple-800" :
                        post.type === "Notice" ? "bg-amber-100 text-amber-800" :
                        "bg-blue-100 text-blue-800"
                      }`}>
                        {post.type}
                      </span>
                    </div>

                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-1 text-slate-400 hover:text-red-600 rounded"
                      title="Delete entry"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  <p className="text-xs text-[#4A453E] leading-relaxed mb-3">
                    {post.task}
                  </p>

                  {post.notes && (
                    <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-200/50 text-[11px] text-amber-900 mb-3 font-medium">
                      📌 Note: {post.notes}
                    </div>
                  )}

                  <div className="pt-3 border-t border-[#FAF8F5] flex items-center justify-between text-[11px] text-[#8C877D]">
                    <span className="flex items-center gap-1">
                      <Calendar size={11} /> {post.date}
                    </span>
                    <span className="text-emerald-700 font-semibold">
                      Broadcast Active
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
