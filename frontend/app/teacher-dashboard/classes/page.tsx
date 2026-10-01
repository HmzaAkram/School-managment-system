"use client";

import { useState } from "react";
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
  Sparkles
} from "lucide-react";

const classesList = [
  {
    id: "cls-1",
    name: "Grade 10-A",
    subject: "Advanced Mathematics",
    students: 45,
    timing: "08:45 AM – 09:30 AM",
    room: "Room 101",
    progress: 78,
    currentTopic: "Trigonometric Transformations & Polynomials",
    nextExam: "Oct 28, 2026",
    days: "Mon, Wed, Fri",
  },
  {
    id: "cls-2",
    name: "Grade 10-B",
    subject: "Advanced Mathematics",
    students: 42,
    timing: "10:45 AM – 11:30 AM",
    room: "Room 102",
    progress: 72,
    currentTopic: "Quadratic Equations & Complex Roots",
    nextExam: "Nov 02, 2026",
    days: "Mon, Tue, Thu",
  },
  {
    id: "cls-3",
    name: "Grade 9-A",
    subject: "Pure Mathematics",
    students: 48,
    timing: "11:35 AM – 12:20 PM",
    room: "Room 103",
    progress: 84,
    currentTopic: "Euclidean Geometry & Circle Theorems",
    nextExam: "Oct 30, 2026",
    days: "Daily",
  },
  {
    id: "cls-4",
    name: "Grade 9-B",
    subject: "Introductory Algebra",
    students: 40,
    timing: "12:25 PM – 01:10 PM",
    room: "Room 104",
    progress: 69,
    currentTopic: "Simultaneous Equations & Inequalities",
    nextExam: "Nov 05, 2026",
    days: "Tue, Thu, Fri",
  },
];

export default function TeacherClasses() {
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
            <span className="font-bold text-[#23201B]">4</span> Sections Assigned • <span className="font-bold text-[#23201B]">175</span> Total Students
          </div>
        </div>
      </div>

      {/* Class Cards Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {classesList.map((cls) => (
          <div
            key={cls.id}
            className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm hover:shadow-md transition-all p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="font-bold text-xl text-[#23201B] font-sora">{cls.name}</h2>
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#FAF8F5] border border-[#EBE8E2] text-[#706B62]">
                      {cls.days}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-[#C4993C]">{cls.subject}</p>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] text-xs font-bold text-[#4A453E]">
                  <Users size={14} className="text-[#8C877D]" />
                  <span>{cls.students} Enrolled</span>
                </div>
              </div>

              {/* Location & Time Pills */}
              <div className="grid grid-cols-2 gap-2 text-xs mb-5">
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                  <Clock size={14} className="text-[#C4993C]" />
                  <span className="font-medium">{cls.timing}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2] flex items-center gap-2 text-[#4A453E]">
                  <MapPin size={14} className="text-[#C4993C]" />
                  <span className="font-medium">{cls.room}</span>
                </div>
              </div>

              {/* Syllabus Progress */}
              <div className="mb-5 bg-[#FFFDF9] p-4 rounded-xl border border-[#F1EAD9]">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-bold text-[#4A453E]">Syllabus Progress</span>
                  <span className="font-extrabold text-[#C4993C] font-mono">{cls.progress}%</span>
                </div>
                <div className="w-full h-2 bg-[#EBE8E2] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                    style={{ width: `${cls.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-1 text-[11px] text-[#706B62]">
                  <Sparkles size={11} className="text-[#C4993C]" />
                  <span className="font-medium">Current: {cls.currentTopic}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-4 border-t border-[#EBE8E2] grid grid-cols-3 gap-2">
              <Link
                href="/teacher-dashboard/attendance"
                className="py-2.5 px-3 rounded-xl text-center text-xs font-bold text-[#23201B] bg-[#FAF8F5] hover:bg-[#EBE8E2] border border-[#EBE8E2] transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckSquare size={13} className="text-[#C4993C]" /> Roll Call
              </Link>
              <Link
                href="/teacher-dashboard/diaries"
                className="py-2.5 px-3 rounded-xl text-center text-xs font-bold text-[#23201B] bg-[#FAF8F5] hover:bg-[#EBE8E2] border border-[#EBE8E2] transition-colors flex items-center justify-center gap-1.5"
              >
                <BookOpen size={13} className="text-[#C4993C]" /> Post Diary
              </Link>
              <Link
                href="/teacher-dashboard/assignments"
                className="py-2.5 px-3 rounded-xl text-center text-xs font-bold text-white bg-[#23201B] hover:bg-[#3D382F] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <FileText size={13} /> Tasks
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
