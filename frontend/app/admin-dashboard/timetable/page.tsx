"use client";

import { useEffect, useState } from "react";
import {
  Calendar,
  Clock,
  BookOpen,
  Users,
  MapPin,
  Download,
  Filter,
  Plus,
  Trash2,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";
import { apiFetch } from "@/lib/api";

const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default function AdminTimetable() {
  const [selectedDay, setSelectedDay] = useState("Monday");
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string | number>("");
  const [teachers, setTeachers] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);

  const [timetableEntries, setTimetableEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject_id: "",
    teacher_id: "",
    period: "1",
    start_time: "08:00",
    end_time: "08:45",
    room: "Room 101",
    type: "Lecture"
  });

  // Load classes, teachers, subjects
  useEffect(() => {
    async function loadMeta() {
      try {
        const [classesRes, teachersRes, subjectsRes] = await Promise.allSettled([
          apiFetch<any>("/admin/classes"),
          apiFetch<any>("/admin/teachers?per_page=100"),
          apiFetch<any>("/admin/subjects")
        ]);

        if (classesRes.status === "fulfilled") {
          const list = Array.isArray(classesRes.value) ? classesRes.value : (classesRes.value.data || []);
          setClasses(list);
          if (list.length > 0 && !selectedClassId) {
            setSelectedClassId(list[0].id);
          }
        }
        if (teachersRes.status === "fulfilled") {
          setTeachers(teachersRes.value.data || []);
        }
        if (subjectsRes.status === "fulfilled") {
          const sList = Array.isArray(subjectsRes.value) ? subjectsRes.value : (subjectsRes.value.data || []);
          setSubjects(sList);
        }
      } catch (err) {
        console.error("Failed to load metadata", err);
      }
    }
    loadMeta();
  }, []);

  // Fetch timetable entries for selected class
  const fetchTimetable = async () => {
    if (!selectedClassId) return;
    try {
      setLoading(true);
      setError(null);
      const res = await apiFetch<any>(`/admin/timetable?class_id=${selectedClassId}`);
      setTimetableEntries(res.entries || res.data || []);
    } catch (err: any) {
      console.error("Error loading timetable:", err);
      setError(err?.message || "Failed to load master timetable");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTimetable();
  }, [selectedClassId]);

  const handleCreateSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await apiFetch("/admin/timetable", {
        method: "POST",
        body: JSON.stringify({
          class_id: selectedClassId,
          day_of_week: selectedDay,
          subject_id: formData.subject_id,
          teacher_id: formData.teacher_id || null,
          period: parseInt(formData.period) || 1,
          start_time: formData.start_time,
          end_time: formData.end_time,
          room: formData.room,
          type: formData.type
        })
      });
      setShowModal(false);
      fetchTimetable();
    } catch (err: any) {
      setFormError(err?.message || "Failed to add timetable period");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSlot = async (id: number) => {
    if (!confirm("Are you sure you want to remove this timetable slot?")) return;
    try {
      await apiFetch(`/admin/timetable/${id}`, { method: "DELETE" });
      fetchTimetable();
    } catch (err: any) {
      alert(err?.message || "Failed to remove slot");
    }
  };

  // Filter slots for the active day
  const currentDaySlots = timetableEntries.filter(
    (slot) => slot.day?.toLowerCase() === selectedDay.toLowerCase()
  );

  const selectedClassObj = classes.find(c => String(c.id) === String(selectedClassId));

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
            Configure weekly bell schedules, classroom room allocations, and faculty assignments from live database records.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button 
            onClick={() => window.print()}
            className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] text-xs font-bold hover:bg-[#FAF8F5] transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={14} /> Export Timetable
          </button>
          <button 
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md"
          >
            <Plus size={14} /> Add Period Slot
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Selector Controls */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Class selector */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <label className="text-xs font-bold text-[#8C877D] uppercase tracking-wider whitespace-nowrap">
            Selected Class:
          </label>
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="px-3 py-2 text-xs font-bold text-[#23201B] bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl outline-none focus:border-[#C4993C]"
          >
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name} {cls.section ? `(${cls.section})` : ""}
              </option>
            ))}
          </select>
          <span className="text-xs text-[#8C877D] hidden sm:inline">
            {timetableEntries.length} Total Weekly Periods Scheduled
          </span>
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
              {selectedDay} Schedule — {selectedClassObj ? `${selectedClassObj.name} ${selectedClassObj.section || ''}` : "Selected Class"}
            </h2>
            <p className="text-xs text-[#8C877D]">
              {currentDaySlots.length} periods active on {selectedDay}
            </p>
          </div>
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
            Live Synchronized
          </span>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
            <span>Loading master schedule...</span>
          </div>
        ) : currentDaySlots.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-sm">
            No periods scheduled for {selectedDay}. Click "Add Period Slot" to allocate periods.
          </div>
        ) : (
          <div className="divide-y divide-[#EBE8E2]">
            {currentDaySlots.map((slot) => {
              const isBreak = slot.type?.toLowerCase() === "break";
              const isAssembly = slot.type?.toLowerCase() === "assembly";
              const isLab = slot.type?.toLowerCase() === "lab";

              return (
                <div
                  key={slot.id}
                  className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors ${
                    isBreak
                      ? "bg-amber-50/40 border-l-4 border-l-amber-400"
                      : isAssembly
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
                        {slot.start_time} - {slot.end_time}
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-[#8C877D] tracking-wider">
                        {slot.type || "Lecture"}
                      </span>
                    </div>
                  </div>

                  {/* Subject & Topic */}
                  <div className="flex-1 min-w-[240px]">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-bold text-[#23201B] text-sm font-sora">
                        {slot.subject || "Homeroom"}
                      </h3>
                      {slot.subject_code && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {slot.subject_code}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#706B62]">
                      Class {slot.class || ""} {slot.section ? `(${slot.section})` : ""}
                    </p>
                  </div>

                  {/* Teacher & Room */}
                  <div className="flex items-center gap-6 min-w-[260px] text-xs">
                    <div className="flex items-center gap-2 text-[#4A453E]">
                      <Users size={14} className="text-[#8C877D]" />
                      <span className="font-medium">{slot.teacher || "Unassigned"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#706B62]">
                      <MapPin size={14} className="text-[#C4993C]" />
                      <span className="font-semibold text-[#23201B] bg-[#FAF8F5] px-2 py-1 rounded-md border border-[#EBE8E2]">
                        {slot.room || "Room Assigned"}
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Delete slot"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Period Slot Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-[#EBE8E2] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-[#EBE8E2] flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sora text-[#23201B]">Add Period Slot</h2>
                <p className="text-xs text-[#706B62] mt-1">
                  Schedule a subject for {selectedDay} ({selectedClassObj?.name})
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Subject *</label>
                  <select 
                    required
                    value={formData.subject_id}
                    onChange={e => setFormData({...formData, subject_id: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="">-- Choose Subject --</option>
                    {subjects.map((s: any) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Teacher</label>
                  <select 
                    value={formData.teacher_id}
                    onChange={e => setFormData({...formData, teacher_id: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="">-- Faculty Member --</option>
                    {teachers.map((t: any) => (
                      <option key={t.id} value={t.id}>{t.name} ({t.department})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period No.</label>
                  <input 
                    type="number"
                    min="1"
                    max="10"
                    value={formData.period}
                    onChange={e => setFormData({...formData, period: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Start Time</label>
                  <input 
                    type="text"
                    value={formData.start_time}
                    onChange={e => setFormData({...formData, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="08:00 AM"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">End Time</label>
                  <input 
                    type="text"
                    value={formData.end_time}
                    onChange={e => setFormData({...formData, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="08:45 AM"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room</label>
                  <input 
                    type="text"
                    value={formData.room}
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="Room 101"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Period Type</label>
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  >
                    <option value="Lecture">Lecture</option>
                    <option value="Lab">Practical Lab</option>
                    <option value="Break">Break / Recess</option>
                    <option value="Assembly">Assembly</option>
                  </select>
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
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
