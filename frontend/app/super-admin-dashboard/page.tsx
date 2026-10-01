"use client";

import { Building2, Users, CreditCard, Wallet, TrendingUp, CheckCircle2 } from "lucide-react";
import { mockSchools, mockTransactions } from "@/lib/mock-data";

export default function SuperAdminDashboard() {
  const totalSchools = mockSchools.length;
  const activeSchools = mockSchools.filter(s => s.status === 'Active').length;
  const totalStudents = mockSchools.reduce((acc, curr) => acc + curr.students, 0);
  const totalRevenue = mockTransactions.filter(t => t.type === 'Credit').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-extrabold font-sora text-slate-900 mb-1">Super Admin Dashboard</h1>
        <p className="text-slate-500 text-sm">Platform overview and general statistics.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Building2 size={20} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-full">{activeSchools} Active</span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{totalSchools}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Schools</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">{totalStudents.toLocaleString()}</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Students</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Wallet size={20} />
            </div>
            <span className="text-xs font-semibold px-2 py-1 bg-green-50 text-green-600 rounded-full flex items-center gap-1"><TrendingUp size={12}/> +12%</span>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">Rs. {(totalRevenue / 1000).toFixed(1)}k</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Total Revenue</p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
              <CreditCard size={20} />
            </div>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-slate-900">4</p>
            <p className="text-sm font-medium text-slate-500 mt-1">Pending Payments</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Schools */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sora font-bold text-lg text-slate-900">Recent Schools</h2>
            <button className="text-sm font-semibold text-primary hover:text-accent transition-colors">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="text-left font-semibold pb-3">School Name</th>
                  <th className="text-left font-semibold pb-3">Location</th>
                  <th className="text-left font-semibold pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {mockSchools.slice(0, 4).map(school => (
                  <tr key={school.id} className="border-b border-slate-50 last:border-0">
                    <td className="py-4">
                      <div className="font-semibold text-slate-900">{school.name}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{school.admin}</div>
                    </td>
                    <td className="py-4 text-slate-600">{school.location}</td>
                    <td className="py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${school.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                        {school.status === 'Active' && <CheckCircle2 size={12} />}
                        {school.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-sora font-bold text-lg text-slate-900">Recent Transactions</h2>
          </div>
          <div className="space-y-4">
            {mockTransactions.slice(0, 5).map(txn => (
              <div key={txn.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${txn.type === 'Credit' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                    {txn.type === 'Credit' ? '+' : '-'}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{txn.description}</div>
                    <div className="text-xs text-slate-500">{txn.date}</div>
                  </div>
                </div>
                <div className={`text-sm font-bold ${txn.type === 'Credit' ? 'text-emerald-600' : 'text-slate-900'}`}>
                  {txn.type === 'Credit' ? '+' : '-'} Rs. {txn.amount.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
