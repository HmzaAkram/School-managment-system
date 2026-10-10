"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, Download, CheckCircle2, Clock, AlertCircle, 
  CreditCard, ShieldCheck, ChevronRight, FileText, ArrowUpRight, 
  Receipt, X, Check, Printer, Building2, Loader2
} from "lucide-react";
import { apiFetch } from "@/lib/api";

interface InvoicePayment {
  id: number;
  amount: number;
  payment_date?: string;
  payment_method?: string;
}

interface FeeInvoiceItem {
  id: number;
  invoice_number: string;
  title: string;
  amount: number;
  paid_amount: number;
  due_amount: number;
  due_date: string;
  status: "Paid" | "Unpaid" | "Partial" | "Overdue";
  fee_structure?: {
    id: number;
    name: string;
    frequency?: string;
  };
  payments?: InvoicePayment[];
}

interface FeeStructureItem {
  id: number;
  name: string;
  amount: number;
  frequency?: string;
  description?: string;
  class?: string;
}

interface FeeSummaryResponse {
  summary: {
    billed: number;
    paid: number;
    due: number;
    collection_rate: number | null;
    invoice_count: number;
    overdue_count: number;
  };
  next_due?: FeeInvoiceItem | null;
  payments: Array<{
    id: number;
    receipt_no: string;
    amount: number;
    payment_method: string;
    payment_date: string;
    status: string;
  }>;
}

interface StudentProfile {
  name: string;
  roll_number?: string;
  class_name?: string;
  section_name?: string;
  school_name?: string;
  parent_name?: string;
}

export default function StudentFees() {
  const [invoices, setInvoices] = useState<FeeInvoiceItem[]>([]);
  const [summaryData, setSummaryData] = useState<FeeSummaryResponse | null>(null);
  const [feeStructures, setFeeStructures] = useState<FeeStructureItem[]>([]);
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [payModal, setPayModal] = useState<FeeInvoiceItem | null>(null);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<FeeInvoiceItem | null>(null);

  const loadFeeData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [invRes, sumRes, structRes, statsRes] = await Promise.all([
        apiFetch<any>("/student/invoices?per_page=100"),
        apiFetch<FeeSummaryResponse>("/student/invoices/summary"),
        apiFetch<FeeStructureItem[]>("/student/fee-structures").catch(() => []),
        apiFetch<any>("/student/stats").catch(() => null),
      ]);

      if (invRes?.data) setInvoices(invRes.data);
      else if (Array.isArray(invRes)) setInvoices(invRes);

      if (sumRes) setSummaryData(sumRes);
      if (Array.isArray(structRes)) setFeeStructures(structRes);

      if (statsRes?.student) {
        setStudentProfile({
          name: statsRes.student.name || `${statsRes.student.first_name || ""} ${statsRes.student.last_name || ""}`.trim() || "Student",
          roll_number: statsRes.student.roll_number || "—",
          class_name: statsRes.student.class_name || "Enrolled Class",
          section_name: statsRes.student.section_name || "",
          school_name: statsRes.student.school_name || "Oakridge Grammar School",
          parent_name: statsRes.student.parent_name || "Guardian",
        });
      }
    } catch (err: any) {
      console.error("Failed to load student fees:", err);
      setError(err.message || "Failed to load fee invoices and account standing");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFeeData();
  }, []);

  const handlePayConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setPayModal(null);
    setPaidSuccess(true);
    setTimeout(() => setPaidSuccess(false), 5000);
  };

  const activeInvoice = selectedInvoice || invoices[0] || null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            Student Fee Account & Invoices
          </h1>
          <p className="text-xs sm:text-sm text-[#706B62]">
            Tuition ledger, official institutional receipts, and 3-fold bank challan vouchers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {invoices.length > 0 && (
            <button 
              onClick={() => {
                setSelectedInvoice(invoices[0]);
                setIsChallanModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5"
            >
              <Printer size={14} className="text-[#C4993C]" />
              <span>Print 3-Fold Bank Challan</span>
            </button>
          )}
          
          {summaryData?.summary && summaryData.summary.due > 0 && (
            <button
              onClick={() => {
                const pendingInv = invoices.find((i) => i.status !== "Paid") || invoices[0];
                setPayModal(pendingInv || null);
              }}
              className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
            >
              <CreditCard size={14} className="text-[#D4A843]" />
              <span>Clear Outstanding Fee</span>
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}

      {/* Payment Success Alert */}
      {paidSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <p className="text-xs font-bold">
              Transaction Approved: Fee payment submitted and awaiting administrative verification.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Total Billed",
            value: `PKR ${(summaryData?.summary?.billed || 0).toLocaleString()}`,
            sub: `${summaryData?.summary?.invoice_count || invoices.length} total fee invoices`,
            icon: Receipt,
            color: "text-[#C4993C]",
            bg: "bg-[#FFFDF9] border-[#F1EAD9]"
          },
          {
            label: "Amount Cleared",
            value: `PKR ${(summaryData?.summary?.paid || 0).toLocaleString()}`,
            sub: summaryData?.summary?.collection_rate !== null && summaryData?.summary?.collection_rate !== undefined
              ? `${summaryData.summary.collection_rate}% settled`
              : "Bank & online receipts",
            icon: CheckCircle2,
            color: "text-emerald-700",
            bg: "bg-emerald-50/60 border-emerald-200/80"
          },
          {
            label: "Balance Due",
            value: `PKR ${(summaryData?.summary?.due || 0).toLocaleString()}`,
            sub: summaryData?.summary?.overdue_count ? `${summaryData.summary.overdue_count} overdue invoices` : "All dues in grace period",
            icon: AlertCircle,
            color: "text-amber-700",
            bg: "bg-amber-50/60 border-amber-200/80"
          },
          {
            label: "Account Standing",
            value: (summaryData?.summary?.due || 0) === 0 ? "Good" : summaryData?.summary?.overdue_count ? "Overdue" : "Pending",
            sub: (summaryData?.summary?.due || 0) === 0 ? "Zero outstanding balance" : "Payment required",
            icon: ShieldCheck,
            color: (summaryData?.summary?.due || 0) === 0 ? "text-emerald-700" : "text-blue-700",
            bg: (summaryData?.summary?.due || 0) === 0 ? "bg-emerald-50/60 border-emerald-200/80" : "bg-blue-50/60 border-blue-200/80"
          },
        ].map((stat, i) => (
          <div key={i} className={`p-5 rounded-2xl border ${stat.bg} shadow-sm`}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8C877D] uppercase tracking-wider">{stat.label}</span>
              <stat.icon size={18} className={stat.color} />
            </div>
            <div className="text-2xl font-extrabold text-[#23201B] font-sora">{stat.value}</div>
            <div className="text-xs text-[#706B62] mt-1 font-medium">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Fee Itemization Breakdown */}
      {feeStructures.length > 0 && (
        <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-4">
          <h2 className="font-bold text-base text-[#23201B] font-sora">Annual Fee Structure Breakdown</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {feeStructures.map((f) => (
              <div key={f.id} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
                <span className="text-[#8C877D] font-medium block mb-1">{f.name}</span>
                <div className="font-bold text-sm text-[#23201B]">PKR {Number(f.amount).toLocaleString()}</div>
                <div className="text-[10px] text-[#706B62] mt-0.5">{f.frequency || "Termly"}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment History Ledger */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-[#23201B] font-sora">Payment Receipts & Invoices</h2>
            <p className="text-xs text-[#8C877D]">Certified receipts generated for accounting and banking records.</p>
          </div>
          {invoices.length > 0 && (
            <button 
              onClick={() => {
                setSelectedInvoice(invoices[0]);
                setIsChallanModalOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-xl border border-[#D9D4CC] text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] flex items-center gap-1.5 shadow-sm"
            >
              <Printer size={13} className="text-[#C4993C]" />
              <span>Generate Bank Slip</span>
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#8C877D] space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-[#C4993C]" />
            <p className="text-sm font-medium">Loading fee ledger and invoice receipts...</p>
          </div>
        ) : invoices.length === 0 ? (
          <div className="p-12 text-center">
            <Receipt className="w-12 h-12 text-[#8C877D] mx-auto mb-3 opacity-40" />
            <h3 className="font-bold text-[#23201B] text-lg font-sora mb-1">No Invoices Issued</h3>
            <p className="text-xs text-[#706B62] max-w-sm mx-auto">
              There are no fee challans or invoices recorded for your account.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE8E2] text-[#706B62]">
                  <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Voucher #</th>
                  <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Billing Title</th>
                  <th className="text-right py-3.5 px-6 font-bold uppercase tracking-wider">Amount</th>
                  <th className="text-right py-3.5 px-6 font-bold uppercase tracking-wider">Paid Amount</th>
                  <th className="text-center py-3.5 px-6 font-bold uppercase tracking-wider">Due Date</th>
                  <th className="text-center py-3.5 px-6 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-6 font-bold uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#996B1E]">{inv.invoice_number || `INV-${inv.id}`}</td>
                    <td className="py-4 px-6 font-bold text-[#23201B]">{inv.title || inv.fee_structure?.name || "Tuition Fee"}</td>
                    <td className="py-4 px-6 text-right font-mono font-bold text-sm text-[#23201B]">
                      PKR {Number(inv.amount).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-right font-mono text-[#706B62]">
                      PKR {Number(inv.paid_amount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-center text-[#706B62]">{inv.due_date || "—"}</td>
                    <td className="py-4 px-6 text-center">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        inv.status === "Paid" 
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                          : inv.status === "Overdue"
                          ? "bg-rose-50 text-rose-700 border border-rose-200"
                          : "bg-amber-50 text-amber-800 border border-amber-200" 
                      }`}>
                        {inv.status === "Paid" ? <CheckCircle2 size={11} /> : <Clock size={11} />}
                        <span>{inv.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => {
                            setSelectedInvoice(inv);
                            setIsChallanModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5]"
                          title="View 3-Fold Challan"
                        >
                          <FileText size={13} className="text-[#C4993C]" />
                        </button>

                        {inv.status !== "Paid" && (
                          <button
                            onClick={() => setPayModal(inv)}
                            className="px-3 py-1 bg-[#23201B] hover:bg-[#3D382F] text-white rounded-lg font-bold text-[11px] transition-all shadow-xs"
                          >
                            Pay Online
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── 3-Fold Bank Challan Modal Template (Standard Pakistani Voucher) ── */}
      {isChallanModalOpen && activeInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-5xl p-6 sm:p-8 animate-in zoom-in-95 max-h-[92vh] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE5D9] mb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">Official 3-Fold Bank Deposit Challan</h3>
                <p className="text-xs text-[#706B62]">Deposit payable at partner commercial bank branches nationwide.</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#23201B] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Printer size={13} className="text-[#D4A843]" />
                  <span>Print Slip</span>
                </button>
                <button onClick={() => setIsChallanModalOpen(false)} className="text-[#8C847B] hover:text-[#23201B]">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* 3-Fold Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-dashed border-[#D9D4CC] p-4 rounded-2xl bg-[#FFFDF9] overflow-y-auto text-[11px]">
              {["1. BANK COPY", "2. SCHOOL COPY", "3. STUDENT COPY"].map((copyTitle, copyIdx) => (
                <div key={copyIdx} className={`p-4 border ${copyIdx < 2 ? 'md:border-r border-[#D9D4CC]' : ''} bg-white rounded-xl flex flex-col justify-between space-y-3`}>
                  {/* Header */}
                  <div className="text-center pb-2 border-b border-[#EBE5D9]">
                    <div className="font-serif font-bold text-sm text-[#23201B]">
                      {studentProfile?.school_name || "OAKRIDGE GRAMMAR SCHOOL"}
                    </div>
                    <div className="text-[9px] text-[#706B62]">Finance & Accounts Department</div>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#23201B] text-white font-mono font-bold text-[9px]">
                      {copyTitle}
                    </div>
                  </div>

                  {/* Bank Account */}
                  <div className="bg-[#FAF8F5] p-2 rounded-lg border border-[#EBE5D9] text-[10px] space-y-0.5">
                    <div><strong>Bank:</strong> Habib Bank Limited (HBL) / Allied Bank</div>
                    <div><strong>A/C Title:</strong> {studentProfile?.school_name || "Oakridge Educational Trust"}</div>
                    <div><strong>A/C No:</strong> 0129-883719-01</div>
                    <div className="text-[#996B1E] font-mono"><strong>Challan #:</strong> {activeInvoice.invoice_number || `INV-${activeInvoice.id}`}</div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between"><span>Student:</span><strong>{studentProfile?.name || "Student"}</strong></div>
                    <div className="flex justify-between"><span>Guardian:</span><span>{studentProfile?.parent_name || "Parent/Guardian"}</span></div>
                    <div className="flex justify-between"><span>Roll No:</span><strong className="font-mono">{studentProfile?.roll_number || "—"}</strong></div>
                    <div className="flex justify-between"><span>Class:</span><span>{studentProfile?.class_name || "Active Grade"} {studentProfile?.section_name ? `(${studentProfile.section_name})` : ""}</span></div>
                    <div className="flex justify-between"><span>Due Date:</span><strong className="text-red-700">{activeInvoice.due_date || "—"}</strong></div>
                  </div>

                  {/* Fee Items */}
                  <table className="w-full text-[10px] border-t border-b border-[#EBE5D9] my-1">
                    <tbody>
                      <tr>
                        <td className="py-0.5">{activeInvoice.title || "Tuition Fee"}:</td>
                        <td className="text-right font-mono">PKR {Number(activeInvoice.amount).toLocaleString()}</td>
                      </tr>
                      {activeInvoice.paid_amount > 0 && (
                        <tr>
                          <td className="py-0.5 text-emerald-700">Less Paid:</td>
                          <td className="text-right font-mono text-emerald-700">- PKR {Number(activeInvoice.paid_amount).toLocaleString()}</td>
                        </tr>
                      )}
                      <tr className="font-bold border-t border-[#EBE5D9] text-[#23201B]">
                        <td className="py-1">Net Payable:</td>
                        <td className="text-right font-mono text-emerald-700">PKR {Number(activeInvoice.due_amount ?? activeInvoice.amount).toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>

                  {/* Barcode & Signature */}
                  <div className="pt-2 text-center text-[9px] text-[#8C847B] space-y-2">
                    <div className="font-mono tracking-widest text-[#23201B] font-bold">
                      ||| | |||| | ||||| |||| | |||
                    </div>
                    <div className="border border-dashed border-slate-300 h-10 rounded flex items-center justify-center text-slate-400">
                      Bank Cashier Stamp & Signature
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-4 mt-2 border-t border-[#EBE5D9] text-xs text-[#706B62]">
              <span>Note: A late surcharge of PKR 500 will apply if paid after the stipulated due date.</span>
              <button
                onClick={() => setIsChallanModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#23201B] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <div>
                <h3 className="font-bold text-[#23201B] text-base font-sora">Tuition Fee Checkout</h3>
                <p className="text-xs text-[#8C877D]">
                  {payModal.invoice_number || `INV-${payModal.id}`} • PKR {Number(payModal.due_amount ?? payModal.amount).toLocaleString()}
                </p>
              </div>
              <button onClick={() => setPayModal(null)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePayConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">
                  Card / 1-Link Account Number
                </label>
                <input
                  type="text"
                  placeholder="4242 •••• •••• 4242"
                  required
                  defaultValue="4242 8812 9901 3410"
                  className="w-full text-xs font-mono border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5] focus:border-[#C4993C]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    required
                    defaultValue="12/28"
                    className="w-full text-xs font-mono border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">CVC / PIN</label>
                  <input
                    type="password"
                    placeholder="•••"
                    required
                    defaultValue="891"
                    className="w-full text-xs font-mono border border-[#D9D4CC] rounded-xl p-3 outline-none bg-[#FAF8F5]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPayModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold shadow-md hover:from-[#B3882B] hover:to-[#C4993C]"
                >
                  Confirm PKR {Number(payModal.due_amount ?? payModal.amount).toLocaleString()}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
