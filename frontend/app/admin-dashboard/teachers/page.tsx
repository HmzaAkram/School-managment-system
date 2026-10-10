"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { 
  Search, Filter, Plus, Download, Eye, Edit, Trash2, 
  BookOpen, Mail, Phone, Calendar, Loader2, AlertCircle, X, Check
} from "lucide-react";

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface ClassItem {
  id: number;
  name: string;
  section?: string;
}

interface TeacherItem {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  employee_id: string;
  designation: string;
  department: string;
  status: string;
  salary: number;
  salary_status?: string;
  attendance_percentage?: number | null;
  subjects?: Subject[];
  classes?: ClassItem[];
}

export default function AdminTeachers() {
  const [teachers, setTeachers] = useState<TeacherItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<any>(null);

  // Add Teacher Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "Password123!",
    phone: "",
    employee_id: "",
    designation: "Teacher",
    department: "General",
    salary: "50000",
    joining_date: new Date().toISOString().split("T")[0]
  });

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (searchTerm) params.append("search", searchTerm);
      if (departmentFilter) params.append("department", departmentFilter);
      params.append("page", page.toString());
      params.append("per_page", "15");

      const res = await apiFetch<any>(`/admin/teachers?${params.toString()}`);
      setTeachers(res.data || []);
      setMeta(res.meta || null);
    } catch (err: any) {
      console.error("Error fetching teachers:", err);
      setError(err?.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, departmentFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTeachers();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this staff member?")) return;
    try {
      await apiFetch(`/admin/teachers/${id}`, { method: "DELETE" });
      fetchTeachers();
    } catch (err: any) {
      alert(err?.message || "Failed to delete teacher");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);
    try {
      await apiFetch("/admin/teachers", {
        method: "POST",
        body: JSON.stringify({
          ...formData,
          salary: parseFloat(formData.salary) || 0
        })
      });
      setShowAddModal(false);
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        password: "Password123!",
        phone: "",
        employee_id: "",
        designation: "Teacher",
        department: "General",
        salary: "50000",
        joining_date: new Date().toISOString().split("T")[0]
      });
      fetchTeachers();
    } catch (err: any) {
      setFormError(err?.message || "Failed to create teacher");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Teachers & Staff</h1>
          <p className="text-slate-500 text-sm">
            {meta ? `Manage ${meta.total} teaching and non-teaching staff members.` : "Manage teaching and staff members."}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => window.print()}
            className="bg-white text-slate-700 px-4 py-2 rounded-xl font-semibold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
          >
            <Download size={16} /> Export
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center gap-2"
          >
            <Plus size={16} /> Add Staff
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search staff by name, ID or department..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </form>
          <div className="flex gap-2 w-full sm:w-auto">
            <select 
              value={departmentFilter}
              onChange={e => { setDepartmentFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">All Departments</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Science">Science</option>
              <option value="English">English</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
              <span>Loading staff directory...</span>
            </div>
          ) : teachers.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              No staff members found matching your search.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                  <th className="text-left py-4 px-6 font-semibold">Staff Member</th>
                  <th className="text-left py-4 px-6 font-semibold">Role & Dept</th>
                  <th className="text-left py-4 px-6 font-semibold">Contact Details</th>
                  <th className="text-left py-4 px-6 font-semibold">Assigned Classes</th>
                  <th className="text-left py-4 px-6 font-semibold">Attendance</th>
                  <th className="text-left py-4 px-6 font-semibold">Status</th>
                  <th className="text-right py-4 px-6 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map(teacher => {
                  const attRate = teacher.attendance_percentage ?? 95;
                  return (
                    <tr key={teacher.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0">
                            {(teacher.first_name?.[0] || "") + (teacher.last_name?.[0] || "")}
                          </div>
                          <div>
                            <Link href={`/admin-dashboard/teachers/${teacher.id}`} className="font-semibold text-slate-900 group-hover:text-primary transition-colors cursor-pointer">
                              {teacher.name}
                            </Link>
                            <div className="text-xs text-slate-500 mt-0.5">{teacher.employee_id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-900 font-medium">{teacher.designation || "Teacher"}</div>
                        <div className="text-slate-500 text-xs mt-0.5 flex items-center gap-1">
                          <BookOpen size={10} /> {teacher.department || "General"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-slate-600 text-xs flex items-center gap-1 mb-1">
                          <Mail size={12} /> {teacher.email || "N/A"}
                        </div>
                        <div className="text-slate-600 text-xs flex items-center gap-1">
                          <Phone size={12} /> {teacher.phone || "N/A"}
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {teacher.classes && teacher.classes.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {teacher.classes.map(c => (
                              <span key={c.id} className="bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md text-xs font-semibold">
                                {c.name} {c.section ? `(${c.section})` : ""}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">Not Assigned</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden flex-shrink-0">
                            <div 
                              className={`h-full rounded-full ${attRate >= 90 ? 'bg-emerald-500' : attRate >= 75 ? 'bg-amber-500' : 'bg-red-500'}`} 
                              style={{ width: `${Math.min(attRate, 100)}%` }} 
                            />
                          </div>
                          <span className="text-sm font-semibold text-slate-700">{attRate}%</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${teacher.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                          {teacher.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link 
                            href={`/admin-dashboard/teachers/${teacher.id}`}
                            className="p-1.5 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
                            title="View Profile"
                          >
                            <Eye size={16} />
                          </Link>
                          <button 
                            onClick={() => handleDelete(teacher.id)}
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
        
        {/* Pagination */}
        {meta && (
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
            <div>
              Showing {meta.from || 0} to {meta.to || 0} of {meta.total} entries
            </div>
            <div className="flex gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-1 border border-primary bg-primary text-white rounded">
                {page}
              </span>
              <button 
                onClick={() => setPage(p => p + 1)}
                disabled={!meta.to || meta.to >= meta.total}
                className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold font-sora text-slate-900">Add Faculty Member</h2>
                <p className="text-xs text-slate-500 mt-1">Register new faculty in your school directory</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-50"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
                  <input 
                    required
                    type="text"
                    value={formData.first_name}
                    onChange={e => setFormData({...formData, first_name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="e.g. Tariq"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
                  <input 
                    required
                    type="text"
                    value={formData.last_name}
                    onChange={e => setFormData({...formData, last_name: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="e.g. Mehmood"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email *</label>
                  <input 
                    required
                    type="email"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="tariq@school.com"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Password *</label>
                  <input 
                    required
                    type="password"
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Employee ID *</label>
                  <input 
                    required
                    type="text"
                    value={formData.employee_id}
                    onChange={e => setFormData({...formData, employee_id: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="e.g. EMP-2024-001"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
                  <input 
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                    placeholder="+92 300 1234567"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                  <input 
                    type="text"
                    value={formData.designation}
                    onChange={e => setFormData({...formData, designation: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Department</label>
                  <input 
                    type="text"
                    value={formData.department}
                    onChange={e => setFormData({...formData, department: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Monthly Salary (PKR)</label>
                  <input 
                    type="number"
                    value={formData.salary}
                    onChange={e => setFormData({...formData, salary: e.target.value})}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddModal(false)}
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
                  Register Faculty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
