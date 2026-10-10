"use client";

import { useEffect, useState } from "react";
import { 
  Search, Download, ArrowUpRight, CreditCard, DollarSign, 
  CheckCircle2, Clock, AlertCircle, MessageSquare, Loader2
} from "lucide-react";
import { api } from "@/lib/api";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [schools, setSchools] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentTotals, setPaymentTotals] = useState<any>({ total: 0, completed: 0, outstanding: 0 });
  const [activeTab, setActiveTab] = useState<"invoices" | "transactions">("invoices");
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState<number | null>(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const [schoolsRes, paymentsRes] = await Promise.all([
        api.get("/super-admin/schools?per_page=100"),
        api.get("/super-admin/payments?per_page=100"),
      ]);
      setSchools(schoolsRes?.data || []);
      setPayments(paymentsRes?.data || []);
      setPaymentTotals(paymentsRes?.totals || { total: 0, completed: 0, outstanding: 0 });
    } catch (err: any) {
      console.error("Failed to load payments data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const totalMonthlySaaS = schools.reduce((acc, curr) => {
    const fee = (Number(curr.per_student_fee || 20) * Number(curr.saas_share_percent || 50)) / 100;
    return acc + (Number(curr.students_count || 0) * fee);
  }, 0);
  const totalCollectedAll = schools.reduce((acc, curr) => acc + Number(curr.paid_amount || 0), 0);
  const totalPendingAll = schools.reduce((acc, curr) => acc + Number(curr.pending_amount || 0), 0);

  const handleMarkAsPaid = async (school: any) => {
    setMarkingId(school.id);
    try {
      const fee = (Number(school.per_student_fee || 20) * Number(school.saas_share_percent || 50)) / 100;
      const amount = Number(school.students_count || 0) * fee || 10000;

      await api.post("/super-admin/payments", {
        school_id: school.id,
        amount,
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "Bank Transfer",
        status: "Completed",
        reference: `INV-${Date.now().toString().slice(-6)}`,
        description: `Monthly SaaS Subscription - ${school.name}`,
        month_for: new Date().toLocaleString('default', { month: 'long', year: 'numeric' }),
      });

      await loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to record payment.");
    } finally {
      setMarkingId(null);
    }
  };

  const filteredSchools = schools.filter(s =>
    (s.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.principal_name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.code || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPayments = payments.filter(p =>
    (p.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.school?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.payment_method || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            School Invoicing & SaaS Collections
          </h1>
          <p className="text-[#706B62] text-sm">
            Track monthly per-student billings, mark received wire transfers, and issue payment notices from database.
          </p>
        </div>

        <button 
          onClick={() => window.print()}
          className="bg-white text-[#23201B] px-4 py-2 rounded-xl font-bold text-xs border border-[#D9D4CC] shadow-xs hover:bg-[#FAF8F5] transition-colors flex items-center gap-2"
        >
          <Download size={15} className="text-[#C4993C]" /> 
          <span>Export Invoices</span>
        </button>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total Year-To-Date Realized</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700">
            PKR {totalCollectedAll.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#706B62] mt-1 block">Accumulated across all school accounts</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Estimated Monthly SaaS (MRR)</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#23201B]">
            PKR {Math.round(totalMonthlySaaS).toLocaleString()}
          </div>
          <span className="text-[10px] text-[#706B62] mt-1 block">From {schools.length} onboarded school campuses</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Pending Contract Balance</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-red-700">
            PKR {totalPendingAll.toLocaleString()}
          </div>
          <span className="text-[10px] text-red-600 mt-1 font-semibold block">
            {schools.filter(s => Number(s.pending_amount || 0) > 0).length} schools with outstanding dues
          </span>
        </div>

      </div>

      {/* ── Table Container ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs overflow-hidden flex flex-col">
        
        {/* Sub-Header & Search */}
        <div className="p-4 border-b border-[#EBE5D9] flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#FAF8F5]">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8C847B]" size={15} />
            <input 
              type="text" 
              placeholder="Search school name, contract ID or principal..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs focus:outline-none focus:border-[#C4993C] text-[#23201B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "invoices"
                  ? "bg-[#23201B] text-white"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              School Billing Invoices
            </button>
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "transactions"
                  ? "bg-[#23201B] text-white"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              Recent Bank Deposits ({payments.length})
            </button>
          </div>
        </div>

        {/* Tab 1: School Invoices */}
        {activeTab === "invoices" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-[#706B62]">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C4993C]" />
                <p className="text-xs">Loading billing records from database...</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                    <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">School & Contract</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Billable Students</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">SaaS Rate</th>
                    <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Total Contract Deal</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                    <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">
                  {filteredSchools.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#8C847B]">
                        No schools found in database.
                      </td>
                    </tr>
                  ) : filteredSchools.map(school => {
                    const feePerStd = (Number(school.per_student_fee || 20) * Number(school.saas_share_percent || 50)) / 100;
                    const monthlyRev = Math.round(Number(school.students_count || 0) * feePerStd);
                    const isFullyPaid = Number(school.pending_amount || 0) <= 0;

                    return (
                      <tr key={school.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        
                        <td className="py-4 px-5">
                          <div className="font-bold text-sm text-[#23201B]">{school.name}</div>
                          <div className="text-[11px] text-[#706B62] flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[#996B1E]">{school.code}</span>
                            <span>•</span>
                            <span>{school.principal_name || "School Principal"}</span>
                            <span>•</span>
                            <span>{school.phone || "N/A"}</span>
                          </div>
                        </td>

                        <td className="py-4 px-3 text-center font-bold text-sm text-[#23201B]">
                          {(school.students_count ?? 0).toLocaleString()}
                        </td>

                        <td className="py-4 px-3 text-center">
                          <span className="px-2 py-0.5 rounded-md bg-[#FAF3E5] text-[#996B1E] font-bold text-[11px]">
                            Rs. {feePerStd}/student
                          </span>
                        </td>

                        <td className="py-4 px-4 text-right">
                          <span className="font-mono font-bold text-sm text-[#23201B]">
                            PKR {Number(school.contract_amount || monthlyRev).toLocaleString()}
                          </span>
                        </td>

                        <td className="py-4 px-3 text-center">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              isFullyPaid
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {isFullyPaid ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                            <span>{isFullyPaid ? "Paid" : "Pending"}</span>
                          </span>
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {!isFullyPaid ? (
                              <button
                                disabled={markingId === school.id}
                                onClick={() => handleMarkAsPaid(school)}
                                className="px-3 py-1 rounded-lg bg-[#23201B] hover:bg-[#3D382F] text-white text-[11px] font-bold shadow-xs transition-all disabled:opacity-60 flex items-center gap-1"
                              >
                                {markingId === school.id && <Loader2 size={10} className="animate-spin" />}
                                <span>Record Payment</span>
                              </button>
                            ) : (
                              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                                ✓ Settled
                              </span>
                            )}

                            <a
                              href={`https://wa.me/923152123010?text=Dear%20${encodeURIComponent(school.principal_name || school.name)}%2C%20invoice%20for%20${encodeURIComponent(school.name)}%20(PKR%20${monthlyRev.toLocaleString()})%20is%20now%20ready.`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white hover:bg-[#FAF8F5] text-[#23201B] transition-all"
                              title="Send Invoice Notice on WhatsApp"
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
        )}

        {/* Tab 2: Bank Transactions */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-[#706B62]">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C4993C]" />
                <p className="text-xs">Loading deposits from database...</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                    <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Transaction ID</th>
                    <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Date</th>
                    <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Description</th>
                    <th className="text-right py-3.5 px-6 font-bold uppercase tracking-wider">Amount</th>
                    <th className="text-center py-3.5 px-6 font-bold uppercase tracking-wider">Method</th>
                    <th className="text-center py-3.5 px-6 font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-[#8C847B]">
                        No payment records found in database.
                      </td>
                    </tr>
                  ) : filteredPayments.map(payment => (
                    <tr key={payment.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-[#706B62] bg-[#FAF3E5] px-2 py-1 rounded border border-[#EBE5D9]">
                          {payment.transaction_id || `TXN-${payment.id}`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-[#706B62] font-mono">
                        {String(payment.payment_date || "").slice(0, 10)}
                      </td>
                      <td className="py-4 px-6 text-[#23201B] font-bold">
                        {payment.description || `Payment from ${payment.school?.name || "School"}`}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <span className="font-mono font-bold text-sm text-emerald-700">
                          + PKR {Number(payment.amount || 0).toLocaleString()}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-center text-[#706B62]">
                        {payment.payment_method || "Bank Wire"}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {payment.status || "Completed"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

      </div>

    </div>
  );
}
