"use client";

import { useState } from "react";
import { mockSchools, SchoolContract } from "@/lib/mock-data";
import { 
  Search, Plus, Filter, Building2, MapPin, Mail, Phone, Calendar, 
  CheckCircle2, Clock, AlertCircle, X, Calculator, ShieldCheck, ChevronRight, MessageSquare
} from "lucide-react";

export default function SchoolsPage() {
  const [schools, setSchools] = useState<SchoolContract[]>(mockSchools);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    contractStart: "2026-10-01",
  });

  // Derived calculations for form
  const saasFeePerStudent = Math.round((formData.perStudentFee * formData.saasSharePercent) / 100);
  const monthlySaaSRevenue = formData.students * saasFeePerStudent;
  const totalContractValue = monthlySaaSRevenue * formData.contractDurationMonths;

  const handleCreateContract = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.admin) return;

    const startDate = new Date(formData.contractStart);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + formData.contractDurationMonths);
    const contractEndFormatted = endDate.toISOString().split("T")[0];

    const newContract: SchoolContract = {
      id: `SCH-00${schools.length + 1}`,
      name: formData.name,
      admin: formData.admin,
      phone: formData.phone || "+92 300 0000000",
      email: formData.email || `${formData.name.toLowerCase().replace(/\s+/g, "")}@school.edu`,
      location: formData.location,
      students: Number(formData.students),
      teachers: Number(formData.teachers),
      perStudentFee: Number(formData.perStudentFee),
      schoolSharePercent: 100 - Number(formData.saasSharePercent),
      saasSharePercent: Number(formData.saasSharePercent),
      saasFeePerStudent: saasFeePerStudent,
      monthlySaaSRevenue: monthlySaaSRevenue,
      contractDurationMonths: Number(formData.contractDurationMonths),
      contractStart: formData.contractStart,
      contractEnd: contractEndFormatted,
      monthsElapsed: 1,
      totalContractValue: totalContractValue,
      totalPaidAmount: monthlySaaSRevenue,
      totalPendingAmount: totalContractValue - monthlySaaSRevenue,
      currentMonthStatus: "Paid",
      status: "Active",
    };

    setSchools([newContract, ...schools]);
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
      contractStart: "2026-10-01",
    });
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = 
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.admin.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || school.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            School Contracts & Revenue Shares
          </h1>
          <p className="text-[#706B62] text-sm">
            Manage annual school deals, student capacity tiers, and 50/50 revenue split terms.
          </p>
        </div>
        
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={16} className="text-[#D4A843]" /> 
          <span>Create New School Contract</span>
        </button>
      </div>

      {/* ── Summary Ribbon ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-2xl border border-[#EBE5D9] shadow-xs">
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Total Active Schools</span>
          <div className="font-serif font-bold text-xl text-[#23201B]">{schools.length} Institutions</div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Managed Students</span>
          <div className="font-serif font-bold text-xl text-[#23201B]">
            {schools.reduce((a, s) => a + s.students, 0).toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Total Monthly SaaS</span>
          <div className="font-serif font-bold text-xl text-emerald-700">
            PKR {schools.reduce((a, s) => a + s.monthlySaaSRevenue, 0).toLocaleString()}
          </div>
        </div>
        <div>
          <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Annual Contract Pipeline</span>
          <div className="font-serif font-bold text-xl text-[#996B1E]">
            PKR {(schools.reduce((a, s) => a + s.totalContractValue, 0) / 1000000).toFixed(2)}M
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
            {["all", "active", "pending renewal"].map((st) => (
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
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Institution</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Students</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Revenue Split</th>
                <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Monthly MRR</th>
                <th className="text-center py-3.5 px-4 font-bold uppercase tracking-wider">Contract Progress (1 Year)</th>
                <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Paid / Total Deal</th>
                <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {filteredSchools.map(school => {
                const progressPercent = Math.min(100, Math.round((school.monthsElapsed / school.contractDurationMonths) * 100));

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
                            <span>{school.admin}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><MapPin size={10} /> {school.location}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Students */}
                    <td className="py-4 px-3 text-center">
                      <span className="font-bold text-sm text-[#23201B]">{school.students.toLocaleString()}</span>
                      <span className="block text-[10px] text-[#8C847B]">{school.teachers} faculty</span>
                    </td>

                    {/* Revenue Split */}
                    <td className="py-4 px-3 text-center">
                      <div className="inline-block p-1.5 rounded-lg bg-[#FAF3E5] border border-[#EBE5D9]">
                        <div className="font-bold text-[11px] text-[#996B1E]">
                          Rs. {school.perStudentFee} / student
                        </div>
                        <div className="text-[10px] text-[#706B62] font-mono">
                          {school.saasSharePercent}% SaaS (Rs. {school.saasFeePerStudent})
                        </div>
                      </div>
                    </td>

                    {/* Monthly SaaS Revenue */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-mono font-bold text-sm text-[#23201B]">
                        PKR {school.monthlySaaSRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-[#8C847B]">per month</span>
                    </td>

                    {/* Contract Timeline (Months Elapsed) */}
                    <td className="py-4 px-4">
                      <div className="w-40 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold mb-1 text-[#4A453E]">
                          <span>Month {school.monthsElapsed} of {school.contractDurationMonths}</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#EBE5D9] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-[#8C847B] mt-1">
                          <span>{school.contractStart}</span>
                          <span>{school.contractEnd}</span>
                        </div>
                      </div>
                    </td>

                    {/* Paid / Total */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-mono font-bold text-xs text-emerald-700">
                        PKR {school.totalPaidAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#8C847B]">
                        of PKR {school.totalContractValue.toLocaleString()}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/923152123010?text=Hello%20${encodeURIComponent(school.admin)}%20(${encodeURIComponent(school.name)})%2C%20this%20is%20regarding%20your%20Skoolms%20SaaS%20Contract%20Billing.`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs"
                          title="Contact School via WhatsApp"
                        >
                          <MessageSquare size={13} className="text-[#C4993C]" />
                        </a>
                        <button
                          className="px-2.5 py-1 rounded-lg bg-[#FAF3E5] border border-[#EBE5D9] text-[#996B1E] font-bold text-[11px] hover:bg-[#F3EBD9]"
                          onClick={() => alert(`Contract ID: ${school.id}\nMonthly Revenue: PKR ${school.monthlySaaSRevenue}\nDuration: ${school.contractDurationMonths} Months\nEnds: ${school.contractEnd}`)}
                        >
                          Details
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </div>

      {/* ── Add New School Contract Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">New School Contract Agreement</h3>
                <p className="text-xs text-[#706B62]">Configure per-student fee, 50/50 revenue split, and contract timeline.</p>
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
                  <label className="block text-xs font-bold text-[#23201B] mb-1">School Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Allied School Gulshan"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:outline-none focus:border-[#C4993C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23201B] mb-1">Principal / Admin Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Salman Qazi"
                    value={formData.admin}
                    onChange={e => setFormData({ ...formData, admin: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#23201B] mb-1">Contact Phone</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:outline-none focus:border-[#C4993C]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#23201B] mb-1">City / Location</label>
                  <input
                    type="text"
                    placeholder="Lahore, Punjab"
                    value={formData.location}
                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              {/* Deal & Revenue Split Calculations */}
              <div className="p-4 rounded-2xl bg-[#FAF3E5]/60 border border-[#EBE5D9] space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#996B1E]">
                  <Calculator size={14} />
                  <span>Revenue Split & Contract Modeling</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A453E] mb-1">Total Students</label>
                    <input
                      type="number"
                      required
                      min={50}
                      value={formData.students}
                      onChange={e => setFormData({ ...formData, students: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-bold text-[#23201B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A453E] mb-1">Per Student Fee (PKR)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={formData.perStudentFee}
                      onChange={e => setFormData({ ...formData, perStudentFee: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-bold text-[#23201B]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A453E] mb-1">SaaS Share %</label>
                    <select
                      value={formData.saasSharePercent}
                      onChange={e => setFormData({ ...formData, saasSharePercent: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-bold text-[#23201B]"
                    >
                      <option value={50}>50% (50/50 Split)</option>
                      <option value={40}>40% (60/40 Split)</option>
                      <option value={60}>60% (40/60 Split)</option>
                      <option value={100}>100% (Full SaaS)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#4A453E] mb-1">Contract Duration</label>
                    <select
                      value={formData.contractDurationMonths}
                      onChange={e => setFormData({ ...formData, contractDurationMonths: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-bold text-[#23201B]"
                    >
                      <option value={12}>12 Months (1 Year)</option>
                      <option value={24}>24 Months (2 Years)</option>
                      <option value={6}>6 Months</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-[#4A453E] mb-1">Contract Start Date</label>
                    <input
                      type="date"
                      value={formData.contractStart}
                      onChange={e => setFormData({ ...formData, contractStart: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-[#D9D4CC] rounded-lg text-xs font-bold text-[#23201B]"
                    />
                  </div>
                </div>

                {/* Auto Calculated Summary Box */}
                <div className="p-3 bg-white rounded-xl border border-[#EBE5D9] grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#8C847B] block text-[10px]">Monthly SaaS Revenue:</span>
                    <strong className="text-emerald-700 font-mono text-sm">PKR {monthlySaaSRevenue.toLocaleString()}</strong>
                  </div>
                  <div>
                    <span className="text-[#8C847B] block text-[10px]">1-Year Total Contract Value:</span>
                    <strong className="text-[#996B1E] font-mono text-sm">PKR {totalContractValue.toLocaleString()}</strong>
                  </div>
                </div>

              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold shadow-md"
                >
                  Save Contract & Activate
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
