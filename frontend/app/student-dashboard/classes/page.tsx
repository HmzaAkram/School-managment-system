"use client";

import { useState } from "react";
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  Mail,
  Download,
  Award,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface EnrolledCourse {
  id: string;
  subject: string;
  code: string;
  teacher: string;
  email: string;
  room: string;
  timing: string;
  days: string;
  grade: string;
  score: number;
  progress: number;
  currentUnit: string;
}

const enrolledCourses: EnrolledCourse[] = [
  { id: "1", subject: "Advanced Mathematics", code: "MATH-301", teacher: "Dr. Robert Vance", email: "r.vance@oakridge.skoolms.edu", room: "Room 101", timing: "08:45 AM – 09:30 AM", days: "Mon, Wed, Fri", grade: "A+", score: 96, progress: 78, currentUnit: "Trigonometric Transforms & Polynomials" },
  { id: "2", subject: "Physics & Mechanics", code: "PHYS-204", teacher: "Elena Rostova", email: "e.rostova@oakridge.skoolms.edu", room: "Science Lab 2", timing: "09:35 AM – 10:20 AM", days: "Mon, Wed, Fri", grade: "A", score: 92, progress: 74, currentUnit: "Conservation of Momentum & Collisions" },
  { id: "3", subject: "English Literature", code: "ENG-102", teacher: "Clara Oswald", email: "c.oswald@oakridge.skoolms.edu", room: "Room 204", timing: "10:45 AM – 11:30 AM", days: "Daily", grade: "A", score: 90, progress: 82, currentUnit: "Shakespearean Tragedy & Analytical Essays" },
  { id: "4", subject: "Chemistry & Organic Analysis", code: "CHEM-202", teacher: "Dr. Angela Merkel", email: "a.merkel@oakridge.skoolms.edu", room: "Chemistry Lab A", timing: "08:00 AM – 08:45 AM", days: "Tue, Thu", grade: "A-", score: 88, progress: 70, currentUnit: "Hydrocarbons, Isomerism & Functional Groups" },
  { id: "5", subject: "Computer Science & AI", code: "CS-105", teacher: "David Kim", email: "d.kim@oakridge.skoolms.edu", room: "Computer Lab 1", timing: "12:25 PM – 01:10 PM", days: "Mon, Wed", grade: "A+", score: 98, progress: 85, currentUnit: "Graph Traversal Algorithms & Binary Trees" },
  { id: "6", subject: "World History & Civics", code: "HIST-101", teacher: "Marcus Sterling", email: "m.sterling@oakridge.skoolms.edu", room: "Room 108", timing: "11:35 AM – 12:20 PM", days: "Tue, Thu", grade: "B+", score: 84, progress: 68, currentUnit: "Post-War International Alliances & Decolonization" },
];

export default function StudentClasses() {
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
            Grade 10-A • 6 Core Subjects
          </div>
        </div>
      </div>

      {/* Grid of Courses */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((c) => (
          <div
            key={c.id}
            className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#EBE8E2] text-[#8C877D]">
                  {c.code}
                </span>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#23201B]">{c.score}%</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {c.grade}
                  </span>
                </div>
              </div>

              <h2 className="font-bold text-lg text-[#23201B] font-sora mb-1">{c.subject}</h2>
              <p className="text-xs text-[#706B62] mb-4">Instructor: <span className="font-semibold text-[#23201B]">{c.teacher}</span></p>

              {/* Schedule Details */}
              <div className="space-y-2 text-xs mb-5">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center justify-between text-[#4A453E]">
                  <span className="flex items-center gap-1.5 text-[#706B62]">
                    <Clock size={13} className="text-[#C4993C]" /> Timings
                  </span>
                  <span className="font-semibold">{c.timing}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center justify-between text-[#4A453E]">
                  <span className="flex items-center gap-1.5 text-[#706B62]">
                    <MapPin size={13} className="text-[#C4993C]" /> Room
                  </span>
                  <span className="font-semibold">{c.room}</span>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-5 bg-[#FFFDF9] p-3.5 rounded-xl border border-[#F1EAD9]">
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="font-bold text-[#4A453E]">Course Mastery</span>
                  <span className="font-bold text-[#C4993C] font-mono">{c.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-[#EBE8E2] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                    style={{ width: `${c.progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#706B62] line-clamp-1">
                  Unit: {c.currentUnit}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#EBE8E2] flex items-center gap-2">
              <button className="flex-1 py-2 rounded-xl text-xs font-bold text-[#23201B] bg-[#FAF8F5] hover:bg-[#EBE8E2] border border-[#EBE8E2] transition-colors flex items-center justify-center gap-1">
                <Download size={12} /> Outline
              </button>
              <button className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-[#23201B] hover:bg-[#3D382F] transition-colors flex items-center justify-center gap-1 shadow-sm">
                Coursework
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
