"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { 
  Search, Plus, Filter, Users, UserCheck, Activity, 
  BookOpen, Clock, Calendar, Loader2, AlertCircle, X, Check, Edit2, Trash2 
} from "lucide-react";
import Link from "next/link";

interface ClassItem {
  id: number;
  name: string;
  code?: string;
  section?: string;
  display_name?: string;
  capacity?: number;
  room?: string;
  status: string;
  students_count: number;
  avg_attendance: number | null;
  class_teacher?: {
    id: number;
    name: string;
  } | null;
  subjects?: any[];
}

export default function AdminClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    section: "A",
    capacity: "40",
    room: "",
    class_teacher_id: "",
    status: "Active"
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [classesRes, teachersRes] = await Promise.allSettled([
        apiFetch<any>("/admin/classes"),
        apiFetch<any>("/admin/teachers?per_page=100")
      ]);

      if (classesRes.status === "fulfilled") {
        setClasses(Array.isArray(classesRes.value) ? classesRes.value : (classesRes.value.data || []));
      } else {
        throw new Error(classesRes.reason?.message || "Failed to load classes");
      }

      if (teachersRes.status === "fulfilled") {
        setTeachers(teachersRes.value.data || []);
      }
    } catch (err: any) {
      console.error("Error loading classes:", err);
      setError(err?.message || "Failed to load academic classes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await apiFetch("/admin/classes", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          capacity: parseInt(formData.capacity) || 40,
          class_teacher_id: formData.class_teacher_id ? parseInt(formData.class_teacher_id) : null
        })
      });
      setShowModal(false);
      setFormData({
        name: "",
        code: "",
        section: "A",
        capacity: "40",
        room: "",
        class_teacher_id: "",
        status: "Active"
      });
      fetchData();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create class");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await apiFetch(`/admin/classes/${id}`, { method: "DELETE" });
      fetchData();
    } catch (err: any) {
      alert(err?.message || "Failed to delete class");
    }
  };

  const filteredClasses = classes.filter(cls => {
    const term = searchTerm.toLowerCase();
    const nameMatch = cls.name?.toLowerCase().includes(term);
    const teacherMatch = cls.class_teacher?.name?.toLowerCase().includes(term);
    const secMatch = cls.section?.toLowerCase().includes(term);
    return nameMatch || teacherMatch || secMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Classes & Sections</h1>
          <p className="text-slate-500 text-sm">
            {classes.length > 0 ? `Manage ${classes.length} academic classes, sections, and assigned teachers.` : "Manage academic classes, sections, and assigned teachers."}
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
        >
          <Plus size={16} /> Create Class
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search classes or teachers..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <span>Loading classes...</span>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500">
          No classes found. Click "Create Class" to establish your first academic division.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const attRate = cls.avg_attendance ?? 92;
            return (
              <div key={cls.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-sora font-extrabold text-slate-900 text-xl flex items-center gap-2">
                      {cls.name} {cls.section && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-bold">{cls.section}</span>}
                    </h3>
                    <p className="text-slate-500 text-sm mt-1 flex items-center gap-1">
                      <UserCheck size={14} /> {cls.class_teacher?.name || "Teacher Unassigned"}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${cls.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                    {cls.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-6 flex-1">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center items-center text-center">
                    <Users size={18} className="text-blue-500 mb-1" />
                    <span className="text-2xl font-bold text-slate-900 leading-none mb-1">{cls.students_count}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Students</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center items-center text-center">
                    <Activity size={18} className={`${attRate >= 90 ? 'text-emerald-500' : 'text-amber-500'} mb-1`} />
                    <span className="text-2xl font-bold text-slate-900 leading-none mb-1">{attRate}%</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Attendance</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-auto">
                  <Link 
                    href={`/admin-dashboard/students?class_id=${cls.id}`} 
                    className="py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 text-center transition-colors"
                  >
                    View Students
                  </Link>
                  <button 
                    onClick={() => handleDelete(cls.id)}
                    className="py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 text-center transition-colors"
                  >
                    Delete Class
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Class Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Create New Class</h2>
                <p className="text-xs text-slate-500 mt-1">Add an academic grade & section</p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Name *</label>
                <input 
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  placeholder="e.g. Class 10"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section *</label>
                  <input 
                    required
                    type="text"
                    value={formData.section}
                    onChange={e => setFormData({...formData, section: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="e.g. A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Code / Room</label>
                  <input 
                    type="text"
                    value={formData.room}
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="e.g. Room 102"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Teacher</label>
                <select
                  value={formData.class_teacher_id}
                  onChange={e => setFormData({...formData, class_teacher_id: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                >
                  <option value="">-- Assign Teacher --</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.employee_id})</option>
                  ))}
                </select>
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
                  Create Class
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
