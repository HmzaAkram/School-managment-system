"use client";

import { useEffect, useState } from "react";
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
  AlertCircle,
  Loader2
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TeacherReviews() {
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | number>("");
  const [students, setStudents] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const [loading, setLoading] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState<"Exceptional" | "Satisfactory" | "Needs Attention">("Exceptional");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(false);

  // Load Classes and Reviews
  useEffect(() => {
    async function loadMeta() {
      try {
        setLoading(true);
        setError(null);
        const [clsRes, revRes] = await Promise.allSettled([
          apiFetch<any>("/teacher/classes"),
          apiFetch<any>("/teacher/reviews")
        ]);

        if (clsRes.status === "fulfilled") {
          const cList = Array.isArray(clsRes.value) ? clsRes.value : (clsRes.value.data || []);
          setClasses(cList);
          if (cList.length > 0 && !selectedClassId) {
            setSelectedClassId(cList[0].id);
          }
        }

        if (revRes.status === "fulfilled") {
          setReviews(Array.isArray(revRes.value) ? revRes.value : (revRes.value.data || []));
        }
      } catch (err: any) {
        console.error("Error loading reviews meta:", err);
        setError(err?.message || "Failed to load student reviews");
      } finally {
        setLoading(false);
      }
    }
    loadMeta();
  }, []);

  // Load students for selected class
  useEffect(() => {
    async function loadClassStudents() {
      if (!selectedClassId) return;
      try {
        setLoadingStudents(true);
        const res = await apiFetch<any>(`/teacher/classes/${selectedClassId}/students`);
        const list = Array.isArray(res) ? res : (res.data || []);
        setStudents(list);
        if (list.length > 0) {
          setSelectedStudent(list[0]);
          const existing = reviews.find(r => r.student_id === list[0].id);
          if (existing) {
            setRating(existing.rating || "Exceptional");
            setReviewText(existing.remarks || "");
          } else {
            setReviewText("");
          }
        }
      } catch (err) {
        console.error("Failed to load students", err);
      } finally {
        setLoadingStudents(false);
      }
    }
    loadClassStudents();
  }, [selectedClassId]);

  const handleSelectStudent = (st: any) => {
    setSelectedStudent(st);
    const existing = reviews.find(r => r.student_id === st.id);
    if (existing) {
      setRating(existing.rating || "Exceptional");
      setReviewText(existing.remarks || "");
    } else {
      setRating("Exceptional");
      setReviewText("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent || !reviewText.trim()) return;

    try {
      setSubmitting(true);
      await apiFetch("/teacher/reviews", {
        method: "POST",
        body: JSON.stringify({
          student_id: selectedStudent.id,
          rating,
          remarks: reviewText
        })
      });

      // Refresh reviews list
      const revRes = await apiFetch<any>("/teacher/reviews");
      setReviews(Array.isArray(revRes) ? revRes : (revRes.data || []));

      setToast(true);
      setTimeout(() => setToast(false), 3500);
    } catch (err: any) {
      alert(err?.message || "Failed to save student review");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = students.filter(s =>
    (s.name || "").toLowerCase().includes(search.toLowerCase()) ||
    (s.roll_number || "").toLowerCase().includes(search.toLowerCase())
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

      {toast && selectedStudent && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Evaluation for {selectedStudent.name} successfully updated and committed to MySQL!
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

      {/* Main Grid: Student List on Left, Form on Right */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Student Selector (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
            <div className="flex items-center gap-2">
              <label className="text-xs font-bold text-[#8C877D] uppercase">Class:</label>
              <select
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-lg px-2 py-1 outline-none"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ""}</option>
                ))}
              </select>
            </div>
            <span className="text-xs font-bold text-[#C4993C]">
              {students.length} Students
            </span>
          </div>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8C877D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by student name or roll..."
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C]"
            />
          </div>

          <div className="space-y-2 max-h-[460px] overflow-y-auto">
            {loadingStudents ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <span className="text-xs">Loading class cohort...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No students found in this section.
              </div>
            ) : (
              filtered.map((st) => {
                const existing = reviews.find(r => r.student_id === st.id);
                const isSelected = selectedStudent?.id === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => handleSelectStudent(st)}
                    type="button"
                    className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#FAF3E5] border-[#C4993C] shadow-xs"
                        : "bg-[#FAF8F5] border-transparent hover:border-[#EBE8E2]"
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-xs text-[#23201B]">{st.name}</h4>
                      <div className="text-[10px] text-[#8C877D] mt-0.5">
                        Roll #{st.roll_number || st.admission_number || st.id}
                      </div>
                    </div>
                    {existing ? (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        existing.rating === "Exceptional" ? "bg-emerald-100 text-emerald-800" :
                        existing.rating === "Satisfactory" ? "bg-blue-100 text-blue-800" :
                        "bg-amber-100 text-amber-800"
                      }`}>
                        {existing.rating}
                      </span>
                    ) : (
                      <span className="text-[9px] text-slate-400">Unreviewed</span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Review Composer (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-6">
          {selectedStudent ? (
            <>
              <div className="flex items-center justify-between pb-4 border-b border-[#EBE8E2]">
                <div>
                  <h3 className="font-bold text-lg text-[#23201B] font-sora">{selectedStudent.name}</h3>
                  <p className="text-xs text-[#8C877D]">
                    Roll #{selectedStudent.roll_number || selectedStudent.id}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center justify-center text-[#C4993C] font-bold font-sora">
                  {selectedStudent.name.substring(0, 2).toUpperCase()}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-2">
                    Behavior & Performance Rating
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(["Exceptional", "Satisfactory", "Needs Attention"] as const).map((r) => (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setRating(r)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center ${
                          rating === r
                            ? r === "Exceptional"
                              ? "bg-emerald-700 text-white border-emerald-700 shadow-sm"
                              : r === "Satisfactory"
                              ? "bg-blue-700 text-white border-blue-700 shadow-sm"
                              : "bg-amber-600 text-white border-amber-600 shadow-sm"
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
                    Faculty Remarks & Qualitative Assessment *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Provide constructive observations regarding classroom engagement, homework timeliness, and strengths..."
                    className="w-full text-sm border border-[#D9D4CC] rounded-xl text-[#23201B] bg-[#FAF8F5] p-3.5 outline-none focus:border-[#C4993C] focus:bg-white transition-all placeholder:text-[#A8A298] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                  <span>Save & Transmit Review to Parent Portal</span>
                </button>
              </form>
            </>
          ) : (
            <div className="py-24 text-center text-slate-400 text-sm">
              Select a student to view or draft remarks.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
