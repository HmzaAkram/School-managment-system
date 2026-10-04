"use client";

import { useState } from "react";
import { 
  Building2, Users, CreditCard, Wallet, TrendingUp, TrendingDown, 
  Receipt, ArrowUpRight, Plus, Calendar, Clock, CheckCircle2, AlertCircle, Sparkles
} from "lucide-react";
import { mockSchools, mockExpenses, mockMonthlyFinancials, SchoolContract, SuperAdminExpense } from "@/lib/mock-data";
import Link from "next/link";

export default function SuperAdminDashboard() {
  const [schoolsList, setSchoolsList] = useState<SchoolContract[]>(mockSchools);
  const [expensesList, setExpensesList] = useState<SuperAdminExpense[]>(mockExpenses);

  // Financial Metrics Calculations
  const totalSchools = schoolsList.length;
  const totalStudents = schoolsList.reduce((acc, s) => acc + s.students, 0);
  const monthlySaaSRecurring = schoolsList.reduce((acc, s) => acc + s.monthlySaaSRevenue, 0);
  const totalContractValueAll = schoolsList.reduce((acc, s) => acc + s.totalContractValue, 0);
  const totalPaidRevenue = schoolsList.reduce((acc, s) => acc + s.totalPaidAmount, 0);
  const totalPendingDue = schoolsList.reduce((acc, s) => acc + s.totalPendingAmount, 0);

  const totalExpensesThisMonth = expensesList.reduce((acc, e) => acc + e.amount, 0);
  const netProfitThisMonth = monthlySaaSRecurring - totalExpensesThisMonth;
  const profitMarginPercent = monthlySaaSRecurring > 0 ? ((netProfitThisMonth / monthlySaaSRecurring) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-500">
      
      {/* Header with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C4993C] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#706B62] font-semibold">
              SaaS Multi-Tenant Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#23201B] mt-1">
            Super Administrator Control Room
          </h1>
          <p className="text-[#706B62] text-sm">
            Real-time tracking of school contracts, per-student revenue splits, collections & operational expenses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/super-admin-dashboard/expenses"
            className="px-4 py-2.5 rounded-xl border border-[#D9D4CC] bg-white hover:bg-[#FAF8F5] text-[#23201B] text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Receipt size={14} className="text-[#C4993C]" />
            <span>Manage Expenses</span>
          </Link>

          <Link
            href="/super-admin-dashboard/schools"
            className="px-5 py-2.5 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
          >
            <Plus size={14} className="text-[#D4A843]" />
            <span>New School Contract</span>
          </Link>
        </div>
      </div>

      {/* ── SaaS Contract Renewal Alert Banner ── */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-800 flex-shrink-0">
            <AlertCircle size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-sm text-[#23201B]">Upcoming Contract Expiration: City School Gulberg</h4>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                29 Days Remaining
              </span>
            </div>
            <p className="text-xs text-[#706B62] mt-0.5">
              1-Year agreement (2,800 students • PKR 28,000/mo) expires on <strong>31 Oct 2026</strong>. Review renewal terms with Principal Zain Malik.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <a
            href="https://wa.me/923152123010?text=Dear%20Zain%20Malik%2C%20regarding%20the%20annual%20SaaS%20contract%20renewal%20for%20City%20School%20Gulberg."
            target="_blank"
            rel="noopener noreferrer"
            className="px-3.5 py-2 rounded-xl bg-white border border-amber-300 text-[#23201B] font-bold text-xs hover:bg-[#FAF8F5] transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>WhatsApp Principal</span>
          </a>
          <button
            onClick={() => alert("Renewal agreement draft generated for City School Gulberg (PKR 336,000 ARR).")}
            className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white font-bold text-xs shadow-md transition-all whitespace-nowrap"
          >
            Renew 1-Year Deal
          </button>
        </div>
      </div>

      {/* ── Top Executive KPI Metrics ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Monthly Recurring SaaS (MRR) */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Wallet size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full flex items-center gap-0.5">
              <TrendingUp size={11} /> 100% Active
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Monthly SaaS Revenue (MRR)</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {monthlySaaSRecurring.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#706B62] mt-2 flex items-center gap-1">
            <span>From <strong>{totalStudents.toLocaleString()}</strong> billable students</span>
          </div>
        </div>

        {/* 1-Year Total Contract Pipeline (ARR) */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#C4993C]">
              <Building2 size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-amber-50 text-[#996B1E] rounded-full">
              {totalSchools} Partner Schools
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total Contract Value (ARR)</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {(totalContractValueAll / 1000000).toFixed(2)}M
          </div>
          <div className="text-[11px] text-[#706B62] mt-2">
            Average deal: 12-month 50/50 revenue share
          </div>
        </div>

        {/* Received vs Pending Collection */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CreditCard size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-red-50 text-red-600 rounded-full">
              Due: PKR {totalPendingDue.toLocaleString()}
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Total Realized Collection</p>
          <div className="font-serif font-bold text-2xl text-emerald-700 mt-1">
            PKR {totalPaidRevenue.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#706B62] mt-2 flex items-center justify-between">
            <span>Recovery Rate</span>
            <span className="font-bold text-[#23201B]">
              {((totalPaidRevenue / (totalPaidRevenue + totalPendingDue)) * 100).toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Expenses & Net Profit */}
        <div className="bg-white rounded-2xl p-5 border border-[#EBE5D9] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF3E5] flex items-center justify-center text-[#23201B]">
              <Receipt size={20} />
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full">
              Margin: {profitMarginPercent}%
            </span>
          </div>
          <p className="text-[11px] font-bold text-[#8C847B] uppercase tracking-wider">Net Monthly Profit</p>
          <div className="font-serif font-bold text-2xl text-[#23201B] mt-1">
            PKR {netProfitThisMonth.toLocaleString()}
          </div>
          <div className="text-[11px] text-[#706B62] mt-2 flex items-center justify-between">
            <span>Expenses: PKR {totalExpensesThisMonth.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── Middle Section: Active School Contracts with Revenue Split & Months Tracking ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#EBE5D9]">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-xl text-[#23201B]">Active School Contracts & Revenue Sharing</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FAF3E5] text-[#996B1E]">
                Per Student Share Model
              </span>
            </div>
            <p className="text-xs text-[#706B62] mt-0.5">
              Tracking monthly per-student billing, elapsed contract timeline (e.g. Month 10 of 12), and collections.
            </p>
          </div>
          <Link
            href="/super-admin-dashboard/schools"
            className="text-xs font-bold text-[#996B1E] hover:text-[#23201B] inline-flex items-center gap-1 transition-colors"
          >
            <span>Manage All Contracts</span>
            <ArrowUpRight size={14} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-[#FAF8F5] border-b border-[#EBE5D9] text-[#706B62]">
                <th className="text-left py-3.5 px-4 font-bold uppercase tracking-wider">School & Admin</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Students</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Deal Model</th>
                <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Monthly SaaS</th>
                <th className="text-center py-3.5 px-4 font-bold uppercase tracking-wider">Contract Progress</th>
                <th className="text-right py-3.5 px-4 font-bold uppercase tracking-wider">Collected / Total</th>
                <th className="text-center py-3.5 px-3 font-bold uppercase tracking-wider">Current Month</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EFE9]">
              {schoolsList.map((s) => {
                const progressPercent = Math.min(100, Math.round((s.monthsElapsed / s.contractDurationMonths) * 100));
                return (
                  <tr key={s.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    
                    {/* School Name */}
                    <td className="py-4 px-4">
                      <div className="font-bold text-sm text-[#23201B]">{s.name}</div>
                      <div className="text-[11px] text-[#706B62] mt-0.5 flex items-center gap-2">
                        <span>{s.admin}</span>
                        <span>•</span>
                        <span>{s.location}</span>
                      </div>
                    </td>

                    {/* Students */}
                    <td className="py-4 px-3 text-center">
                      <span className="font-bold text-sm text-[#23201B]">{s.students.toLocaleString()}</span>
                      <span className="block text-[10px] text-[#8C847B]">students</span>
                    </td>

                    {/* Deal Split */}
                    <td className="py-4 px-3 text-center">
                      <div className="inline-flex flex-col items-center">
                        <span className="px-2 py-0.5 rounded-md bg-[#FAF3E5] text-[#996B1E] font-bold text-[11px] border border-[#EBE5D9]">
                          Rs. {s.perStudentFee}/student
                        </span>
                        <span className="text-[10px] text-[#706B62] mt-1 font-mono">
                          {s.saasSharePercent}% SaaS (Rs. {s.saasFeePerStudent})
                        </span>
                      </div>
                    </td>

                    {/* Monthly SaaS Revenue */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-sm text-[#23201B] font-mono">
                        PKR {s.monthlySaaSRevenue.toLocaleString()}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-semibold">/ month</span>
                    </td>

                    {/* Contract Timeline (Elapsed) */}
                    <td className="py-4 px-4">
                      <div className="w-36 mx-auto">
                        <div className="flex justify-between text-[10px] font-bold mb-1 text-[#4A453E]">
                          <span>Month {s.monthsElapsed} of {s.contractDurationMonths}</span>
                          <span>{progressPercent}%</span>
                        </div>
                        <div className="h-2 w-full bg-[#EBE5D9] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#C4993C] to-[#D4A843] rounded-full"
                            style={{ width: `${progressPercent}%` }}
                          />
                        </div>
                        <span className="block text-[9px] text-[#8C847B] text-center mt-1">
                          Ends: {s.contractEnd}
                        </span>
                      </div>
                    </td>

                    {/* Collected / Total Value */}
                    <td className="py-4 px-4 text-right">
                      <div className="font-bold text-xs text-emerald-700 font-mono">
                        PKR {s.totalPaidAmount.toLocaleString()}
                      </div>
                      <div className="text-[10px] text-[#8C847B]">
                        of PKR {s.totalContractValue.toLocaleString()}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-3 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                          s.currentMonthStatus === "Paid"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : s.currentMonthStatus === "Pending"
                            ? "bg-amber-50 text-amber-800 border border-amber-200"
                            : "bg-red-50 text-red-700 border border-red-200"
                        }`}
                      >
                        {s.currentMonthStatus === "Paid" && <CheckCircle2 size={11} />}
                        {s.currentMonthStatus === "Pending" && <Clock size={11} />}
                        {s.currentMonthStatus === "Overdue" && <AlertCircle size={11} />}
                        <span>{s.currentMonthStatus}</span>
                      </span>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Split: Financial Overview vs Recent Operational Expenses ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Financial Performance (P&L Summary) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#23201B]">Financial P&L Overview (Last 6 Months)</h3>
                <p className="text-xs text-[#706B62]">Gross SaaS subscription revenue vs Server/API expenses.</p>
              </div>
              <div className="px-2.5 py-1 rounded-lg bg-[#FAF3E5] text-[11px] font-bold text-[#996B1E]">
                2026 Fiscal Year
              </div>
            </div>

            <div className="space-y-3 my-4">
              {mockMonthlyFinancials.map((m) => {
                const maxVal = 200000;
                const revWidth = (m.grossRevenue / maxVal) * 100;
                const expWidth = (m.expenses / maxVal) * 100;

                return (
                  <div key={m.month} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9]">
                    <div className="flex items-center justify-between text-xs font-bold text-[#23201B] mb-2">
                      <span>{m.month} 2026</span>
                      <div className="flex items-center gap-4">
                        <span className="text-emerald-700">Revenue: PKR {m.grossRevenue.toLocaleString()}</span>
                        <span className="text-red-600">Expenses: PKR {m.expenses.toLocaleString()}</span>
                        <span className="text-[#996B1E] font-extrabold">Net Profit: PKR {m.netProfit.toLocaleString()}</span>
                      </div>
                    </div>
                    
                    {/* Dual Stacked Progress */}
                    <div className="space-y-1">
                      <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${revWidth}%` }}
                        />
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden flex">
                        <div 
                          className="h-full bg-red-400 rounded-full"
                          style={{ width: `${expWidth}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EBE5D9] flex items-center justify-between text-xs text-[#706B62]">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> SaaS Collections
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" /> Cloud & Gateway Expenses
              </span>
            </div>
            <Link 
              href="/super-admin-dashboard/ledger"
              className="font-bold text-[#996B1E] hover:underline"
            >
              View Full Audit Ledger →
            </Link>
          </div>
        </div>

        {/* Operational Expenses Quick View */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-[#23201B]">Active Operational Expenses</h3>
                <p className="text-xs text-[#706B62]">Cloud servers, WhatsApp APIs & team stipends.</p>
              </div>
              <Link
                href="/super-admin-dashboard/expenses"
                className="text-xs font-bold text-[#996B1E] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-3">
              {expensesList.slice(0, 4).map((exp) => (
                <div key={exp.id} className="p-3 rounded-xl border border-[#EBE5D9] bg-[#FAF8F5] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white border border-[#EBE5D9] flex items-center justify-center text-[#C4993C] flex-shrink-0">
                      <Receipt size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#23201B] line-clamp-1">{exp.title}</div>
                      <div className="text-[10px] text-[#706B62] flex items-center gap-1.5 mt-0.5">
                        <span>{exp.category}</span>
                        <span>•</span>
                        <span>{exp.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs font-bold text-red-600 font-mono">
                      - PKR {exp.amount.toLocaleString()}
                    </div>
                    <span className="text-[9px] text-emerald-700 font-semibold">{exp.paymentMethod}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#EBE5D9] mt-4">
            <Link
              href="/super-admin-dashboard/expenses"
              className="w-full py-2.5 rounded-xl border border-[#D9D4CC] bg-white hover:bg-[#FAF8F5] text-[#23201B] text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <Plus size={14} className="text-[#C4993C]" />
              <span>Record New Platform Expense</span>
            </Link>
          </div>
        </div>

      </div>

      {/* ── Subdomain Whitelabeling & Custom DNS Section ── */}
      <div className="bg-white rounded-2xl border border-[#EBE5D9] shadow-xs p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#EBE5D9]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif font-bold text-lg text-[#23201B]">School Subdomain & Whitelabel Portals</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Wildcard SSL Active
              </span>
            </div>
            <p className="text-xs text-[#706B62] mt-0.5">
              Dedicated isolated subdomains & custom branded login URLs for each partner school.
            </p>
          </div>
          <button
            onClick={() => alert("Domain provisioner: Add CNAME pointing to cname.skoolms.edu with automatic LetsEncrypt SSL.")}
            className="px-4 py-2 rounded-xl bg-[#23201B] hover:bg-[#3D382F] text-white text-xs font-bold shadow-xs flex items-center gap-1.5"
          >
            <Plus size={14} className="text-[#D4A843]" />
            <span>Map Custom Domain</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { name: "Crescent International", subdomain: "crescent.skoolms.edu", custom: "portal.crescent.edu", ssl: "Active", ping: "99.98%" },
            { name: "Beaconhouse Model Town", subdomain: "beaconhouse.skoolms.edu", custom: "sms.beaconhouse.edu", ssl: "Active", ping: "99.99%" },
            { name: "Lahore Grammar School", subdomain: "lgs.skoolms.edu", custom: "lgs-portal.edu.pk", ssl: "Active", ping: "100.0%" },
          ].map((d, i) => (
            <div key={i} className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5D9] flex flex-col justify-between">
              <div>
                <div className="font-bold text-xs text-[#23201B]">{d.name}</div>
                <div className="font-mono text-[11px] text-[#996B1E] mt-1">{d.subdomain}</div>
                <div className="text-[10px] text-[#706B62] mt-0.5">CNAME: {d.custom}</div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#EBE5D9] text-[10px]">
                <span className="text-emerald-700 font-bold">🔒 SSL: {d.ssl}</span>
                <span className="text-[#706B62]">Uptime: {d.ping}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
