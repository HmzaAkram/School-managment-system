"use client";

import { useState } from "react";
import { 
  DollarSign, Download, CheckCircle2, Clock, AlertCircle, 
  CreditCard, ShieldCheck, ChevronRight, FileText, ArrowUpRight, 
  Receipt, X, Check, Printer, Building2
} from "lucide-react";

export default function StudentFees() {
  const [payModal, setPayModal] = useState(false);
  const [paidSuccess, setPaidSuccess] = useState(false);
  const [isChallanModalOpen, setIsChallanModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState({
    id: "CHL-2026-1029",
    term: "October 2026 Monthly Tuition",
    amount: "PKR 15,000.00",
    due: "10-Oct-2026",
    student: "Ali Hassan",
    rollNo: "10-A-01",
    class: "Class 10-A",
    father: "Muhammad Hassan",
  });

  const handlePayConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setPayModal(false);
    setPaidSuccess(true);
    setTimeout(() => setPaidSuccess(false), 5000);
  };

  const invoices = [
    { id: "CHL-2026-1029", term: "Academic Term 2 (Mid-Year Tuition)", amount: "PKR 15,000.00", due: "10-Oct-2026", status: "Pending", paidOn: "—" },
    { id: "CHL-2026-0918", term: "Academic Term 1 (Fall Tuition)", amount: "PKR 20,000.00", due: "15-Sep-2026", status: "Paid", paidOn: "12-Sep-2026" },
    { id: "CHL-2026-0805", term: "Annual Examination & Science Lab Fee", amount: "PKR 8,500.00", due: "15-Aug-2026", status: "Paid", paidOn: "14-Aug-2026" },
  ];

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
          <button 
            onClick={() => setIsChallanModalOpen(true)}
            className="px-4 py-2 rounded-xl border border-[#D9D4CC] bg-white text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5"
          >
            <Printer size={14} className="text-[#C4993C]" />
            <span>📄 Print 3-Fold Bank Challan</span>
          </button>
          
          <button
            onClick={() => setPayModal(true)}
            className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <CreditCard size={14} className="text-[#D4A843]" />
            <span>Clear Outstanding Fee</span>
          </button>
        </div>
      </div>

      {/* Payment Success Alert */}
      {paidSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-700" />
            <p className="text-xs font-bold">
              Transaction Approved: Fee voucher #CHL-2026-1029 has been cleared and recorded to your ledger.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Tuition", value: "PKR 50,000", sub: "Academic year 2026-27", icon: Receipt, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Amount Paid", value: "PKR 28,500", sub: "Cleared via online gateway / Bank", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Balance Due", value: "PKR 15,000", sub: "Due by Oct 10, 2026", icon: AlertCircle, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Account Standing", value: "Good", sub: "Zero penalties or late fines", icon: ShieldCheck, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
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
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm p-6 space-y-4">
        <h2 className="font-bold text-base text-[#23201B] font-sora">Annual Fee Structure Breakdown</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
            <span className="text-[#8C877D] font-medium block mb-1">Instruction & Faculty</span>
            <div className="font-bold text-sm text-[#23201B]">PKR 35,000.00</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
            <span className="text-[#8C877D] font-medium block mb-1">Laboratory & STEM Materials</span>
            <div className="font-bold text-sm text-[#23201B]">PKR 6,500.00</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
            <span className="text-[#8C877D] font-medium block mb-1">Digital LMS & Cloud Portal</span>
            <div className="font-bold text-sm text-[#23201B]">PKR 4,500.00</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
            <span className="text-[#8C877D] font-medium block mb-1">Sports Facilities & Library</span>
            <div className="font-bold text-sm text-[#23201B]">PKR 4,000.00</div>
          </div>
        </div>
      </div>

      {/* Payment History Ledger */}
      <div className="bg-white rounded-2xl border border-[#EBE8E2] shadow-sm overflow-hidden">
        <div className="p-5 border-b border-[#EBE8E2] flex items-center justify-between">
          <div>
            <h2 className="font-bold text-base text-[#23201B] font-sora">Payment Receipts & Invoices</h2>
            <p className="text-xs text-[#8C877D]">Certified receipts generated for tax and banking records.</p>
          </div>
          <button 
            onClick={() => setIsChallanModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl border border-[#D9D4CC] text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] flex items-center gap-1.5 shadow-sm"
          >
            <Printer size={13} className="text-[#C4993C]" />
            <span>Generate Bank Slip</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EBE8E2] text-[#706B62]">
                <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Voucher #</th>
                <th className="text-left py-3.5 px-6 font-bold uppercase tracking-wider">Billing Term</th>
                <th className="text-right py-3.5 px-6 font-bold uppercase tracking-wider">Amount</th>
                <th className="text-center py-3.5 px-6 font-bold uppercase tracking-wider">Due Date</th>
                <th className="text-center py-3.5 px-6 font-bold uppercase tracking-wider">Paid On</th>
                <th className="text-center py-3.5 px-6 font-bold uppercase tracking-wider">Status</th>
                <th className="text-right py-3.5 px-6 font-bold uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#996B1E]">{inv.id}</td>
                  <td className="py-4 px-6 font-bold text-[#23201B]">{inv.term}</td>
                  <td className="py-4 px-6 text-right font-mono font-bold text-sm text-[#23201B]">{inv.amount}</td>
                  <td className="py-4 px-6 text-center text-[#706B62]">{inv.due}</td>
                  <td className="py-4 px-6 text-center text-[#706B62]">{inv.paidOn}</td>
                  <td className="py-4 px-6 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inv.status === "Paid" 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : inv.status === "Pending" 
                        ? "bg-amber-50 text-amber-800 border border-amber-200" 
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {inv.status === "Paid" && <CheckCircle2 size={11} />}
                      {inv.status === "Pending" && <Clock size={11} />}
                      <span>{inv.status}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedInvoice({
                            id: inv.id,
                            term: inv.term,
                            amount: inv.amount,
                            due: inv.due,
                            student: "Ali Hassan",
                            rollNo: "10-A-01",
                            class: "Class 10-A",
                            father: "Muhammad Hassan",
                          });
                          setIsChallanModalOpen(true);
                        }}
                        className="p-1.5 rounded-lg border border-[#D9D4CC] bg-white text-[#23201B] hover:bg-[#FAF8F5]"
                        title="View 3-Fold Challan"
                      >
                        <FileText size={13} className="text-[#C4993C]" />
                      </button>

                      {inv.status === "Pending" && (
                        <button
                          onClick={() => setPayModal(true)}
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
      </div>

      {/* ── 3-Fold Bank Challan Modal Template (Pakistani School Standard) ── */}
      {isChallanModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-[#EBE5D9] shadow-2xl w-full max-w-5xl p-6 sm:p-8 animate-in zoom-in-95 max-h-[92vh] flex flex-col justify-between">
            
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE5D9] mb-4">
              <div>
                <h3 className="font-serif font-bold text-xl text-[#23201B]">Official 3-Fold Bank Deposit Challan</h3>
                <p className="text-xs text-[#706B62]">Deposit valid at any Habib Bank Ltd (HBL) or Meezan Bank branch across Pakistan.</p>
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
                    <div className="font-serif font-bold text-sm text-[#23201B]">OAKRIDGE ACADEMY</div>
                    <div className="text-[9px] text-[#706B62]">Main Gulberg Campus, Lahore</div>
                    <div className="inline-block mt-1 px-2 py-0.5 rounded bg-[#23201B] text-white font-mono font-bold text-[9px]">
                      {copyTitle}
                    </div>
                  </div>

                  {/* Bank Account */}
                  <div className="bg-[#FAF8F5] p-2 rounded-lg border border-[#EBE5D9] text-[10px] space-y-0.5">
                    <div><strong>Bank:</strong> Habib Bank Limited (HBL)</div>
                    <div><strong>A/C Title:</strong> Oakridge Educational Trust</div>
                    <div><strong>A/C No:</strong> 0129-883719-01</div>
                    <div className="text-[#996B1E] font-mono"><strong>Challan #:</strong> {selectedInvoice.id}</div>
                  </div>

                  {/* Student Details */}
                  <div className="space-y-1 text-[10px]">
                    <div className="flex justify-between"><span>Student:</span><strong>{selectedInvoice.student}</strong></div>
                    <div className="flex justify-between"><span>Father:</span><span>{selectedInvoice.father}</span></div>
                    <div className="flex justify-between"><span>Roll No:</span><strong className="font-mono">{selectedInvoice.rollNo}</strong></div>
                    <div className="flex justify-between"><span>Class:</span><span>{selectedInvoice.class}</span></div>
                    <div className="flex justify-between"><span>Due Date:</span><strong className="text-red-700">{selectedInvoice.due}</strong></div>
                  </div>

                  {/* Fee Items */}
                  <table className="w-full text-[10px] border-t border-b border-[#EBE5D9] my-1">
                    <tbody>
                      <tr><td className="py-0.5">Tuition Fee:</td><td className="text-right font-mono">12,000</td></tr>
                      <tr><td className="py-0.5">Lab / Computer:</td><td className="text-right font-mono">2,000</td></tr>
                      <tr><td className="py-0.5">Exam & Stationery:</td><td className="text-right font-mono">1,000</td></tr>
                      <tr className="font-bold border-t border-[#EBE5D9] text-[#23201B]">
                        <td className="py-1">Total Payable:</td>
                        <td className="text-right font-mono text-emerald-700">{selectedInvoice.amount}</td>
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
              <span>Note: A late surcharge of PKR 500 will apply if paid after the due date.</span>
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
                <p className="text-xs text-[#8C877D]">Term 2 Installment: PKR 15,000.00</p>
              </div>
              <button onClick={() => setPayModal(false)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePayConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Card / Bank Account Number</label>
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
                  onClick={() => setPayModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#706B62] hover:bg-[#FAF8F5]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold shadow-md hover:from-[#B3882B] hover:to-[#C4993C]"
                >
                  Confirm PKR 15,000.00
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
