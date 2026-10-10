"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, User, Phone, Mail, MapPin, Calendar, Award, 
  CheckCircle2, Clock, DollarSign, BookOpen, 
  FileText, Shield, Edit3, Printer, MessageSquare, Plus, Check,
  Loader2, AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Props {
  params: Promise<{ id: string }>;
}

export default function TeacherDetailPage({ params }: Props) {
  const resolvedParams = use(params);
  const teacherId = resolvedParams.id;

  const [teacherData, setTeacherData] = useState<any>(null);
  const [timetable, setTimetable] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'schedule' | 'salary' | 'performance'>('profile');

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const [teacherRes, timetableRes] = await Promise.allSettled([
          apiFetch<any>(`/admin/teachers/${teacherId}`),
          apiFetch<any>(`/admin/timetable?teacher_id=${teacherId}`)
        ]);

        if (teacherRes.status === "fulfilled") {
          setTeacherData(teacherRes.value);
        } else {
          throw new Error(teacherRes.reason?.message || "Failed to load teacher");
        }

        if (timetableRes.status === "fulfilled") {
          setTimetable(timetableRes.value.data || timetableRes.value || []);
        }
      } catch (err: any) {
        console.error("Error loading teacher:", err);
        setError(err?.message || "Failed to load teacher dossier");
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [teacherId]);

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-3" />
        <span className="text-sm font-medium">Loading faculty dossier...</span>
      </div>
    );
  }

  if (error || !teacherData?.teacher) {
    return (
      <div className="space-y-4">
        <Link
          href="/admin-dashboard/teachers"
          className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft size={16} /> Back to Faculty List
        </Link>
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={20} />
          <span>{error || "Teacher dossier not found"}</span>
        </div>
      </div>
    );
  }

  const { teacher, attendance, performance, workload } = teacherData;
  const attRate = attendance?.rate ?? 95;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin-dashboard/teachers"
            className="p-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#996B1E] bg-[#FAF3E5] px-2 py-0.5 rounded border border-[#EBE5D9]">
                {teacher.employee_id || teacher.id}
              </span>
              <span className="text-xs text-[#706B62]">
                {teacher.designation || "Faculty"} • {teacher.department || "General"}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mt-0.5">
              {teacher.name}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer size={14} className="text-[#C4993C]" />
            <span>Print Dossier</span>
          </button>
          
          <a
            href={`mailto:${teacher.email || ''}`}
            className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <MessageSquare size={14} className="text-[#D4A843]" />
            <span>Contact Faculty</span>
          </a>
        </div>
      </div>

      {/* ── Teacher Profile Header Card ── */}
      <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-xs p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-center gap-5">
            <div className="w-20 h-20 rounded-2xl bg-[#23201B] flex items-center justify-center text-[#D4A843] font-serif font-bold text-2xl shadow-md border-2 border-white flex-shrink-0">
              {(teacher.first_name?.[0] || "") + (teacher.last_name?.[0] || "")}
            </div>
            
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <h2 className="font-serif font-bold text-2xl text-[#23201B]">{teacher.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ● {teacher.status || "Active"}
                </span>
                {teacher.classes && teacher.classes.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF3E5] text-[#996B1E] border border-[#EBE5D9]">
                    Assigned: {teacher.classes.map((c: any) => c.name).join(", ")}
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-xs text-[#706B62]">
                <div className="flex items-center gap-1.5">
                  <Mail size={13} className="text-[#C4993C]" />
                  <span>{teacher.email || "No email"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone size={13} className="text-[#C4993C]" />
                  <span>{teacher.phone || "No phone"}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen size={13} className="text-[#C4993C]" />
                  <span>{teacher.department || "Faculty Member"}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-[#EBE5D9] pt-4 md:pt-0 md:pl-6">
            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Faculty Attendance</span>
              <div className="font-serif font-bold text-xl text-emerald-700">{attRate}%</div>
              <span className="text-[9px] text-emerald-600 font-semibold">Attendance Rate</span>
            </div>
            
            <div className="h-8 w-px bg-[#EBE5D9]" />

            <div className="text-center px-3">
              <span className="text-[10px] font-bold text-[#8C847B] uppercase block">Monthly Salary</span>
              <div className="font-serif font-bold text-xl text-[#23201B]">
                PKR {Number(teacher.salary || 0).toLocaleString()}
              </div>
              <span className="text-[9px] text-emerald-700 font-bold">Status: {teacher.salary_status || "Active"}</span>
            </div>
          </div>

        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 mt-8 pt-6 border-t border-[#EBE5D9] overflow-x-auto">
          {[
            { id: 'profile', label: 'Faculty Profile & Qualifications' },
            { id: 'schedule', label: 'Weekly Timetable & Classes' },
            { id: 'salary', label: 'Payroll & Compensation' },
            { id: 'performance', label: 'Workload & Academic Metrics' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-[#23201B] text-white shadow-xs'
                  : 'bg-[#FAF8F5] text-[#706B62] hover:text-[#23201B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Tab Content ── */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
              Academic & Professional Credentials
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Qualification</span>
                <strong className="text-[#23201B]">{teacher.qualification || "Graduated"}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Specialization</span>
                <strong className="text-[#23201B]">{teacher.specialization || "General Education"}</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Teaching Experience</span>
                <strong className="text-[#23201B]">{teacher.experience_years} Years</strong>
              </div>
              <div className="flex justify-between py-1.5 border-b border-[#FAF8F5]">
                <span className="text-[#8C847B]">Date of Joining</span>
                <span className="text-[#23201B]">{teacher.joining_date || "N/A"}</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-[#8C847B]">Address</span>
                <strong className="text-[#23201B]">{teacher.address || "Not specified"}</strong>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
            <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
              Assigned Courses & Classes
            </h3>
            {teacher.classes && teacher.classes.length > 0 ? (
              <div className="space-y-3 text-xs">
                {teacher.classes.map((c: any, i: number) => (
                  <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] flex justify-between items-center">
                    <div>
                      <div className="font-bold text-[#23201B]">{c.name} {c.section ? `(${c.section})` : ""}</div>
                      <div className="text-[10px] text-[#706B62] mt-0.5">{c.students || 0} Students Enrolled</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-1 rounded bg-white border border-[#EBE5D9] text-[#996B1E]">
                      Class ID: {c.id}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4">No specific classes currently assigned.</p>
            )}

            <h4 className="font-serif font-bold text-sm text-[#23201B] mt-6 mb-2">Subject Specialization</h4>
            {teacher.subjects && teacher.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {teacher.subjects.map((s: any) => (
                  <span key={s.id} className="px-3 py-1 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                    {s.name} ({s.code})
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400">No subjects linked.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === 'schedule' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
          <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
            Weekly Teaching Schedule
          </h3>
          {timetable.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => {
                const daySlots = timetable.filter((t: any) => (t.day_of_week || t.day)?.toLowerCase() === day.toLowerCase());
                return (
                  <div key={day} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9]">
                    <div className="font-bold text-[#23201B] pb-2 border-b border-[#EBE5D9] mb-2">{day}</div>
                    {daySlots.length > 0 ? (
                      <div className="space-y-2 text-[11px]">
                        {daySlots.map((slot: any, idx: number) => (
                          <div key={idx} className="p-2 rounded bg-white border border-[#EBE5D9]">
                            <span className="text-[9px] text-[#8C847B] block">{slot.start_time} - {slot.end_time}</span>
                            <strong>{slot.class_name || slot.class?.name}</strong> ({slot.subject_name || slot.subject?.name})
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">No periods scheduled</span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-8 text-center text-slate-500 text-xs">
              No timetable entries found for this faculty member.
            </div>
          )}
        </div>
      )}

      {activeTab === 'salary' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
          <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
            Compensation & Payroll Record
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Base Monthly Salary</span>
              <div className="text-xl font-bold font-sora text-slate-900 mt-1">
                PKR {Number(teacher.salary || 0).toLocaleString()}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Disbursement Status</span>
              <div className="text-xl font-bold font-sora text-emerald-600 mt-1">
                {teacher.salary_status || "Active"}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500">Account Status</span>
              <div className="text-xl font-bold font-sora text-slate-900 mt-1">
                {teacher.account_status || "Verified"}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'performance' && (
        <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
          <h3 className="font-serif font-bold text-lg text-[#23201B] mb-4 pb-2 border-b border-[#EBE5D9]">
            Workload & Grading Metrics
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] text-center">
              <span className="text-xs text-slate-500">Total Assignments</span>
              <div className="text-2xl font-bold text-[#23201B] mt-1">{workload?.assignments || 0}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] text-center">
              <span className="text-xs text-slate-500">Pending Grading</span>
              <div className="text-2xl font-bold text-amber-600 mt-1">{workload?.pending_grading || 0}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] text-center">
              <span className="text-xs text-slate-500">Diary Entries</span>
              <div className="text-2xl font-bold text-[#23201B] mt-1">{workload?.diary_entries || 0}</div>
            </div>
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] text-center">
              <span className="text-xs text-slate-500">Periods / Week</span>
              <div className="text-2xl font-bold text-[#23201B] mt-1">{workload?.periods_per_week || 0}</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
