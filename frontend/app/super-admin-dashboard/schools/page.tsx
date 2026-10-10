"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Search, Plus, Building2, MapPin, Calendar, 
  CheckCircle2, Clock, AlertCircle, X, Calculator, MessageSquare, Loader2,
  Edit3, Trash2, Eye
} from "lucide-react";
import { api } from "@/lib/api";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSchool, setEditingSchool] = useState<any>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    principal_name: "",
    phone: "",
    email: "",
    city: "",
    state: "",
    address: "",
    status: "Active",
    contract_amount: 0,
    paid_amount: 0,
  });

  const fetchSchools = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/super-admin/schools?per_page=100");
      setSchools(res?.data || []);
    } catch (err: any) {
      setError(err?.message || "Failed to load schools from database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  // New Contract Form State
  const [formData, setFormData] = useState({
    name: "",
    admin: "",
    phone: "",
    email: "",
    location: "Lahore, Punjab",
    students: 1000,
    teachers: 60,
    perStudentFee: 20,
    saasSharePercent: 50,
    contractDurationMonths: 12,
    contractStart: new Date().toISOString().split("T")[0],
  });

  // Derived calculations for form
  const saasFeePerStudent = Math.round((formData.perStudentFee * formData.saasSharePercent) / 100);
  const monthlySaaSRevenue = formData.students * saasFeePerStudent;
  const totalContractValue = monthlySaaSRevenue * formData.contractDurationMonths;

  const handleCreateContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.admin) return;

    setSubmitting(true);
    try {
      const randNum = Math.floor(100 + Math.random() * 900);
      const cleanName = formData.name.toLowerCase().replace(/[^a-z0-9]/g, '') || "school";
      const code = (formData.name.replace(/[^A-Za-z0-9]/g, '').slice(0, 6) || "SCH").toUpperCase() + randNum;
      const schoolEmail = formData.email?.trim() || `${cleanName}${randNum}@school.edu`;
      const adminEmail = `admin_${randNum}@${cleanName}.edu`;

      await api.post("/super-admin/schools", {
        name: formData.name,
        code,
        email: schoolEmail,
        phone: formData.phone || "+92 300 0000000",
        principal_name: formData.admin,
        city: formData.location.split(",")[0]?.trim() || "Lahore",
        state: formData.location.split(",")[1]?.trim() || "Punjab",
        plan: "Standard",
        contract_amount: totalContractValue,
        contract_start: formData.contractStart,
        contract_duration_months: formData.contractDurationMonths,
        per_student_fee: formData.perStudentFee,
        school_share_percent: 100 - formData.saasSharePercent,
        saas_share_percent: formData.saasSharePercent,
        billing_cycle: "Monthly",
        admin_name: formData.admin,
        admin_email: adminEmail,
        admin_password: "password123",
      });

      setIsModalOpen(false);
      setFormData({
        name: "",
        admin: "",
        phone: "",
        email: "",
        location: "Lahore, Punjab",
        students: 1000,
        teachers: 60,
        perStudentFee: 20,
        saasSharePercent: 50,
        contractDurationMonths: 12,
        contractStart: new Date().toISOString().split("T")[0],
      });
      await fetchSchools();
    } catch (err: any) {
      alert(err?.message || "Failed to create school contract.");
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (school: any) => {
    setEditingSchool(school);
    setEditFormData({
      name: school.name || "",
      principal_name: school.principal_name || "",
      phone: school.phone || "",
      email: school.email || "",
      city: school.city || "Lahore",
      state: school.state || "Punjab",
      address: school.address || "",
      status: school.status || "Active",
      contract_amount: Number(school.contract_amount || 0),
      paid_amount: Number(school.paid_amount || 0),
    });
    setIsEditModalOpen(true);
  };

  const handleUpdateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSchool) return;

    setSubmitting(true);
    try {
      await api.put(`/super-admin/schools/${editingSchool.id}`, {
        name: editFormData.name,
        principal_name: editFormData.principal_name,
        phone: editFormData.phone,
        email: editFormData.email,
        city: editFormData.city,
        state: editFormData.state,
        address: editFormData.address,
        status: editFormData.status,
        contract_amount: editFormData.contract_amount,
        paid_amount: editFormData.paid_amount,
      });

      setIsEditModalOpen(false);
      setEditingSchool(null);
      await fetchSchools();
    } catch (err: any) {
      alert(err?.message || "Failed to update school.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSchool = async (schoolId: number, schoolName: string) => {
    if (!confirm(`Are you sure you want to delete "${schoolName}"? This will deactivate the institution.`)) {
      return;
    }

    try {
      await api.delete(`/super-admin/schools/${schoolId}`);
      await fetchSchools();
    } catch (err: any) {
      alert(err?.message || "Failed to delete school.");
    }
  };

  const filteredSchools = schools.filter((school) => {
    const nameMatch = (school.name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const locMatch = ((school.city || "") + " " + (school.state || "")).toLowerCase().includes(searchTerm.toLowerCase());
    const adminMatch = (school.principal_name || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSearch = nameMatch || locMatch || adminMatch;
    
    const status = (school.status || "Active").toLowerCase();
    const matchesStatus = statusFilter === "all" || status === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const totalManagedStudents = schools.reduce((a, s) => a + Number(s.students_count || 0), 0);
  const totalContractAmt = schools.reduce((a, s) => a + Number(s.contract_amount || 0), 0);
  const totalPaidAmt = schools.reduce((a, s) => a + Number(s.paid_amount || 0), 0);
  const now = new Date();

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            School Contracts & Revenue Shares
          </h1>
          <p className="text-[#706B62] text-sm">
            Manage school deals, student capacity tiers, and revenue split terms connected to MySQL.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={15} />
          <span>New School Contract</span>
        </button>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* ── Summary Ribbon ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#EBE5D9] shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Total Active Schools</span>
          <div className="font-serif font-bold text-xl text-[#23201B]">{schools.length} Institutions</div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Managed Students</span>
          <div className="font-serif font-bold text-xl text-[#23201B]">
            {totalManagedStudents.toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Total Realized Revenue</span>
          <div className="font-serif font-bold text-xl text-emerald-700">
            PKR {totalPaidAmt.toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Annual Contract Pipeline</span>
          <div className="font-serif font-bold text-xl text-[#996B1E]">
            PKR {(totalContractAmt / 1000000).toFixed(2)}M
          </div>
        </div>
      </div>

      {/* ── Contracts Directory & Table ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs overflow-hidden flex flex-col">
        
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-[#EBE5D9] flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#FAF8F5]">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C847B]" size={15} />
            <input 
              type="text" 
              placeholder="Search by school name, principal, city..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#C4993C]/30 focus:border-[#C4993C] transition-all placeholder:text-[#8C847B] text-[#23201B]"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {["all", "active", "pending"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                  statusFilter === st
                    ? "bg-[#23201B] text-white"
                    : "bg-white border border-[#D9D4CC] text-[#706B62] hover:bg-[#FAF8F5]"
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-[#706B62]">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C4993C]" />
              <p className="text-xs">Loading real schools from database...</p>
            </div>
          ) : (
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                  <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Institution</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Students</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Revenue Split</th>
                  <th className="text-center py-3.5 px-4 font-bold uppercase tracking-wider">Contract Progress</th>
                  <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Paid / Total Deal</th>
                  <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {filteredSchools.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-[#8C847B]">
                      No schools found in database matching criteria.
                    </td>
                  </tr>
                ) : filteredSchools.map((school) => {
                  const start = school.contract_start ? new Date(school.contract_start) : null;
                  const end = school.contract_end ? new Date(school.contract_end) : null;
                  const durationMonths = start && end ? Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30))) : 12;
                  const monthsElapsed = start ? Math.max(0, Math.min(durationMonths, Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30)))) : 0;
                  const progressPercent = Math.min(100, Math.round((monthsElapsed / durationMonths) * 100));

                  return (
                    <tr key={school.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      
                      {/* School & Admin */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C] font-bold flex-shrink-0">
                            <Building2 size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-sm text-[#23201B]">{school.name}</div>
                            <div className="text-[11px] text-[#706B62] flex items-center gap-2 mt-0.5">
                              <span>{school.principal_name || "School Principal"}</span>
                              <span>•</span>
                              <span className="flex items-center gap-1"><MapPin size={10} /> {[school.city, school.state].filter(Boolean).join(", ") || "Pakistan"}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Students */}
                      <td className="py-4 px-3 text-center">
                        <span className="font-bold text-sm text-[#23201B]">{(school.students_count ?? 0).toLocaleString()}</span>
                        <span className="block text-[10px] text-[#8C847B]">{school.teachers_count ?? 0} faculty</span>
                      </td>

                      {/* Revenue Split */}
                      <td className="py-4 px-3 text-center">
                        <div className="inline-block p-1.5 rounded-lg bg-[#FAF3E5] border border-[#EBE5D9]">
                          <div className="font-bold text-[11px] text-[#996B1E]">
                            PKR {Number(school.per_student_fee || 20)} / student
                          </div>
                          <div className="text-[10px] text-[#706B62] font-mono">
                            {Number(school.saas_share_percent || 50)}% SaaS share
                          </div>
                        </div>
                      </td>

                      {/* Contract Timeline (Months Elapsed) */}
                      <td className="py-4 px-4">
                        <div className="w-40 mx-auto">
                          <div className="flex justify-between text-[10px] font-bold mb-1 text-[#4A453E]">
                            <span>Month {monthsElapsed} of {durationMonths}</span>
                            <span>{progressPercent}%</span>
                          </div>
                          <div className="h-2 w-full bg-[#EBE5D9] rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                              style={{ width: `${progressPercent}%` }}
                            />
                          </div>
                          <div className="flex justify-between text-[9px] text-[#8C847B] mt-1">
                            <span>{school.contract_start ? String(school.contract_start).slice(0, 10) : "—"}</span>
                            <span>{school.contract_end ? String(school.contract_end).slice(0, 10) : "—"}</span>
                          </div>
                        </div>
                      </td>

                      {/* Paid / Total */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-bold text-xs text-emerald-700">
                          PKR {Number(school.paid_amount || 0).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-[#8C847B]">
                          of PKR {Number(school.contract_amount || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/super-admin-dashboard/schools/${school.id}`}
                            className="px-2.5 py-1.5 rounded-lg bg-[#FAF3E5] border border-[#EBE5D9] text-[#996B1E] font-bold text-[11px] hover:bg-[#F3EBD9] transition-all flex items-center gap-1 shadow-xs"
                            title="View School Profile"
                          >
                            <Eye size={12} />
                            <span>Details</span>
                          </Link>

                          <button
                            onClick={() => openEditModal(school)}
                            className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-slate-700 hover:bg-[#FAF8F5] hover:text-[#C4993C] transition-all shadow-xs"
                            title="Edit School Details"
                          >
                            <Edit3 size={13} />
                          </button>

                          <button
                            onClick={() => handleDeleteSchool(school.id, school.name)}
                            className="p-1.5 rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50 transition-all shadow-xs"
                            title="Delete School"
                          >
                            <Trash2 size={13} />
                          </button>

                          <a
                            href={`https://wa.me/923152123010?text=Hello%20${encodeURIComponent(school.principal_name || school.name)}%2C%20this%20is%20regarding%20your%20Skoolms%20SaaS%20Contract.`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs"
                            title="Contact via WhatsApp"
                          >
                            <MessageSquare size={13} className="text-[#C4993C]" />
                          </a>
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

      {/* ── Add New School Contract Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">New School Contract Agreement</h3>
                <p className="text-xs text-[#706B62]">Saves directly into MySQL database and activates school instance.</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-[#8C847B] hover:text-[#23201B] rounded-xl hover:bg-[#FAF8F5]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateContract} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">School Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Oakridge Grammar School"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Principal / Admin Name *</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="e.g. Dr. Salman Khan"
                    value={formData.admin}
                    onChange={e => setFormData({...formData, admin: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">City / Location</label>
                  <input 
                    type="text" 
                    placeholder="Lahore, Punjab"
                    value={formData.location}
                    onChange={e => setFormData({...formData, location: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              {/* Revenue Split Configuration Card */}
              <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#EBE5D9] space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-[#996B1E]">
                  <Calculator size={14} />
                  <span>Revenue Split & Contract Modeling</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-[#706B62] mb-1">Total Students</label>
                    <input 
                      type="number" 
                      min="50" 
                      value={formData.students}
                      onChange={e => setFormData({...formData, students: parseInt(e.target.value) || 0})}
                      className="w-full p-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-mono font-bold text-[#23201B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#706B62] mb-1">Per Student Fee (PKR)</label>
                    <input 
                      type="number" 
                      min="1" 
                      value={formData.perStudentFee}
                      onChange={e => setFormData({...formData, perStudentFee: parseInt(e.target.value) || 0})}
                      className="w-full p-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-mono font-bold text-[#23201B]"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#706B62] mb-1">SaaS Share %</label>
                    <select
                      value={formData.saasSharePercent}
                      onChange={e => setFormData({...formData, saasSharePercent: parseInt(e.target.value) || 50})}
                      className="w-full p-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-bold text-[#23201B]"
                    >
                      <option value={30}>30% (70/30 Split)</option>
                      <option value={40}>40% (60/40 Split)</option>
                      <option value={50}>50% (50/50 Split)</option>
                      <option value={60}>60% (40/60 Split)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-bold text-[#706B62] mb-1">Contract Duration</label>
                    <select
                      value={formData.contractDurationMonths}
                      onChange={e => setFormData({...formData, contractDurationMonths: parseInt(e.target.value) || 12})}
                      className="w-full p-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-bold text-[#23201B]"
                    >
                      <option value={6}>6 Months</option>
                      <option value={12}>12 Months (1 Year)</option>
                      <option value={24}>24 Months (2 Years)</option>
                      <option value={36}>36 Months (3 Years)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-[#706B62] mb-1">Contract Start Date</label>
                    <input 
                      type="date"
                      value={formData.contractStart}
                      onChange={e => setFormData({...formData, contractStart: e.target.value})}
                      className="w-full p-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-mono font-bold text-[#23201B]"
                    />
                  </div>
                </div>

                {/* Instant Calculation Output */}
                <div className="p-3 bg-white rounded-xl border border-[#EBE5D9] flex justify-between items-center text-xs">
                  <div>
                    <span className="text-[10px] text-[#706B62] block">Monthly SaaS Revenue:</span>
                    <strong className="text-emerald-700 font-mono font-bold">PKR {monthlySaaSRevenue.toLocaleString()}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-[#706B62] block">1-Year Total Contract Value:</span>
                    <strong className="text-[#996B1E] font-mono font-bold">PKR {totalContractValue.toLocaleString()}</strong>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-[#D9D4CC] text-[#706B62] rounded-xl text-xs font-bold hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#23201B] hover:bg-[#3D382F] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Contract & Activate</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ── Edit School Modal ── */}
      {isEditModalOpen && editingSchool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">Edit School Information</h3>
                <p className="text-xs text-[#706B62]">Update institution profile, contact coordinates, and contract totals.</p>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-[#8C847B] hover:text-[#23201B] rounded-xl hover:bg-[#FAF8F5]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleUpdateSchool} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">School Name *</label>
                  <input 
                    type="text" 
                    required 
                    value={editFormData.name}
                    onChange={e => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Principal / Admin Name</label>
                  <input 
                    type="text" 
                    value={editFormData.principal_name}
                    onChange={e => setEditFormData({...editFormData, principal_name: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Contact Phone</label>
                  <input 
                    type="text" 
                    value={editFormData.phone}
                    onChange={e => setEditFormData({...editFormData, phone: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">School Email *</label>
                  <input 
                    type="email" 
                    required
                    value={editFormData.email}
                    onChange={e => setEditFormData({...editFormData, email: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">City</label>
                  <input 
                    type="text" 
                    value={editFormData.city}
                    onChange={e => setEditFormData({...editFormData, city: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Status</label>
                  <select
                    value={editFormData.status}
                    onChange={e => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Contract Total Deal (PKR)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editFormData.contract_amount}
                    onChange={e => setEditFormData({...editFormData, contract_amount: parseFloat(e.target.value) || 0})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-mono font-bold text-[#23201B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Total Paid (PKR)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={editFormData.paid_amount}
                    onChange={e => setEditFormData({...editFormData, paid_amount: parseFloat(e.target.value) || 0})}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-mono font-bold text-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">Campus Address</label>
                <textarea 
                  rows={2}
                  value={editFormData.address}
                  onChange={e => setEditFormData({...editFormData, address: e.target.value})}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 border border-[#D9D4CC] text-[#706B62] rounded-xl text-xs font-bold hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 bg-[#23201B] hover:bg-[#3D382F] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>Save Changes</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
