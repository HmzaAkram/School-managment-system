"use client";

import { useState } from "react";
import {
  Book,
  Calendar,
  CheckCircle2,
  Clock,
  Check,
  Filter,
  Users,
  AlertCircle
} from "lucide-react";

interface DiaryEntry {
  id: string;
  date: string;
  subject: string;
  teacher: string;
  type: "Homework" | "Notice" | "Exam Prep";
  note: string;
  completed: boolean;
  parentSigned: boolean;
}

const initialDiaries: DiaryEntry[] = [
  {
    id: "d1",
    date: "Today, Oct 01",
    subject: "Advanced Mathematics",
    teacher: "Dr. Robert Vance",
    type: "Homework",
    note: "Complete Exercise 5.2 on page 142 (questions 1 through 14). Bring geometry toolboxes for conic graphing tomorrow.",
    completed: false,
    parentSigned: true,
  },
  {
    id: "d2",
    date: "Today, Oct 01",
    subject: "English Literature",
    teacher: "Clara Oswald",
    type: "Homework",
    note: "Read Act 3 Scene 2 of Hamlet and prepare three discussion questions for the seminar on Friday.",
    completed: true,
    parentSigned: true,
  },
  {
    id: "d3",
    date: "Yesterday, Sep 30",
    subject: "Physics & Mechanics",
    teacher: "Elena Rostova",
    type: "Notice",
    note: "Lab practical examination schedules have been published. Review safety protocols and wear closed-toe laboratory footwear.",
    completed: true,
    parentSigned: true,
  },
  {
    id: "d4",
    date: "Sep 28, 2026",
    subject: "Chemistry & Organic Analysis",
    teacher: "Dr. Angela Merkel",
    type: "Exam Prep",
    note: "Study reaction mechanisms for alkenes and alkynes. Mock diagnostic quiz will take place next Monday morning.",
    completed: true,
    parentSigned: true,
  },
];

export default function StudentDiaries() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>(initialDiaries);
  const [filterSubject, setFilterSubject] = useState("All");

  const toggleDone = (id: string) => {
    setDiaries(diaries.map(d => d.id === id ? { ...d, completed: !d.completed } : d));
  };

  const filtered = diaries.filter(d => filterSubject === "All" || d.subject.includes(filterSubject));

  const pendingCount = diaries.filter(d => !d.completed).length;

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
              <span className="text-emerald-700 font-bold">All Homework Tasks Completed!</span>
            )}
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["All", "Mathematics", "English", "Physics", "Chemistry"].map((sub) => (
            <button
              key={sub}
              onClick={() => setFilterSubject(sub)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterSubject === sub
                  ? "bg-[#23201B] text-white"
                  : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2]"
              }`}
            >
              {sub}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#8C877D] font-medium hidden sm:inline">
          Showing {filtered.length} recent entries
        </span>
      </div>

      {/* Diary Timeline Feed */}
      <div className="space-y-4">
        {filtered.map((d) => (
          <div
            key={d.id}
            className={`bg-white rounded-2xl border transition-all p-6 shadow-sm hover:shadow-md ${
              d.completed ? "border-[#EBE8E2] opacity-90" : "border-[#C4993C]/40 bg-[#FFFDF9]"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                  d.type === "Homework"
                    ? "bg-purple-100 text-purple-700"
                    : d.type === "Exam Prep"
                    ? "bg-amber-100 text-amber-800"
                    : "bg-blue-100 text-blue-700"
                }`}>
                  {d.type}
                </span>
                <span className="font-bold text-sm text-[#23201B] font-sora">{d.subject}</span>
                <span className="text-xs text-[#706B62]">• {d.teacher}</span>
              </div>

              <div className="flex items-center gap-3 text-xs text-[#8C877D]">
                <span className="flex items-center gap-1 font-medium">
                  <Clock size={12} className="text-[#C4993C]" /> {d.date}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#4A453E] leading-relaxed mb-4 pl-3.5 border-l-2 border-[#C4993C]">
              {d.note}
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
                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center ${
                    d.completed ? "bg-emerald-600 border-emerald-600 text-white" : "border-[#8C877D]"
                  }`}>
                    {d.completed && <Check size={12} strokeWidth={3} />}
                  </div>
                  <span>{d.completed ? "Task Done" : "Mark as Completed"}</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-[#706B62] font-semibold">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Guardian Signed (Acknowledged)</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
