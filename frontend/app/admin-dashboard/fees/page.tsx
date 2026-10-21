"use client";

import { useEffect, useState } from "react";
import { 
  DollarSign, CreditCard, Clock, TrendingUp, Search, Filter, 
  Download, Plus, Receipt, CheckCircle2, Printer, X, Calendar, Wallet,
  Loader2, AlertCircle, Trash2, FileText, ArrowRight, Sparkles, Send
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { ModalPortal } from "@/components/ui/modal-portal";

interface FeePaymentItem {
  id: number;
  receipt_no: string;
  transaction_id: string;
  student_id: number;
  student_name?: string;
  roll_number?: string;
  class?: string;
  invoice_number?: string;
  amount: number;
  payment_method: string;
  payment_date: string;
  status: string;
}

interface SchoolExpenseItem {
  id: number;
  expense_id?: string;
  title: string;
  category: string;
  amount: number;
  expense_date: string;
  payment_method: string;
  status: string;
}

interface FeeInvoiceItem {
  id: number;
  invoice_number: string;
  title: string;
  student_id: number;
  student_name: string;
  roll_number?: string;
  class?: string;
  amount: number;
  paid_amount: number;
  due_amount: number;
  due_date: string;
  month?: string;
  status: string;
}

interface ClassOption {
  id: number;
  name: string;
  section?: string;
  monthly_fee?: number;
}

export default function AdminFees() {
  const [activeTab, setActiveTab] = useState<"fees" | "invoices" | "expenses" | "overview">("invoices");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Live Data State
  const [payments, setPayments] = useState<FeePaymentItem[]>([]);
  const [expenses, setExpenses] = useState<SchoolExpenseItem[]>([]);
  const [invoices, setInvoices] = useState<FeeInvoiceItem[]>([]);
  const [classes, setClasses] = useState<ClassOption[]>([]);

  // Search & Filter
  const [invoiceSearch, setInvoiceSearch] = useState("");
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState("");

  // Modals State
  const [isCollectFeeModalOpen, setIsCollectFeeModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isGenerateInvoicesModalOpen, setIsGenerateInvoicesModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  useBodyScrollLock(isCollectFeeModalOpen || isAddExpenseModalOpen || isGenerateInvoicesModalOpen);

  // Current month default string: e.g. "October 2026"
  const currentMonthName = new Date().toLocaleString("default", { month: "long", year: "numeric" });
  const defaultDueDate = new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

  // Collect Fee Form
  const [feeForm, setFeeForm] = useState({
    fee_invoice_id: "",
    amount: "5000",
    payment_method: "Cash Counter",
    payment_date: new Date().toISOString().split("T")[0]
  });

  // Generate Invoices Form
  const [generateForm, setGenerateForm] = useState({
    class_id: "", // "" means all classes
    month: currentMonthName,
    due_date: defaultDueDate,
  });

  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "Staff Salaries",
    amount: "25000",
    payment_method: "Bank Wire",
    expense_date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [paymentsRes, expensesRes, invoicesRes, classesRes] = await Promise.allSettled([
        apiFetch<any>("/admin/fees/payments?per_page=100"),
        apiFetch<any>("/admin/expenses?per_page=100"),
        apiFetch<any>("/admin/fees/invoices?per_page=150"),
        apiFetch<any>("/admin/classes"),
      ]);

      if (paymentsRes.status === "fulfilled") {
        setPayments(paymentsRes.value.data || []);
      }
      if (expensesRes.status === "fulfilled") {
        setExpenses(expensesRes.value.data || []);
      }
      if (invoicesRes.status === "fulfilled") {
        setInvoices(invoicesRes.value.data || []);
      }
      if (classesRes.status === "fulfilled") {
        const clsData = Array.isArray(classesRes.value) ? classesRes.value : (classesRes.value.data || []);
        setClasses(clsData);
      }
    } catch (err: any) {
      console.error("Error loading financials:", err);
      setError(err?.message || "Failed to load financial records");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCollectFeeForInvoice = (inv: FeeInvoiceItem) => {
    setFeeForm({
      fee_invoice_id: String(inv.id),
      amount: String(inv.due_amount > 0 ? inv.due_amount : inv.amount),
      payment_method: "Cash Counter",
      payment_date: new Date().toISOString().split("T")[0]
    });
    setModalError(null);
    setIsCollectFeeModalOpen(true);
  };

  const handleCollectFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feeForm.fee_invoice_id) {
      setModalError("Please select an invoice to collect fee for");
      return;
    }
    try {
      setSubmitting(true);
      setModalError(null);
      await apiFetch("/admin/fees/payments", {
        method: "POST",
        body: JSON.stringify({
          fee_invoice_id: parseInt(feeForm.fee_invoice_id),
          amount: parseFloat(feeForm.amount),
          payment_method: feeForm.payment_method,
          payment_date: feeForm.payment_date
        })
      });
      setIsCollectFeeModalOpen(false);
      setSuccessMsg("Fee payment recorded successfully. Receipt generated.");
      setTimeout(() => setSuccessMsg(null), 5000);
      fetchData();
    } catch (err: any) {
      setModalError(err?.message || "Failed to record payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGenerateInvoices = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setModalError(null);
      const res = await apiFetch<any>("/admin/fees/invoices/generate", {
        method: "POST",
        body: JSON.stringify({
          month: generateForm.month,
          due_date: generateForm.due_date,
          class_id: generateForm.class_id ? parseInt(generateForm.class_id) : null,
        })
      });

      setIsGenerateInvoicesModalOpen(false);
      setSuccessMsg(res?.message || `Monthly invoices for ${generateForm.month} generated successfully!`);
      setTimeout(() => setSuccessMsg(null), 6000);
      setActiveTab("invoices");
      fetchData();
    } catch (err: any) {
      setModalError(err?.message || "Failed to generate invoices");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setModalError(null);
      await apiFetch("/admin/expenses", {
        method: "POST",
        body: JSON.stringify({
          title: expenseForm.title,
          category: expenseForm.category,
          amount: parseFloat(expenseForm.amount),
          payment_method: expenseForm.payment_method,
          expense_date: expenseForm.expense_date
        })
      });
      setIsAddExpenseModalOpen(false);
      setExpenseForm({
        title: "",
        category: "Staff Salaries",
        amount: "25000",
        payment_method: "Bank Wire",
        expense_date: new Date().toISOString().split("T")[0],
      });
      setSuccessMsg("School operating expense recorded.");
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchData();
    } catch (err: any) {
      setModalError(err?.message || "Failed to record expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: number) => {
    if (!confirm("Are you sure you want to delete this expense record?")) return;
    try {
      await apiFetch(`/admin/expenses/${id}`, { method: "DELETE" });
      setSuccessMsg("Expense deleted successfully.");
      setTimeout(() => setSuccessMsg(null), 4000);
      fetchData();
    } catch (err: any) {
      alert(err?.message || "Failed to delete expense");
    }
  };

  // Live Calculations from Database
  const totalFeesCollected = payments.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const totalSchoolExpenses = expenses.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);
  const netSurplus = totalFeesCollected - totalSchoolExpenses;
  const pendingDues = invoices.reduce((acc, curr) => acc + (Number(curr.due_amount) || 0), 0);
  const overdueCount = invoices.filter(i => Number(i.due_amount) > 0).length;

  const filteredInvoices = invoices.filter(inv => {
    const term = invoiceSearch.toLowerCase();
    const matchName = (inv.student_name || "").toLowerCase().includes(term);
    const matchInv = (inv.invoice_number || "").toLowerCase().includes(term);
    const matchTitle = (inv.title || "").toLowerCase().includes(term);
    const matchClass = (inv.class || "").toLowerCase().includes(term);
    const statusMatch = !invoiceStatusFilter || inv.status === invoiceStatusFilter;
    return (matchName || matchInv || matchTitle || matchClass) && statusMatch;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            School Financials & Fee Counter
          </h1>
          <p className="text-[#706B62] text-sm">
            Generate monthly fee invoices, record student payments, track opening arrears, and manage campus operating expenses.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button 
            onClick={() => {
              setModalError(null);
              setIsGenerateInvoicesModalOpen(true);
            }}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-xs transition-all flex items-center gap-1.5"
          >
            <Sparkles size={14} />
            <span>Generate Monthly Invoices</span>
          </button>

          <button 
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="bg-white text-[#23201B] px-4 py-2.5 rounded-xl font-bold text-xs border border-[#D9D4CC] shadow-xs hover:bg-[#FAF8F5] transition-all flex items-center gap-1.5"
          >
            <Receipt size={14} className="text-red-600" />
            <span>Add School Expense</span>
          </button>

          <button 
            onClick={() => {
              const pendingInv = invoices.find(i => Number(i.due_amount) > 0);
              setFeeForm({
                fee_invoice_id: pendingInv ? String(pendingInv.id) : (invoices[0]?.id ? String(invoices[0].id) : ""),
                amount: pendingInv ? String(pendingInv.due_amount) : "5000",
                payment_method: "Cash Counter",
                payment_date: new Date().toISOString().split("T")[0]
              });
              setModalError(null);
              setIsCollectFeeModalOpen(true);
            }}
            className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus size={14} className="text-[#D4A843]" />
            <span>Collect Student Fee</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 animate-in fade-in">
          <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0" />
          <span className="font-semibold text-sm">{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total Fees Collected</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-emerald-700">
            PKR {totalFeesCollected.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">
            {payments.length} verified payment receipts
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total School Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Receipt size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-red-700">
            PKR {totalSchoolExpenses.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#706B62] mt-1 block">
            {expenses.length} operational outlays posted
          </span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Net Monthly Surplus</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Wallet size={16} />
            </div>
          </div>
          <div className={`text-2xl font-serif font-bold ${netSurplus >= 0 ? "text-[#996B1E]" : "text-red-700"}`}>
            PKR {netSurplus.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#706B62] mt-1 block">Inflows minus operating outlays</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Pending Student Dues</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700">
            PKR {pendingDues.toLocaleString()}
          </div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">
            {overdueCount} student invoices with balance due
          </span>
        </div>

      </div>

      {/* ── Main Tabbed View ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs overflow-hidden flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="p-4 border-b border-[#EBE5D9] flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#FAF8F5]">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab("invoices")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "invoices"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              <FileText size={13} />
              <span>Student Invoices & Dues ({invoices.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("fees")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "fees"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              <CheckCircle2 size={13} />
              <span>Fee Receipts ({payments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "expenses"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              <Receipt size={13} />
              <span>Operating Expenses ({expenses.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "overview"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              <TrendingUp size={13} />
              <span>P&L Overview</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button 
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] flex items-center gap-1.5 hover:bg-[#FAF8F5]"
            >
              <Printer size={13} className="text-[#C4993C]" />
              <span>Print Ledger</span>
            </button>
          </div>
        </div>

        {/* ── TAB 1: INVOICES & STUDENT DUES ── */}
        {activeTab === "invoices" && (
          <div>
            {/* Search and Filters */}
            <div className="p-4 border-b border-[#EBE5D9] bg-[#FAF8F5]/60 flex flex-col sm:flex-row gap-3 justify-between items-center">
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                <input 
                  type="text" 
                  placeholder="Search invoice #, student name, roll #..."
                  value={invoiceSearch}
                  onChange={e => setInvoiceSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] placeholder:text-slate-400 focus:outline-none focus:border-[#23201B]"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={invoiceStatusFilter}
                  onChange={e => setInvoiceStatusFilter(e.target.value)}
                  className="px-3 py-2 bg-white border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] font-medium"
                >
                  <option value="">All Statuses</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Partial">Partial</option>
                  <option value="Paid">Paid</option>
                  <option value="Overdue">Overdue</option>
                </select>

                <button
                  onClick={() => setIsGenerateInvoicesModalOpen(true)}
                  className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Sparkles size={13} />
                  <span>New Invoice Batch</span>
                </button>
              </div>
            </div>

            <div className="overflow-x-auto min-h-[250px]">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                  <span>Loading student fee invoices...</span>
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="py-20 text-center text-slate-500 text-xs">
                  No invoices found matching criteria. Click &quot;New Invoice Batch&quot; to generate monthly invoices.
                </div>
              ) : (
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                      <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Invoice No</th>
                      <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Student & Class</th>
                      <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider">Title / Month</th>
                      <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Total Amount</th>
                      <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Paid</th>
                      <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Due Amount</th>
                      <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Due Date</th>
                      <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                      <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2EFE9]">
                    {filteredInvoices.map(inv => {
                      const isPaid = Number(inv.due_amount) <= 0.01;
                      const isArrears = inv.invoice_number?.startsWith("BAL-");

                      return (
                        <tr key={inv.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3.5 px-5">
                            <span className={`font-mono text-xs font-bold px-2 py-1 rounded border ${isArrears ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-[#FAF3E5] text-[#996B1E] border-[#EBE5D9]'}`}>
                              {inv.invoice_number || `INV-${inv.id}`}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <div className="font-bold text-sm text-[#23201B]">{inv.student_name || `Student #${inv.student_id}`}</div>
                            <div className="text-[11px] text-[#706B62] mt-0.5">
                              {inv.class ? `${inv.class} • ` : ""}Roll: {inv.roll_number || '—'}
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-slate-800">{inv.title}</div>
                            {inv.month && <div className="text-[10px] text-slate-400 font-medium">{inv.month}</div>}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-700">
                            PKR {Number(inv.amount).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono text-emerald-700 font-semibold">
                            PKR {Number(inv.paid_amount).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono font-bold text-amber-800">
                            PKR {Number(inv.due_amount).toLocaleString()}
                          </td>
                          <td className="py-3.5 px-3 text-center text-[#706B62] font-mono text-[11px]">
                            {inv.due_date || "—"}
                          </td>
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === "Paid" 
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : inv.status === "Partial"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : inv.status === "Overdue"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}>
                              {inv.status || "Unpaid"}
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-right">
                            {!isPaid ? (
                              <button
                                onClick={() => openCollectFeeForInvoice(inv)}
                                className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-[11px] transition-colors shadow-xs"
                              >
                                Collect Fee
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-semibold flex items-center justify-end gap-1">
                                <CheckCircle2 size={13} /> Paid
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: FEES RECEIVED (RECEIPTS) ── */}
        {activeTab === "fees" && (
          <div className="overflow-x-auto min-h-[250px]">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <span>Loading fee payment records...</span>
              </div>
            ) : payments.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm">
                No fee collection records found. Click &quot;Collect Student Fee&quot; to record your first receipt.
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                    <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Receipt No</th>
                    <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Student & Class</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Payment Date</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Payment Mode</th>
                    <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Amount Collected</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">
                  {payments.map(fee => (
                    <tr key={fee.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs font-bold text-[#996B1E] bg-[#FAF3E5] px-2 py-1 rounded border border-[#EBE5D9]">
                          {fee.receipt_no || `RCP-${fee.id}`}
                        </span>
                      </td>
                      <td className="py-4 px-5">
                        <div className="font-bold text-sm text-[#23201B]">{fee.student_name || `Student #${fee.student_id}`}</div>
                        <div className="text-[11px] text-[#706B62] mt-0.5">
                          {fee.class ? `${fee.class} • ` : ""}Roll #{fee.roll_number || fee.student_id}
                        </div>
                      </td>
                      <td className="py-4 px-3 text-center text-[#706B62] font-mono">{fee.payment_date}</td>
                      <td className="py-4 px-3 text-center font-semibold text-[#4A453E]">{fee.payment_method}</td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-sm text-emerald-700">
                        PKR {Number(fee.amount).toLocaleString()}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} />
                          <span>{fee.status || "Completed"}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── TAB 3: SCHOOL EXPENSES ── */}
        {activeTab === "expenses" && (
          <div className="overflow-x-auto min-h-[250px]">
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-2" />
                <span>Loading operating expenses...</span>
              </div>
            ) : expenses.length === 0 ? (
              <div className="py-20 text-center text-slate-500 text-sm">
                No school expenses logged. Click &quot;Add School Expense&quot; to record outlays.
              </div>
            ) : (
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                    <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Expense ID</th>
                    <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Description</th>
                    <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider">Category</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Date</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Payment Mode</th>
                    <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Amount Paid</th>
                    <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                    <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EFE9]">
                  {expenses.map(exp => (
                    <tr key={exp.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                      <td className="py-4 px-5">
                        <span className="font-mono text-xs font-bold text-[#706B62] bg-[#FAF8F5] px-2 py-1 rounded border border-[#EBE5D9]">
                          {exp.expense_id || `EXP-${exp.id}`}
                        </span>
                      </td>
                      <td className="py-4 px-5 font-bold text-sm text-[#23201B]">
                        {exp.title}
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 rounded-md bg-[#FAF3E5] text-[#996B1E] font-bold text-[11px] border border-[#EBE5D9]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-4 px-3 text-center text-[#706B62] font-mono">{exp.expense_date}</td>
                      <td className="py-4 px-3 text-center font-semibold text-[#4A453E]">{exp.payment_method}</td>
                      <td className="py-4 px-5 text-right font-mono font-bold text-sm text-red-600">
                        - PKR {Number(exp.amount).toLocaleString()}
                      </td>
                      <td className="py-4 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <CheckCircle2 size={11} />
                          <span>{exp.status || "Completed"}</span>
                        </span>
                      </td>
                      <td className="py-4 px-5 text-right">
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                          title="Delete expense"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ── TAB 4: FINANCIAL P&L OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider block mb-1">Gross Tuition Inflows</span>
                <div className="font-serif font-bold text-2xl text-emerald-800">
                  PKR {totalFeesCollected.toLocaleString()}
                </div>
                <p className="text-[11px] text-emerald-700 mt-1">
                  From {payments.length} student payment receipts
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200">
                <span className="text-xs font-bold uppercase text-red-800 tracking-wider block mb-1">Operating Outflows</span>
                <div className="font-serif font-bold text-2xl text-red-800">
                  PKR {totalSchoolExpenses.toLocaleString()}
                </div>
                <p className="text-[11px] text-red-700 mt-1">
                  Faculty payroll, utility bills, campus supplies
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF3E5] border border-[#EBE5D9]">
                <span className="text-xs font-bold uppercase text-[#996B1E] tracking-wider block mb-1">Net Operating Surplus</span>
                <div className={`font-serif font-bold text-2xl ${netSurplus >= 0 ? "text-[#996B1E]" : "text-red-700"}`}>
                  PKR {netSurplus.toLocaleString()}
                </div>
                <p className="text-[11px] text-[#706B62] mt-1">Live surplus balance from active database ledgers</p>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Generate Invoices Modal ── */}
      {isGenerateInvoicesModalOpen && (
        <ModalPortal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EBE5D9]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-800">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#23201B]">Generate Monthly Invoices</h3>
                  <p className="text-xs text-slate-500">Auto-create fee invoices for active students based on class tuition.</p>
                </div>
              </div>
              <button onClick={() => setIsGenerateInvoicesModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleGenerateInvoices} className="space-y-4 text-xs">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#23201B] mb-1">Target Class *</label>
                <select
                  value={generateForm.class_id}
                  onChange={e => setGenerateForm({ ...generateForm, class_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-medium text-[#23201B]"
                >
                  <option value="">All Classes (Batch for Entire School)</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} {c.section ? `(${c.section})` : ''} — Fee: PKR {c.monthly_fee || 5000}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Each student will be billed their class tuition fee.
                </p>
              </div>

              <div>
                <label className="block font-bold text-[#23201B] mb-1">Billing Month / Term *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. October 2026"
                  value={generateForm.month}
                  onChange={e => setGenerateForm({ ...generateForm, month: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                />
              </div>

              <div>
                <label className="block font-bold text-[#23201B] mb-1">Payment Due Date *</label>
                <input
                  type="date"
                  required
                  value={generateForm.due_date}
                  onChange={e => setGenerateForm({ ...generateForm, due_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsGenerateInvoicesModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] font-bold text-[#706B62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md flex items-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Generate Invoices Now</span>
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* ── Collect Fee Modal ── */}
      {isCollectFeeModalOpen && (
        <ModalPortal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EBE5D9]">
              <h3 className="font-serif font-bold text-xl text-[#23201B]">Collect Student Tuition Fee</h3>
              <button onClick={() => setIsCollectFeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="space-y-4 text-xs">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#23201B] mb-1">Select Student Invoice / Arrears *</label>
                <select
                  required
                  value={feeForm.fee_invoice_id}
                  onChange={e => {
                    const inv = invoices.find(i => String(i.id) === e.target.value);
                    setFeeForm({
                      ...feeForm,
                      fee_invoice_id: e.target.value,
                      amount: inv ? String(inv.due_amount > 0 ? inv.due_amount : inv.amount) : feeForm.amount
                    });
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] font-medium"
                >
                  <option value="">-- Choose Pending Invoice --</option>
                  {invoices.map(inv => (
                    <option key={inv.id} value={inv.id}>
                      {inv.invoice_number}: {inv.student_name} ({inv.class || 'Class'}) — Due: PKR {inv.due_amount}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Fee Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    step="50"
                    value={feeForm.amount}
                    onChange={e => setFeeForm({ ...feeForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Payment Method</label>
                  <select
                    value={feeForm.payment_method}
                    onChange={e => setFeeForm({ ...feeForm, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  >
                    <option value="Cash Counter">Cash Counter</option>
                    <option value="Habib Bank Online">Habib Bank Online</option>
                    <option value="EasyPaisa / JazzCash">EasyPaisa / JazzCash</option>
                    <option value="Bank Deposit Slip">Bank Deposit Slip</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-[#23201B] mb-1">Payment Date</label>
                <input
                  type="date"
                  value={feeForm.payment_date}
                  onChange={e => setFeeForm({ ...feeForm, payment_date: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsCollectFeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] font-bold text-[#706B62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md flex items-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Record & Generate Receipt</span>
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

      {/* ── Add Expense Modal ── */}
      {isAddExpenseModalOpen && (
        <ModalPortal className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EBE5D9]">
              <h3 className="font-serif font-bold text-xl text-[#23201B]">Record School Expense</h3>
              <button onClick={() => setIsAddExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              {modalError && (
                <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle size={14} />
                  <span>{modalError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-[#23201B] mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab chemicals & supplies"
                  value={expenseForm.title}
                  onChange={e => setExpenseForm({ ...expenseForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Category</label>
                  <select
                    value={expenseForm.category}
                    onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  >
                    <option value="Staff Salaries">Staff Salaries</option>
                    <option value="Electricity & Utilities">Electricity & Utilities</option>
                    <option value="Lab & Books Supplies">Lab & Books Supplies</option>
                    <option value="Campus Maintenance">Campus Maintenance</option>
                    <option value="Exam & Stationery">Exam & Stationery</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Amount (PKR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Payment Method</label>
                  <select
                    value={expenseForm.payment_method}
                    onChange={e => setExpenseForm({ ...expenseForm, payment_method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  >
                    <option value="Bank Wire">Bank Wire</option>
                    <option value="Cash">Cash</option>
                    <option value="Online Transfer">Online Transfer</option>
                    <option value="Cheque">Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseForm.expense_date}
                    onChange={e => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#EBE5D9]">
                <button
                  type="button"
                  onClick={() => setIsAddExpenseModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[#D9D4CC] font-bold text-[#706B62]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md flex items-center gap-2"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  <span>Save Expense</span>
                </button>
              </div>
            </form>
          </div>
        </ModalPortal>
      )}

    </div>
  );
}
