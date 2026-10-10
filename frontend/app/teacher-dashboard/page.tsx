"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { 
  Users, 
  BookOpen, 
  FileText, 
  CheckCircle, 
  Clock, 
  Calendar, 
  Loader2, 
  AlertCircle 
} from "lucide-react";

export default function TeacherOverview() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);
        const res = await apiFetch<any>("/teacher/stats");
        setData(res);
      } catch (err: any) {
        console.error("Error loading teacher stats:", err);
        setError(err?.message || "Failed to load faculty dashboard");
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
        <span>Loading faculty dashboard...</span>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
        <AlertCircle size={20} />
        <span>{error || "Faculty profile not found"}</span>
      </div>
    );
  }

  const { teacher, today_classes = [], stats = {}, action_items = [] } = data;

  const cards = [
    { label: 'Total Students', value: stats.total_students ?? 0, icon: '👨‍🎓', color: 'from-primary to-accent' },
    { label: 'Classes Today',  value: today_classes.length,      icon: '🏫', color: 'from-accent to-accent-cyan' },
    { label: 'To Grade',       value: stats.pending_grading ?? 0, icon: '📝', color: 'from-[#D4A843] to-[#E3C273]' },
    { label: 'Avg Attendance', value: `${stats.attendance_rate ?? 95}%`, icon: '📋', color: 'from-emerald-500 to-emerald-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">
          Welcome back, {teacher?.name || "Teacher"}! 👋
        </h1>
        <p className="text-slate-500 text-sm">
          You have {today_classes.length} classes scheduled today and {stats.pending_grading ?? 0} submissions awaiting evaluation.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {cards.map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(212,168,67,0.1)] hover:-translate-y-0.5 transition-all duration-300">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm mb-4`}>
              {s.icon}
            </div>
            <div className="text-2xl font-extrabold font-sora text-slate-900 mb-1">{s.value}</div>
            <div className="text-sm text-slate-500 font-medium">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Schedule */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Today's Schedule</h2>
          {today_classes.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-sm">
              No teaching periods scheduled for today.
            </div>
          ) : (
            <div className="relative border-l-2 border-slate-100 ml-3 space-y-6">
              {today_classes.map((item: any, i: number) => (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-4 border-white ${item.is_ongoing ? 'bg-primary shadow-[0_0_0_4px_rgba(212,168,67,0.2)]' : 'bg-slate-300'}`} />
                  <div className="text-xs font-bold text-slate-400 mb-1">{item.start_time} - {item.end_time}</div>
                  <div className={`p-4 rounded-xl border ${item.is_ongoing ? 'bg-primary/5 border-primary/20' : 'bg-slate-50 border-slate-100'}`}>
                    <h4 className={`font-semibold ${item.is_ongoing ? 'text-primary' : 'text-slate-700'}`}>{item.subject}</h4>
                    <div className={`text-sm mt-1 ${item.is_ongoing ? 'text-accent' : 'text-slate-500'}`}>
                      Class: {item.class} {item.section ? `(${item.section})` : ""} {item.room ? `• ${item.room}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Items */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]">
          <h2 className="font-sora font-bold text-slate-800 mb-5">Action Items</h2>
          <div className="space-y-3">
            {action_items.map((a: any, i: number) => (
              <Link 
                href={a.href || "#"} 
                key={i} 
                className="flex gap-4 items-center p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-lg">
                  {i === 0 ? "📝" : i === 1 ? "📋" : "📚"}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors">
                    {a.label}
                  </p>
                  {a.count > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded text-amber-700 bg-amber-50 mt-1 inline-block">
                      {a.count} PENDING
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold font-mono text-slate-400 group-hover:text-primary">
                  {a.count}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
