"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  CheckSquare,
  FileText,
  Calendar,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TeacherClasses() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<any>("/teacher/classes");
        setClasses(Array.isArray(res) ? res : (res.data || []));
      } catch (err: any) {
        console.error("Error loading classes:", err);
        setError(err?.message || "Failed to load assigned classes");
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  const totalStudents = classes.reduce((acc, curr) => acc + (Number(curr.students_count) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Active Courses</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">My Assigned Classes & Sections</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Overview of syllabus coverage, daily lecture schedules, and quick actions for your sections.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-semibold text-[#706B62]">
            <span className="font-bold text-[#23201B]">{classes.length}</span> Sections Assigned • <span className="font-bold text-[#23201B]">{totalStudents}</span> Total Students
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <span>Loading assigned classes...</span>
        </div>
      ) : classes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-[#EBE8E2] text-slate-500">
          No classes currently timetabled for your faculty account.
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-6">
          {classes.map((cls) => {
            const firstSchedule = cls.schedule?.[0];
            const timing = firstSchedule ? `${firstSchedule.start_time} - ${firstSchedule.end_time}` : "Flexible Timing";
            const days = cls.schedule && cls.schedule.length > 0 ? cls.schedule.map((s: any) => s.day).join(", ") : "Weekly Rotation";
            const subject = cls.subjects?.[0] || "General";
            const room = cls.room || firstSchedule?.room || "Room 101";

            return (
              <div
                key={cls.id}
                className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="font-bold text-xl text-[#23201B] font-sora">
                          {cls.name} {cls.section ? `(${cls.section})` : ""}
                        </h2>
                        <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EBE8E2] text-[#706B62]">
                          {days}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-[#C4993C]">{subject}</p>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-bold text-[#4A453E]">
                      <Users size={14} className="text-[#8C877D]" />
                      <span>{cls.students_count || 0} Enrolled</span>
                    </div>
                  </div>

                  {/* Location & Time Pills */}
                  <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                      <Clock size={14} className="text-[#C4993C]" />
                      <span className="font-medium">{timing}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                      <MapPin size={14} className="text-[#C4993C]" />
                      <span className="font-medium">{room}</span>
                    </div>
                  </div>

                  {/* Syllabus / Next Exam */}
                  <div className="mb-5 bg-[#FFFDF9] p-4 rounded-xl border border-[#F1EAD9]">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-bold text-[#4A453E]">Next Scheduled Paper</span>
                      <span className="font-extrabold text-[#C4993C] font-mono">
                        {cls.next_exam ? `${cls.next_exam.days_away}d away` : "No upcoming exams"}
                      </span>
                    </div>
                    {cls.next_exam ? (
                      <div className="flex items-center gap-1 text-[11px] text-[#706B62]">
                        <Sparkles size={11} className="text-[#C4993C]" />
                        <span className="font-medium">
                          {cls.next_exam.name}: {cls.next_exam.subject} on {cls.next_exam.date}
                        </span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-[#706B62]">
                        All regular coursework ongoing.
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions Footer */}
                <div className="pt-4 border-t border-[#EBE8E2] grid grid-cols-3 gap-2">
                  <Link
                    href={`/teacher-dashboard/attendance?class_id=${cls.id}`}
                    className="py-2.5 px-3 rounded-xl text-center text-xs font-bold text-[#23201B] bg-[#FAF8F5] hover:bg-[#EBE8E2] border border-[#EBE8E2] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <CheckSquare size={13} className="text-[#C4993C]" /> Roll Call
                  </Link>
                  <Link
                    href={`/teacher-dashboard/diaries?class_id=${cls.id}`}
                    className="py-2.5 px-3 rounded-xl text-center text-xs font-bold text-[#23201B] bg-[#FAF8F5] hover:bg-[#EBE8E2] border border-[#EBE8E2] transition-colors flex items-center justify-center gap-1.5"
                  >
                    <BookOpen size={13} className="text-[#C4993C]" /> Post Diary
                  </Link>
                  <Link
                    href={`/teacher-dashboard/assignments?class_id=${cls.id}`}
                    className="py-2.5 px-3 rounded-xl text-center text-xs font-bold text-white bg-[#23201B] hover:bg-[#3D382F] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <FileText size={13} /> Tasks
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
