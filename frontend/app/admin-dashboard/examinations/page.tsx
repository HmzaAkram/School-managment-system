"use client";

import { useEffect, useState } from "react";
import {
  ClipboardList,
  Calendar,
  Clock,
  MapPin,
  Users,
  Award,
  Plus,
  Search,
  Filter,
  CheckCircle,
  FileText,
  AlertCircle,
  Loader2,
  X
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface ExamScheduleItem {
  id: number;
  exam_id: number;
  exam: string;
  term: string;
  class: string;
  section?: string;
  subject: string;
  subject_code?: string;
  date: string;
  start_time: string;
  end_time: string;
  room?: string;
  candidates: number;
  graded_count: number;
  status?: string;
}

export default function AdminExaminations() {
  const [exams, setExams] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<ExamScheduleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterStatus, setFilterStatus] = useState("All");
  const [search, setSearch] = useState("");

  // Modal for new Exam Term
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    term: "Term 1",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
    description: "",
    status: "Upcoming"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [examsRes, schedulesRes] = await Promise.allSettled([
        apiFetch<any>("/admin/exams"),
        apiFetch<any>("/admin/exam-schedules")
      ]);

      if (examsRes.status === "fulfilled") {
        setExams(Array.isArray(examsRes.value) ? examsRes.value : (examsRes.value.data || []));
      }
      if (schedulesRes.status === "fulfilled") {
        setSchedules(Array.isArray(schedulesRes.value) ? schedulesRes.value : (schedulesRes.value.data || []));
      }
    } catch (err: any) {
      console.error("Error loading exams:", err);
      setError(err?.message || "Failed to load examinations data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await apiFetch("/admin/exams", {
        method: "POST",
        body: JSON.stringify(formData)
      });
      setShowModal(false);
      fetchData();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create exam session");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredExams = schedules.filter(e => {
    const term = search.toLowerCase();
    const matchesSearch = 
      (e.subject || "").toLowerCase().includes(term) || 
      (e.subject_code || "").toLowerCase().includes(term) || 
      (e.class || "").toLowerCase().includes(term) ||
      (e.exam || "").toLowerCase().includes(term);

    const isDone = (e.graded_count || 0) >= (e.candidates || 1);
    const itemStatus = isDone ? "Completed" : (e.graded_count > 0 ? "Grading" : "Scheduled");
    const matchesStatus = filterStatus === "All" || itemStatus === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const activeTerm = exams.find(ex => ex.status === 'Ongoing' || ex.status === 'Upcoming') || exams[0];
  const totalPapers = schedules.length;
  const totalCandidates = schedules.reduce((acc, curr) => acc + (curr.candidates || 0), 0);
  const gradedPapers = schedules.filter(s => (s.graded_count || 0) > 0).length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Administration</span>
            <span>/</span>
            <span className="text-[#C4993C]">Examinations & Grading</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">
            {activeTerm ? activeTerm.name : "Academic Examination Portal"}
          </h1>
          <p className="text-sm text-[#706B62] mt-1">
            Coordinate exam hall seatings, invigilation duty rosters, date sheets, and result publishing.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm"
          >
            <FileText size={14} /> Print Date Sheets
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md"
          >
            <Plus size={14} /> Schedule New Exam Term
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Active Exam Term", value: activeTerm ? activeTerm.name : "None Scheduled", sub: activeTerm ? `Term: ${activeTerm.term}` : "Create an exam session", icon: ClipboardList, color: "text-[#C4993C]" },
          { label: "Papers Scheduled", value: totalPapers.toString(), sub: "Across all active classes", icon: Calendar, color: "text-blue-600" },
          { label: "Total Candidates", value: totalCandidates.toString(), sub: "Candidate seats enrolled", icon: Users, color: "text-emerald-600" },
          { label: "Results Published", value: `${gradedPapers} / ${totalPapers}`, sub: "Graded by faculty", icon: Award, color: "text-purple-600" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-[#EBE8E2] shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-[#FAF8F5] ${stat.color} border border-[#EBE8E2]`}>
                <stat.icon size={18} />
              </div>
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#8C877D] mt-1 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Table & Filter Card */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-80">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C877D]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subject, code, or grade..."
              className="w-full pl-10 pr-4 py-2 text-xs border border-[#EBE8E2] rounded-xl bg-[#FAF8F5] outline-none focus:border-[#C4993C] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            {["All", "Scheduled", "Grading", "Completed"].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterStatus === st
                    ? "bg-[#23201B] text-white"
                    : "bg-[#FAF8F5] text-[#706B62] hover:bg-[#EBE8E2]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto min-h-[250px]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <span>Loading examination records...</span>
            </div>
          ) : filteredExams.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-sm">
              No examination schedules found matching your criteria.
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
                <tr>
                  <th className="py-4 px-6">Subject & Code</th>
                  <th className="py-4 px-6">Exam & Class</th>
                  <th className="py-4 px-6">Date & Time</th>
                  <th className="py-4 px-6">Room / Hall</th>
                  <th className="py-4 px-6">Candidates</th>
                  <th className="py-4 px-6">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EBE8E2]">
                {filteredExams.map((ex) => {
                  const isDone = (ex.graded_count || 0) >= (ex.candidates || 1);
                  const status = isDone ? "Completed" : (ex.graded_count > 0 ? "Grading" : "Scheduled");

                  return (
                    <tr key={ex.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-[#23201B] text-sm font-sora">{ex.subject}</div>
                        <div className="text-[11px] font-mono text-[#8C877D] mt-0.5">{ex.subject_code || `SUB-${ex.id}`}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#4A453E]">{ex.class} {ex.section ? `(${ex.section})` : ""}</div>
                        <div className="text-[10px] text-[#8C877D] mt-0.5">{ex.exam}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#23201B] flex items-center gap-1">
                          <Calendar size={12} className="text-[#C4993C]" /> {ex.date}
                        </div>
                        <div className="text-[11px] text-[#8C877D] flex items-center gap-1 mt-0.5">
                          <Clock size={11} /> {ex.start_time} - {ex.end_time}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="font-semibold text-[#23201B] flex items-center gap-1">
                          <MapPin size={12} className="text-[#C4993C]" /> {ex.room || "Main Exam Hall"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#23201B] bg-[#FAF8F5] px-2.5 py-1 rounded-md border border-[#EBE8E2]">
                          {ex.candidates || 0} Students
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          status === "Scheduled"
                            ? "bg-blue-50 text-blue-700 border border-blue-200"
                            : status === "Grading"
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Schedule New Exam Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Schedule Exam Term</h2>
                <p className="text-xs text-slate-500 mt-1">Open an official examination session</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExam} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Exam Name *</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Mid-Term Examination 2026"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Term / Session *</label>
                <input 
                  required
                  type="text"
                  value={formData.term}
                  onChange={e => setFormData({...formData, term: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Term 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Date *</label>
                  <input 
                    required
                    type="date"
                    value={formData.start_date}
                    onChange={e => setFormData({...formData, start_date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Date *</label>
                  <input 
                    required
                    type="date"
                    value={formData.end_date}
                    onChange={e => setFormData({...formData, end_date: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-sm font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-sm font-semibold shadow hover:opacity-90 flex items-center gap-2"
                >
                  {submitting && <Loader2 size={16} className="animate-spin" />}
                  Schedule Term
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
