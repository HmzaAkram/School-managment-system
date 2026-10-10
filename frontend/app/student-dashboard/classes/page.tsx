"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  Mail,
  Download,
  Award,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface CourseSchedule {
  day: string;
  period: number;
  start_time: string;
  end_time: string;
  room?: string;
  teacher?: string;
}

interface CourseTeacher {
  id: number;
  name: string;
  designation?: string;
}

interface EnrolledCourse {
  id: number;
  name: string;
  code: string;
  type: string;
  credits: number;
  total_marks: number;
  pass_marks: number;
  teachers: CourseTeacher[];
  periods_per_week: number;
  schedule: CourseSchedule[];
}

interface StudentInfo {
  class_name?: string;
  section_name?: string;
  roll_number?: string;
}

export default function StudentClasses() {
  const [courses, setCourses] = useState<EnrolledCourse[]>([]);
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [coursesRes, statsRes] = await Promise.all([
          apiFetch<EnrolledCourse[]>("/student/courses"),
          apiFetch<any>("/student/stats").catch(() => null),
        ]);

        if (Array.isArray(coursesRes)) {
          setCourses(coursesRes);
        } else {
          setCourses([]);
        }

        if (statsRes?.student) {
          setStudentInfo({
            class_name: statsRes.student.class_name,
            section_name: statsRes.student.section_name,
            roll_number: statsRes.student.roll_number,
          });
        }
      } catch (err: any) {
        console.error("Failed to load courses:", err);
        setError(err.message || "Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Student Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Registered Subjects</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">My Enrolled Academic Classes</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Access course syllabi, teacher office hours, room schedules, and current academic standing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-lg bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-semibold text-[#706B62]">
            {studentInfo?.class_name ? `${studentInfo.class_name} ${studentInfo.section_name ? `• ${studentInfo.section_name}` : ""}` : "Academic Class"} • {courses.length} Subject{courses.length === 1 ? "" : "s"}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-[#8C877D] space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#C4993C]" />
          <p className="text-sm font-medium">Loading enrolled subjects...</p>
        </div>
      ) : courses.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#EBE8E2] p-12 text-center">
          <BookOpen className="w-12 h-12 text-[#8C877D] mx-auto mb-3 opacity-40" />
          <h3 className="font-bold text-[#23201B] text-lg font-sora mb-1">No Enrolled Subjects</h3>
          <p className="text-xs text-[#706B62] max-w-sm mx-auto">
            You are not currently enrolled in any academic subjects for this term. Please contact your school administrator.
          </p>
        </div>
      ) : (
        /* Grid of Courses */
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => {
            const primaryTeacher = c.teachers?.[0]?.name || "Assigned Faculty";
            const firstSchedule = c.schedule?.[0];
            const timingText = firstSchedule
              ? `${firstSchedule.start_time.substring(0, 5)} - ${firstSchedule.end_time.substring(0, 5)} (${firstSchedule.day})`
              : `${c.periods_per_week || 0} periods / week`;
            const roomText = firstSchedule?.room || "Classroom";

            return (
              <div
                key={c.id}
                className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Header */}
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE8E2] text-[#8C877D]">
                      {c.code || `SUB-${c.id}`}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#23201B]">{c.credits || 1} Credits</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {c.type || "Core"}
                      </span>
                    </div>
                  </div>

                  <h2 className="font-bold text-lg text-[#23201B] font-sora mb-1">{c.name}</h2>
                  <p className="text-xs text-[#706B62] mb-4">
                    Instructor: <span className="font-semibold text-[#23201B]">{primaryTeacher}</span>
                  </p>

                  {/* Schedule Details */}
                  <div className="space-y-2 text-xs mb-5">
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center justify-between text-[#4A453E]">
                      <span className="flex items-center gap-1.5 text-[#706B62]">
                        <Clock size={13} className="text-[#C4993C]" /> Timings
                      </span>
                      <span className="font-semibold">{timingText}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center justify-between text-[#4A453E]">
                      <span className="flex items-center gap-1.5 text-[#706B62]">
                        <MapPin size={13} className="text-[#C4993C]" /> Room
                      </span>
                      <span className="font-semibold">{roomText}</span>
                    </div>
                  </div>

                  {/* Academic Weight */}
                  <div className="mb-5 bg-[#FFFDF9] p-3.5 rounded-xl border border-[#F1EAD9]">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="font-bold text-[#4A453E]">Passing Threshold</span>
                      <span className="font-bold text-[#C4993C] font-mono">{c.pass_marks} / {c.total_marks} Marks</span>
                    </div>
                    <div className="w-full h-1.5 bg-[#EBE8E2] rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                        style={{ width: `${Math.min(100, Math.round((c.pass_marks / (c.total_marks || 100)) * 100))}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-[#706B62] line-clamp-1">
                      Weekly Schedule: {c.schedule?.length ? `${c.schedule.length} class session(s)` : "Standard lecture block"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-[#EBE8E2] flex items-center gap-2">
                  <div className="flex-1 py-2 rounded-xl text-xs font-bold text-[#706B62] bg-[#FAF8F5] border border-[#EBE8E2] text-center">
                    {c.periods_per_week || c.schedule?.length || 0} Periods/Wk
                  </div>
                  <div className="flex-1 py-2 rounded-xl text-xs font-bold text-[#23201B] bg-[#F1EAD9] border border-[#E0D5BE] text-center">
                    Active
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
