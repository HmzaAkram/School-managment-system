"use client";

import { useEffect, useState } from "react";
import {
  Book,
  Calendar,
  CheckCircle2,
  Clock,
  Check,
  Filter,
  Users,
  AlertCircle,
  Loader2
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface DiaryEntry {
  id: number;
  date: string;
  subject?: string;
  subject_code?: string;
  teacher?: string;
  type: string;
  task?: string;
  notes?: string;
  note?: string;
  completed: boolean;
  acknowledged_at?: string | null;
}

interface DiariesResponse {
  data: DiaryEntry[];
  total: number;
}

export default function StudentDiaries() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [filterType, setFilterType] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadDiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<DiariesResponse>("/student/diaries?per_page=100");
      if (res?.data) {
        setDiaries(res.data);
      } else if (Array.isArray(res)) {
        setDiaries(res);
      }
    } catch (err: any) {
      console.error("Failed to load diaries:", err);
      setError(err.message || "Failed to load student diaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDiaries();
  }, []);

  const handleAcknowledge = async (id: number) => {
    try {
      setActionLoading(id);
      await apiFetch(`/student/diaries/${id}/acknowledge`, { method: "POST" });
      setDiaries((prev) =>
        prev.map((d) => (d.id === id ? { ...d, acknowledged_at: new Date().toISOString() } : d))
      );
    } catch (err: any) {
      alert(err.message || "Failed to acknowledge diary entry");
    } finally {
      setActionLoading(null);
    }
  };

  const toggleDone = (id: number) => {
    setDiaries((prev) =>
      prev.map((d) => (d.id === id ? { ...d, completed: !d.completed } : d))
    );
  };

  const filtered = diaries.filter(
    (d) => filterType === "All" || d.type?.toLowerCase() === filterType.toLowerCase()
  );

  const pendingCount = diaries.filter((d) => !d.completed).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Student Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Daily Logs</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Student Digital Diary</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Daily homework notices, teacher reminders, and guardian sign-off tracking.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-semibold text-[#706B62]">
            {pendingCount > 0 ? (
              <span className="text-amber-700 font-bold">{pendingCount} Tasks To Complete</span>
            ) : (
              <span className="text-emerald-700 font-bold">All Diary Tasks Done!</span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Row */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All", "Homework", "Notice", "Exam Prep", "General"].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterType === type
                  ? "bg-[#23201B] text-white"
                  : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2]"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#8C877D] font-medium hidden sm:inline">
          Showing {filtered.length} entries
        </span>
      </div>

      {/* Diary Timeline Feed */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8C877D] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4993C]" />
          <p className="text-sm font-medium">Loading diary logs...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EBE8E2] p-12 text-center shadow-sm">
          <Book className="w-12 h-12 text-[#8C877D] mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-[#23201B] text-lg font-sora mb-1">No Diary Entries Found</h3>
          <p className="text-xs text-[#706B62] max-w-sm mx-auto">
            {filterType !== "All"
              ? `No entries under category '${filterType}'.`
              : "No diary records have been logged by teachers yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((d) => {
            const entryText = d.notes || d.note || d.task || "No notes provided.";
            const isAcknowledged = !!d.acknowledged_at;

            return (
              <div
                key={d.id}
                className={`bg-white rounded-2xl border transition-all p-6 shadow-sm hover:shadow-md ${
                  d.completed ? "border-[#EBE8E2] opacity-90" : "border-[#C4993C]/40 bg-[#FFFDF9]"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        d.type === "Homework"
                          ? "bg-purple-100 text-purple-700"
                          : d.type === "Exam Prep"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {d.type || "Notice"}
                    </span>
                    <span className="font-bold text-sm text-[#23201B] font-sora">
                      {d.subject || "All Subjects"}
                    </span>
                    {d.teacher && <span className="text-xs text-[#706B62]">• {d.teacher}</span>}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-[#8C877D]">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock size={12} className="text-[#C4993C]" /> {d.date}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-[#4A453E] leading-relaxed mb-4 pl-3.5 border-l-2 border-[#C4993C]">
                  {entryText}
                </p>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#F1EAD9] text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => toggleDone(d.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-bold transition-all ${
                        d.completed
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2] border border-[#D9D4CC]"
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                          d.completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-[#8C877D]"
                        }`}
                      >
                        {d.completed && <Check size={12} strokeWidth={3} />}
                      </div>
                      <span>{d.completed ? "Task Done" : "Mark as Completed"}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    {isAcknowledged ? (
                      <div className="flex items-center gap-1.5 text-emerald-800 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                        <CheckCircle2 size={13} className="text-emerald-600" />
                        <span>Guardian Acknowledged</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleAcknowledge(d.id)}
                        disabled={actionLoading === d.id}
                        className="flex items-center gap-1.5 text-[#C4993C] font-bold bg-[#FAF8F5] hover:bg-[#F1EAD9] px-2.5 py-1 rounded-lg border border-[#D9D4CC] transition-colors disabled:opacity-50"
                      >
                        {actionLoading === d.id ? (
                          <Loader2 size={13} className="animate-spin" />
                        ) : (
                          <CheckCircle2 size={13} />
                        )}
                        <span>Acknowledge as Guardian</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
