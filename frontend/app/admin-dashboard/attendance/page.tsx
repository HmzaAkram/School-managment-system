"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { 
  Calendar, Filter, Users, UserCheck, Search, CheckCircle2, 
  XCircle, Clock, Loader2, AlertCircle, Save, Check 
} from "lucide-react";

export default function AdminAttendance() {
  const [view, setView] = useState<'students' | 'staff'>('students');
  const [classes, setClasses] = useState<any[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<number | string>("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Load classes initially
  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await apiFetch<any>("/admin/classes");
        const list = Array.isArray(res) ? res : (res.data || []);
        setClasses(list);
        if (list.length > 0 && !selectedClassId) {
          setSelectedClassId(list[0].id);
        }
      } catch (err) {
        console.error("Failed to load classes", err);
      }
    }
    loadClasses();
  }, []);

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setLoading(true);
      setError(null);
      setSuccessMsg(null);

      if (view === 'students') {
        if (!selectedClassId) {
          setRecords([]);
          setLoading(false);
          return;
        }
        const res = await apiFetch<any>(`/admin/attendance/students?class_id=${selectedClassId}&date=${date}`);
        setRecords(res.records || []);
      } else {
        const res = await apiFetch<any>(`/admin/attendance/teachers?date=${date}`);
        setRecords(res.records || []);
      }
    } catch (err: any) {
      console.error("Error fetching attendance:", err);
      setError(err?.message || "Failed to load attendance records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [view, selectedClassId, date]);

  const handleStatusChange = (index: number, newStatus: string) => {
    const updated = [...records];
    updated[index].status = newStatus;
    setRecords(updated);
  };

  const handleMarkAll = (status: string) => {
    const updated = records.map(r => ({ ...r, status }));
    setRecords(updated);
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccessMsg(null);

      if (view === 'students') {
        const payload = {
          class_id: selectedClassId,
          date: date,
          attendances: records.map(r => ({
            student_id: r.student_id,
            status: r.status || 'Present',
            remarks: r.remarks || null
          }))
        };
        await apiFetch('/admin/attendance/students', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      } else {
        const payload = {
          date: date,
          attendances: records.map(r => ({
            teacher_id: r.teacher_id,
            status: r.status || 'Present',
            remarks: r.remarks || null
          }))
        };
        await apiFetch('/admin/attendance/teachers', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      setSuccessMsg("Attendance successfully saved to database!");
      setTimeout(() => setSuccessMsg(null), 3000);
      fetchAttendance();
    } catch (err: any) {
      console.error("Failed to save attendance:", err);
      setError(err?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  // Stats calculation
  const totalCount = records.length;
  const presentCount = records.filter(r => r.status === 'Present').length;
  const absentCount = records.filter(r => r.status === 'Absent').length;
  const lateCount = records.filter(r => r.status === 'Late' || r.status === 'Excused' || r.status === 'Half-Day').length;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Attendance Management</h1>
          <p className="text-slate-500 text-sm">Monitor and record live daily attendance for students and staff.</p>
        </div>
        <div className="flex items-center bg-slate-100 p-1 rounded-xl">
          <button 
            onClick={() => setView('students')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'students' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Students
          </button>
          <button 
            onClick={() => setView('staff')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${view === 'staff' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
          >
            Staff
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 flex items-center gap-3">
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
            <Users size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Total {view === 'students' ? 'Students' : 'Faculty'}</div>
            <div className="text-2xl font-extrabold text-slate-900">{totalCount}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Present</div>
            <div className="text-2xl font-extrabold text-emerald-600">{presentCount}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center flex-shrink-0">
            <XCircle size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Absent</div>
            <div className="text-2xl font-extrabold text-red-600">{absentCount}</div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-sm font-medium text-slate-500">Late / Excused</div>
            <div className="text-2xl font-extrabold text-amber-600">{lateCount}</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 w-full sm:w-auto"
              />
            </div>
            
            {view === 'students' && (
              <select 
                value={selectedClassId}
                onChange={e => setSelectedClassId(e.target.value)}
                className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary w-full sm:w-auto"
              >
                {classes.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} {c.section ? `(${c.section})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button 
              onClick={() => handleMarkAll('Present')}
              className="px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
            >
              Mark All Present
            </button>
            <button 
              onClick={() => handleMarkAll('Absent')}
              className="px-3 py-1.5 text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 rounded-lg transition-colors"
            >
              Mark All Absent
            </button>
            <button 
              onClick={handleSaveAttendance}
              disabled={saving || records.length === 0}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
            >
              {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <span>Loading attendance roster...</span>
            </div>
          ) : records.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              No members found in this roster.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                  <th className="text-left py-4 px-6 font-semibold">Name</th>
                  <th className="text-left py-4 px-6 font-semibold">ID / Roll No</th>
                  <th className="text-left py-4 px-6 font-semibold">Status</th>
                  <th className="text-right py-4 px-6 font-semibold">Quick Mark</th>
                </tr>
              </thead>
              <tbody>
                {records.map((r, idx) => {
                  const personName = view === 'students' 
                    ? (r.student?.name || "Student") 
                    : (r.teacher?.name || "Faculty");
                  const identifier = view === 'students' 
                    ? (r.student?.roll_number || r.student?.admission_number || `ID: ${r.student_id}`) 
                    : (r.teacher?.employee_id || `ID: ${r.teacher_id}`);

                  const currentStatus = r.status || "Unmarked";

                  return (
                    <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-6 font-semibold text-slate-900">
                        {personName}
                      </td>
                      <td className="py-3 px-6 text-slate-500 text-xs font-mono">
                        {identifier}
                      </td>
                      <td className="py-3 px-6">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                          currentStatus === 'Present' ? 'bg-emerald-50 text-emerald-700' :
                          currentStatus === 'Absent' ? 'bg-red-50 text-red-700' :
                          currentStatus === 'Late' ? 'bg-amber-50 text-amber-700' :
                          'bg-slate-100 text-slate-600'
                        }`}>
                          {currentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {['Present', 'Absent', 'Late', 'Excused'].map(st => (
                            <button
                              key={st}
                              onClick={() => handleStatusChange(idx, st)}
                              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-all ${
                                r.status === st
                                  ? st === 'Present' ? 'bg-emerald-600 text-white font-bold'
                                    : st === 'Absent' ? 'bg-red-600 text-white font-bold'
                                    : 'bg-amber-600 text-white font-bold'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
