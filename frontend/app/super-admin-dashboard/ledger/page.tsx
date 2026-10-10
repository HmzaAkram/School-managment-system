"use client";

import { useEffect, useState } from "react";
import { Search, Filter, Download, FileText, Loader2 } from "lucide-react";
import { api } from "@/lib/api";

export default function LedgerPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [entries, setEntries] = useState<any[]>([]);
  const [totals, setTotals] = useState<any>({ credits: 0, debits: 0, net: 0, closing_balance: 0 });
  const [loading, setLoading] = useState(true);

  const loadLedger = async () => {
    setLoading(true);
    try {
      const res = await api.get("/super-admin/ledger?per_page=100");
      setEntries(res?.data || []);
      setTotals(res?.totals || { credits: 0, debits: 0, net: 0, closing_balance: 0 });
    } catch (err: any) {
      console.error("Failed to load ledger:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLedger();
  }, []);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = 
      (entry.description || "").toLowerCase().includes(searchTerm.toLowerCase()) || 
      (entry.transaction_id || "").toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || (entry.type || "").toLowerCase() === typeFilter.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Financial Ledger</h1>
          <p className="text-slate-500 text-sm">Detailed audit of all financial debit and credit transactions across the platform from MySQL.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="bg-white text-slate-700 px-5 py-2.5 rounded-xl font-semibold text-sm border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"
        >
          <Download size={16} /> Export Ledger
        </button>
      </div>

      {/* Summary KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Inflow (Credits)</span>
          <div className="font-sora font-extrabold text-xl text-emerald-600 mt-1">
            PKR {Number(totals.credits || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Total Outflow (Debits)</span>
          <div className="font-sora font-extrabold text-xl text-red-600 mt-1">
            PKR {Number(totals.debits || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Net Platform Flow</span>
          <div className="font-sora font-extrabold text-xl text-amber-600 mt-1">
            PKR {Number(totals.net || 0).toLocaleString()}
          </div>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Closing Balance</span>
          <div className="font-sora font-extrabold text-xl text-slate-900 mt-1">
            PKR {Number(totals.closing_balance || 0).toLocaleString()}
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
              placeholder="Search by reference or description..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-slate-400"
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            {["all", "credit", "debit"].map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors ${
                  typeFilter === t
                    ? "bg-slate-900 text-white"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Table view */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="py-16 text-center text-slate-500">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[#D4A843]" />
              <p className="text-xs">Loading ledger entries from MySQL...</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-500 text-xs uppercase">
                  <th className="text-left py-4 px-6 font-semibold">Date</th>
                  <th className="text-left py-4 px-6 font-semibold">Reference ID</th>
                  <th className="text-left py-4 px-6 font-semibold">Description</th>
                  <th className="text-right py-4 px-6 font-semibold">Debit</th>
                  <th className="text-right py-4 px-6 font-semibold">Credit</th>
                  <th className="text-right py-4 px-6 font-semibold">Running Balance</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry) => {
                  const debit = Number(entry.debit || 0);
                  const credit = Number(entry.credit || 0);

                  return (
                    <tr key={entry.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 text-slate-600 font-medium whitespace-nowrap text-xs">
                        {String(entry.entry_date || "").slice(0, 10)}
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-mono text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {entry.transaction_id || `LE-${entry.id}`}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-slate-900 font-medium text-xs">
                        {entry.description}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {debit > 0 ? (
                          <span className="font-semibold text-red-600 font-mono text-xs">- PKR {debit.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {credit > 0 ? (
                          <span className="font-semibold text-emerald-600 font-mono text-xs">+ PKR {credit.toLocaleString()}</span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-right font-bold text-slate-900 bg-slate-50/30 font-mono text-xs">
                        PKR {Number(entry.balance || 0).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        
        {!loading && filteredEntries.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No ledger entries found</h3>
            <p className="text-slate-500 text-sm max-w-md">No financial records in the database matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
}
