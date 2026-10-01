"use client";

import { useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  MapPin,
  Download,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from "lucide-react";

interface ScheduleSlot {
  id: string;
  time: string;
  period: number;
  subject: string;
  teacher: string;
  room: string;
  classGrade: string;
  type: "lecture" | "lab" | "break" | "assembly";
}

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const mockSchedule: Record<string, ScheduleSlot[]> = {
  Monday: [
    { id: "1", time: "08:00 - 08:45 AM", period: 1, subject: "Morning Assembly & Homeroom", teacher: "Staff", room: "Main Courtyard", classGrade: "All", type: "assembly" },
    { id: "2", time: "08:45 - 09:30 AM", period: 2, subject: "Advanced Mathematics", teacher: "Dr. Robert Vance", room: "Room 101", classGrade: "Grade 10-A", type: "lecture" },
    { id: "3", time: "09:35 - 10:20 AM", period: 3, subject: "Physics & Mechanics", teacher: "Elena Rostova", room: "Science Lab 2", classGrade: "Grade 10-A", type: "lab" },
    { id: "4", time: "10:20 - 10:45 AM", period: 4, subject: "Recess / Nutrition Break", teacher: "Duty Staff", room: "Cafeteria", classGrade: "All", type: "break" },
    { id: "5", time: "10:45 - 11:30 AM", period: 5, subject: "English Literature", teacher: "Clara Oswald", room: "Room 204", classGrade: "Grade 10-A", type: "lecture" },
    { id: "6", time: "11:35 - 12:20 PM", period: 6, subject: "World History", teacher: "Marcus Sterling", room: "Room 108", classGrade: "Grade 10-A", type: "lecture" },
    { id: "7", time: "12:25 - 01:10 PM", period: 7, subject: "Computer Science & Robotics", teacher: "David Kim", room: "Computer Lab 1", classGrade: "Grade 10-A", type: "lab" },
  ],
  Tuesday: [
    { id: "8", time: "08:00 - 08:45 AM", period: 1, subject: "Chemistry & Molecular Bio", teacher: "Dr. Angela Merkel", room: "Chem Lab 1", classGrade: "Grade 10-A", type: "lab" },
    { id: "9", time: "08:45 - 09:30 AM", period: 2, subject: "English Literature", teacher: "Clara Oswald", room: "Room 204", classGrade: "Grade 10-A", type: "lecture" },
    { id: "10", time: "09:35 - 10:20 AM", period: 3, subject: "Advanced Mathematics", teacher: "Dr. Robert Vance", room: "Room 101", classGrade: "Grade 10-A", type: "lecture" },
    { id: "11", time: "10:20 - 10:45 AM", period: 4, subject: "Recess / Nutrition Break", teacher: "Duty Staff", room: "Cafeteria", classGrade: "All", type: "break" },
    { id: "12", time: "10:45 - 11:30 AM", period: 5, subject: "Physical Education", teacher: "Coach Miller", room: "Sports Complex", classGrade: "Grade 10-A", type: "lecture" },
    { id: "13", time: "11:35 - 12:20 PM", period: 6, subject: "Art & Design", teacher: "Sophia Chen", room: "Studio 3", classGrade: "Grade 10-A", type: "lab" },
    { id: "14", time: "12:25 - 01:10 PM", period: 7, subject: "Geography & Earth Sciences", teacher: "James Thornton", room: "Room 105", classGrade: "Grade 10-A", type: "lecture" },
  ],
  Wednesday: [
    { id: "15", time: "08:00 - 08:45 AM", period: 1, subject: "Advanced Mathematics", teacher: "Dr. Robert Vance", room: "Room 101", classGrade: "Grade 10-A", type: "lecture" },
    { id: "16", time: "08:45 - 09:30 AM", period: 2, subject: "World History", teacher: "Marcus Sterling", room: "Room 108", classGrade: "Grade 10-A", type: "lecture" },
    { id: "17", time: "09:35 - 10:20 AM", period: 3, subject: "Physics & Mechanics", teacher: "Elena Rostova", room: "Science Lab 2", classGrade: "Grade 10-A", type: "lab" },
    { id: "18", time: "10:20 - 10:45 AM", period: 4, subject: "Recess / Nutrition Break", teacher: "Duty Staff", room: "Cafeteria", classGrade: "All", type: "break" },
    { id: "19", time: "10:45 - 11:30 AM", period: 5, subject: "Computer Science", teacher: "David Kim", room: "Computer Lab 1", classGrade: "Grade 10-A", type: "lab" },
    { id: "20", time: "11:35 - 12:20 PM", period: 6, subject: "English Literature", teacher: "Clara Oswald", room: "Room 204", classGrade: "Grade 10-A", type: "lecture" },
    { id: "21", time: "12:25 - 01:10 PM", period: 7, subject: "Civics & Ethics", teacher: "Marcus Sterling", room: "Room 108", classGrade: "Grade 10-A", type: "lecture" },
  ],
  Thursday: [
    { id: "22", time: "08:00 - 08:45 AM", period: 1, subject: "Chemistry & Molecular Bio", teacher: "Dr. Angela Merkel", room: "Chem Lab 1", classGrade: "Grade 10-A", type: "lab" },
    { id: "23", time: "08:45 - 09:30 AM", period: 2, subject: "Advanced Mathematics", teacher: "Dr. Robert Vance", room: "Room 101", classGrade: "Grade 10-A", type: "lecture" },
    { id: "24", time: "09:35 - 10:20 AM", period: 3, subject: "English Literature", teacher: "Clara Oswald", room: "Room 204", classGrade: "Grade 10-A", type: "lecture" },
    { id: "25", time: "10:20 - 10:45 AM", period: 4, subject: "Recess / Nutrition Break", teacher: "Duty Staff", room: "Cafeteria", classGrade: "All", type: "break" },
    { id: "26", time: "10:45 - 11:30 AM", period: 5, subject: "World History", teacher: "Marcus Sterling", room: "Room 108", classGrade: "Grade 10-A", type: "lecture" },
    { id: "27", time: "11:35 - 12:20 PM", period: 6, subject: "French Language", teacher: "Madame Dubois", room: "Language Lab", classGrade: "Grade 10-A", type: "lecture" },
    { id: "28", time: "12:25 - 01:10 PM", period: 7, subject: "Library & Independent Study", teacher: "Librarian", room: "Central Library", classGrade: "Grade 10-A", type: "lecture" },
  ],
  Friday: [
    { id: "29", time: "08:00 - 08:45 AM", period: 1, subject: "STEM Project & Robotics", teacher: "David Kim", room: "Makerspace", classGrade: "Grade 10-A", type: "lab" },
    { id: "30", time: "08:45 - 09:30 AM", period: 2, subject: "Physics & Mechanics", teacher: "Elena Rostova", room: "Science Lab 2", classGrade: "Grade 10-A", type: "lab" },
    { id: "31", time: "09:35 - 10:20 AM", period: 3, subject: "Advanced Mathematics", teacher: "Dr. Robert Vance", room: "Room 101", classGrade: "Grade 10-A", type: "lecture" },
    { id: "32", time: "10:20 - 10:45 AM", period: 4, subject: "Recess / Nutrition Break", teacher: "Duty Staff", room: "Cafeteria", classGrade: "All", type: "break" },
    { id: "33", time: "10:45 - 11:30 AM", period: 5, subject: "Physical Education & Games", teacher: "Coach Miller", room: "Main Oval", classGrade: "Grade 10-A", type: "lecture" },
    { id: "34", time: "11:35 - 12:20 PM", period: 6, subject: "Clubs & Extracurriculars", teacher: "Club Leads", room: "Campus Grounds", classGrade: "Grade 10-A", type: "lecture" },
    { id: "35", time: "12:25 - 01:00 PM", period: 7, subject: "Weekly Assembly & Dismissal", teacher: "Homeroom", room: "Main Courtyard", classGrade: "All", type: "assembly" },
  ],
};

export default function AdminTimetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [selectedClass, setSelectedClass] = useState("Grade 10-A");

  const currentDaySlots = mockSchedule[selectedDay] || [];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Administration</span>
            <span>/</span>
            <span className="text-[#C4993C]">Academic Planning</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Master Timetable & Period Schedules</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Configure weekly bell schedules, classroom room allocations, and faculty assignments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm">
            <Download size={14} /> Export Timetable (PDF)
          </button>
          <button className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md">
            <Plus size={14} /> Add Period Slot
          </button>
        </div>
      </div>

      {/* Selector Controls */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Class selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-[#8C877D] uppercase tracking-wider whitespace-nowrap">
            Selected Class:
          </label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl outline-none focus:border-[#C4993C]"
          >
            <option>Grade 10-A</option>
            <option>Grade 10-B</option>
            <option>Grade 9-A</option>
            <option>Grade 9-B</option>
            <option>Grade 11-PreMed</option>
            <option>Grade 12-Engineering</option>
          </select>
          <span className="text-xs text-[#8C877D] hidden sm:inline">36 Total Weekly Periods</span>
        </div>

        {/* Weekday Switcher Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto p-1 bg-[#FAF8F5] rounded-xl border border-[#EBE8E2]">
          {weekDays.map((day) => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                selectedDay === day
                  ? "bg-[#23201B] text-white shadow-sm"
                  : "text-[#706B62] hover:text-[#23201B] hover:bg-white"
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </div>

      {/* Schedule Table / Timeline */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] bg-[#FAF8F5]/60 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-[#23201B] text-base font-sora">
              {selectedDay} Schedule — {selectedClass}
            </h2>
            <p className="text-xs text-[#8C877D]">Standard 7-period rotation • Bell timings synchronized</p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            0 Scheduling Conflicts
          </span>
        </div>

        <div className="divide-y divide-[#EBE8E2]">
          {currentDaySlots.map((slot) => (
            <div
              key={slot.id}
              className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                slot.type === "break"
                  ? "bg-amber-50/40 border-l-4 border-l-amber-400"
                  : slot.type === "assembly"
                  ? "bg-blue-50/30 border-l-4 border-l-blue-400"
                  : "hover:bg-[#FAF8F5] border-l-4 border-l-[#C4993C]"
              }`}
            >
              {/* Period & Timing */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <div className="w-10 h-10 rounded-xl bg-white border border-[#EBE8E2] flex flex-col items-center justify-center font-bold text-xs shadow-sm">
                  <span className="text-[10px] text-[#8C877D] font-mono leading-none">P</span>
                  <span className="text-sm text-[#23201B]">{slot.period}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#23201B]">
                    <Clock size={13} className="text-[#C4993C]" />
                    {slot.time}
                  </div>
                  <span className="text-[10px] uppercase font-semibold text-[#8C877D] tracking-wider">
                    {slot.type === "break" ? "Nutrition Recess" : slot.type === "lab" ? "Practical Lab" : "Lecture"}
                  </span>
                </div>
              </div>

              {/* Subject & Topic */}
              <div className="flex-1 min-w-[240px]">
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="font-bold text-[#23201B] text-sm font-sora">{slot.subject}</h3>
                  {slot.type === "lab" && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">
                      Lab
                    </span>
                  )}
                </div>
                <p className="text-xs text-[#706B62]">Curriculum Term 2 • Unit 4 Module</p>
              </div>

              {/* Teacher & Room */}
              <div className="flex items-center gap-6 min-w-[260px] text-xs">
                <div className="flex items-center gap-2 text-[#4A453E]">
                  <Users size={14} className="text-[#8C877D]" />
                  <span className="font-medium">{slot.teacher}</span>
                </div>
                <div className="flex items-center gap-2 text-[#706B62]">
                  <MapPin size={14} className="text-[#C4993C]" />
                  <span className="font-semibold text-[#23201B] bg-[#FAF8F5] px-2 py-1 rounded-md border border-[#EBE8E2]">
                    {slot.room}
                  </span>
                </div>
              </div>

              {/* Action */}
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#706B62] hover:text-[#23201B] hover:bg-white border border-transparent hover:border-[#D9D4CC] transition-all">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
