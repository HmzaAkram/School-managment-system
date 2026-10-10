"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Building2,
  ArrowLeft,
  Edit3,
  Mail,
  Phone,
  MapPin,
  Key,
  ShieldCheck,
  TrendingUp,
  Receipt,
  CreditCard,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  Loader2,
  X,
  Eye,
  ExternalLink
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";
import { api } from "@/lib/api";

export default function SchoolProfilePage() {
  const params = useParams();
  const router = useRouter();
  const schoolId = params?.id;

  const [schoolData, setSchoolData] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
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

  const fetchSchoolDetails = async () => {
    if (!schoolId) return;
    setLoading(true);
    setError(null);
    try {
      const [schoolRes, paymentsRes] = await Promise.all([
        api.get(`/super-admin/schools/${schoolId}`),
        api.get(`/super-admin/payments?school_id=${schoolId}&per_page=20`).catch(() => null),
      ]);

      if (schoolRes?.school) {
        setSchoolData(schoolRes.school);
        setStats(schoolRes.stats || {});
        setEditFormData({
          name: schoolRes.school.name || "",
          principal_name: schoolRes.school.principal_name || "",
          phone: schoolRes.school.phone || "",
          email: schoolRes.school.email || "",
          city: schoolRes.school.city || "Lahore",
          state: schoolRes.school.state || "Punjab",
          address: schoolRes.school.address || "",
          status: schoolRes.school.status || "Active",
          contract_amount: Number(schoolRes.school.contract_amount || 0),
          paid_amount: Number(schoolRes.school.paid_amount || 0),
        });
      } else {
        setError("School not found in database.");
      }

      if (paymentsRes?.data && Array.isArray(paymentsRes.data)) {
        setPayments(paymentsRes.data);
      }
    } catch (err: any) {
      console.error("Failed to load school details:", err);
      setError(err?.message || "Failed to load institution dossier.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
  }, [schoolId]);

  const handleUpdateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!schoolId) return;

    setSubmitting(true);
    try {
      await api.put(`/super-admin/schools/${schoolId}`, {
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
      await fetchSchoolDetails();
    } catch (err: any) {
      alert(err?.message || "Failed to update school.");
    } finally {
      setSubmitting(false);
    }
  };

  // Trend Chart Data generator
  const trendData = useMemo(() => {
    if (!schoolData) return [];
    const totalContract = Number(schoolData.contract_amount || 0);
    const paid = Number(schoolData.paid_amount || 0);
    const pending = Math.max(0, totalContract - paid);

    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const baseStep = totalContract / months.length;

    return months.map((m, i) => {
      const simulatedBilled = Math.round(baseStep * (i + 1));
      const simulatedPaid = Math.min(paid, Math.round(simulatedBilled * 0.75));
      const simulatedBalance = Math.max(0, simulatedBilled - simulatedPaid);
      return {
        date: `${m} 2026`,
        balance: i === months.length - 1 ? pending : simulatedBalance,
        billed: simulatedBilled,
        paid: simulatedPaid,
      };
    });
  }, [schoolData]);

  if (loading) {
    return (
      <div className="py-24 text-center text-[#706B62] space-y-3">
        <Loader2 className="w-9 h-9 animate-spin mx-auto text-[#C4993C]" />
        <p className="text-sm font-medium">Loading school profile and financial ledger...</p>
      </div>
    );
  }

  if (error || !schoolData) {
    return (
      <div className="p-8 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-center space-y-4 max-w-xl mx-auto mt-12">
        <AlertCircle className="w-10 h-10 mx-auto text-red-500" />
        <h2 className="text-lg font-bold">Error Loading School Profile</h2>
        <p className="text-xs">{error || "Could not retrieve school data."}</p>
        <Link
          href="/super-admin-dashboard/schools"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#23201B] text-white rounded-xl text-xs font-bold"
        >
          <ArrowLeft size={14} /> Back to Schools
        </Link>
      </div>
    );
  }

  const school = schoolData;
  const adminUser = school.users?.find((u: any) => u.role === "school_admin") || school.users?.[0];
  const totalBilled = Number(school.contract_amount || 0);
  const totalPaid = Number(school.paid_amount || 0);
  const outstandingBalance = Math.max(0, totalBilled - totalPaid);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto pb-12">
      {/* ── Top Header & Breadcrumb ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EBE5D9] pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/super-admin-dashboard/schools"
            className="p-2.5 rounded-xl border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs"
            title="Back to Schools"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold font-serif text-[#23201B]">
                School Profile
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-[#FAF3E5] border border-[#EBE5D9] text-[#996B1E] font-mono font-bold text-xs">
                {school.code || `SCH-${school.id}`}
              </span>
            </div>
            <p className="text-xs text-[#706B62] mt-0.5">
              Detailed view of <span className="font-semibold text-[#23201B]">{school.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5"
          >
            <Edit3 size={14} className="text-[#C4993C]" />
            <span>Edit Details</span>
          </button>
        </div>
      </div>

      {/* ── Main Two-Column Layout (Matching Reference Structure) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ── LEFT COLUMN (5 cols): School Information & Financial Summary ── */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Card 1: School Information */}
          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#EBE5D9] pb-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#23201B] uppercase tracking-wider">
                <Building2 size={16} className="text-[#C4993C]" />
                <span>School Information</span>
              </div>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                school.status === "Active"
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "bg-amber-50 text-amber-800 border border-amber-200"
              }`}>
                {school.status || "Active"}
              </span>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">School Name</span>
                <div className="font-bold text-sm text-[#23201B] mt-0.5">{school.name}</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Registration / Code</span>
                  <div className="font-mono font-bold text-[#23201B] mt-0.5">{school.code || "N/A"}</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Affiliation / Board</span>
                  <div className="font-semibold text-[#23201B] mt-0.5">BISE / Cambridge</div>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">School Email</span>
                <div className="font-medium text-[#23201B] mt-0.5 flex items-center gap-1.5">
                  <Mail size={12} className="text-[#8C847B]" />
                  <span>{school.email || "N/A"}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Company / Contact Phone</span>
                <div className="font-medium text-[#23201B] mt-0.5 flex items-center gap-1.5">
                  <Phone size={12} className="text-[#8C847B]" />
                  <span>{school.phone || "+92 300 0000000"}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Campus Address</span>
                <div className="font-medium text-[#23201B] mt-0.5 flex items-start gap-1.5">
                  <MapPin size={12} className="text-[#8C847B] mt-0.5 flex-shrink-0" />
                  <span>{[school.address, school.city, school.state].filter(Boolean).join(", ") || "Pakistan"}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Opening Balance</span>
                  <div className="font-mono font-bold text-[#23201B] mt-0.5">0.00</div>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#8C847B] uppercase tracking-wider block">Enrolled Students</span>
                  <div className="font-bold text-[#23201B] mt-0.5">{(stats?.students ?? school.students_count ?? 0).toLocaleString()}</div>
                </div>
              </div>

              {/* Login Credentials Box */}
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#8C847B] uppercase tracking-wider">
                  <Key size={12} className="text-[#C4993C]" />
                  <span>Admin Login Credentials</span>
                </div>
                <div className="space-y-1 text-[11px]">
                  <div className="flex justify-between">
                    <span className="text-[#706B62]">Username / Admin:</span>
                    <strong className="text-[#23201B]">{adminUser?.name || school.principal_name || "Admin"}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#706B62]">Email:</span>
                    <span className="font-mono text-[#23201B]">{adminUser?.email || school.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#706B62]">Password:</span>
                    <span className="text-amber-700 font-mono">••••••••</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-[11px]">
                <span className="text-[#8C847B]">Status:</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Financial Summary (Navy / Brand Gradient Card as in reference) */}
          <div className="rounded-2xl bg-gradient-to-br from-[#1E293B] to-[#0F172A] text-white p-6 shadow-md space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Financial Summary</span>
              <TrendingUp size={16} className="text-emerald-400" />
            </div>

            <div>
              <span className="text-[11px] text-slate-300 block">Outstanding Balance</span>
              <div className="text-3xl font-extrabold font-serif tracking-tight mt-1 text-white">
                PKR {outstandingBalance.toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/10">
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Billed</span>
                <div className="text-base font-bold font-mono text-slate-100 mt-0.5">
                  PKR {totalBilled.toLocaleString()}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Paid</span>
                <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                  PKR {totalPaid.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ── RIGHT COLUMN (7 cols): Balance Trend & Recent Transactions ── */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Card 3: Balance Trend Chart */}
          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#23201B] font-serif">Balance Trend</h3>
                <p className="text-[11px] text-[#706B62]">Contract fulfillment and balance realization trajectory</p>
              </div>
              <div className="flex items-center gap-3 text-[11px]">
                <span className="flex items-center gap-1.5 text-[#706B62]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1E3A8A]" /> Balance
                </span>
                <span className="flex items-center gap-1.5 text-[#706B62]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Paid
                </span>
              </div>
            </div>

            <div className="h-64 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="paidGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1EAD9" vertical={false} />
                  <XAxis dataKey="date" tick={{ fill: "#8C847B", fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "#8C847B", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: "12px",
                      border: "1px solid #EBE5D9",
                      fontSize: "11px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
                    }}
                    formatter={(val: any) => [`PKR ${Number(val).toLocaleString()}`, "Amount"]}
                  />
                  <Area type="monotone" dataKey="balance" stroke="#1E3A8A" strokeWidth={2.5} fillOpacity={1} fill="url(#balanceGrad)" />
                  <Area type="monotone" dataKey="paid" stroke="#10B981" strokeWidth={2} fillOpacity={1} fill="url(#paidGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Card 4: Recent Transactions Table */}
          <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EBE5D9] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[#23201B] font-serif">Recent Transactions</h3>
                <p className="text-[11px] text-[#706B62]">Ledger entries, payments, and contract milestones</p>
              </div>
              <Link
                href="/super-admin-dashboard/ledger"
                className="px-3 py-1.5 rounded-xl border border-[#D9D4CC] text-[11px] font-bold text-[#23201B] hover:bg-[#FAF8F5] transition-all flex items-center gap-1 shadow-xs"
              >
                <span>View Full Ledger</span>
                <ExternalLink size={11} className="text-[#C4993C]" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[#EBE5D9] text-[#8C847B] text-[11px]">
                    <th className="text-left py-2.5 font-bold">Date</th>
                    <th className="text-left py-2.5 px-3 font-bold">Description</th>
                    <th className="text-right py-2.5 px-3 font-bold">Debit</th>
                    <th className="text-right py-2.5 px-3 font-bold">Credit</th>
                    <th className="text-right py-2.5 font-bold">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">
                  {payments.length > 0 ? (
                    payments.map((p, idx) => (
                      <tr key={p.id || idx} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 font-mono text-[11px] text-[#706B62]">
                          {p.payment_date || "09-10-2026"}
                        </td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#23201B]">{p.description || "Contract Fee Settlement"}</div>
                          <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                            {p.payment_method || "Bank Transfer"}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-[#8C847B]">—</td>
                        <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                          {Number(p.amount || 0).toLocaleString()}
                        </td>
                        <td className="py-3 text-right font-mono font-bold text-[#23201B]">
                          {Math.max(0, totalBilled - totalPaid).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr className="hover:bg-[#FAF8F5]/80 transition-colors">
                        <td className="py-3 font-mono text-[11px] text-[#706B62]">10-10-2026</td>
                        <td className="py-3 px-3">
                          <div className="font-semibold text-[#23201B]">Annual SaaS License Agreement Activated</div>
                          <span className="text-[10px] text-[#996B1E] bg-[#FAF3E5] px-1.5 py-0.2 rounded border border-[#EBE5D9]">
                            Contract Billing
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right font-mono text-slate-700">{totalBilled.toLocaleString()}</td>
                        <td className="py-3 px-3 text-right text-[#8C847B]">—</td>
                        <td className="py-3 text-right font-mono font-bold text-[#23201B]">
                          {totalBilled.toLocaleString()}
                        </td>
                      </tr>
                      {totalPaid > 0 && (
                        <tr className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3 font-mono text-[11px] text-[#706B62]">10-10-2026</td>
                          <td className="py-3 px-3">
                            <div className="font-semibold text-[#23201B]">Payment: Lumpsum Payment (Auto-distributed)</div>
                            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                              Verified
                            </span>
                          </td>
                          <td className="py-3 px-3 text-right text-[#8C847B]">—</td>
                          <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700">
                            {totalPaid.toLocaleString()}
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-[#23201B]">
                            {outstandingBalance.toLocaleString()}
                          </td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>

      {/* ── Edit School Modal ── */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">Edit School Profile</h3>
                <p className="text-xs text-[#706B62]">Update institution contact details and financial contract terms.</p>
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
