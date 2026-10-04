"use client";

import { useState } from "react";
import { 
  DollarSign, CreditCard, Clock, TrendingUp, Search, Filter, 
  Download, Plus, Receipt, CheckCircle2, Printer, X, Calendar, Wallet
} from "lucide-react";
import { mockStudents } from "@/lib/mock-data";

interface SchoolExpense {
  id: string;
  title: string;
  category: "Staff Salaries" | "Electricity & Utilities" | "Lab & Books Supplies" | "Campus Maintenance" | "Exam & Stationery";
  amount: number;
  date: string;
  paymentMethod: string;
  status: "Completed";
}

const initialSchoolExpenses: SchoolExpense[] = [
  { id: "EXP-S01", title: "Faculty & Staff Monthly Payroll (86 Members)", category: "Staff Salaries", amount: 1850000, date: "2026-10-01", paymentMethod: "Bank Wire", status: "Completed" },
  { id: "EXP-S02", title: "Electricity & Solar Power Hybrid Bill (LESCO)", category: "Electricity & Utilities", amount: 145000, date: "2026-10-02", paymentMethod: "Online", status: "Completed" },
  { id: "EXP-S03", title: "Science Lab Chemical Reagents & Glassware", category: "Lab & Books Supplies", amount: 48000, date: "2026-10-04", paymentMethod: "Bank Transfer", status: "Completed" },
  { id: "EXP-S04", title: "Annual Exam Papers & Answer Sheets Printing", category: "Exam & Stationery", amount: 35000, date: "2026-10-05", paymentMethod: "Cash", status: "Completed" },
  { id: "EXP-S05", title: "Campus Air Conditioner Servicing & Maintenance", category: "Campus Maintenance", amount: 28000, date: "2026-09-28", paymentMethod: "Cash", status: "Completed" },
];

export default function AdminFees() {
  const [activeTab, setActiveTab] = useState<"fees" | "expenses" | "overview">("fees");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Fee Receipts State
  const [feeRecords, setFeeRecords] = useState([
    { id: "CHL-901", studentName: "Ali Hassan", rollNo: "10-A-01", class: "Class 10-A", amount: 8500, date: "2026-10-02", method: "Cash Counter", status: "Paid" },
    { id: "CHL-902", studentName: "Ayesha Khan", rollNo: "10-A-02", class: "Class 10-A", amount: 8500, date: "2026-10-02", method: "Habib Bank Online", status: "Paid" },
    { id: "CHL-903", studentName: "Omar Sheikh", rollNo: "10-B-01", class: "Class 10-B", amount: 8500, date: "2026-10-01", method: "EasyPaisa", status: "Paid" },
    { id: "CHL-904", studentName: "Zara Qureshi", rollNo: "9-A-01", class: "Class 9-A", amount: 7500, date: "2026-10-01", method: "Bank Deposit", status: "Paid" },
    { id: "CHL-905", studentName: "Bilal Nawaz", rollNo: "9-B-01", class: "Class 9-B", amount: 7500, date: "2026-09-30", method: "Cash Counter", status: "Paid" },
  ]);

  // School Expenses State
  const [expenses, setExpenses] = useState<SchoolExpense[]>(initialSchoolExpenses);

  // Modals State
  const [isCollectFeeModalOpen, setIsCollectFeeModalOpen] = useState(false);
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);

  // Collect Fee Form
  const [feeForm, setFeeForm] = useState({
    studentName: "Ali Hassan",
    rollNo: "10-A-01",
    class: "Class 10-A",
    amount: 8500,
    method: "Cash Counter",
  });

  // Expense Form
  const [expenseForm, setExpenseForm] = useState({
    title: "",
    category: "Staff Salaries" as SchoolExpense["category"],
    amount: 50000,
    paymentMethod: "Bank Wire",
    date: new Date().toISOString().split("T")[0],
  });

  const handleCollectFee = (e: React.FormEvent) => {
    e.preventDefault();
    const newRecord = {
      id: `CHL-${900 + feeRecords.length + 1}`,
      studentName: feeForm.studentName,
      rollNo: feeForm.rollNo,
      class: feeForm.class,
      amount: Number(feeForm.amount),
      date: new Date().toISOString().split("T")[0],
      method: feeForm.method,
      status: "Paid",
    };
    setFeeRecords([newRecord, ...feeRecords]);
    setIsCollectFeeModalOpen(false);
  };

  const handleAddExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.title || !expenseForm.amount) return;
    const newExpense: SchoolExpense = {
      id: `EXP-S0${expenses.length + 1}`,
      title: expenseForm.title,
      category: expenseForm.category,
      amount: Number(expenseForm.amount),
      date: expenseForm.date,
      paymentMethod: expenseForm.paymentMethod,
      status: "Completed",
    };
    setExpenses([newExpense, ...expenses]);
    setIsAddExpenseModalOpen(false);
    setExpenseForm({
      title: "",
      category: "Staff Salaries",
      amount: 50000,
      paymentMethod: "Bank Wire",
      date: new Date().toISOString().split("T")[0],
    });
  };

  // Calculations
  const totalFeesCollected = 4850000;
  const totalSchoolExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0) + 1250000;
  const netSurplus = totalFeesCollected - totalSchoolExpenses;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mb-1">
            School Financials & Fee Counter
          </h1>
          <p className="text-[#706B62] text-sm">
            Collect student fees, manage campus operating expenses & track net monthly surplus.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsAddExpenseModalOpen(true)}
            className="bg-white text-[#23201B] px-4 py-2.5 rounded-xl font-bold text-xs border border-[#D9D4CC] shadow-xs hover:bg-[#FAF8F5] transition-all flex items-center gap-1.5"
          >
            <Receipt size={14} className="text-red-600" />
            <span>Add School Expense</span>
          </button>

          <button 
            onClick={() => setIsCollectFeeModalOpen(true)}
            className="bg-[#23201B] hover:bg-[#3D382F] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
          >
            <Plus size={14} className="text-[#D4A843]" />
            <span>Collect Student Fee</span>
          </button>
        </div>
      </div>

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
            PKR {(totalFeesCollected / 1000000).toFixed(2)}M
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-1 block">↗ 96.4% collection rate</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total School Expenses</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <Receipt size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-red-700">
            PKR {(totalSchoolExpenses / 1000000).toFixed(2)}M
          </div>
          <span className="text-[10px] text-[#706B62] mt-1 block">Staff salaries & utilities included</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Net Monthly Surplus</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Wallet size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#996B1E]">
            PKR {(netSurplus / 1000000).toFixed(2)}M
          </div>
          <span className="text-[10px] text-[#706B62] mt-1 block">Surplus after all operational outlays</span>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Pending Dues</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-amber-700">PKR 350K</div>
          <span className="text-[10px] text-amber-700 font-semibold mt-1 block">18 students with pending dues</span>
        </div>

      </div>

      {/* ── Main Tabbed View ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs overflow-hidden flex flex-col">
        
        {/* Navigation Tabs */}
        <div className="p-4 border-b border-[#EBE5D9] flex flex-col sm:flex-row gap-3 justify-between items-center bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("fees")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "fees"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              Student Fee Collections ({feeRecords.length})
            </button>

            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "expenses"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              School Operating Expenses ({expenses.length})
            </button>

            <button
              onClick={() => setActiveTab("overview")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === "overview"
                  ? "bg-[#23201B] text-white shadow-xs"
                  : "bg-white border border-[#D9D4CC] text-[#706B62]"
              }`}
            >
              Financial P&L Overview
            </button>
          </div>

          <button 
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] flex items-center gap-1.5"
          >
            <Printer size={13} className="text-[#C4993C]" />
            <span>Print Financial Ledger</span>
          </button>
        </div>

        {/* ── TAB 1: FEES RECEIVED ── */}
        {activeTab === "fees" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                  <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Voucher / Receipt ID</th>
                  <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">Student & Class</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Date</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Payment Mode</th>
                  <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Amount Collected</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {feeRecords.map(fee => (
                  <tr key={fee.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-bold text-[#996B1E] bg-[#FAF3E5] px-2 py-1 rounded border border-[#EBE5D9]">
                        {fee.id}
                      </span>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-sm text-[#23201B]">{fee.studentName}</div>
                      <div className="text-[11px] text-[#706B62] mt-0.5">{fee.class} • Roll #{fee.rollNo}</div>
                    </td>
                    <td className="py-4 px-3 text-center text-[#706B62] font-mono">{fee.date}</td>
                    <td className="py-4 px-3 text-center font-semibold text-[#4A453E]">{fee.method}</td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-sm text-emerald-700">
                      PKR {fee.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} />
                        <span>{fee.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button 
                        onClick={() => alert(`Printing Receipt ${fee.id} for ${fee.studentName}`)}
                        className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5]"
                        title="Print Receipt"
                      >
                        <Printer size={13} className="text-[#C4993C]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 2: SCHOOL EXPENSES ── */}
        {activeTab === "expenses" && (
          <div className="overflow-x-auto">
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
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {expenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-5">
                      <span className="font-mono text-xs font-bold text-[#706B62] bg-[#FAF8F5] px-2 py-1 rounded border border-[#EBE5D9]">
                        {exp.id}
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
                    <td className="py-4 px-3 text-center text-[#706B62] font-mono">{exp.date}</td>
                    <td className="py-4 px-3 text-center font-semibold text-[#4A453E]">{exp.paymentMethod}</td>
                    <td className="py-4 px-5 text-right font-mono font-bold text-sm text-red-600">
                      - PKR {exp.amount.toLocaleString()}
                    </td>
                    <td className="py-4 px-3 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <CheckCircle2 size={11} />
                        <span>{exp.status}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── TAB 3: FINANCIAL P&L OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-xs font-bold uppercase text-emerald-800 tracking-wider block mb-1">Gross Tuition Inflows</span>
                <div className="font-serif font-bold text-2xl text-emerald-800">PKR {(totalFeesCollected / 1000000).toFixed(2)}M</div>
                <p className="text-[11px] text-emerald-700 mt-1">1,248 students across 28 sections</p>
              </div>

              <div className="p-5 rounded-2xl bg-red-50/60 border border-red-200">
                <span className="text-xs font-bold uppercase text-red-800 tracking-wider block mb-1">Operating Outflows</span>
                <div className="font-serif font-bold text-2xl text-red-800">PKR {(totalSchoolExpenses / 1000000).toFixed(2)}M</div>
                <p className="text-[11px] text-red-700 mt-1">Faculty salaries, utility bills, campus maintenance</p>
              </div>

              <div className="p-5 rounded-2xl bg-[#FAF3E5] border border-[#EBE5D9]">
                <span className="text-xs font-bold uppercase text-[#996B1E] tracking-wider block mb-1">Net Operating Surplus</span>
                <div className="font-serif font-bold text-2xl text-[#996B1E]">PKR {(netSurplus / 1000000).toFixed(2)}M</div>
                <p className="text-[11px] text-[#706B62] mt-1">Net surplus for school development & reserves</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] space-y-2 text-xs">
              <div className="font-bold text-[#23201B]">Expense Allocation Breakdown</div>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Faculty & Staff Salaries (60%)</span>
                    <strong>PKR 1,850,000</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C4993C] rounded-full" style={{ width: "60%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Electricity & Utilities (15%)</span>
                    <strong>PKR 145,000</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "15%" }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span>Science Labs & Exam Supplies (10%)</span>
                    <strong>PKR 83,000</strong>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: "10%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── Collect Fee Modal ── */}
      {isCollectFeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EBE5D9]">
              <h3 className="font-serif font-bold text-xl text-[#23201B]">Collect Student Tuition Fee</h3>
              <button onClick={() => setIsCollectFeeModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCollectFee} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#23201B] mb-1">Student Name</label>
                <input
                  type="text"
                  required
                  value={feeForm.studentName}
                  onChange={e => setFeeForm({ ...feeForm, studentName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B] font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Roll Number</label>
                  <input
                    type="text"
                    required
                    value={feeForm.rollNo}
                    onChange={e => setFeeForm({ ...feeForm, rollNo: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Class</label>
                  <select
                    value={feeForm.class}
                    onChange={e => setFeeForm({ ...feeForm, class: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  >
                    <option>Class 10-A</option>
                    <option>Class 10-B</option>
                    <option>Class 9-A</option>
                    <option>Class 9-B</option>
                    <option>Class 8-A</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Fee Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    value={feeForm.amount}
                    onChange={e => setFeeForm({ ...feeForm, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Payment Method</label>
                  <select
                    value={feeForm.method}
                    onChange={e => setFeeForm({ ...feeForm, method: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  >
                    <option>Cash Counter</option>
                    <option>Habib Bank Online</option>
                    <option>EasyPaisa / JazzCash</option>
                    <option>Bank Deposit Slip</option>
                  </select>
                </div>
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
                  className="px-6 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-md"
                >
                  Record & Generate Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Add Expense Modal ── */}
      {isAddExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-md p-6 animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-[#EBE5D9]">
              <h3 className="font-serif font-bold text-xl text-[#23201B]">Record School Expense</h3>
              <button onClick={() => setIsAddExpenseModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-[#23201B] mb-1">Expense Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Science Lab chemicals & test tubes"
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
                    onChange={e => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
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
                    min={100}
                    value={expenseForm.amount}
                    onChange={e => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs font-bold text-[#23201B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Payment Method</label>
                  <select
                    value={expenseForm.paymentMethod}
                    onChange={e => setExpenseForm({ ...expenseForm, paymentMethod: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F5] border border-[#D9D4CC] rounded-xl text-xs text-[#23201B]"
                  >
                    <option>Bank Wire</option>
                    <option>Cash</option>
                    <option>Online Transfer</option>
                    <option>Cheque</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-[#23201B] mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseForm.date}
                    onChange={e => setExpenseForm({ ...expenseForm, date: e.target.value })}
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
                  className="px-6 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md"
                >
                  Save Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
