"use client";

import { useState } from "react";
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
  Paperclip
} from "lucide-react";

interface DiaryPost {
  id: string;
  className: string;
  subject: string;
  type: "Homework" | "Classwork" | "Announcement" | "Reminder";
  date: string;
  content: string;
  readCount: number;
  totalStudents: number;
}

const initialDiaries: DiaryPost[] = [
  {
    id: "DIR-01",
    className: "Grade 10-A",
    subject: "Advanced Mathematics",
    type: "Homework",
    date: "Today, 01:15 PM",
    content: "Complete Exercise 5.2 (problems 1 through 14) on page 142. Bring geometry instrument boxes tomorrow for conic sections graphing.",
    readCount: 41,
    totalStudents: 45,
  },
  {
    id: "DIR-02",
    className: "Grade 10-B",
    subject: "Advanced Mathematics",
    type: "Classwork",
    date: "Today, 11:40 AM",
    content: "Covered synthetic division and remainder theorem. Students must review textbook examples 3 and 4 before tomorrow's follow-up quiz.",
    readCount: 38,
    totalStudents: 42,
  },
  {
    id: "DIR-03",
    className: "Grade 10-A",
    subject: "Advanced Mathematics",
    type: "Reminder",
    date: "Yesterday, 02:00 PM",
    content: "Term 2 Mid-Term syllabus will strictly cover chapters 1 through 6. Extra doubt-clearing session on Thursday after 6th period.",
    readCount: 45,
    totalStudents: 45,
  },
  {
    id: "DIR-04",
    className: "Grade 9-A",
    subject: "Pure Mathematics",
    type: "Homework",
    date: "Sep 28, 2026",
    content: "Read chapter summary on Coordinate Geometry and solve review questions 1-8 in homework notebooks.",
    readCount: 46,
    totalStudents: 48,
  },
];

export default function TeacherDiaries() {
  const [diaries, setDiaries] = useState<DiaryPost[]>(initialDiaries);
  const [className, setClassName] = useState("Grade 10-A");
  const [subject, setSubject] = useState("Advanced Mathematics");
  const [type, setType] = useState<"Homework" | "Classwork" | "Announcement" | "Reminder">("Homework");
  const [content, setContent] = useState("");
  const [toast, setToast] = useState(false);
  const [filterClass, setFilterClass] = useState("All");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    const newPost: DiaryPost = {
      id: `DIR-${String(diaries.length + 1).padStart(2, '0')}`,
      className,
      subject,
      type,
      date: "Just now",
      content,
      readCount: 1,
      totalStudents: className === "Grade 10-A" ? 45 : 42,
    };

    setDiaries([newPost, ...diaries]);
    setContent("");
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  const filteredDiaries = diaries.filter(d => filterClass === "All" || d.className === filterClass);

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
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Class Diary & Daily Log</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Post daily homework, syllabus notes, and notices directly to student and parent mobile portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-[#8C877D] px-3 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2]">
            Parents Notified via App Push
          </span>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Diary entry posted and dispatched to all students and guardians in {className}!
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Grid: Composer (5 cols) & Feed (7 cols) */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        {/* Composer */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#EBE8E2] pb-4">
            <div className="w-8 h-8 rounded-lg bg-[#C4993C]/10 text-[#C4993C] flex items-center justify-center">
              <Book size={18} />
            </div>
            <div>
              <h2 className="font-bold text-[#23201B] text-base font-sora">New Diary Entry</h2>
              <p className="text-xs text-[#8C877D]">Instant synchronization to student portals</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Target Class</label>
                <select
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  className="w-full text-xs font-medium border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
                >
                  <option>Grade 10-A</option>
                  <option>Grade 10-B</option>
                  <option>Grade 9-A</option>
                  <option>Grade 9-B</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Subject</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full text-xs font-medium border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
                >
                  <option>Advanced Mathematics</option>
                  <option>Pure Mathematics</option>
                  <option>General Physics</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Entry Classification</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["Homework", "Classwork", "Announcement", "Reminder"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setType(t)}
                    className={`py-2 px-2 text-center rounded-xl text-xs font-bold border transition-all ${
                      type === t
                        ? "bg-[#23201B] text-white border-[#23201B] shadow-sm"
                        : "bg-[#FAF8F5] text-[#706B62] border-[#EBE8E2] hover:bg-white hover:text-[#23201B]"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Diary Description *</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="e.g. Exercise 5.2 on page 142. Bring geometry set tomorrow..."
                rows={5}
                required
                className="w-full text-xs border border-[#D9D4CC] rounded-xl p-3.5 outline-none bg-[#FAF8F5] focus:border-[#C4993C] focus:bg-white resize-none"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                className="text-xs text-[#8C877D] hover:text-[#23201B] flex items-center gap-1 font-medium"
              >
                <Paperclip size={13} /> Attach Worksheet File
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-[#C4993C] to-[#D4A843] hover:from-[#B3882B] hover:to-[#C4993C] shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send size={15} /> Publish Diary Log
            </button>
          </form>
        </div>

        {/* Diary Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-4 flex items-center justify-between">
            <span className="font-bold text-xs text-[#23201B] uppercase tracking-wider">Filter Section:</span>
            <div className="flex items-center gap-2">
              {["All", "Grade 10-A", "Grade 10-B", "Grade 9-A"].map((c) => (
                <button
                  key={c}
                  onClick={() => setFilterClass(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterClass === c
                      ? "bg-[#23201B] text-white"
                      : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2]"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {filteredDiaries.map((d) => (
              <div
                key={d.id}
                className="bg-white rounded-2xl border border-[#EBE8E2] p-5 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      d.type === "Homework"
                        ? "bg-purple-100 text-purple-700"
                        : d.type === "Reminder"
                        ? "bg-amber-100 text-amber-800"
                        : d.type === "Announcement"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-emerald-100 text-emerald-800"
                    }`}>
                      {d.type}
                    </span>
                    <span className="font-bold text-xs text-[#23201B] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#EBE8E2]">
                      {d.className}
                    </span>
                    <span className="text-xs text-[#8C877D]">• {d.subject}</span>
                  </div>

                  <span className="text-[11px] text-[#8C877D] flex items-center gap-1 font-medium">
                    <Clock size={11} /> {d.date}
                  </span>
                </div>

                <p className="text-xs text-[#4A453E] leading-relaxed mb-4 pl-3 border-l-2 border-[#C4993C]">
                  {d.content}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-[#F1EAD9] text-xs text-[#8C877D]">
                  <span className="font-semibold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 size={12} className="text-emerald-600" />
                    {d.readCount} / {d.totalStudents} Guardians Acknowledged
                  </span>
                  <button className="text-[#C4993C] hover:underline font-bold text-xs">
                    View Signatures
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
