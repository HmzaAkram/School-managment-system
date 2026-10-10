"use client";

import { useEffect, useState } from "react";
import { 
  Search, Download, ArrowUpRight, CreditCard, DollarSign, 
  CheckCircle2, Clock, AlertCircle, MessageSquare, Loader2,
  Plus, X, Building2, Receipt, Calendar, Wallet, Check
} from "lucide-react";
import { api } from "@/lib/api";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");
  const [schools, setSchools] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentTotals, setPaymentTotals] = useState<any>({ total: 0, completed: 0, outstanding: 0 });
  const [activeTab, setActiveTab] = useState<"transactions" | "invoices">("transactions");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [markingId, setMarkingId] = useState<number | null>(null);

  // Record Payment Modal State
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    school_id: "",
    amount: "",
    payment_date: new Date().toISOString().split("T")[0],
    payment_method: "Online Bank Transfer",
    receiving_account: "Habib Bank Ltd (HBL) - A/C 0129-883719-01",
    reference: "",
    month_for: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    description: "",
    notes: "",
    status: "Completed",
  });

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

  // Selected school in modal
  const selectedSchoolObj = schools.find((s) => String(s.id) === String(paymentForm.school_id));

  const handleOpenRecordModal = (preselectedSchool?: any) => {
    const defaultSchool = preselectedSchool || schools[0];
    const defaultSchoolId = defaultSchool ? String(defaultSchool.id) : "";
    const pendingAmt = defaultSchool ? Number(defaultSchool.pending_amount || 0) : "";

    setPaymentForm({
      school_id: defaultSchoolId,
      amount: pendingAmt ? String(pendingAmt) : "",
      payment_date: new Date().toISOString().split("T")[0],
      payment_method: "Online Bank Transfer",
      receiving_account: "Habib Bank Ltd (HBL) - A/C 0129-883719-01",
      reference: `REC-${Date.now().toString().slice(-6)}`,
      month_for: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
      description: defaultSchool ? `Monthly SaaS Settlement - ${defaultSchool.name}` : "",
      notes: "Direct deposit into corporate account",
      status: "Completed",
    });
    setIsRecordModalOpen(true);
  };

  const handleRecordPaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentForm.school_id || !paymentForm.amount) {
      alert("Please select a school and enter payment amount.");
      return;
    }

    setSubmitting(true);
    try {
      const fullDescription = paymentForm.description || 
        `Payment for ${paymentForm.month_for} - ${selectedSchoolObj?.name || "School"}`;
      const fullNotes = paymentForm.receiving_account 
        ? `Account: ${paymentForm.receiving_account}. ${paymentForm.notes || ""}`.trim()
        : paymentForm.notes;

      await api.post("/super-admin/payments", {
        school_id: parseInt(paymentForm.school_id),
        amount: parseFloat(paymentForm.amount),
        payment_date: paymentForm.payment_date,
        payment_method: paymentForm.payment_method,
        status: paymentForm.status,
        reference: paymentForm.reference || `TXN-${Date.now().toString().slice(-6)}`,
        description: fullDescription,
        notes: fullNotes,
        month_for: paymentForm.month_for,
      });

      setIsRecordModalOpen(false);
      await loadData();
    } catch (err: any) {
      alert(err?.message || "Failed to record payment.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickMarkPaid = async (school: any) => {
    setMarkingId(school.id);
    try {
      const fee = (Number(school.per_student_fee || 20) * Number(school.saas_share_percent || 50)) / 100;
      const amount = Number(school.pending_amount || 0) || Math.round(Number(school.students_count || 0) * fee) || 10000;

      await api.post("/super-admin/payments", {
        school_id: school.id,
        amount,
        payment_date: new Date().toISOString().split("T")[0],
        payment_method: "Online Bank Transfer",
        status: "Completed",
        reference: `INV-${Date.now().toString().slice(-6)}`,
        description: `Monthly SaaS Subscription - ${school.name}`,
        month_for: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
        notes: "Direct clearance via quick-action button",
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

  const filteredPayments = payments.filter(p => {
    const matchesSearch = 
      (p.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.school?.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.description || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.payment_method || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.reference || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.notes || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesMethod = 
      methodFilter === "all" || 
      (p.payment_method || "").toLowerCase().includes(methodFilter.toLowerCase());

    return matchesSearch && matchesMethod;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto pb-12">
      
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            School Invoicing & SaaS Collections
          </h1>
          <p className="text-[#706B62] text-sm">
            Record incoming bank wires, track school SaaS fee transactions, and verify account deposits in MySQL.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button 
            onClick={() => handleOpenRecordModal()}
            className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Record Payment</span>
          </button>

          <button 
            onClick={() => window.print()}
            className="bg-white text-[#23201B] px-4 py-2.5 rounded-xl font-bold text-xs border border-[#D9D4CC] shadow-xs hover:bg-[#FAF8F5] transition-colors flex items-center gap-2"
          >
            <Download size={14} className="text-[#C4993C]" /> 
            <span>Export Report</span>
          </button>
        </div>
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
              placeholder="Search by transaction ID, school, receipt #, method..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs focus:outline-none focus:border-[#C4993C] text-[#23201B]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "transactions"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62] hover:bg-[#FAF8F5]"
              }`}
            >
              Transaction History ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "invoices"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62] hover:bg-[#FAF8F5]"
              }`}
            >
              School Accounts & Dues ({schools.length})
            </button>
          </div>
        </div>

        {/* Method Filter Pills for Transactions Tab */}
        {activeTab === "transactions" && (
          <div className="px-4 py-2.5 border-b border-[#EBE5D9] bg-white flex items-center gap-2 overflow-x-auto text-xs">
            <span className="text-[#8C847B] font-bold text-[11px] uppercase mr-1">Filter Method:</span>
            {[
              { id: "all", label: "All Methods" },
              { id: "online", label: "Online Transfer" },
              { id: "bank", label: "Bank Wire" },
              { id: "cash", label: "Cash Deposit" },
              { id: "cheque", label: "Cheque" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setMethodFilter(f.id)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  methodFilter === f.id
                    ? "bg-[#FAF3E5] text-[#996B1E] border border-[#EBE5D9]"
                    : "text-[#706B62] hover:bg-[#FAF8F5]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* ── Tab 1: Transaction History (User Primary Focus) ── */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-[#706B62]">
                <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#C4993C]" />
                <p className="text-xs">Loading deposits and transaction history from database...</p>
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                    <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Transaction ID / Ref</th>
                    <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider">School / Institution</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Transfer Date</th>
                    <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Amount Transferred</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Method</th>
                    <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider">Account / Notes</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-16 text-center text-[#8C847B]">
                        <Receipt className="w-10 h-10 mx-auto text-[#C4993C] mb-2 opacity-40" />
                        <div className="font-bold text-sm text-[#23201B]">No transaction records found</div>
                        <p className="text-xs text-[#706B62] mt-0.5">Click &quot;Record Payment&quot; above to log an incoming transfer.</p>
                      </td>
                    </tr>
                  ) : filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      
                      {/* Transaction ID & Reference */}
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-bold text-[#23201B] bg-[#FAF3E5] px-2 py-0.5 rounded border border-[#EBE5D9] block w-fit">
                          {payment.transaction_id || `TXN-${payment.id}`}
                        </span>
                        {payment.reference && payment.reference !== payment.transaction_id && (
                          <span className="text-[10px] text-[#8C847B] font-mono mt-0.5 block">
                            Ref: {payment.reference}
                          </span>
                        )}
                      </td>

                      {/* School Name */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-sm text-[#23201B]">
                          {payment.school?.name || "Institution Account"}
                        </div>
                        <div className="text-[11px] text-[#706B62] flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-[#996B1E]">{payment.school?.code || "—"}</span>
                          {payment.month_for && (
                            <>
                              <span>•</span>
                              <span>{payment.month_for}</span>
                            </>
                          )}
                        </div>
                      </td>

                      {/* Transfer Date */}
                      <td className="py-4 px-3 text-center text-[#706B62] font-mono">
                        <div className="font-bold text-[#23201B]">
                          {String(payment.payment_date || "").slice(0, 10)}
                        </div>
                        <span className="text-[10px] text-[#8C847B]">Verified</span>
                      </td>

                      {/* Amount Transferred */}
                      <td className="py-4 px-4 text-right">
                        <div className="font-mono font-bold text-sm text-emerald-700">
                          + PKR {Number(payment.amount || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Payment Method */}
                      <td className="py-4 px-3 text-center">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          (payment.payment_method || "").toLowerCase().includes("cash")
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : (payment.payment_method || "").toLowerCase().includes("cheque")
                            ? "bg-purple-50 text-purple-800 border border-purple-200"
                            : "bg-blue-50 text-blue-800 border border-blue-200"
                        }`}>
                          <Wallet size={10} />
                          <span>{payment.payment_method || "Online Transfer"}</span>
                        </span>
                      </td>

                      {/* Account & Notes */}
                      <td className="py-4 px-4 text-[#706B62]">
                        <div className="text-xs text-[#23201B] font-medium line-clamp-1">
                          {payment.description || "Corporate Subscription Transfer"}
                        </div>
                        {payment.notes && (
                          <div className="text-[10px] text-[#8C847B] mt-0.5 line-clamp-1 italic">
                            {payment.notes}
                          </div>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} />
                          <span>{payment.status || "Completed"}</span>
                        </span>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── Tab 2: School Invoicing Dues ── */}
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
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Students</th>
                    <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Total Contract Deal</th>
                    <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Paid Amount</th>
                    <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Outstanding Due</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                    <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">
                  {filteredSchools.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-[#8C847B]">
                        No schools found in database.
                      </td>
                    </tr>
                  ) : filteredSchools.map(school => {
                    const totalContract = Number(school.contract_amount || 0);
                    const paid = Number(school.paid_amount || 0);
                    const pending = Number(school.pending_amount || Math.max(0, totalContract - paid));
                    const isFullyPaid = pending <= 0;

                    return (
                      <tr key={school.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                        
                        <td className="py-4 px-5">
                          <div className="font-bold text-sm text-[#23201B]">{school.name}</div>
                          <div className="text-[11px] text-[#706B62] flex items-center gap-2 mt-0.5">
                            <span className="font-mono text-[#996B1E]">{school.code}</span>
                            <span>•</span>
                            <span>{school.principal_name || "Principal"}</span>
                            <span>•</span>
                            <span>{school.phone || "N/A"}</span>
                          </div>
                        </td>

                        <td className="py-4 px-3 text-center font-bold text-sm text-[#23201B]">
                          {(school.students_count || 0).toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-right font-mono font-bold text-[#23201B]">
                          PKR {totalContract.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-right font-mono font-bold text-emerald-700">
                          PKR {paid.toLocaleString()}
                        </td>

                        <td className="py-4 px-4 text-right font-mono font-bold text-red-700">
                          PKR {pending.toLocaleString()}
                        </td>

                        <td className="py-4 px-3 text-center">
                          {isFullyPaid ? (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 size={11} /> Settled
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock size={11} /> Due
                            </span>
                          )}
                        </td>

                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleOpenRecordModal(school)}
                              className="px-2.5 py-1 rounded-lg bg-[#23201B] hover:bg-[#3D382F] text-white font-bold text-[11px] transition-all flex items-center gap-1"
                              title="Record Payment for this School"
                            >
                              <Plus size={12} /> Record
                            </button>

                            <a
                              href={`https://wa.me/923152123010?text=Dear%20${encodeURIComponent(school.principal_name || school.name)}%2C%20fee%20invoice%20for%20${encodeURIComponent(school.name)}%20(Due:%20PKR%20${pending.toLocaleString()})%20is%20ready.`}
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

      </div>

      {/* ── Record Payment Modal ── */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between pb-4 border-b border-[#EBE5D9] mb-6">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">Record School Payment</h3>
                <p className="text-xs text-[#706B62]">Log incoming fee settlements, bank transfers, or cash deposits directly to MySQL.</p>
              </div>
              <button 
                onClick={() => setIsRecordModalOpen(false)}
                className="p-2 text-[#8C847B] hover:text-[#23201B] rounded-xl hover:bg-[#FAF8F5]"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleRecordPaymentSubmit} className="space-y-4">
              
              {/* Select School */}
              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">Select School / Campus *</label>
                <select
                  required
                  value={paymentForm.school_id}
                  onChange={(e) => {
                    const schId = e.target.value;
                    const sch = schools.find((s) => String(s.id) === String(schId));
                    setPaymentForm({
                      ...paymentForm,
                      school_id: schId,
                      amount: sch ? String(sch.pending_amount || 0) : paymentForm.amount,
                      description: sch ? `Monthly SaaS Settlement - ${sch.name}` : paymentForm.description,
                    });
                  }}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-semibold text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                >
                  <option value="">-- Choose School --</option>
                  {schools.map((sch) => (
                    <option key={sch.id} value={sch.id}>
                      {sch.name} ({sch.code}) — Due: PKR {Number(sch.pending_amount || 0).toLocaleString()}
                    </option>
                  ))}
                </select>
                {selectedSchoolObj && (
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#706B62] bg-[#FFFDF9] p-2 rounded-lg border border-[#F1EAD9]">
                    <span>Contract Deal: <strong className="text-[#23201B]">PKR {Number(selectedSchoolObj.contract_amount || 0).toLocaleString()}</strong></span>
                    <span>Pending Due: <strong className="text-red-700 font-mono">PKR {Number(selectedSchoolObj.pending_amount || 0).toLocaleString()}</strong></span>
                  </div>
                )}
              </div>

              {/* Amount & Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Payment Amount (PKR) *</label>
                  <input 
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="e.g. 50000"
                    value={paymentForm.amount}
                    onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-mono font-bold text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Payment Date *</label>
                  <input 
                    type="date"
                    required
                    value={paymentForm.payment_date}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-mono text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              {/* Payment Method & Target Account */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Payment Method *</label>
                  <select
                    value={paymentForm.payment_method}
                    onChange={(e) => setPaymentForm({ ...paymentForm, payment_method: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  >
                    <option value="Online Bank Transfer">Online Bank Transfer (1-Link / IBFT)</option>
                    <option value="Direct Bank Wire">Direct Bank Wire (HBL / Meezan)</option>
                    <option value="Cash Deposit">Cash Deposit</option>
                    <option value="Bank Cheque / Pay Order">Bank Cheque / Pay Order</option>
                    <option value="Raast / JazzCash / EasyPaisa">Raast / Digital Wallet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Receiving Account / Bank</label>
                  <input 
                    type="text"
                    placeholder="e.g. HBL Corporate A/C 0129-883719"
                    value={paymentForm.receiving_account}
                    onChange={(e) => setPaymentForm({ ...paymentForm, receiving_account: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              {/* Reference ID & Billing Month */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Transaction Ref / Slip No.</label>
                  <input 
                    type="text"
                    placeholder="e.g. TXN-998822 or Challan #1029"
                    value={paymentForm.reference}
                    onChange={(e) => setPaymentForm({ ...paymentForm, reference: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-mono text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] mb-1">Billing Month / Period</label>
                  <input 
                    type="text"
                    placeholder="e.g. October 2026 or Term 2"
                    value={paymentForm.month_for}
                    onChange={(e) => setPaymentForm({ ...paymentForm, month_for: e.target.value })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                  />
                </div>
              </div>

              {/* Description & Notes */}
              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">Payment Description</label>
                <input 
                  type="text"
                  placeholder="e.g. Monthly SaaS License Fee - October"
                  value={paymentForm.description}
                  onChange={(e) => setPaymentForm({ ...paymentForm, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#4A453E] mb-1">Internal Notes / Payer Details</label>
                <textarea 
                  rows={2}
                  placeholder="Optional depositor name, bank branch, or cheque number..."
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] focus:bg-white focus:outline-none focus:border-[#C4993C] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
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
                  <Check size={14} />
                  <span>Confirm & Record Payment</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
