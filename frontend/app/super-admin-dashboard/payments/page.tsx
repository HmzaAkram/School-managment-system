"use client";

import { useState } from "react";
import { mockTransactions, mockSchools, SchoolContract } from "@/lib/mock-data";
import { 
  Search, Filter, Download, ArrowUpRight, CreditCard, DollarSign, 
  CheckCircle2, Clock, AlertCircle, MessageSquare, Plus, Receipt
} from "lucide-react";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [schools, setSchools] = useState<SchoolContract[]>(mockSchools);
  const [activeTab, setActiveTab] = useState<"invoices" | "transactions">("invoices");

  const totalMonthlySaaS = schools.reduce((acc, curr) => acc + curr.monthlySaaSRevenue, 0);
  const totalCollectedAll = schools.reduce((acc, curr) => acc + curr.totalPaidAmount, 0);
  const totalPendingAll = schools.reduce((acc, curr) => acc + curr.totalPendingAmount, 0);

  const handleMarkAsPaid = (schoolId: string) => {
    setSchools(schools.map(s => {
      if (s.id === schoolId) {
        return {
          ...s,
          currentMonthStatus: 'Paid',
          totalPaidAmount: s.totalPaidAmount + s.monthlySaaSRevenue,
          totalPendingAmount: Math.max(0, s.totalPendingAmount - s.monthlySaaSRevenue),
        };
      }
      return s;
    }));
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.admin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.id.toLowerCase().includes(searchTerm.toLowerCase())
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
            Track monthly per-student billings, mark received wire transfers, and issue payment notices.
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
          <span className="text-[10px] text-[#706B62] mt-1 block">Accumulated across all signed contracts</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">This Month Expected (MRR)</span>
            <div className="w-8 h-8 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-[#23201B]">
            PKR {totalMonthlySaaS.toLocaleString()}
          </div>
          <span className="text-[10px] text-[#706B62] mt-1 block">From {schools.length} onboarded school campuses</span>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Pending / Overdue Invoices</span>
            <div className="w-8 h-8 rounded-xl bg-red-50 flex items-center justify-center text-red-600">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="text-2xl font-serif font-bold text-red-700">
            PKR {totalPendingAll.toLocaleString()}
          </div>
          <span className="text-[10px] text-red-600 mt-1 font-semibold block">
            {schools.filter(s => s.currentMonthStatus !== 'Paid').length} schools with pending installments
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
              Recent Bank Deposits
            </button>
          </div>
        </div>

        {/* Tab 1: School Invoices */}
        {activeTab === "invoices" && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                  <th className="text-left py-3.5 px-5 font-bold uppercase tracking-wider">School & Contract</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Billable Students</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">SaaS Rate</th>
                  <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Monthly Invoice Due</th>
                  <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-5 font-bold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EFE9]">
                {filteredSchools.map(school => (
                  <tr key={school.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    
                    <td className="py-4 px-5">
                      <div className="font-bold text-sm text-[#23201B]">{school.name}</div>
                      <div className="text-[11px] text-[#706B62] flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[#996B1E]">{school.id}</span>
                        <span>•</span>
                        <span>{school.admin}</span>
                        <span>•</span>
                        <span>{school.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-3 text-center font-bold text-sm text-[#23201B]">
                      {school.students.toLocaleString()}
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-md bg-[#FAF3E5] text-[#996B1E] font-bold text-[11px]">
                        Rs. {school.saasFeePerStudent}/student
                      </span>
                    </td>

                    <td className="py-4 px-4 text-right">
                      <span className="font-mono font-bold text-sm text-[#23201B]">
                        PKR {school.monthlySaaSRevenue.toLocaleString()}
                      </span>
                    </td>

                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          school.currentMonthStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : school.currentMonthStatus === "Pending"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {school.currentMonthStatus === "Paid" && <CheckCircle2 size={11} />}
                        {school.currentMonthStatus === "Pending" && <Clock size={11} />}
                        {school.currentMonthStatus === "Overdue" && <AlertCircle size={11} />}
                        <span>{school.currentMonthStatus}</span>
                      </span>
                    </td>

                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {school.currentMonthStatus !== "Paid" ? (
                          <button
                            onClick={() => handleMarkAsPaid(school.id)}
                            className="px-3 py-1 rounded-lg bg-[#23201B] hover:bg-[#3D382F] text-white text-[11px] font-bold shadow-xs transition-all"
                          >
                            Mark Paid
                          </button>
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg">
                            ✓ Verified
                          </span>
                        )}

                        <a
                          href={`https://wa.me/923152123010?text=Dear%20${encodeURIComponent(school.admin)}%2C%20invoice%20for%20${encodeURIComponent(school.name)}%20(PKR%20${school.monthlySaaSRevenue.toLocaleString()})%20is%20now%20ready.`}
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
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Bank Transactions */}
        {activeTab === "transactions" && (
          <div className="overflow-x-auto">
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
                {mockTransactions.map(payment => (
                  <tr key={payment.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6">
                      <span className="font-mono text-xs font-bold text-[#706B62] bg-[#FAF3E5] px-2 py-1 rounded border border-[#EBE5D9]">
                        {payment.id}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#706B62] font-mono">
                      {payment.date}
                    </td>
                    <td className="py-4 px-6 text-[#23201B] font-bold">
                      {payment.description}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <span className={`font-mono font-bold text-sm ${payment.type === 'Credit' ? 'text-emerald-700' : 'text-red-600'}`}>
                        {payment.type === 'Credit' ? '+' : '-'} PKR {payment.amount.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center text-[#706B62]">
                      {payment.method}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {payment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>

    </div>
  );
}
