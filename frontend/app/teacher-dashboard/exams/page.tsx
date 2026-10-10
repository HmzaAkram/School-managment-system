"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Download,
  Plus,
  CheckCircle2,
  FileText,
  Award,
  ChevronRight,
  Edit3,
  Save,
  X,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react";
import { apiFetch } from "@/lib/api";

export default function TeacherExams() {
  const [examGroups, setExamGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("All");

  // Mark Sheet Modal
  const [isGridModalOpen, setIsGridModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [markSheetData, setMarkSheetData] = useState<any>(null);
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [submittingMarks, setSubmittingMarks] = useState(false);
  const [enteredScores, setEnteredScores] = useState<Record<number, string>>({});
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);

  const fetchExams = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<any>("/teacher/exams");
      setExamGroups(Array.isArray(res) ? res : (res.data || []));
    } catch (err: any) {
      console.error("Error loading exams:", err);
      setError(err?.message || "Failed to load examination schedules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const openMarkSheet = async (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsGridModalOpen(true);
    setLoadingSheet(true);
    try {
      const res = await apiFetch<any>(
        `/teacher/marks/mark-sheet?exam_id=${schedule.exam_id}&class_id=${schedule.class_id || 1}&subject_id=${schedule.subject_id || 1}`
      );
      setMarkSheetData(res);
      const initialMap: Record<number, string> = {};
      (res.marks || []).forEach((m: any) => {
        if (m.marks_obtained !== null && m.marks_obtained !== undefined) {
          initialMap[m.student_id] = String(m.marks_obtained);
        }
      });
      setEnteredScores(initialMap);
    } catch (err: any) {
      console.error("Failed to load mark sheet:", err);
    } finally {
      setLoadingSheet(false);
    }
  };

  const handleSaveGrades = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule || !markSheetData) return;

    try {
      setSubmittingMarks(true);
      const marksPayload = Object.entries(enteredScores).map(([studentId, score]) => ({
        student_id: parseInt(studentId),
        marks_obtained: parseFloat(score) || 0,
        total_marks: markSheetData.subject?.total_marks || 100
      }));

      await apiFetch("/teacher/marks", {
        method: "POST",
        body: JSON.stringify({
          exam_id: selectedSchedule.exam_id,
          class_id: selectedSchedule.class_id || 1,
          subject_id: selectedSchedule.subject_id || 1,
          marks: marksPayload
        })
      });

      setIsGridModalOpen(false);
      setSaveSuccessToast(true);
      setTimeout(() => setSaveSuccessToast(false), 4000);
      fetchExams();
    } catch (err: any) {
      alert(err?.message || "Failed to save marks");
    } finally {
      setSubmittingMarks(false);
    }
  };

  const allSchedules = examGroups.flatMap(g => g.schedules || []);
  const filteredSchedules = allSchedules.filter(s => {
    if (filter === "All") return true;
    return (s.exam_status || "").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Teacher Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Examinations</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Exam Roster & Grading Portal</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Track exam schedules for your subject specializations, invigilation duties, and record student marks.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm"
        >
          <Download size={14} /> Print Schedule Dossier
        </button>
      </div>

      {saveSuccessToast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 size={16} />
          <span>Marks recorded and submitted successfully to academic database!</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#EBE8E2] pb-3">
        {["All", "Upcoming", "Ongoing", "Completed"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === st
                ? "bg-[#23201B] text-white shadow-sm"
                : "text-[#706B62] hover:bg-[#FAF8F5] hover:text-[#23201B]"
            }`}
          >
            {st}
          </button>
        ))}
      </div>

      {/* Schedules List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <span>Loading exam schedule rosters...</span>
          </div>
        ) : filteredSchedules.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-[#EBE8E2] text-slate-500 text-sm">
            No examination schedules found for your subjects.
          </div>
        ) : (
          filteredSchedules.map((ex) => (
            <div
              key={ex.id}
              className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-all"
            >
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <h3 className="font-bold text-lg text-[#23201B] font-sora">{ex.exam}</h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 uppercase">
                    {ex.term || "Term Paper"}
                  </span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    ex.exam_status === "Completed" ? "bg-emerald-50 text-emerald-700" : "bg-blue-50 text-blue-700"
                  }`}>
                    {ex.exam_status || "Scheduled"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs text-[#706B62]">
                  <span className="font-semibold text-[#C4993C]">
                    {ex.subject} ({ex.subject_code || "Paper"})
                  </span>
                  <span>Class: {ex.class} {ex.section ? `(${ex.section})` : ""}</span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} /> {ex.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {ex.start_time} - {ex.end_time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} /> {ex.room || "Exam Hall"}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => openMarkSheet(ex)}
                  className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Edit3 size={13} className="text-[#D4A843]" />
                  <span>Enter / View Marks</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Mark Sheet Modal */}
      {isGridModalOpen && selectedSchedule && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-2xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <div>
                <h3 className="font-bold text-[#23201B] text-lg font-sora">
                  Record Marks: {selectedSchedule.exam}
                </h3>
                <p className="text-xs text-[#706B62]">
                  {selectedSchedule.subject} • Class: {selectedSchedule.class}
                </p>
              </div>
              <button onClick={() => setIsGridModalOpen(false)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveGrades} className="overflow-y-auto flex-1 space-y-4">
              {loadingSheet ? (
                <div className="py-16 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <span>Loading candidate list...</span>
                </div>
              ) : !markSheetData || markSheetData.marks?.length === 0 ? (
                <div className="py-16 text-center text-slate-500 text-xs">
                  No students registered in this class.
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EBE8E2] text-[#706B62]">
                      <th className="text-left py-2 px-3">Student Name</th>
                      <th className="text-left py-2 px-3">Roll No</th>
                      <th className="text-right py-2 px-3">
                        Marks Obtained (Max: {markSheetData.subject?.total_marks || 100})
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#EBE8E2]">
                    {markSheetData.marks.map((m: any) => (
                      <tr key={m.student_id}>
                        <td className="py-2.5 px-3 font-semibold text-[#23201B]">{m.student_name}</td>
                        <td className="py-2.5 px-3 text-[#706B62] font-mono">{m.roll_number || m.student_id}</td>
                        <td className="py-2.5 px-3 text-right">
                          <input
                            type="number"
                            min="0"
                            max={markSheetData.subject?.total_marks || 100}
                            value={enteredScores[m.student_id] ?? ""}
                            onChange={(e) => setEnteredScores({ ...enteredScores, [m.student_id]: e.target.value })}
                            placeholder="0"
                            className="w-24 px-2.5 py-1.5 border border-[#D9D4CC] rounded-lg text-right font-bold text-xs"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EBE8E2]">
                <button
                  type="button"
                  onClick={() => setIsGridModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingMarks}
                  className="px-6 py-2 rounded-xl bg-[#23201B] text-white text-xs font-bold hover:bg-[#3D382F] transition-all flex items-center gap-2"
                >
                  {submittingMarks && <Loader2 size={14} className="animate-spin" />}
                  Save All Marks
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
