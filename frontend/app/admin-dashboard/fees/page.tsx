"use client";

import { useState } from "react";
import { mockTransactions } from "@/lib/mock-data";
import { DollarSign, CreditCard, Clock, TrendingUp, Search, Filter, Download, Plus } from "lucide-react";

export default function AdminFees() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter for credit transactions (fees)
  const feeTransactions = mockTransactions.filter(t => t.type === 'Credit');
  
  const filteredFees = feeTransactions.filter(fee => 
    fee.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    fee.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Fee Management</h1>
          <p className="text-slate-500 text-sm">Manage student fees, generate receipts, and track pending payments.</p>
        </div>
        <button className="bg-gradient-to-r from-primary to-accent text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md hover:shadow-lg transition-shadow flex items-center gap-2">
          <Plus size={16} /> Collect Fee
        </button>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 font-medium text-sm">Total Collected</div>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Rs. 4.2M</div>
          <div className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
            <TrendingUp size={12} /> +12% from last month
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 font-medium text-sm">Today's Collection</div>
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600">
              <CreditCard size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Rs. 45,000</div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            12 receipts generated
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 font-medium text-sm">Pending Fees</div>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">Rs. 850k</div>
          <div className="text-xs text-slate-500 font-medium mt-2">
            42 students pending
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="text-slate-500 font-medium text-sm">Collection Rate</div>
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              <Activity size={16} />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-slate-900">83%</div>
          <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mt-2">
            <div className="h-full bg-primary rounded-full" style={{ width: '83%' }} />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by receipt ID, student or class..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
              <Download size={16} /> Export
            </button>
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500">
                <th className="text-left py-4 px-6 font-semibold">Receipt ID</th>
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-left py-4 px-6 font-semibold">Description</th>
                <th className="text-left py-4 px-6 font-semibold">Amount</th>
                <th className="text-left py-4 px-6 font-semibold">Method</th>
                <th className="text-left py-4 px-6 font-semibold">Status</th>
                <th className="text-right py-4 px-6 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredFees.map(fee => (
                <tr key={fee.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{fee.id}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600 font-medium">
                    {fee.date}
                  </td>
                  <td className="py-4 px-6 text-slate-900 font-medium">
                    {fee.description}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-bold text-emerald-600">Rs. {fee.amount.toLocaleString()}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">
                    {fee.method}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${fee.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                      {fee.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-primary font-semibold text-xs hover:underline">
                      Print Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Ensure Activity icon is imported
import { Activity } from "lucide-react";
