"use client";

import { useState } from "react";
import { mockTransactions } from "@/lib/mock-data";
import { Search, Filter, Download, FileText } from "lucide-react";

export default function LedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Compute running balance
  let currentBalance = 0;
  const ledgerEntries = [...mockTransactions].reverse().map(txn => {
    if (txn.type === 'Credit') {
      currentBalance += txn.amount;
    } else {
      currentBalance -= txn.amount;
    }
    return { ...txn, balance: currentBalance };
  }).reverse(); // Reverse back to show newest first

  const filteredEntries = ledgerEntries.filter(entry => 
    entry.description.toLowerCase().includes(searchTerm.toLowerCase()) || 
    entry.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Financial Ledger</h1>
          <p className="text-slate-500 text-sm">Detailed view of all financial transactions across the platform.</p>
        </div>
        <button className="bg-white text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Download size={16} /> Export Ledger
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Filters/Search Bar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-3 justify-between items-center bg-slate-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search by reference or description..." 
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
                <th className="text-left py-4 px-6 font-semibold">Date</th>
                <th className="text-left py-4 px-6 font-semibold">Reference ID</th>
                <th className="text-left py-4 px-6 font-semibold">Description</th>
                <th className="text-right py-4 px-6 font-semibold">Debit</th>
                <th className="text-right py-4 px-6 font-semibold">Credit</th>
                <th className="text-right py-4 px-6 font-semibold">Balance</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map(entry => (
                <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap">
                    {entry.date}
                  </td>
                  <td className="py-4 px-6">
                    <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">{entry.id}</span>
                  </td>
                  <td className="py-4 px-6 text-slate-900 font-medium">
                    {entry.description}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {entry.type === 'Debit' ? (
                      <span className="font-semibold text-red-600">Rs. {entry.amount.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right">
                    {entry.type === 'Credit' ? (
                      <span className="font-semibold text-emerald-600">Rs. {entry.amount.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-4 px-6 text-right font-bold text-slate-900 bg-slate-50/30">
                    Rs. {entry.balance.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No records found</h3>
            <p className="text-slate-500 text-sm max-w-md">We couldn't find any ledger entries matching your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
