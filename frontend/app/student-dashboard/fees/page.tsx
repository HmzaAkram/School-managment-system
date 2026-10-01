"use client";

import { useState } from "react";
import {
  CreditCard,
  Download,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Receipt,
  ShieldCheck,
  ArrowUpRight,
  X
} from "lucide-react";

interface PaymentRecord {
  id: string;
  invoiceNo: string;
  term: string;
  date: string;
  amount: number;
  method: string;
  status: "Completed" | "Pending";
}

const paymentHistory: PaymentRecord[] = [
  { id: "1", invoiceNo: "INV-2026-081", term: "Term 1 Tuition & Annual Fees", date: "Aug 15, 2026", amount: 1500, method: "Credit Card (Visa •••• 4242)", status: "Completed" },
  { id: "2", invoiceNo: "INV-2026-114", term: "Science Lab & Robotics Fee", date: "Sep 01, 2026", amount: 350, method: "Bank Transfer", status: "Completed" },
  { id: "3", invoiceNo: "INV-2026-192", term: "Term 2 Tuition Fee", date: "Jan 10, 2027", amount: 1500, method: "Pending Invoice", status: "Pending" },
];

export default function StudentFees() {
  const [payModal, setPayModal] = useState(false);
  const [toast, setToast] = useState(false);

  const handlePayConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setPayModal(false);
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-500 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#EBE8E2] pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#8C877D] uppercase tracking-wider mb-1">
            <span>Student Portal</span>
            <span>/</span>
            <span className="text-[#C4993C]">Tuition & Accounts</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#23201B] font-sora">Student Fee Ledger & Invoices</h1>
          <p className="text-sm text-[#706B62] mt-1">
            Review fee installments, download official tax receipts, and pay tuition online.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setPayModal(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C4993C] to-[#D4A843] text-white text-xs font-bold hover:from-[#B3882B] hover:to-[#C4993C] transition-all flex items-center gap-2 shadow-md"
          >
            <CreditCard size={15} /> Pay Tuition Online
          </button>
        </div>
      </div>

      {toast && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="text-emerald-600" size={20} />
            <p className="text-sm font-semibold text-emerald-900">
              Payment processed successfully! Official digital receipt dispatched to your registered guardian email.
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Just now</span>
        </div>
      )}

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Annual Tuition", value: "$3,350", sub: "Academic year 2025-26", icon: Receipt, color: "text-[#C4993C]", bg: "bg-[#FFFDF9] border-[#F1EAD9]" },
          { label: "Amount Paid", value: "$1,850", sub: "Cleared via online gateway", icon: CheckCircle2, color: "text-emerald-700", bg: "bg-emerald-50/60 border-emerald-200/80" },
          { label: "Balance Due", value: "$1,500", sub: "Due by Jan 10, 2027", icon: AlertCircle, color: "text-amber-700", bg: "bg-amber-50/60 border-amber-200/80" },
          { label: "Account Standing", value: "Good", sub: "Zero penalties or fines", icon: ShieldCheck, color: "text-blue-700", bg: "bg-blue-50/60 border-blue-200/80" },
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
            <div className="font-bold text-sm text-[#23201B]">$2,500.00</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
            <span className="text-[#8C877D] font-medium block mb-1">Laboratory & STEM Materials</span>
            <div className="font-bold text-sm text-[#23201B]">$350.00</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
            <span className="text-[#8C877D] font-medium block mb-1">Digital LMS & Cloud Portal</span>
            <div className="font-bold text-sm text-[#23201B]">$250.00</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE8E2]">
            <span className="text-[#8C877D] font-medium block mb-1">Sports Facilities & Library</span>
            <div className="font-bold text-sm text-[#23201B]">$250.00</div>
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
          <button className="px-3.5 py-1.5 rounded-xl border border-[#D9D4CC] text-xs font-bold text-[#23201B] hover:bg-[#FAF8F5] flex items-center gap-1.5 shadow-sm">
            <Download size={13} /> Download All (ZIP)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#706B62] uppercase tracking-wider font-semibold border-b border-[#EBE8E2]">
              <tr>
                <th className="py-4 px-6">Invoice No</th>
                <th className="py-4 px-6">Description</th>
                <th className="py-4 px-6">Issue / Due Date</th>
                <th className="py-4 px-6">Payment Method</th>
                <th className="py-4 px-6">Amount</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Receipt</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EBE8E2]">
              {paymentHistory.map((p) => (
                <tr key={p.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                  <td className="py-4 px-6 font-mono font-bold text-[#8C877D]">
                    {p.invoiceNo}
                  </td>
                  <td className="py-4 px-6 font-bold text-[#23201B] font-sora">
                    {p.term}
                  </td>
                  <td className="py-4 px-6 text-[#706B62]">
                    {p.date}
                  </td>
                  <td className="py-4 px-6 text-[#4A453E] font-medium">
                    {p.method}
                  </td>
                  <td className="py-4 px-6 font-extrabold text-[#23201B] text-sm font-sora">
                    ${p.amount.toLocaleString()}.00
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      p.status === "Completed"
                        ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                        : "bg-amber-50 text-amber-800 border border-amber-200"
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    {p.status === "Completed" ? (
                      <button className="px-3 py-1.5 rounded-lg border border-[#D9D4CC] text-[#23201B] hover:border-[#C4993C] hover:text-[#C4993C] font-bold text-xs transition-all inline-flex items-center gap-1">
                        <Download size={12} /> PDF
                      </button>
                    ) : (
                      <button
                        onClick={() => setPayModal(true)}
                        className="px-3 py-1.5 rounded-lg bg-[#23201B] text-white hover:bg-[#3D382F] font-bold text-xs transition-all shadow-sm"
                      >
                        Pay Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pay Modal */}
      {payModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl border border-[#EBE8E2] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#EBE8E2]">
              <div>
                <h3 className="font-bold text-[#23201B] text-base font-sora">Tuition Fee Checkout</h3>
                <p className="text-xs text-[#8C877D]">Term 2 Installment: $1,500.00</p>
              </div>
              <button onClick={() => setPayModal(false)} className="text-[#8C877D] hover:text-[#23201B]">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePayConfirm} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">Card Number</label>
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
                  <label className="block text-xs font-bold text-[#4A453E] uppercase tracking-wider mb-1">CVC</label>
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
                  Confirm $1,500.00
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
