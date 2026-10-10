"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { Loader2, AlertCircle, Calendar, Megaphone } from "lucide-react";

export default function StudentOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<any>("/student/stats");
        setData(res);
      } catch (err: any) {
        console.error("Error loading student stats:", err);
        setError(err?.message || "Failed to load student dashboard");
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
        <span>Loading your student dashboard...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
        <AlertCircle size={20} />
        <span>{error || "Student profile not found"}</span>
      </div>
    );
  }

  const { student, stats = {}, upcoming_exams = [], recent_notices = [] } = data;

  const cards = [
    { 
      label: 'Overall GPA', 
      value: stats.gpa ? `${stats.gpa}/4.0` : (stats.overall_percentage ? `${stats.overall_percentage}%` : 'N/A'), 
      icon: '🎓', 
      color: 'from-primary to-accent' 
    },
    { 
      label: 'Avg Attendance', 
      value: stats.attendance_percentage ? `${stats.attendance_percentage}%` : '100%', 
      icon: '📋', 
      color: 'from-accent to-accent-cyan' 
    },
    { 
      label: 'Assignments Done', 
      value: `${stats.submitted_assignments ?? 0}/${stats.total_assignments ?? 0}`, 
      icon: '📝', 
      color: 'from-[#D4A843] to-[#E3C273]' 
    },
    { 
      label: 'Fees Status', 
      value: stats.fee_status === 'Paid' ? 'Paid ✓' : (stats.total_pending_fee > 0 ? `Due PKR ${stats.total_pending_fee}` : stats.fee_status || 'Paid ✓'), 
      icon: '💰', 
      color: stats.fee_status === 'Overdue' ? 'from-red-500 to-red-600' : 'from-emerald-500 to-emerald-600' 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">
          Welcome back, {student?.name || "Student"}! 👋
        </h1>
        <p className="text-slate-500 text-sm">
          Roll No: {student?.roll_number || student?.admission_number || `ID: ${student?.id}`} | Class: {student?.class || "Assigned"} {student?.section ? `(${student.section})` : ""}
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(212,168,67,0.1)] hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm mb-4`}>
              {s.icon}
            </div>
            <div className="text-2xl font-extrabold font-sora text-slate-900 mb-1">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming exams */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Upcoming Exams 📅</h2>
          {upcoming_exams.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No exams scheduled for the near future.
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming_exams.map((exam: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-primary/5 transition-colors">
                  <div>
                    <div className="font-semibold text-slate-800 text-sm">{exam.subject || exam.exam}</div>
                    <div className="text-xs text-slate-400">{exam.start_time ? `${exam.start_time} • ${exam.room || "Exam Hall"}` : exam.exam}</div>
                  </div>
                  <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/10 text-accent">
                    {exam.date}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Announcements */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Announcements 📢</h2>
          {recent_notices.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-sm">
              No recent announcements on the notice board.
            </div>
          ) : (
            <div className="space-y-3">
              {recent_notices.map((a: any, i: number) => (
                <div key={i} className="flex gap-3 items-start p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${a.pinned ? "bg-amber-500" : "bg-primary"} mt-1.5 flex-shrink-0`} />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">{a.title}</p>
                    <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">{a.content}</p>
                    <p className="text-[10px] text-slate-400 mt-1">{a.publish_date || "Recent"}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
