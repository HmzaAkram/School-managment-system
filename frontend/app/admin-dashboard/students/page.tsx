"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Plus, Download, Upload, Eye, Edit, Trash2, Loader2, X } from "lucide-react";
import Link from "next/link";
import { api } from "@/lib/api";

export default function AdminStudents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Student Form
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "password123",
    admission_number: "",
    roll_number: "",
    class_id: "",
    gender: "Male",
    phone: "",
    father_name: "",
  });

  const loadStudents = async () => {
    setLoading(true);
    try {
      const [studentsRes, classesRes] = await Promise.all([
        api.get(`/admin/students?per_page=100${selectedClassId ? `&class_id=${selectedClassId}` : ''}`),
        api.get("/admin/classes"),
      ]);
      setStudents(studentsRes?.data || []);
      setTotalStudents(studentsRes?.total || (studentsRes?.data || []).length);
      setClasses(classesRes?.data || classesRes || []);
      if (!formData.class_id && (classesRes?.data || classesRes || []).length > 0) {
        setFormData(prev => ({ ...prev, class_id: String((classesRes?.data || classesRes)[0].id) }));
      }
    } catch (err: any) {
      console.error("Failed to load students:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [selectedClassId]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.first_name || !formData.email || !formData.admission_number || !formData.class_id) return;

    setSubmitting(true);
    try {
      await api.post("/admin/students", formData);
      setIsModalOpen(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "password123",
        admission_number: "",
        roll_number: "",
        class_id: classes[0]?.id ? String(classes[0].id) : "",
        gender: "Male",
        phone: "",
        father_name: "",
      });
      await loadStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to add student.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student record?")) return;
    try {
      await api.del(`/admin/students/${id}`);
      await loadStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to delete student.");
    }
  };

  const filteredStudents = students.filter(student => {
    const nameMatch = (student.name || `${student.first_name || ''} ${student.last_name || ''}`).toLowerCase().includes(searchTerm.toLowerCase());
    const rollMatch = (student.roll_number || student.rollNo || "").toLowerCase().includes(searchTerm.toLowerCase());
    const admMatch = (student.admission_number || String(student.id)).toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || rollMatch || admMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Students Directory</h1>
          <p className="text-slate-500 text-sm">Manage {totalStudents} enrolled students fetched from MySQL database.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="bg-white text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Plus size={16} /> Add Student
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search students by name, ID or roll number..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={selectedClassId} 
              onChange={e => setSelectedClassId(e.target.value)}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Classes</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>{cls.name} {cls.section ? `(${cls.section})` : ''}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-20 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-primary" />
              <p className="text-xs">Loading students from MySQL database...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                  <th className="text-left py-4 px-6 font-semibold">Student</th>
                  <th className="text-left py-4 px-6 font-semibold">Roll Number</th>
                  <th className="text-left py-4 px-6 font-semibold">Class</th>
                  <th className="text-left py-4 px-6 font-semibold">Parent & Contact</th>
                  <th className="text-left py-4 px-6 font-semibold">Attendance</th>
                  <th className="text-left py-4 px-6 font-semibold">Fee Status</th>
                  <th className="text-left py-4 px-6 font-semibold">Status</th>
                  <th className="text-right py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-slate-400">
                      No students found in database.
                    </td>
                  </tr>
                ) : filteredStudents.map((student) => {
                  const name = student.name || `${student.first_name || ''} ${student.last_name || ''}`.trim() || "Student";
                  const attRate = student.attendance?.rate !== null && student.attendance?.rate !== undefined 
                    ? Number(student.attendance.rate) 
                    : 95;
                  const feeStatus = student.fees?.status || (Number(student.fees?.due || 0) <= 0 ? 'Paid' : 'Pending');
                  const guardian = (student.parents && student.parents[0]) ? student.parents[0].name : "Guardian";
                  const phone = (student.parents && student.parents[0]?.phone) || student.phone || "—";

                  return (
                    <tr key={student.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 text-xs">
                            {name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <Link href={`/admin-dashboard/students/${student.id}`} className="font-semibold text-slate-900 hover:text-primary transition-colors cursor-pointer">
                              {name}
                            </Link>
                            <div className="text-xs text-slate-500 mt-0.5">{student.admission_number || `STD-${student.id}`}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-600 font-medium">
                        {student.roll_number || student.rollNo || "—"}
                      </td>
                      <td className="py-4 px-6">
                        <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                          {student.class || "Class"} {student.section ? `(${student.section})` : ""}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-900 font-medium text-xs">{guardian}</div>
                        <div className="text-slate-500 text-xs mt-0.5">{phone}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                            <div className={`h-full rounded-full ${attRate >= 90 ? 'bg-emerald-500' : attRate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, attRate)}%` }} />
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{attRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${feeStatus === 'Paid' ? 'bg-emerald-50 text-emerald-700' : feeStatus === 'Pending' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'}`}>
                          {feeStatus}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {student.status || 'Active'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin-dashboard/students/${student.id}`} className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" title="View Profile">
                            <Eye size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(student.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {/* Pagination summary */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing {filteredStudents.length} of {totalStudents} students from MySQL</div>
        </div>
      </div>

      {/* Add Student Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="font-sora font-bold text-xl text-slate-900">Add New Student</h3>
                <p className="text-xs text-slate-500">Creates student record and user credentials in MySQL.</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    value={formData.last_name}
                    onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Student Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Password *</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={formData.password}
                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Admission No *</label>
                  <input
                    type="text"
                    required
                    placeholder="STD-2026-..."
                    value={formData.admission_number}
                    onChange={e => setFormData({ ...formData, admission_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    placeholder="10-A-01"
                    value={formData.roll_number}
                    onChange={e => setFormData({ ...formData, roll_number: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class *</label>
                  <select
                    value={formData.class_id}
                    onChange={e => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name} {c.section ? `(${c.section})` : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={e => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Guardian Name</label>
                  <input
                    type="text"
                    value={formData.father_name}
                    onChange={e => setFormData({ ...formData, father_name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:bg-primary/90 flex items-center gap-2 disabled:opacity-60"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
