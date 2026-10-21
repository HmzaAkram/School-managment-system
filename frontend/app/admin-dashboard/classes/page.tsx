"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { 
  Search, Plus, Filter, Users, UserCheck, Activity, 
  BookOpen, Clock, Calendar, Loader2, AlertCircle, X, Check, Edit2, Trash2,
  ArrowRight, GraduationCap, DollarSign, Sparkles, CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { ModalPortal } from "@/components/ui/modal-portal";

interface ClassItem {
  id: number;
  name: string;
  code?: string;
  section?: string;
  display_name?: string;
  capacity?: number;
  room?: string;
  status: string;
  monthly_fee?: number;
  students_count: number;
  avg_attendance: number | null;
  class_teacher?: {
    id: number;
    name: string;
  } | null;
  subjects?: any[];
}

interface StudentInClass {
  id: number;
  name: string;
  roll_number?: string;
  admission_number?: string;
  attendance?: { rate?: number | null };
  fees?: { due?: number; status?: string };
  action?: "promote" | "passout" | "retain";
}

export default function AdminClasses() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Create / Edit Class Modal
  const [showModal, setShowModal] = useState(false);
  const [editingClassId, setEditingClassId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    section: "A",
    capacity: "40",
    room: "",
    class_teacher_id: "",
    monthly_fee: "5000",
    status: "Active"
  });

  // Student Promotion & Rollover Modal
  const [showPromoteModal, setShowPromoteModal] = useState(false);
  const [sourceClassId, setSourceClassId] = useState<string>("");
  const [targetClassId, setTargetClassId] = useState<string>("");
  const [rolloverAction, setRolloverAction] = useState<"promote" | "passout">("promote");
  const [classStudents, setClassStudents] = useState<StudentInClass[]>([]);
  const [selectedStudentIds, setSelectedStudentIds] = useState<number[]>([]);
  const [studentActionMap, setStudentActionMap] = useState<Record<number, "promote" | "passout" | "retain">>({});
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [promoteSubmitting, setPromoteSubmitting] = useState(false);
  const [promoteError, setPromoteError] = useState<string | null>(null);

  useBodyScrollLock(showModal || showPromoteModal);

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

  const openCreateModal = () => {
    setEditingClassId(null);
    setFormData({
      name: "",
      code: "",
      section: "A",
      capacity: "40",
      room: "",
      class_teacher_id: "",
      monthly_fee: "5000",
      status: "Active"
    });
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (cls: ClassItem) => {
    setEditingClassId(cls.id);
    setFormData({
      name: cls.name || "",
      code: cls.code || "",
      section: cls.section || "A",
      capacity: String(cls.capacity || 40),
      room: cls.room || "",
      class_teacher_id: cls.class_teacher?.id ? String(cls.class_teacher.id) : "",
      monthly_fee: cls.monthly_fee !== undefined ? String(cls.monthly_fee) : "5000",
      status: cls.status || "Active"
    });
    setFormError(null);
    setShowModal(true);
  };

  const handleSaveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      const payload = {
        ...formData,
        capacity: parseInt(formData.capacity) || 40,
        monthly_fee: parseFloat(formData.monthly_fee) || 0,
        class_teacher_id: formData.class_teacher_id ? parseInt(formData.class_teacher_id) : null
      };

      if (editingClassId) {
        await apiFetch(`/admin/classes/${editingClassId}`, {
          method: "PUT",
          body: JSON.stringify(payload)
        });
        setSuccessMsg(`Class "${formData.name}" and fee structure updated successfully.`);
      } else {
        await apiFetch("/admin/classes", {
          method: "POST",
          body: JSON.stringify(payload)
        });
        setSuccessMsg(`Class "${formData.name}" and monthly fee created successfully.`);
      }

      setShowModal(false);
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchData();
    } catch (err: any) {
      setFormError(err?.message || "Failed to save class");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await apiFetch(`/admin/classes/${id}`, { method: "DELETE" });
      setSuccessMsg("Class deleted successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchData();
    } catch (err: any) {
      alert(err?.message || "Failed to delete class");
    }
  };

  // Open Promotion modal with pre-selected class
  const openPromoteModalForClass = (clsId?: number) => {
    const defaultSource = clsId ? String(clsId) : (classes[0]?.id ? String(classes[0].id) : "");
    setSourceClassId(defaultSource);
    setRolloverAction("promote");
    setPromoteError(null);
    setShowPromoteModal(true);
    if (defaultSource) {
      loadStudentsForPromotion(defaultSource);
    }
  };

  const loadStudentsForPromotion = async (clsId: string) => {
    if (!clsId) {
      setClassStudents([]);
      setSelectedStudentIds([]);
      return;
    }
    setLoadingStudents(true);
    setPromoteError(null);
    try {
      const res = await apiFetch<any>(`/admin/students?class_id=${clsId}&per_page=150&status=Active`);
      const list: StudentInClass[] = res?.data || [];
      setClassStudents(list);
      setSelectedStudentIds(list.map(s => s.id));
      const initialMap: Record<number, "promote" | "passout" | "retain"> = {};
      list.forEach(s => {
        initialMap[s.id] = rolloverAction === "passout" ? "passout" : "promote";
      });
      setStudentActionMap(initialMap);
    } catch (err: any) {
      console.error("Error loading students for promotion:", err);
      setPromoteError(err?.message || "Failed to load students in class");
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleSourceClassChange = (newId: string) => {
    setSourceClassId(newId);
    loadStudentsForPromotion(newId);
  };

  const toggleSelectAll = () => {
    if (selectedStudentIds.length === classStudents.length) {
      setSelectedStudentIds([]);
    } else {
      setSelectedStudentIds(classStudents.map(s => s.id));
    }
  };

  const toggleStudent = (id: number) => {
    setSelectedStudentIds(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const handleExecutePromotion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceClassId) {
      setPromoteError("Please select the source class.");
      return;
    }
    if (selectedStudentIds.length === 0) {
      setPromoteError("Please select at least one student to promote or graduate.");
      return;
    }
    if (rolloverAction === "promote" && !targetClassId) {
      setPromoteError("Please select the next target class (destination class).");
      return;
    }
    if (rolloverAction === "promote" && targetClassId === sourceClassId) {
      setPromoteError("Target class cannot be the same as current class.");
      return;
    }

    setPromoteSubmitting(true);
    setPromoteError(null);
    try {
      const res = await apiFetch<any>("/admin/students/promote", {
        method: "POST",
        body: JSON.stringify({
          current_class_id: parseInt(sourceClassId),
          target_class_id: rolloverAction === "promote" ? parseInt(targetClassId) : null,
          action: rolloverAction,
          student_ids: selectedStudentIds,
          student_actions: studentActionMap,
        })
      });

      setSuccessMsg(res?.message || "Students promoted successfully!");
      setShowPromoteModal(false);
      setTimeout(() => setSuccessMsg(null), 6000);
      fetchData();
    } catch (err: any) {
      setPromoteError(err?.message || "Failed to execute academic promotion");
    } finally {
      setPromoteSubmitting(false);
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Classes & Academic Progression</h1>
          <p className="text-slate-500 text-sm">
            Configure classes, manage monthly class fees, and execute yearly student promotions or pass-out graduations.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => openPromoteModalForClass()}
            className="bg-white text-slate-800 border border-slate-200 px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs hover:bg-slate-50 transition-all flex items-center gap-2"
          >
            <GraduationCap size={16} className="text-primary" />
            <span>Promote / Rollover Class</span>
          </button>

          <button 
            onClick={openCreateModal}
            className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-semibold text-xs shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Plus size={16} /> Create Class
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <span className="font-medium text-sm">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search & Overview bar */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search classes or teachers..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400 shadow-xs"
          />
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Showing {filteredClasses.length} of {classes.length} classes
        </div>
      </div>

      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
          <span>Loading classes and fee structures...</span>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-100 text-slate-500 shadow-xs">
          No classes found. Click "Create Class" to establish your first academic division.
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClasses.map((cls) => {
            const attRate = cls.avg_attendance ?? 92;
            const fee = Number(cls.monthly_fee) || 5000;

            return (
              <div key={cls.id} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group flex flex-col h-full">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-sora font-extrabold text-slate-900 text-xl flex items-center gap-2">
                      {cls.name} {cls.section && <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-sm font-bold">{cls.section}</span>}
                    </h3>
                    <p className="text-slate-500 text-xs mt-1 flex items-center gap-1.5 font-medium">
                      <UserCheck size={14} className="text-slate-400" /> {cls.class_teacher?.name || "Teacher Unassigned"}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider ${cls.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-slate-100 text-slate-500'}`}>
                    {cls.status}
                  </span>
                </div>

                {/* Monthly fee badge */}
                <div className="mb-4 inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200/80 px-3 py-1.5 rounded-xl text-xs font-bold">
                  <DollarSign size={13} className="text-amber-600" />
                  <span>Tuition Fee: PKR {fee.toLocaleString()} / mo</span>
                </div>
                
                {/* Metrics */}
                <div className="grid grid-cols-2 gap-3 mb-5 flex-1">
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center items-center text-center">
                    <Users size={18} className="text-blue-500 mb-1" />
                    <span className="text-2xl font-bold text-slate-900 leading-none mb-1">{cls.students_count}</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Enrolled</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 flex flex-col justify-center items-center text-center">
                    <Activity size={18} className={`${attRate >= 90 ? 'text-emerald-500' : 'text-amber-500'} mb-1`} />
                    <span className="text-2xl font-bold text-slate-900 leading-none mb-1">{attRate}%</span>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Attendance</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 mt-auto pt-2 border-t border-slate-100">
                  <div className="grid grid-cols-2 gap-2">
                    <Link 
                      href={`/admin-dashboard/students?class_id=${cls.id}`} 
                      className="py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <Users size={13} /> View Students
                    </Link>
                    <button 
                      onClick={() => openPromoteModalForClass(cls.id)}
                      className="py-2.5 rounded-xl text-xs font-bold bg-primary/10 text-primary hover:bg-primary/20 text-center transition-colors flex items-center justify-center gap-1"
                    >
                      <GraduationCap size={13} /> Promote Class
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <button 
                      onClick={() => openEditModal(cls)}
                      className="text-slate-500 hover:text-slate-900 font-semibold flex items-center gap-1 py-1"
                    >
                      <Edit2 size={13} /> Edit Details & Fee
                    </button>
                    <button 
                      onClick={() => handleDelete(cls.id)}
                      className="text-red-500 hover:text-red-700 font-semibold flex items-center gap-1 py-1"
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Create / Edit Class Modal ── */}
      {showModal && (
        <ModalPortal className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sora text-slate-900">
                  {editingClassId ? "Edit Class & Fee" : "Create New Class"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Define class grade, assigned teacher, and monthly tuition fee.
                </p>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4">
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
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  placeholder="e.g. Class 9 or Grade 10"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Section *</label>
                  <input 
                    required
                    type="text"
                    value={formData.section}
                    onChange={e => setFormData({...formData, section: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                    placeholder="e.g. A"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Room / Hall</label>
                  <input 
                    type="text"
                    value={formData.room}
                    onChange={e => setFormData({...formData, room: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                    placeholder="e.g. Room 102"
                  />
                </div>
              </div>

              {/* Monthly Tuition Fee */}
              <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/70">
                <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <DollarSign size={14} className="text-amber-700" />
                  <span>Monthly Tuition Fee (PKR) *</span>
                </label>
                <input 
                  required
                  type="number"
                  min="0"
                  step="50"
                  value={formData.monthly_fee}
                  onChange={e => setFormData({...formData, monthly_fee: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-amber-600"
                  placeholder="5000"
                />
                <p className="text-[11px] text-amber-700 mt-1">
                  Monthly fee invoices for students in this class will automatically generate based on this amount.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Teacher</label>
                <select
                  value={formData.class_teacher_id}
                  onChange={e => setFormData({...formData, class_teacher_id: e.target.value})}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                >
                  <option value="">-- Assign Teacher --</option>
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.id}>{t.name} ({t.employee_id || 'Staff'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Capacity</label>
                  <input 
                    type="number"
                    value={formData.capacity}
                    onChange={e => setFormData({...formData, capacity: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={e => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-50 text-slate-600"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="bg-primary text-white px-5 py-2 rounded-xl text-xs font-bold shadow hover:opacity-90 flex items-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {editingClassId ? "Update Class" : "Create Class"}
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* ── Student Promotion & Rollover Modal ── */}
      {showPromoteModal && (
        <ModalPortal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8 animate-in zoom-in-95">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  <GraduationCap size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold font-sora text-slate-900">Academic Promotion & Rollover</h2>
                  <p className="text-xs text-slate-500">Promote students to next class (e.g. 9th &rarr; 10th) or graduate pass-outs.</p>
                </div>
              </div>
              <button 
                onClick={() => setShowPromoteModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleExecutePromotion} className="p-6 space-y-5">
              {promoteError && (
                <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2 border border-red-200">
                  <AlertCircle size={15} className="flex-shrink-0" />
                  <span>{promoteError}</span>
                </div>
              )}

              {/* Class & Action Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Current Class (Source) *</label>
                  <select
                    value={sourceClassId}
                    onChange={e => handleSourceClassChange(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-primary"
                  >
                    <option value="">-- Choose Class --</option>
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ''}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Action *</label>
                  <select
                    value={rolloverAction}
                    onChange={e => {
                      const val = e.target.value as "promote" | "passout";
                      setRolloverAction(val);
                      // Update default for students
                      const newMap: Record<number, "promote" | "passout" | "retain"> = {};
                      classStudents.forEach(s => { newMap[s.id] = val; });
                      setStudentActionMap(newMap);
                    }}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-primary"
                  >
                    <option value="promote">Promote to Next Class</option>
                    <option value="passout">Graduate / Pass Out Class</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {rolloverAction === "promote" ? "Destination Class *" : "Final Status"}
                  </label>
                  {rolloverAction === "promote" ? (
                    <select
                      value={targetClassId}
                      onChange={e => setTargetClassId(e.target.value)}
                      className="w-full px-3 py-2 bg-emerald-50 border border-emerald-300 rounded-xl text-xs font-bold text-emerald-900 focus:outline-none focus:border-emerald-600"
                    >
                      <option value="">-- Select Next Class --</option>
                      {classes.filter(c => String(c.id) !== sourceClassId).map(c => (
                        <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ''}</option>
                      ))}
                    </select>
                  ) : (
                    <div className="px-3 py-2 bg-slate-100 rounded-xl text-xs font-bold text-slate-600">
                      Graduated (Alumni)
                    </div>
                  )}
                </div>
              </div>

              {/* Student Checklist Table */}
              <div className="border border-slate-200 rounded-2xl overflow-hidden">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <input 
                      type="checkbox"
                      id="selectAllStudents"
                      checked={classStudents.length > 0 && selectedStudentIds.length === classStudents.length}
                      onChange={toggleSelectAll}
                      className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="selectAllStudents" className="text-xs font-bold text-slate-700 cursor-pointer">
                      Select All Students ({selectedStudentIds.length} of {classStudents.length} selected)
                    </label>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    Set individual action per student if repeating
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                  {loadingStudents ? (
                    <div className="py-10 text-center text-slate-400">
                      <Loader2 className="w-6 h-6 animate-spin mx-auto mb-1 text-primary" />
                      <span className="text-xs">Loading students in selected class...</span>
                    </div>
                  ) : classStudents.length === 0 ? (
                    <div className="py-8 text-center text-slate-400 text-xs">
                      {sourceClassId ? "No active students found in this class." : "Select a source class above to see students."}
                    </div>
                  ) : (
                    classStudents.map((s) => {
                      const isChecked = selectedStudentIds.includes(s.id);
                      const currentAct = studentActionMap[s.id] || (rolloverAction === "passout" ? "passout" : "promote");
                      const att = s.attendance?.rate !== null && s.attendance?.rate !== undefined ? `${s.attendance.rate}%` : "95%";

                      return (
                        <div key={s.id} className={`p-3 flex items-center justify-between gap-3 text-xs ${isChecked ? 'bg-white' : 'bg-slate-50/60 opacity-60'}`}>
                          <div className="flex items-center gap-3">
                            <input 
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleStudent(s.id)}
                              className="rounded border-slate-300 text-primary focus:ring-primary h-4 w-4"
                            />
                            <div>
                              <div className="font-bold text-slate-900">{s.name}</div>
                              <div className="text-[11px] text-slate-400">
                                Roll: {s.roll_number || '—'} • Adm: {s.admission_number || s.id} • Att: {att}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <select
                              value={currentAct}
                              onChange={e => {
                                const val = e.target.value as "promote" | "passout" | "retain";
                                setStudentActionMap(prev => ({ ...prev, [s.id]: val }));
                              }}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-200 bg-white"
                            >
                              <option value="promote">Promote</option>
                              <option value="retain">Retain / Repeat</option>
                              <option value="passout">Pass Out / Graduate</option>
                            </select>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Notice */}
              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                <Sparkles size={16} className="text-blue-600 flex-shrink-0" />
                <span>
                  {rolloverAction === "promote" 
                    ? "Promoting students will update their active class in database and prepare their record for next academic year." 
                    : "Graduating students will mark their status as 'Graduated' and archive their attendance roster."}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowPromoteModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={promoteSubmitting || classStudents.length === 0}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white text-xs font-bold shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
                >
                  {promoteSubmitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Execute Academic Progression</span>
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

    </div>
  );
}
