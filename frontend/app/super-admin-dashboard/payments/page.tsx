"use client";

import { useState } from "react";
import { mockTransactions, mockSchools } from "@/lib/mock-data";
import { Search, Filter, Download, ArrowUpRight, ArrowDownRight, CreditCard, DollarSign } from "lucide-react";

export default function PaymentsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter for credit transactions (payments received)
  const payments = mockTransactions.filter(t => t.type === 'Credit');
  
  const filteredPayments = payments.filter(payment => 
    payment.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    payment.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalCollected = payments.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Payments</h1>
          <p className="text-slate-500 text-sm">Manage subscription payments and revenue from schools.</p>
        </div>
        <button className="bg-white text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Download size={16} /> Export
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 font-medium text-sm">Total Revenue</div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">Rs. {totalCollected.toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 font-medium text-sm">This Month</div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <ArrowUpRight size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">Rs. {(totalCollected * 0.8).toLocaleString()}</div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 font-medium text-sm">Pending Payments</div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-slate-900">4 Schools</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by ID or description..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              <Filter size={16} /> Filter
            </button>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                <th className="text-left py-4 px-6 font-semibold">Transaction ID</th>
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-left py-4 px-6 font-semibold">Description</th>
                <th className="text-left py-4 px-6 font-semibold">Amount</th>
                <th className="text-left py-4 px-6 font-semibold">Method</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.map(payment => (
                <tr key={payment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{payment.id}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {payment.date}
                  </td>
                  <td className="py-4 px-6 text-slate-900 font-medium">
                    {payment.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-600">Rs. {payment.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {payment.method}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${payment.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredPayments.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <p className="text-slate-500 text-sm">No payments found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
